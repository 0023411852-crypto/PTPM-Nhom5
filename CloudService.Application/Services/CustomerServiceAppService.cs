using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CloudService.Application.Common;
using CloudService.Application.DTOs.CustomerServices;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.Services
{
    public class CustomerServiceAppService : ICustomerServiceAppService
    {
        private readonly IGenericRepository<CustomerService> _repository;
        private readonly IMapper _mapper;

        public CustomerServiceAppService(IGenericRepository<CustomerService> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<PagedResponse<CustomerServiceDto>> GetMyServicesAsync(Guid customerId, PaginationFilter filter)
        {
            var allItems = await _repository.GetAllAsync();
            var myItems = allItems.Where(x => x.CustomerId == customerId).ToList();
            
            var totalCount = myItems.Count;
            
            var paginatedItems = myItems
                .OrderByDescending(x => x.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            var dtos = _mapper.Map<List<CustomerServiceDto>>(paginatedItems);

            return new PagedResponse<CustomerServiceDto>(dtos, totalCount, filter.PageNumber, filter.PageSize);
        }

        public async Task<CustomerServiceDto?> GetServiceByIdAsync(Guid id, Guid customerId)
        {
            var allItems = await _repository.GetAllAsync();
            var entity = allItems.FirstOrDefault(x => x.Id == id && x.CustomerId == customerId);
            if (entity == null) return null;
            return _mapper.Map<CustomerServiceDto>(entity);
        }
    }
}
