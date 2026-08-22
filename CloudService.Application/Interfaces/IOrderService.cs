using CloudService.Application.Common;
using CloudService.Application.DTOs.Orders;

namespace CloudService.Application.Interfaces
{
    public interface IOrderService
    {
        Task<PagedResponse<OrderDto>> GetUserOrdersAsync(Guid userId, PaginationFilter filter);
        Task<PagedResponse<OrderDto>> GetAllOrdersAsync(PaginationFilter filter);
        Task<OrderDto> CreateOrderAsync(Guid userId, CreateOrderDto dto);
        Task<decimal?> GetPaymentAmountAsync(Guid orderId, Guid requesterId, bool isAdmin);
        Task<bool> UpdateOrderStatusAsync(Guid orderId, string status);
        Task<bool> ApproveOrderAsync(Guid orderId, ApproveOrderDto dto);
        Task<OrderDto> AdminCreateOrderAsync(AdminCreateOrderDto dto);
        Task<bool> DeleteOrderAsync(Guid orderId);
    }
}
