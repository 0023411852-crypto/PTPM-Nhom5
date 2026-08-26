using CloudService.Domain.Interfaces;
using CloudService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudService.Infrastructure.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly ApplicationDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public GenericRepository(ApplicationDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public async Task<T?> GetByIdAsync(Guid id, string includeProperties = "")
        {
            if (string.IsNullOrEmpty(includeProperties))
            {
                return await _dbSet.FindAsync(id);
            }

            // Khi có includeProperties, dùng LINQ query thay vì FindAsync
            IQueryable<T> query = _dbSet;
            foreach (var prop in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(prop.Trim());
            }

            return await query.FirstOrDefaultAsync(e => EF.Property<Guid>(e, "Id") == id);
        }

        public async Task<T?> FirstOrDefaultAsync(System.Linq.Expressions.Expression<Func<T, bool>> predicate, string includeProperties = "")
        {
            return await GetQueryable(includeProperties).AsNoTracking().FirstOrDefaultAsync(predicate);
        }

        public async Task<IEnumerable<T>> GetAllAsync(string includeProperties = "")
        {
            IQueryable<T> query = _dbSet;

            foreach (var includeProperty in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }

            return await query.ToListAsync();
        }

        public IQueryable<T> GetQueryable(string includeProperties = "")
        {
            IQueryable<T> query = _dbSet;

            foreach (var includeProperty in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }

            return query;
        }

        public Task<int> CountAsync(Func<IQueryable<T>, IQueryable<T>> queryBuilder, string includeProperties = "")
        {
            return queryBuilder(GetQueryable(includeProperties).AsNoTracking()).CountAsync();
        }

        public Task<List<T>> ToListAsync(Func<IQueryable<T>, IQueryable<T>> queryBuilder, string includeProperties = "")
        {
            return queryBuilder(GetQueryable(includeProperties).AsNoTracking()).ToListAsync();
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public void Update(T entity)
        {
            _dbSet.Update(entity);
        }

        public void Delete(T entity)
        {
            _dbSet.Remove(entity);
        }
    }
}
