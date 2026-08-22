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
        private readonly Mock<Microsoft.Extensions.Configuration.IConfiguration> _configMock;
        private readonly OrderService _orderService;

        private readonly Mock<IGenericRepository<ServicePlan>> _planRepoMock;
        private readonly Mock<IGenericRepository<PlanPrice>> _priceRepoMock;
        private readonly Mock<IGenericRepository<OrderRequest>> _orderRepoMock;
        private readonly Mock<IGenericRepository<CustomerService>> _serviceRepoMock;

        public OrderServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _mapperMock = new Mock<IMapper>();
            _emailServiceMock = new Mock<IEmailService>();
            _eventDispatcherMock = new Mock<IEventDispatcher>();
            _configMock = new Mock<Microsoft.Extensions.Configuration.IConfiguration>();
            _configMock.Setup(c => c["DemoPayment:Enabled"]).Returns("true");

            _planRepoMock = new Mock<IGenericRepository<ServicePlan>>();
            _priceRepoMock = new Mock<IGenericRepository<PlanPrice>>();
            _orderRepoMock = new Mock<IGenericRepository<OrderRequest>>();
            _serviceRepoMock = new Mock<IGenericRepository<CustomerService>>();

            _unitOfWorkMock.Setup(u => u.Repository<ServicePlan>()).Returns(_planRepoMock.Object);
            _unitOfWorkMock.Setup(u => u.Repository<PlanPrice>()).Returns(_priceRepoMock.Object);
            _unitOfWorkMock.Setup(u => u.Repository<OrderRequest>()).Returns(_orderRepoMock.Object);
            _unitOfWorkMock.Setup(u => u.Repository<CustomerService>()).Returns(_serviceRepoMock.Object);

            _orderService = new OrderService(
                _unitOfWorkMock.Object,
                _mapperMock.Object,
                _emailServiceMock.Object,
                _eventDispatcherMock.Object,
                _configMock.Object
            );
        }

        [Fact]
        public async Task CreateOrderAsync_ShouldThrowException_WhenPlanDoesNotExist()
        {
            var userId = Guid.NewGuid();
            _planRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), "")).ReturnsAsync((ServicePlan?)null);
            
            var dto = new CreateOrderDto { ServicePlanId = Guid.NewGuid(), PlanPriceId = Guid.NewGuid() };

            Func<Task> act = async () => await _orderService.CreateOrderAsync(userId, dto);

            await act.Should().ThrowAsync<Exception>().WithMessage("Service Plan not found");
        }

        [Fact]
        public async Task ConfirmDemoPaymentAsync_ShouldReturnNull_WhenOrderDoesNotExist()
        {
            var orderId = Guid.NewGuid();
            var userId = Guid.NewGuid();
            _orderRepoMock.Setup(r => r.GetAllAsync("ServicePlan")).ReturnsAsync(new List<OrderRequest>().AsQueryable());

            var result = await _orderService.ConfirmDemoPaymentAsync(orderId, userId);

            result.Should().BeNull();
        }
    }
}
