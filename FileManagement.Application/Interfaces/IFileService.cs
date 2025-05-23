using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using FileManagement.Core.DTOs;

namespace FileManagement.Application.Interfaces
{
    public interface IFileService
    {
        Task<FileResponseDto> UploadFileAsync(IFormFile file, Guid userId);
        Task<IEnumerable<FileResponseDto>> GetUserFilesAsync(Guid userId);
        Task<FileResponseDto> GetFileAsync(Guid fileId, Guid userId);
        Task DeleteFileAsync(Guid fileId, Guid userId);
    }
} 