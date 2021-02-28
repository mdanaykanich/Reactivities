using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Controllers
{
	[AllowAnonymous]
	[ApiController]
	[Route("api/[controller]")]
	public class AccountController : ControllerBase
	{
		private readonly UserManager<AppUser> _userManager;
		private readonly SignInManager<AppUser> _signInManager;
		private readonly TokenService _tokenService;

		public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, TokenService tokenService)
		{
			_tokenService = tokenService;
			_userManager = userManager;
			_signInManager = signInManager;
		}

		[HttpPost("login")]
		public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDto)
		{
			var user = await _userManager.FindByEmailAsync(loginDto.Email);

			if (user == null) return Unauthorized();

			var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

			if (result.Succeeded)
			{
				return CreateUserObject(user);
			}

			return Unauthorized();
		}

		[HttpPost("register")]
		public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDto)
		{
			if (await _userManager.Users.AnyAsync(u => u.Email == registerDto.Email))
			{
				return BadRequest("Email taken");
			}
			if (await _userManager.Users.AnyAsync(u => u.UserName == registerDto.UserName))
			{
				return BadRequest("Username taken");
			}

			var user = new AppUser
			{
				DisplayName = registerDto.DisplayName,
				Email = registerDto.Email,
				UserName = registerDto.UserName
			};

			var result = await _userManager.CreateAsync(user, registerDto.Password);
			if (result.Succeeded)
			{
				return CreateUserObject(user);
			}
			return BadRequest("Problem registering user");
		}

		[Authorize]
		[HttpGet]
		public async Task<ActionResult<UserDTO>> GetCurrentUser()
		{
			var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
			return CreateUserObject(user);
		}

		private UserDTO CreateUserObject(AppUser user)
		{
			return new UserDTO
			{
				DisplayName = user.DisplayName,
				UserName = user.UserName,
				Image = null,
				Token = _tokenService.CreateToken(user)
			};
		}
	}
}