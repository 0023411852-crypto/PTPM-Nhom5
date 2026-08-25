using AutoMapper;
using CloudService.Application.DTOs.SupportTickets;
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
    public class SupportTicketServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IEventDispatcher> _eventDispatcherMock;
        private readonly SupportTicketService _ticketService;
        private readonly Mock<IGenericRepository<SupportTicket>> _ticketRepoMock;
        private readonly Mock<IGenericRepository<AppUser>> _userRepoMock;

        public SupportTicketServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _mapperMock = new Mock<IMapper>();
            _eventDispatcherMock = new Mock<IEventDispatcher>();

            _ticketRepoMock = new Mock<IGenericRepository<SupportTicket>>();
            _userRepoMock = new Mock<IGenericRepository<AppUser>>();

            _unitOfWorkMock.Setup(u => u.Repository<SupportTicket>()).Returns(_ticketRepoMock.Object);
            _unitOfWorkMock.Setup(u => u.Repository<AppUser>()).Returns(_userRepoMock.Object);

            _ticketService = new SupportTicketService(_unitOfWorkMock.Object, _mapperMock.Object, _eventDispatcherMock.Object);
        }

        [Fact]
        public async Task ReplyToTicketAsync_ShouldThrowNotFoundException_WhenTicketDoesNotExist()
        {
            var userId = Guid.NewGuid();
            var ticketId = Guid.NewGuid();
            var dto = new CreateTicketReplyDto { Content = "Test reply" };
            _ticketRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((SupportTicket?)null);

            Func<Task> act = async () => await _ticketService.ReplyToTicketAsync(userId, ticketId, dto, false);

            await act.Should().ThrowAsync<NotFoundException>().WithMessage("Ticket not found");
        }

        [Fact]
        public async Task CloseTicketAsync_ShouldThrowNotFoundException_WhenTicketDoesNotExist()
        {
            var ticketId = Guid.NewGuid();
            _ticketRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((SupportTicket?)null);

            Func<Task> act = async () => await _ticketService.CloseTicketAsync(ticketId);

            await act.Should().ThrowAsync<NotFoundException>();
        }

        [Fact]
        public async Task CreateAsync_ShouldDispatchTicketCreatedEvent_WhenSuccess()
        {
            var customerId = Guid.NewGuid();
            var dto = new CreateSupportTicketDto { Title = "Test Issue", Content = "Test content" };
            var user = new AppUser { Id = customerId, Email = "test@example.com" };
            _userRepoMock.Setup(r => r.GetByIdAsync(customerId)).ReturnsAsync(user);

            await _ticketService.CreateAsync(customerId, dto);

            _eventDispatcherMock.Verify(d => d.DispatchAsync(It.IsAny<SupportTicketCreatedEvent>()), Times.Once);
        }
    }
}
