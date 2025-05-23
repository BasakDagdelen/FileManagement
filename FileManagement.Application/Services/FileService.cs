using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using FileManagement.Application.Interfaces;
using FileManagement.Core.DTOs;
using FileManagement.Core.Entities;
using FileManagement.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace FileManagement.Application.Services
{
    public class FileService : IFileService
    {
        private readonly IFileRepository _fileRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<FileService> _logger;
        private readonly string _uploadPath;

        public FileService(
            IFileRepository fileRepository,
            IConfiguration configuration,
            ILogger<FileService> logger)
        {
            _fileRepository = fileRepository;
            _configuration = configuration;
            _logger = logger;
            _uploadPath = _configuration["FileStorage:UploadPath"] ?? "Uploads";
            
            if (!Directory.Exists(_uploadPath))
            {
                Directory.CreateDirectory(_uploadPath);
            }
        }

        public async Task<FileResponseDto> UploadFileAsync(IFormFile file, Guid userId)
        {
            _logger.LogInformation("Attempting to upload file for user {UserId}", userId);

            if (file == null || file.Length == 0)
            {
                _logger.LogWarning("No file was uploaded for user {UserId}", userId);
                throw new Exception("No file uploaded");
            }

            var allowedExtensions = new[] { ".pdf", ".png", ".jpg", ".jpeg" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!Array.Exists(allowedExtensions, x => x == fileExtension))
            {
                _logger.LogWarning("Invalid file type {FileType} uploaded by user {UserId}", fileExtension, userId);
                throw new Exception("Invalid file type. Only PDF, PNG, and JPG files are allowed.");
            }

            var fileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(_uploadPath, fileName);

            try
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var fileEntity = new FileManagement.Core.Entities.File
                {
                    Id = Guid.NewGuid(),
                    FileName = file.FileName,
                    FilePath = filePath,
                    FileType = fileExtension,
                    FileSize = file.Length,
                    UploadDate = DateTime.UtcNow,
                    UserId = userId
                };

                await _fileRepository.AddAsync(fileEntity);
                _logger.LogInformation("File {FileName} successfully uploaded for user {UserId}", file.FileName, userId);

                return new FileResponseDto
                {
                    Id = fileEntity.Id,
                    FileName = fileEntity.FileName,
                    FileType = fileEntity.FileType,
                    FileSize = fileEntity.FileSize,
                    UploadDate = fileEntity.UploadDate
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading file for user {UserId}", userId);
                throw;
            }
        }

        public async Task<IEnumerable<FileResponseDto>> GetUserFilesAsync(Guid userId)
        {
            _logger.LogInformation("Retrieving files for user {UserId}", userId);
            var files = await _fileRepository.GetUserFilesAsync(userId);
            return files.Select(f => new FileResponseDto
            {
                Id = f.Id,
                FileName = f.FileName,
                FileType = f.FileType,
                FileSize = f.FileSize,
                UploadDate = f.UploadDate
            });
        }

        public async Task<FileResponseDto> GetFileAsync(Guid fileId, Guid userId)
        {
            _logger.LogInformation("Retrieving file {FileId} for user {UserId}", fileId, userId);
            var file = await _fileRepository.GetUserFileAsync(userId, fileId);
            if (file == null)
            {
                _logger.LogWarning("File {FileId} not found for user {UserId}", fileId, userId);
                throw new Exception("File not found");
            }

            return new FileResponseDto
            {
                Id = file.Id,
                FileName = file.FileName,
                FileType = file.FileType,
                FileSize = file.FileSize,
                UploadDate = file.UploadDate
            };
        }

        public async Task DeleteFileAsync(Guid fileId, Guid userId)
        {
            _logger.LogInformation("Attempting to delete file {FileId} for user {UserId}", fileId, userId);
            var file = await _fileRepository.GetUserFileAsync(userId, fileId);
            if (file == null)
            {
                _logger.LogWarning("File {FileId} not found for user {UserId}", fileId, userId);
                throw new Exception("File not found");
            }

            try
            {
                if (System.IO.File.Exists(file.FilePath))
                {
                    System.IO.File.Delete(file.FilePath);
                    _logger.LogInformation("Physical file deleted: {FilePath}", file.FilePath);
                }

                await _fileRepository.DeleteAsync(file);
                _logger.LogInformation("File {FileId} successfully deleted for user {UserId}", fileId, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file {FileId} for user {UserId}", fileId, userId);
                throw;
            }
        }
    }
} 