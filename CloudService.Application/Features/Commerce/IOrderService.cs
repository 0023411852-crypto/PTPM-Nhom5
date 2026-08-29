using CloudService.Application.Common;
using CloudService.Application.DTOs.Orders;

namespace CloudService.Application.Interfaces
{
    public interface IOrderService
    {
        Task<PagedResponse<OrderDto>> GetUserOrdersAsync(Guid userId, PaginationFilter filter);
        Task<OrderDetailDto?> GetOrderDetailAsync(Guid orderId, Guid requesterId, bool isAdmin);
        Task<PagedResponse<OrderDto>> GetAllOrdersAsync(PaginationFilter filter);
        Task<byte[]> ExportAllOrdersCsvAsync();
        Task<OrderDto> CreateOrderAsync(Guid userId, CreateOrderDto dto, Guid? orderGroupId = null);
        Task<decimal?> GetPaymentAmountAsync(Guid orderId, Guid requesterId, bool isAdmin);
        Task<DemoPaymentResultDto?> ConfirmDemoPaymentAsync(Guid orderId, Guid requesterId);
        Task<bool> DeleteOrderAsync(Guid orderId, Guid requesterId, bool isAdmin);

        Task<Guid> CreateOrderBatchAsync(Guid userId, CreateOrderBatchDto dto);
        Task<decimal?> GetPaymentAmountForGroupAsync(Guid groupId, Guid requesterId, bool isAdmin);
        Task<List<DemoPaymentResultDto>> ConfirmDemoPaymentGroupAsync(Guid groupId, Guid requesterId);
        Task<List<DemoPaymentResultDto>> ConfirmPayOsPaymentGroupAsync(Guid groupId);
    }
}
