using AutoMapper;
using CloudService.Application.DTOs.PackageSpecifications;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CloudService.Application.Services
{
    public class PackageSpecificationService : IPackageSpecificationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public PackageSpecificationService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PackageSpecificationDto> CreateAsync(CreatePackageSpecificationDto dto)
        {
            var spec = _mapper.Map<PackageSpecification>(dto);
            await _unitOfWork.Repository<PackageSpecification>().AddAsync(spec);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<PackageSpecificationDto>(spec);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var repo = _unitOfWork.Repository<PackageSpecification>();
            var spec = await repo.GetByIdAsync(id);
            if (spec == null) return false;

            repo.Delete(spec);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<PackageSpecificationDto>> GetByPlanIdAsync(Guid planId)
        {
            var repo = _unitOfWork.Repository<PackageSpecification>();
            var specs = repo.GetQueryable()
                .Where(p => p.ServicePlanId == planId)
                .OrderBy(p => p.DisplayOrder)
                .ToList();
            return _mapper.Map<IEnumerable<PackageSpecificationDto>>(specs);
        }

        public async Task<PackageSpecificationDto> GetByIdAsync(Guid id)
        {
            var spec = await _unitOfWork.Repository<PackageSpecification>().GetByIdAsync(id);
            return _mapper.Map<PackageSpecificationDto>(spec);
        }

        public async Task<PackageSpecificationDto> UpdateAsync(Guid id, UpdatePackageSpecificationDto dto)
        {
            var repo = _unitOfWork.Repository<PackageSpecification>();
            var spec = await repo.GetByIdAsync(id);
            if (spec == null) return null;

            _mapper.Map(dto, spec);
            spec.UpdatedAt = DateTime.UtcNow;
            
            repo.Update(spec);
            await _unitOfWork.SaveChangesAsync();
            
            return _mapper.Map<PackageSpecificationDto>(spec);
        }
    }
}
