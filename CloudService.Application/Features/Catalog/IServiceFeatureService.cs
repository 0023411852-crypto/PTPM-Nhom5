using CloudService.Application.DTOs.ServiceFeatures;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CloudService.Application.Interfaces
{
    public interface IServiceFeatureService
    {
        Task<IEnumerable<ServiceFeatureDto>> GetByCategoryIdAsync(Guid categoryId);
        Task<ServiceFeatureDto> GetByIdAsync(Guid id);
        Task<ServiceFeatureDto> CreateAsync(CreateServiceFeatureDto dto);
        Task<ServiceFeatureDto> UpdateAsync(Guid id, UpdateServiceFeatureDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
