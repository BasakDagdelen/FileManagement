using Microsoft.EntityFrameworkCore;
using FileManagement.Core.Entities;

namespace FileManagement.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<FileManagement.Core.Entities.File> Files { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired();
                entity.Property(e => e.Username).IsRequired();
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.Username).IsUnique();

                entity.HasData(new User
                {
                    Id = new Guid("11111111-1111-1111-1111-111111111111"),
                    Username = "admin",
                    Email = "admin@example.com",
                    PasswordHash = "$2a$11$u1Qw6QwOQw6QwOQw6QwOQeQwOQw6QwOQw6QwOQw6QwOQw6QwOQwO" 
                });
            });

            modelBuilder.Entity<FileManagement.Core.Entities.File>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.FileName).IsRequired();
                entity.Property(e => e.FilePath).IsRequired();
                entity.Property(e => e.FileType).IsRequired();
                entity.HasOne(e => e.User)
                    .WithMany(u => u.Files)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
} 