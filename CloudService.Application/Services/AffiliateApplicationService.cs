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
            var allData = await repo.GetAllAsync();

            var pagedData = allData
                .OrderByDescending(x => x.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            var dtos = _mapper.Map<List<AffiliateApplicationDto>>(pagedData);
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
    }
}
