using AutoMapper;
using CloudService.Application.DTOs.Orders;
using CloudService.Application.Interfaces;
using CloudService.Application.Services;
using CloudService.Domain.Entities;
using CloudService.Domain.Enums;
using CloudService.Domain.Exceptions;
using CloudService.Domain.Interfaces;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace CloudService.Tests
{
    public class OrderServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IEmailService> _emailServiceMock;
        private readonly Mock<IEventDispatcher> _eventDispatcherMock;
        private readonly OrderService _orderService;

        private readonly Mock<IGenericRepository<AppUser>> _userRepoMock;
        private readonly Mock<IGenericRepository<Product>> _productRepoMock;
        private readonly Mock<IGenericRepository<Order>> _orderRepoMock;
        private readonly Mock<IGenericRepository<OrderDetail>> _orderDetailRepoMock;

        public OrderServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _mapperMock = new Mock<IMapper>();
            _emailServiceMock = new Mock<IEmailService>();
            _eventDispatcherMock = new Mock<IEventDispatcher>();

            _userRepoMock = new Mock<IGenericRepository<AppUser>>();
            _productRepoMock = new Mock<IGenericRepository<Product>>();
            _orderRepoMock = new Mock<IGenericRepository<Order>>();
            _orderDetailRepoMock = new Mock<IGenericRepository<OrderDetail>>();

            _unitOfWorkMock.Setup(u => u.Repository<AppUser>()).Returns(_userRepoMock.Object);
            _unitOfWorkMock.Setup(u => u.Repository<Product>()).Returns(_productRepoMock.Object);
            _unitOfWorkMock.Setup(u => u.Repository<Order>()).Returns(_orderRepoMock.Object);
            _unitOfWorkMock.Setup(u => u.Repository<OrderDetail>()).Returns(_orderDetailRepoMock.Object);

            _orderService = new OrderService(
                _unitOfWorkMock.Object,
                _mapperMock.Object,
                _emailServiceMock.Object,
                _eventDispatcherMock.Object
            );
        }

        [Fact]
        public async Task CreateOrderAsync_ShouldThrowNotFound_WhenUserDoesNotExist()
        {
            var userId = Guid.NewGuid();
            _userRepoMock.Setup(r => r.GetByIdAsync(userId, "")).ReturnsAsync((AppUser)null);
            
            var dto = new CreateOrderDto { ProductIds = new List<Guid> { Guid.NewGuid() } };

            Func<Task> act = async () => await _orderService.CreateOrderAsync(userId, dto);

            await act.Should().ThrowAsync<NotFoundException>().WithMessage("Người dùng không tồn tại");
        }

        [Fact]
        public async Task ConfirmDemoPaymentAsync_ShouldThrowNotFound_WhenOrderDoesNotExist()
        {
            var orderId = Guid.NewGuid();
            var userId = Guid.NewGuid();
            _orderRepoMock.Setup(r => r.GetByIdAsync(orderId, "")).ReturnsAsync((Order)null);

            Func<Task> act = async () => await _orderService.ConfirmDemoPaymentAsync(orderId, userId);

            await act.Should().ThrowAsync<NotFoundException>().WithMessage("Không tìm thấy đơn hàng");
        }
    }
}
