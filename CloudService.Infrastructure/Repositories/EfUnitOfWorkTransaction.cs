using Microsoft.EntityFrameworkCore.Storage;
using CloudService.Domain.Interfaces;

namespace CloudService.Infrastructure.Repositories
{
    internal sealed class EfUnitOfWorkTransaction : IUnitOfWorkTransaction
    {
        private readonly IDbContextTransaction _transaction;
        private bool _completed;

        public EfUnitOfWorkTransaction(IDbContextTransaction transaction)
        {
            _transaction = transaction;
        }

        public async Task CommitAsync()
        {
            await _transaction.CommitAsync();
            _completed = true;
        }

        public async Task RollbackAsync()
        {
            await _transaction.RollbackAsync();
            _completed = true;
        }

        public async ValueTask DisposeAsync()
        {
            if (!_completed)
            {
                await _transaction.RollbackAsync();
            }

            await _transaction.DisposeAsync();
        }
    }
}
