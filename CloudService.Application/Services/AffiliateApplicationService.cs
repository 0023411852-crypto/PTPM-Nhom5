using AutoMapper;
using CloudService.Application.Common;
using CloudService.Application.DTOs.AffiliateApplications;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Enums;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.Services
{
    public class AffiliateApplicationService : IAffiliateApplicationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AffiliateApplicationService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedResponse<AffiliateApplicationDto>> GetAllAsync(PaginationFilter filter)
        {
            var repo = _unitOfWork.Repository<AffiliateApplication>();
            var userRepo = _unitOfWork.Repository<AppUser>();
            var allData = await repo.GetAllAsync();
            var allUsers = await userRepo.GetAllAsync();

            var pagedData = allData
                .OrderByDescending(x => x.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            var dtos = _mapper.Map<List<AffiliateApplicationDto>>(pagedData);
            foreach (var dto in dtos)
            {
                var user = allUsers.FirstOrDefault(u => u.Id == dto.UserId);
                if (user != null)
                {
                    dto.FullName = user.FullName;
                    dto.Email = user.Email;
                }
            }

            return new PagedResponse<AffiliateApplicationDto>(dtos, allData.Count(), filter.PageNumber, filter.PageSize);
        }

        public async Task<AffiliateApplicationDto?> GetByUserIdAsync(Guid userId)
        {
            var repo = _unitOfWork.Repository<AffiliateApplication>();
            var allData = await repo.GetAllAsync();
            var entity = allData.FirstOrDefault(x => x.UserId == userId);
            
            if (entity == null) return null;
            return _mapper.Map<AffiliateApplicationDto>(entity);
        }

        public async Task<AffiliateApplicationDto> CreateAsync(Guid userId, CreateAffiliateApplicationDto dto)
        {
            var repo = _unitOfWork.Repository<AffiliateApplication>();
            var allData = await repo.GetAllAsync();
            if (allData.Any(x => x.UserId == userId))
            {
                throw new Exception("You have already applied for the affiliate program.");
            }

            var entity = _mapper.Map<AffiliateApplication>(dto);
            entity.UserId = userId;
            entity.Status = AffiliateStatus.Pending;
            
            await repo.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            
            return _mapper.Map<AffiliateApplicationDto>(entity);
        }

        public async Task<AffiliateApplicationDto> UpdateStatusAsync(Guid id, UpdateAffiliateApplicationDto dto)
        {
            var repo = _unitOfWork.Repository<AffiliateApplication>();
            var entity = await repo.GetByIdAsync(id);
            if (entity == null) throw new Exception("Application not found");

            entity.Status = dto.Status;
            repo.Update(entity);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<AffiliateApplicationDto>(entity);
        }

        public async Task<AffiliateApplicationDto> AdminCreatePartnerAsync(AdminCreatePartnerDto dto)
        {
            var userRepo = _unitOfWork.Repository<AppUser>();
            var allUsers = await userRepo.GetAllAsync();
            var existingUser = allUsers.FirstOrDefault(u => u.Email == dto.Email);

            AppUser userToUse;
            if (existingUser != null)
            {
                userToUse = existingUser;
            }
            else
            {
                var roleRepo = _unitOfWork.Repository<Role>();
                var roles = await roleRepo.GetAllAsync();
                var customerRole = roles.FirstOrDefault(r => r.Name == "Customer");

                userToUse = new AppUser
                {
                    Email = dto.Email,
                    FullName = dto.FullName,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    RoleId = customerRole!.Id,
                    IsActive = true
                };
                await userRepo.AddAsync(userToUse);
                await _unitOfWork.SaveChangesAsync();
            }

            var appRepo = _unitOfWork.Repository<AffiliateApplication>();
            var existingApps = await appRepo.GetAllAsync();
            
            if (existingApps.Any(a => a.UserId == userToUse.Id))
            {
                throw new Exception("Người dùng này đã là đối tác.");
            }

            var entity = new AffiliateApplication
            {
                UserId = userToUse.Id,
                WebsiteUrl = dto.WebsiteUrl,
                PromotionMethod = dto.PromotionalMethods,
                Status = dto.Status
            };
            
            await appRepo.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();

            var resultDto = _mapper.Map<AffiliateApplicationDto>(entity);
            resultDto.FullName = userToUse.FullName;
            resultDto.Email = userToUse.Email;
            
            return resultDto;
        }

        public async Task SeedDataAsync()
        {
            var partners = new List<AdminCreatePartnerDto>
            {
                new AdminCreatePartnerDto { FullName = "Công ty TNHH VNG", Email = "contact@vng.com.vn", WebsiteUrl = "https://vng.com.vn", PromotionalMethods = "agency", Status = AffiliateStatus.Approved },
                new AdminCreatePartnerDto { FullName = "Hoàng Công T", Email = "tech_reviewer@gmail.com", WebsiteUrl = "https://youtube.com/...", PromotionalMethods = "social", Status = AffiliateStatus.Pending },
                new AdminCreatePartnerDto { FullName = "Lê Blog IT", Email = "admin@leblog.vn", WebsiteUrl = "https://leblog.vn", PromotionalMethods = "blog", Status = AffiliateStatus.Pending },
                new AdminCreatePartnerDto { FullName = "FPT Software", Email = "partner@fsoft.com.vn", WebsiteUrl = "https://fptsoftware.com", PromotionalMethods = "agency", Status = AffiliateStatus.Approved },
                new AdminCreatePartnerDto { FullName = "Nguyễn Văn Spam", Email = "spam1234@spam.com", WebsiteUrl = "", PromotionalMethods = "other", Status = AffiliateStatus.Rejected }
            };

            foreach (var partner in partners)
            {
                try
                {
                    await AdminCreatePartnerAsync(partner);
                }
                catch
                {
                    // Ignore if already exists
                }
            }
        }
    }
}
