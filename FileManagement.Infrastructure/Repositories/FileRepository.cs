using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FileManagement.Core.Entities;
using FileManagement.Core.Interfaces;
using FileManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FileManagement.Infrastructure.Repositories
{
    public class FileRepository : GenericRepository<FileManagement.Core.Entities.File>, IFileRepository
    {
        public FileRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<FileManagement.Core.Entities.File>> GetUserFilesAsync(Guid userId)
        {
            return await _context.Files
                .Where(f => f.UserId == userId)
                .ToListAsync();
        }

        public async Task<FileManagement.Core.Entities.File> GetUserFileAsync(Guid userId, Guid fileId)
        {
            return await _context.Files
                .FirstOrDefaultAsync(f => f.UserId == userId && f.Id == fileId);
        }

        public async Task<bool> IsFileNameUniqueForUserAsync(Guid userId, string fileName)
        {
            return !await _context.Files
                .AnyAsync(f => f.UserId == userId && f.FileName == fileName);
        }
    }
} 