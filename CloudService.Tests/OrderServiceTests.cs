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
        private readonly Mock<IGenericRepository<Promotion>> _promotionRepoMock;

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
            _promotionRepoMock = new Mock<IGenericRepository<Promotion>>();

            _unitOfWorkMock.Setup(u => u.Repository<ServicePlan>()).Returns(_planRepoMock.Object);
            _unitOfWorkMock.Setup(u => u.Repository<PlanPrice>()).Returns(_priceRepoMock.Object);
            _unitOfWorkMock.Setup(u => u.Repository<OrderRequest>()).Returns(_orderRepoMock.Object);
            _unitOfWorkMock.Setup(u => u.Repository<CustomerService>()).Returns(_serviceRepoMock.Object);
            _unitOfWorkMock.Setup(u => u.Repository<Promotion>()).Returns(_promotionRepoMock.Object);

            _orderService = new OrderService(
                _unitOfWorkMock.Object,
                _mapperMock.Object,
                _emailServiceMock.Object,
                _eventDispatcherMock.Object,
                _configMock.Object
            );
        }

        [Fact]
        public async Task CreateOrderAsync_ShouldThrowNotFoundException_WhenPlanDoesNotExist()
        {
            var userId = Guid.NewGuid();
            _planRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), "")).ReturnsAsync((ServicePlan?)null);
            
            var dto = new CreateOrderDto { ServicePlanId = Guid.NewGuid(), PlanPriceId = Guid.NewGuid() };

            Func<Task> act = async () => await _orderService.CreateOrderAsync(userId, dto);

            await act.Should().ThrowAsync<NotFoundException>().WithMessage("Service Plan not found");
        }

        [Fact]
        public async Task ConfirmDemoPaymentAsync_ShouldReturnNull_WhenOrderDoesNotExist()
        {
            var orderId = Guid.NewGuid();
            var userId = Guid.NewGuid();
            _orderRepoMock.Setup(r => r.FirstOrDefaultAsync(It.IsAny<System.Linq.Expressions.Expression<Func<OrderRequest, bool>>>(), "ServicePlan"))
                .ReturnsAsync((OrderRequest?)null);

            var result = await _orderService.ConfirmDemoPaymentAsync(orderId, userId);

            result.Should().BeNull();
        }

        [Fact]
        public async Task CreateOrderAsync_ShouldRejectNegativePrice()
        {
            var planId = Guid.NewGuid();
            var priceId = Guid.NewGuid();
            _planRepoMock.Setup(r => r.GetByIdAsync(planId, "")).ReturnsAsync(new ServicePlan { Id = planId });
            _priceRepoMock.Setup(r => r.GetByIdAsync(priceId, "")).ReturnsAsync(new PlanPrice
            {
                Id = priceId,
                ServicePlanId = planId,
                Price = -1,
                SetupFee = 0
            });

            Func<Task> act = async () => await _orderService.CreateOrderAsync(
                Guid.NewGuid(), new CreateOrderDto { ServicePlanId = planId, PlanPriceId = priceId });

            await act.Should().ThrowAsync<ValidationException>()
                .WithMessage("Price and setup fee must be non-negative");
        }

        [Fact]
        public async Task CreateOrderAsync_ShouldRejectPromotionDiscountOutsideRange()
        {
            var planId = Guid.NewGuid();
            var priceId = Guid.NewGuid();
            var promotionId = Guid.NewGuid();
            _planRepoMock.Setup(r => r.GetByIdAsync(planId, "")).ReturnsAsync(new ServicePlan { Id = planId });
            _priceRepoMock.Setup(r => r.GetByIdAsync(priceId, "")).ReturnsAsync(new PlanPrice
            {
                Id = priceId,
                ServicePlanId = planId,
                Price = 100,
                SetupFee = 10
            });
            _promotionRepoMock.Setup(r => r.GetByIdAsync(promotionId, "ServicePlans"))
                .ReturnsAsync(new Promotion
                {
                    Id = promotionId,
                    IsActive = true,
                    StartDate = DateTime.UtcNow.AddMinutes(-1),
                    DiscountPercentage = 101
                });

            Func<Task> act = async () => await _orderService.CreateOrderAsync(
                Guid.NewGuid(), new CreateOrderDto
                {
                    ServicePlanId = planId,
                    PlanPriceId = priceId,
                    PromotionId = promotionId
                });

            await act.Should().ThrowAsync<ValidationException>()
                .WithMessage("Promotion discount must be between 0 and 100 percent");
        }
    }
}
