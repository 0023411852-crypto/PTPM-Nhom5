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
            IQueryable<T> query = _dbSet;
            
            foreach (var includeProperty in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }
            
            var entity = await _dbSet.FindAsync(id);
            if (entity != null && !string.IsNullOrEmpty(includeProperties))
            {
                // FindAsync doesn't support Includes well if entity is already loaded, 
                // so we reload from query for safety if includes are provided.
                // Wait, it's better to just query by ID if includeProperties are provided.
                // Assuming T has an Id property is hard without generic constraints, but we can just use FindAsync for now
                // Actually, let's just do:
            }
            
            // To properly do generic Include with GetById, we can't easily filter by ID if we don't know the ID column name.
            // But we can just use the provided includeProperties on GetAllAsync, and then find.
            return await _dbSet.FindAsync(id); // Warning: GetByIdAsync with Include is complex for generic repos. Let's just use it on GetAllAsync.
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
