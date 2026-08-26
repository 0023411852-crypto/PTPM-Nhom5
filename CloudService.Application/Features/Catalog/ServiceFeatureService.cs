using AutoMapper;
using CloudService.Application.DTOs.ServiceFeatures;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using CloudService.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CloudService.Application.Services
{
    public class ServiceFeatureService : IServiceFeatureService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ServiceFeatureService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ServiceFeatureDto> CreateAsync(CreateServiceFeatureDto dto)
        {
            var feature = _mapper.Map<ServiceFeature>(dto);
            await _unitOfWork.Repository<ServiceFeature>().AddAsync(feature);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<ServiceFeatureDto>(feature);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var repo = _unitOfWork.Repository<ServiceFeature>();
            var feature = await repo.GetByIdAsync(id);
            if (feature == null) return false;

            repo.Delete(feature);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ServiceFeatureDto>> GetByCategoryIdAsync(Guid categoryId)
        {
            // This method currently uses synchronous IQueryable operations.
            await Task.CompletedTask;
            var repo = _unitOfWork.Repository<ServiceFeature>();
            var features = repo.GetQueryable()
                .Where(f => f.ServiceCategoryId == categoryId)
                .OrderBy(f => f.DisplayOrder)
                .ToList();
            return _mapper.Map<IEnumerable<ServiceFeatureDto>>(features);
        }

        public async Task<ServiceFeatureDto> GetByIdAsync(Guid id)
        {
            var feature = await _unitOfWork.Repository<ServiceFeature>().GetByIdAsync(id);
            return _mapper.Map<ServiceFeatureDto>(feature);
        }

        public async Task<ServiceFeatureDto> UpdateAsync(Guid id, UpdateServiceFeatureDto dto)
        {
            var repo = _unitOfWork.Repository<ServiceFeature>();
            var feature = await repo.GetByIdAsync(id);
            if (feature == null) throw new NotFoundException("Service feature not found");

            _mapper.Map(dto, feature);
            feature.UpdatedAt = DateTime.UtcNow;
            
            repo.Update(feature);
            await _unitOfWork.SaveChangesAsync();
            
            return _mapper.Map<ServiceFeatureDto>(feature);
        }
    }
}
