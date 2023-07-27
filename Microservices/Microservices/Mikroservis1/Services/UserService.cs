using AutoMapper;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Mikroservis1.Dto;
using Mikroservis1.Infrastracture;
using Mikroservis1.Interfaces;
using Mikroservis1.Model;
using Mikroservis1.Repo;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Mikroservis1.Services
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly ProjectDbContext _dbContext;
        private readonly IConfigurationSection _secretKey;
        private readonly IConfigurationSection _googleClientId;
        private readonly UsersRepo usersRepo;
        private readonly string LogsPath;
        public UserService(IMapper mapper, ProjectDbContext dbContext, IConfiguration config)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            usersRepo = new UsersRepo(dbContext);
            _secretKey = config.GetSection("SecretKey");
            _googleClientId = config.GetSection("GoogleClientId");
            LogsPath = Path.Combine(Directory.GetCurrentDirectory() + "/Logs/log.txt");
        }

        public async Task<bool> ChangePasswordAsync(string username, string oldPassword, string newPassword)
        {
            if (username.Trim() == "" || oldPassword.Trim() == "" || newPassword.Trim() == "")
            {
                throw new Exception("Invalid data");
            }

            User u = usersRepo.FindUserByUsername(username);
            if (u == null)
            {
                throw new Exception("Error");
            }

            if (BCrypt.Net.BCrypt.Verify(oldPassword, u.Password))
            {
                u.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
                usersRepo.UpdateUser(u);
                return true;
            }
            else
            {
                throw new Exception("Invalid password!");
            }
        }

        public async Task<User> EditUserAsync(UserEditDto userEditDto)
        {
            if (userEditDto.Address.Trim() == "" || userEditDto.Email.Trim() == "" || userEditDto.Lastname.Trim() == "" || userEditDto.Username.Trim() == "")
            {
                throw new Exception("Invalid edit data.");
            }
            User u = usersRepo.FindUserByUsername(userEditDto.Username);
            if (u == null) 
                throw new Exception("Error");

            u.Lastname = userEditDto.Lastname;
            u.Name = userEditDto.Name;
            u.Birthday = userEditDto.Birthday;

            if (userEditDto.file != null)
            {
                using (var stream = new MemoryStream())
                {
                    await userEditDto.file.CopyToAsync(stream);
                    u.Picture = stream.ToArray();
                }
            }

            u.Address = userEditDto.Address;

            User retVal = usersRepo.UpdateUser(u);
            return retVal;
        }

        public async Task<List<GetUserDto>> GetSellersAsync()
        {
            List<GetUserDto> retVal = new List<GetUserDto>();
            foreach (User u in usersRepo.GetSellers())
            {
                if (u.UserType == "seller")
                    retVal.Add(_mapper.Map<GetUserDto>(u));
            }
            return retVal;
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            return usersRepo.FindUserByUsername(username);
        }

        public async Task<GetUserDto> GetUserDataAsync(string username)
        {
            if (username.Trim() == "")
            {
                throw new Exception("Invalid data");
            }

            User u = usersRepo.FindUserByUsername(username);
            if (u == null)
            {
                throw new Exception("Error");
            }

            return _mapper.Map<GetUserDto>(u);
        }

        public async Task<string> LoginAsync(UserLoginDto userLoginDto)
        {
            if (userLoginDto.Username.Trim() == "" || userLoginDto.Password.Trim() == "")
            {
                throw new Exception("Invalid data");
            }

            User u = _mapper.Map<User>(userLoginDto);
            User user = usersRepo.FindUserByUsername(userLoginDto.Username);
            if (user == null)
            {
                throw new Exception("Username doesn't exist");
            }

            if (BCrypt.Net.BCrypt.Verify(userLoginDto.Password, user.Password))
            {
                List<Claim> claims = new List<Claim>();
                if (user.UserType == "admin")
                {
                    claims.Add(new Claim(ClaimTypes.Role, "admin"));
                }
                else if (user.UserType == "buyer")
                {
                    claims.Add(new Claim(ClaimTypes.Role, "buyer"));
                }
                else if (user.UserType == "seller")
                {
                    claims.Add(new Claim(ClaimTypes.Role, "seller"));
                }
                claims.Add(new Claim("verified", user.Verified.ToString()));

                SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var tokenOptions = new JwtSecurityToken(
                    issuer: "http://localhost:44306",
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(20),
                    signingCredentials: signinCredentials
                );
                string tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

                return tokenString;
            }
            else
            {
                throw new Exception("Invalid password!");
            }
        }

        public async Task<string> LoginGoogleAsync(string email, string token)
        {
            try
            {
                GoogleJsonWebSignature.ValidationSettings validationSettings = new GoogleJsonWebSignature.ValidationSettings();
                validationSettings.Audience = new List<string>() { _googleClientId.Value };

                GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(token, validationSettings);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

            if (email == "")
            {
                throw new Exception("Invalid data");
            }

            User user = usersRepo.FindByEmail(email);
            if (user == null)
            {
                throw new Exception("User with that email doesn't exist");
            }

            List<Claim> claims = new List<Claim>();
            claims.Add(new Claim(ClaimTypes.Role, "buyer"));
            claims.Add(new Claim("username", user.Username));
            claims.Add(new Claim("verified", user.Verified.ToString()));

            SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokenOptions = new JwtSecurityToken(
                issuer: "http://localhost:44306",
                claims: claims,
                expires: DateTime.Now.AddMinutes(20),
                signingCredentials: signinCredentials
            );
            string tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            return tokenString;
        }

        public async Task<User> RegisterAsync(UserRegisterDto userRegisterDto)
        {
            if (userRegisterDto.Address.Trim() == "" || userRegisterDto.Email.Trim() == "" || userRegisterDto.Lastname.Trim() == "" || userRegisterDto.Username.Trim() == "" || userRegisterDto.file == null)
                throw new Exception("Invalid data");

            if (userRegisterDto.UserType.Trim() != "buyer" && userRegisterDto.UserType.Trim() != "seller")
                throw new Exception("Invalid data");

            User u = _mapper.Map<User>(userRegisterDto);

            using (var stream = new MemoryStream())
            {
                await userRegisterDto.file.CopyToAsync(stream);
                u.Picture = stream.ToArray();
            }

            u.Password = BCrypt.Net.BCrypt.HashPassword(userRegisterDto.Password);
            u.Verified = null;

            User retVal = usersRepo.AddUser(u);
            return retVal;
        }

        public async Task<User> RegisterUserGoogleAsync(RegisterUserGoogleDto dto)
        {
            string token = dto.Token;

            try
            {
                GoogleJsonWebSignature.ValidationSettings validationSettings = new GoogleJsonWebSignature.ValidationSettings();
                validationSettings.Audience = new List<string>() { _googleClientId.Value };

                GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(token, validationSettings);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

            if (dto.Address.Trim() == "" || dto.Email.Trim() == "" || dto.Lastname.Trim() == "" || dto.Username.Trim() == "" || dto.file == null)
                throw new Exception("Invalid data");

            if (dto.UserType.Trim() != "buyer")
                throw new Exception("Invalid data");
            if (usersRepo.FindByEmail(dto.Email) != null)
                throw new Exception("User already exists!");
            User u = _mapper.Map<User>(dto);

            using (var stream = new MemoryStream())
            {
                await dto.file.CopyToAsync(stream);
                u.Picture = stream.ToArray();
            }

            u.Password = "";

            User retVal = usersRepo.AddUser(u);
            return retVal;
        }

        public async Task<bool> VerifySellerAsync(string username, bool v)
        {
            if (username.Trim() == "")
                throw new Exception("Invalid data");

            User user = usersRepo.FindUserByUsername(username);
            user.Verified = v;

            MailMessage message = new MailMessage();
            message.From = new MailAddress("web2projekatadm@gmail.com");
            message.To.Add(new MailAddress(user.Email));
            message.Subject = "Verifikacija naloga";

            if (v)
            {
                message.Body = "Vaš nalog je uspešno verifikovan.";
            }
            else
            {
                message.Body = "Verifikacija odbijena.";
            }

            SmtpClient client = new SmtpClient("smtp.gmail.com", 587);
            client.EnableSsl = true;
            client.Credentials = new System.Net.NetworkCredential("web2projekatadm@gmail.com", "jppxjjtuqwfcwnzy");
            client.Send(message);

            usersRepo.UpdateUser(user);
            return true;
        }

    }
}
