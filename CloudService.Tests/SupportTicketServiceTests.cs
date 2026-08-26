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
        private readonly Mock<IGenericRepository<SupportTicket>> _ticketRepoMock;
        private readonly Mock<IGenericRepository<TicketReply>> _replyRepoMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IEventDispatcher> _eventDispatcherMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly SupportTicketService _ticketService;

        public SupportTicketServiceTests()
        {
            _ticketRepoMock = new Mock<IGenericRepository<SupportTicket>>();
            _replyRepoMock = new Mock<IGenericRepository<TicketReply>>();
            _mapperMock = new Mock<IMapper>();
            _eventDispatcherMock = new Mock<IEventDispatcher>();
            _unitOfWorkMock = new Mock<IUnitOfWork>();

            _ticketService = new SupportTicketService(
                _ticketRepoMock.Object,
                _replyRepoMock.Object,
                _mapperMock.Object,
                _eventDispatcherMock.Object,
                _unitOfWorkMock.Object
            );
        }

        [Fact]
        public async Task ReplyToTicketAsync_ShouldThrowNotFoundException_WhenTicketDoesNotExist()
        {
            var userId = Guid.NewGuid();
            var ticketId = Guid.NewGuid();
            var dto = new CreateTicketReplyDto { Message = "Test reply" };
            _ticketRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), "")).ReturnsAsync((SupportTicket?)null);

            Func<Task> act = async () => await _ticketService.ReplyToTicketAsync(userId, ticketId, dto, false);

            await act.Should().ThrowAsync<NotFoundException>().WithMessage("Ticket not found");
        }

        [Fact]
        public async Task CloseTicketAsync_ShouldReturnFalse_WhenTicketDoesNotExist()
        {
            var ticketId = Guid.NewGuid();
            _ticketRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), "")).ReturnsAsync((SupportTicket?)null);

            var result = await _ticketService.CloseTicketAsync(ticketId);

            result.Should().BeFalse();
        }

        [Fact]
        public async Task CreateTicketAsync_ShouldDispatchTicketCreatedEvent_WhenSuccess()
        {
            var customerId = Guid.NewGuid();
            var dto = new CreateSupportTicketDto { Title = "Test Issue", Description = "Test content" };
            _mapperMock.Setup(m => m.Map<SupportTicketDto>(It.IsAny<SupportTicket>())).Returns(new SupportTicketDto { Id = Guid.NewGuid() });

            await _ticketService.CreateTicketAsync(customerId, dto);

            _eventDispatcherMock.Verify(d => d.DispatchAsync(It.IsAny<CloudService.Domain.Events.SupportTicketCreatedEvent>()), Times.Once);
        }

        [Fact]
        public async Task ReplyToTicketAsync_ShouldThrowValidationException_WhenTicketIsClosed()
        {
            var userId = Guid.NewGuid();
            var ticketId = Guid.NewGuid();
            var ticket = new SupportTicket { Id = ticketId, Status = "Closed", CustomerId = userId };
            var dto = new CreateTicketReplyDto { Message = "Test reply" };
            _ticketRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), "")).ReturnsAsync(ticket);

            Func<Task> act = async () => await _ticketService.ReplyToTicketAsync(userId, ticketId, dto, false);

            await act.Should().ThrowAsync<ValidationException>().WithMessage("Không thể trả lời ticket đã đóng.");
        }
    }
}
