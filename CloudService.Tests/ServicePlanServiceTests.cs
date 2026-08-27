using AutoMapper;
using CloudService.Application.DTOs.ServicePlans;
using CloudService.Application.Interfaces;
using CloudService.Application.Services;
using CloudService.Domain.Entities;
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
    public class ServicePlanServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IQRCodeService> _qrCodeServiceMock;
        private readonly Mock<IEventDispatcher> _eventDispatcherMock;
        private readonly ServicePlanService _servicePlanService;
        private readonly Mock<IGenericRepository<ServicePlan>> _planRepoMock;
        private readonly Mock<IGenericRepository<ServiceCategory>> _categoryRepoMock;

        public ServicePlanServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _mapperMock = new Mock<IMapper>();
            _qrCodeServiceMock = new Mock<IQRCodeService>();
            _eventDispatcherMock = new Mock<IEventDispatcher>();

            _planRepoMock = new Mock<IGenericRepository<ServicePlan>>();
            _categoryRepoMock = new Mock<IGenericRepository<ServiceCategory>>();

            _unitOfWorkMock.Setup(u => u.Repository<ServicePlan>()).Returns(_planRepoMock.Object);
            _unitOfWorkMock.Setup(u => u.Repository<ServiceCategory>()).Returns(_categoryRepoMock.Object);

            _qrCodeServiceMock.Setup(q => q.GenerateQRCodeBase64(It.IsAny<string>())).Returns("base64_qr_code");

            _servicePlanService = new ServicePlanService(_unitOfWorkMock.Object, _mapperMock.Object, _qrCodeServiceMock.Object, _eventDispatcherMock.Object);
        }

        [Fact]
        public async Task CreateAsync_ShouldThrowNotFoundException_WhenCategoryDoesNotExist()
        {
            var dto = new CreateServicePlanDto { CategoryId = Guid.NewGuid(), Name = "Test Plan" };
            _categoryRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), "")).ReturnsAsync((ServiceCategory?)null);

            Func<Task> act = async () => await _servicePlanService.CreateAsync(dto);

            await act.Should().ThrowAsync<NotFoundException>().WithMessage("Category not found");
        }

        [Fact]
        public async Task UpdateAsync_ShouldThrowNotFoundException_WhenPlanDoesNotExist()
        {
            var planId = Guid.NewGuid();
            var dto = new UpdateServicePlanDto { Name = "Updated Plan" };
            _planRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<string>()))
                .ReturnsAsync((ServicePlan?)null);

            Func<Task> act = async () => await _servicePlanService.UpdateAsync(planId, dto);

            await act.Should().ThrowAsync<NotFoundException>().WithMessage("Plan not found");
        }

        [Fact]
        public async Task UpdateAsync_ShouldThrowNotFoundException_WhenCategoryDoesNotExist()
        {
            var planId = Guid.NewGuid();
            var categoryId = Guid.NewGuid();
            var plan = new ServicePlan { Id = planId, CategoryId = categoryId };
            var dto = new UpdateServicePlanDto { CategoryId = Guid.NewGuid(), Name = "Updated Plan" };
            
            _planRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<string>()))
                .ReturnsAsync(plan);
            _categoryRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), "")).ReturnsAsync((ServiceCategory?)null);

            Func<Task> act = async () => await _servicePlanService.UpdateAsync(planId, dto);

            await act.Should().ThrowAsync<NotFoundException>().WithMessage("Category not found");
        }
    }
}
