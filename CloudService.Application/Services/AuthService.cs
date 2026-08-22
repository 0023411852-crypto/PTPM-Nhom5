using CloudService.Application.DTOs.Auth;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace CloudService.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;

        public AuthService(IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private string HashToken(string token)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(token);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var userRepo = _unitOfWork.Repository<AppUser>();
            var allUsers = await userRepo.GetAllAsync();
            var user = allUsers.FirstOrDefault(u => u.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new Exception("Invalid credentials");
            }

            var roleRepo = _unitOfWork.Repository<Role>();
            var role = await roleRepo.GetByIdAsync(user.RoleId);

            var token = GenerateJwtToken(user, role?.Name ?? "Customer");
            var refreshToken = GenerateRefreshToken();
            
            var userSession = new UserSession
            {
                UserId = user.Id,
                RefreshTokenHash = HashToken(refreshToken),
                LastActiveTimestamp = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(30),
                IsRevoked = false
            };
            
            await _unitOfWork.Repository<UserSession>().AddAsync(userSession);
            await _unitOfWork.SaveChangesAsync();

            return new AuthResponse
            {
                Token = token,
                RefreshToken = refreshToken,
                Email = user.Email,
                FullName = user.FullName,
                Role = role?.Name ?? "Customer"
            };
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            var userRepo = _unitOfWork.Repository<AppUser>();
            var allUsers = await userRepo.GetAllAsync();
            
            if (allUsers.Any(u => u.Email == request.Email))
            {
                throw new Exception("Email already exists");
            }

            var roleRepo = _unitOfWork.Repository<Role>();
            var roles = await roleRepo.GetAllAsync();
            var customerRole = roles.FirstOrDefault(r => r.Name == "Customer");

            if (customerRole == null)
            {
                throw new Exception("Default role not found");
            }

            var newUser = new AppUser
            {
                Email = request.Email,
                FullName = request.FullName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                RoleId = customerRole.Id,
                IsActive = true
            };

            await userRepo.AddAsync(newUser);
            await _unitOfWork.SaveChangesAsync();

            var token = GenerateJwtToken(newUser, customerRole.Name);
            var refreshToken = GenerateRefreshToken();
            
            var userSession = new UserSession
            {
                UserId = newUser.Id,
                RefreshTokenHash = HashToken(refreshToken),
                LastActiveTimestamp = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(30),
                IsRevoked = false
            };
            
            await _unitOfWork.Repository<UserSession>().AddAsync(userSession);
            await _unitOfWork.SaveChangesAsync();

            return new AuthResponse
            {
                Token = token,
                RefreshToken = refreshToken,
                Email = newUser.Email,
                FullName = newUser.FullName,
                Role = customerRole.Name
            };
        }

        public async Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request)
        {
            var hashedToken = HashToken(request.RefreshToken);
            
            var repo = _unitOfWork.Repository<UserSession>();
            var sessions = await repo.GetAllAsync();
            var session = sessions.FirstOrDefault(s => s.RefreshTokenHash == hashedToken && !s.IsRevoked);

            if (session == null)
                throw new Exception("Invalid session or refresh token.");

            var now = DateTime.UtcNow;

            if (now > session.ExpiresAt)
            {
                session.IsRevoked = true;
                repo.Update(session);
                await _unitOfWork.SaveChangesAsync();
                throw new Exception("Session absolutely expired. Please login again.");
            }

            if ((now - session.LastActiveTimestamp).TotalMinutes > 15)
            {
                session.IsRevoked = true;
                repo.Update(session);
                await _unitOfWork.SaveChangesAsync();
                throw new Exception("Session expired due to idle timeout.");
            }

            var userRepo = _unitOfWork.Repository<AppUser>();
            var user = await userRepo.GetByIdAsync(session.UserId);
            
            if (user == null || !user.IsActive)
            {
                throw new Exception("User is disabled or not found.");
            }
            
            var roleRepo = _unitOfWork.Repository<Role>();
            var role = await roleRepo.GetByIdAsync(user.RoleId);

            var newJwt = GenerateJwtToken(user, role?.Name ?? "Customer");
            var newRefreshToken = GenerateRefreshToken();

            session.RefreshTokenHash = HashToken(newRefreshToken);
            session.LastActiveTimestamp = now;
            
            repo.Update(session);
            await _unitOfWork.SaveChangesAsync();

            return new AuthResponse
            {
                Token = newJwt,
                RefreshToken = newRefreshToken,
                Email = user.Email,
                FullName = user.FullName,
                Role = role?.Name ?? "Customer"
            };
        }

        public async Task<bool> LogoutAsync(string refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken)) return false;
            
            var hashedToken = HashToken(refreshToken);
            var repo = _unitOfWork.Repository<UserSession>();
            var sessions = await repo.GetAllAsync();
            var session = sessions.FirstOrDefault(s => s.RefreshTokenHash == hashedToken);
            
            if (session != null)
            {
                session.IsRevoked = true;
                repo.Update(session);
                await _unitOfWork.SaveChangesAsync();
            }
            
            return true;
        }

        private string GenerateJwtToken(AppUser user, string roleName)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = Encoding.ASCII.GetBytes(jwtSettings["Secret"]!);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, roleName)
                }),
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpirationInMinutes"]!)),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
