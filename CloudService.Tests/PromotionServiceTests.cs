using AutoMapper;
using CloudService.Application.DTOs.Promotions;
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
    public class PromotionServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly PromotionService _promotionService;
        private readonly Mock<IGenericRepository<Promotion>> _promotionRepoMock;

        public PromotionServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _mapperMock = new Mock<IMapper>();

            _promotionRepoMock = new Mock<IGenericRepository<Promotion>>();
            _unitOfWorkMock.Setup(u => u.Repository<Promotion>()).Returns(_promotionRepoMock.Object);

            _promotionService = new PromotionService(_unitOfWorkMock.Object, _mapperMock.Object);
        }

        [Fact]
        public async Task UpdateAsync_ShouldThrowNotFoundException_WhenPromotionDoesNotExist()
        {
            var promotionId = Guid.NewGuid();
            var dto = new UpdatePromotionDto { Code = "UPDATED" };
            _promotionRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<string>())).ReturnsAsync((Promotion?)null);

            Func<Task> act = async () => await _promotionService.UpdateAsync(promotionId, dto);

            await act.Should().ThrowAsync<NotFoundException>().WithMessage("Promotion not found");
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenPromotionDoesNotExist()
        {
            var promotionId = Guid.NewGuid();
            _promotionRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<string>())).ReturnsAsync((Promotion?)null);

            var result = await _promotionService.GetByIdAsync(promotionId);

            result.Should().BeNull();
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnFalse_WhenPromotionDoesNotExist()
        {
            var promotionId = Guid.NewGuid();
            _promotionRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), "")).ReturnsAsync((Promotion?)null);

            var result = await _promotionService.DeleteAsync(promotionId);

            result.Should().BeFalse();
        }
    }
}
