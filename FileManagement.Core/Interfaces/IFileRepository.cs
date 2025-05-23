using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FileManagement.Core.Entities;

namespace FileManagement.Core.Interfaces
{
    public interface IFileRepository : IRepository<FileManagement.Core.Entities.File>
    {
        Task<IEnumerable<FileManagement.Core.Entities.File>> GetUserFilesAsync(Guid userId);
        Task<FileManagement.Core.Entities.File> GetUserFileAsync(Guid userId, Guid fileId);
        Task<bool> IsFileNameUniqueForUserAsync(Guid userId, string fileName);
    }
} 