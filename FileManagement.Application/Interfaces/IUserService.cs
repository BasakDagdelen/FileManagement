using System.Threading.Tasks;
using FileManagement.Core.DTOs;

namespace FileManagement.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserResponseDto> RegisterAsync(UserRegistrationDto registrationDto);
        Task<string> LoginAsync(UserLoginDto loginDto);
        Task<UserResponseDto> GetUserByIdAsync(string userId);
    }
} 