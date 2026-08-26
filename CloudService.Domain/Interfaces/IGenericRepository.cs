using System.Linq.Expressions;

namespace CloudService.Domain.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(Guid id, string includeProperties = "");
        Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate, string includeProperties = "");
        Task<IEnumerable<T>> GetAllAsync(string includeProperties = "");
        IQueryable<T> GetQueryable(string includeProperties = "");
        Task<int> CountAsync(Func<IQueryable<T>, IQueryable<T>> queryBuilder, string includeProperties = "");
        Task<List<T>> ToListAsync(Func<IQueryable<T>, IQueryable<T>> queryBuilder, string includeProperties = "");
        Task AddAsync(T entity);
        void Update(T entity);
        void Delete(T entity);
    }
}
