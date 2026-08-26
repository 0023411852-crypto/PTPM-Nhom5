using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CloudService.Application.Common;
using CloudService.Application.DTOs.CustomerServices;

namespace CloudService.Application.Interfaces
{
    public interface ICustomerServiceAppService
    {
        Task<PagedResponse<CustomerServiceDto>> GetMyServicesAsync(Guid customerId, PaginationFilter filter);
        Task<CustomerServiceDto?> GetServiceByIdAsync(Guid id, Guid customerId);
    }
}
