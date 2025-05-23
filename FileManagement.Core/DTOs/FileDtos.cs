using System;

namespace FileManagement.Core.DTOs
{
    public class FileUploadDto
    {
        public string FileName { get; set; }
        public string FileType { get; set; }
        public long FileSize { get; set; }
    }

    public class FileResponseDto
    {
        public Guid Id { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public long FileSize { get; set; }
        public DateTime UploadDate { get; set; }
    }
} 