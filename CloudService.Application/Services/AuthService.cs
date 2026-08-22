using CloudService.Application.DTOs.Auth;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
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

            return new AuthResponse
            {
                Token = token,
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

            return new AuthResponse
            {
                Token = token,
                Email = newUser.Email,
                FullName = newUser.FullName,
                Role = customerRole.Name
            };
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
