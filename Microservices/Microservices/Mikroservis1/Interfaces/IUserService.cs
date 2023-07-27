using Mikroservis1.Dto;
using Mikroservis1.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mikroservis1.Interfaces
{
    public interface IUserService
    {
        Task<User> RegisterAsync(UserRegisterDto userRegisterDto);

        Task<string> LoginAsync(UserLoginDto userLoginDto);

        Task<GetUserDto> GetUserDataAsync(string username);

        Task<User> EditUserAsync(UserEditDto userEditDto);

        Task<List<GetUserDto>> GetSellersAsync();

        Task<bool> VerifySellerAsync(string username, bool v);

        Task<bool> ChangePasswordAsync(string username, string oldPassword, string newPassword);

        Task<User> RegisterUserGoogleAsync(RegisterUserGoogleDto dto);
        Task<string> LoginGoogleAsync(string email, string token);
        Task<User> GetUserByUsernameAsync(string username);
    }
}
