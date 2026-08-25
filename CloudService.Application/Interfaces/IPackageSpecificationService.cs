using CloudService.Application.DTOs.PackageSpecifications;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CloudService.Application.Interfaces
{
    public interface IPackageSpecificationService
    {
        Task<IEnumerable<PackageSpecificationDto>> GetByPlanIdAsync(Guid planId);
        Task<PackageSpecificationDto> GetByIdAsync(Guid id);
        Task<PackageSpecificationDto> CreateAsync(CreatePackageSpecificationDto dto);
        Task<PackageSpecificationDto> UpdateAsync(Guid id, UpdatePackageSpecificationDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
