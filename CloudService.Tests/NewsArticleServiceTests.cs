using AutoMapper;
using CloudService.Application.DTOs.NewsArticles;
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
    public class NewsArticleServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly NewsArticleService _articleService;
        private readonly Mock<IGenericRepository<NewsArticle>> _articleRepoMock;

        public NewsArticleServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _mapperMock = new Mock<IMapper>();

            _articleRepoMock = new Mock<IGenericRepository<NewsArticle>>();
            _unitOfWorkMock.Setup(u => u.Repository<NewsArticle>()).Returns(_articleRepoMock.Object);

            _articleService = new NewsArticleService(_unitOfWorkMock.Object, _mapperMock.Object);
        }

        [Fact]
        public async Task UpdateAsync_ShouldThrowNotFoundException_WhenArticleDoesNotExist()
        {
            var articleId = Guid.NewGuid();
            var dto = new UpdateNewsArticleDto { Title = "Updated Title" };
            _articleRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), "")).ReturnsAsync((NewsArticle?)null);

            Func<Task> act = async () => await _articleService.UpdateAsync(articleId, dto);

            await act.Should().ThrowAsync<NotFoundException>().WithMessage("Article not found");
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenArticleDoesNotExist()
        {
            var articleId = Guid.NewGuid();
            _articleRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), "")).ReturnsAsync((NewsArticle?)null);

            var result = await _articleService.GetByIdAsync(articleId);

            result.Should().BeNull();
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenArticleIsNotPublishedAndOnlyPublishedIsTrue()
        {
            var articleId = Guid.NewGuid();
            var article = new NewsArticle { Id = articleId, IsPublished = false };
            _articleRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), "")).ReturnsAsync(article);

            var result = await _articleService.GetByIdAsync(articleId, onlyPublished: true);

            result.Should().BeNull();
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnArticle_WhenArticleIsPublished()
        {
            var articleId = Guid.NewGuid();
            var article = new NewsArticle { Id = articleId, IsPublished = true, Title = "Test Article" };
            _articleRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), "")).ReturnsAsync(article);
            _mapperMock.Setup(m => m.Map<NewsArticleDto>(It.IsAny<NewsArticle>())).Returns(new NewsArticleDto { Id = articleId, Title = "Test Article" });

            var result = await _articleService.GetByIdAsync(articleId, onlyPublished: true);

            result.Should().NotBeNull();
            result!.Title.Should().Be("Test Article");
        }
    }
}
