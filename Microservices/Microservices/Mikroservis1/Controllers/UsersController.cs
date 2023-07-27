using Mikroservis1.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Mikroservis1.Interfaces;

namespace Mikroservis1.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        
        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] UserRegisterDto dto)
        {
            try
            {
                return Ok(await _userService.RegisterAsync(dto));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromForm] UserLoginDto dto)
        {
            try
            {
                return Ok(await _userService.LoginAsync(dto));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("getUserData")]
        public async Task<IActionResult> GetUserData([FromQuery] string username)
        {
            try
            {
                return Ok(await _userService.GetUserDataAsync(username));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("updateProfile")]
        public async Task<IActionResult> UpdateProfile([FromForm] UserEditDto dto)
        {
            try
            {
                return Ok(await _userService.EditUserAsync(dto));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("getSellers")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetSellers()
        {
            try
            {
                return Ok(await _userService.GetSellersAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("verify/{username}/{v}")]
        //[Authorize(Policy ="AdminPolicy")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> VerifyUser(string username, bool v)
        {
            try
            {
                return Ok(await _userService.VerifySellerAsync(username, v));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("changePassword")]
        public async Task<ActionResult> ChangePassword([FromForm] UserChangePasswordDto dto)
        {
            try
            {
                return Ok(await _userService.ChangePasswordAsync(dto.Username, dto.OldPassword, dto.NewPassword));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("registerGoogleUser")]
        public async Task<ActionResult> RegisterGoogleUser([FromForm] RegisterUserGoogleDto dto)
        {
            try
            {
                return Ok(await _userService.RegisterUserGoogleAsync(dto));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("loginGoogle")]
        public async Task<ActionResult> LoginGoogleUser([FromForm] GoogleLoginDto dto)
        {
            try
            {
                return Ok(await _userService.LoginGoogleAsync(dto.Email, dto.Token));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("getUserByUsername/{username}")]
        public async Task<ActionResult> GetUserByUsername(string username)
        {
            return Ok(await _userService.GetUserByUsernameAsync(username));
        }
    }
}
