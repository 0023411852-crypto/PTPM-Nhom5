namespace CloudService.Domain.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(Guid id, string includeProperties = "");
        Task<IEnumerable<T>> GetAllAsync(string includeProperties = "");
        Task AddAsync(T entity);
        void Update(T entity);
        void Delete(T entity);
    }
}
