using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

public class AuthService : IAuthService
{
    private readonly AppDbContext _dbcontext;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly AuthenticationSettings _authenticationSettings;
    private readonly IUserContextService _userContextService;   

    public AuthService(AppDbContext dbcontext, IPasswordHasher<User> passwordHasher, AuthenticationSettings authenticationSettings, IUserContextService userContextService)
    {
        _dbcontext = dbcontext;
        _passwordHasher = passwordHasher;
        _userContextService = userContextService;
        _authenticationSettings = authenticationSettings;
    }

    public async Task<ServiceResponse<LoginUserInfoDto>> GenerateToken(LoginUserDto loginUserDto)
    {
        var user = await _dbcontext.Users.FirstOrDefaultAsync(u => u.Email == loginUserDto.Email);
        if (user == null)
        {
            return new ServiceResponse<LoginUserInfoDto>("User not found") { Success = false };
        }
        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, loginUserDto.Password);
        if (result == PasswordVerificationResult.Failed)
        {
            return new ServiceResponse<LoginUserInfoDto>("Invalid password") { Success = false };
        }
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authenticationSettings.JwtKey));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.Now.AddDays(_authenticationSettings.JwtExpireDays);

        var token = new JwtSecurityToken(_authenticationSettings.JwtIssuer, _authenticationSettings.JwtIssuer, claims : claims, expires : expires, signingCredentials: credentials);

        var tokenHandler = new JwtSecurityTokenHandler();

        return new ServiceResponse<LoginUserInfoDto>(new LoginUserInfoDto(tokenHandler.WriteToken(token)){},true, "LoggedIn");
    }

    public async Task<ServiceResponse<string>> RegisterUser(RegisterUserDto registerUserDto)
    {
        var newUser = new User
        {
            Name = registerUserDto.Name,
            Email = registerUserDto.Email

        };
        
        var hashedPassword = _passwordHasher.HashPassword(newUser,registerUserDto.Password);
        newUser.PasswordHash = hashedPassword;
        await _dbcontext.AddAsync(newUser);
        await _dbcontext.SaveChangesAsync();
        return new ServiceResponse<string>("User Registered");

    }

    public async Task<ServiceResponse<string>> AddWrongBaseQuestionToUser(int questionId)
    {
        var user = await _dbcontext.Users.FirstOrDefaultAsync(u => u.Id == _userContextService.GetUserId);
        var question = await _dbcontext.BaseQuestions.FirstOrDefaultAsync(u => u.Id == questionId);
         if(question == null)
        {
            return new ServiceResponse<string>("Question not found") { Success = false };
        }
        if (user == null)
        {
            return new ServiceResponse<string>("User not found") { Success = false };
        }
        if(user.WrongBaseIds.Contains(questionId))
        {
            return new ServiceResponse<string>("Question already added") { Success = false };
        }
        user.WrongBaseIds.Add(questionId);
        await _dbcontext.SaveChangesAsync();
        return new ServiceResponse<string>("Question added");
    }

    public async Task<ServiceResponse<string>> AddWrongSpecialQuestionToUser(int questionId)
    {
        var user = await _dbcontext.Users.FirstOrDefaultAsync(u => u.Id == _userContextService.GetUserId);
        var question = await _dbcontext.SpecialQuestions.FirstOrDefaultAsync(u => u.Id == questionId);
         if(question == null)
        {
            return new ServiceResponse<string>("Question not found") { Success = false };
        }
        
        if (user == null)
        {
            return new ServiceResponse<string>("User not found") { Success = false };
        }
        if(user.WrongSpecialIds.Contains(questionId))
        {
            return new ServiceResponse<string>("Question already added") { Success = false };
        }
        user.WrongSpecialIds.Add(questionId);
        await _dbcontext.SaveChangesAsync();
        return new ServiceResponse<string>("Question added");
    }

    public async Task<ServiceResponse<string>> RemoveWrongSpecialQuestionFromUser(int questionId)
    {
        var user = await _dbcontext.Users.FirstOrDefaultAsync(u => u.Id == _userContextService.GetUserId);
        if (user == null)
        {
            return new ServiceResponse<string>("User not found") { Success = false };
        }
        if(!user.WrongSpecialIds.Contains(questionId))
        {
            return new ServiceResponse<string>("Question not found in wrong questions") { Success = false };
        }
        user.WrongSpecialIds.Remove(questionId);
        await _dbcontext.SaveChangesAsync();
        return new ServiceResponse<string>("Question removed"){Success = true};
    }


    public async Task<ServiceResponse<string>> RemoveWrongBaseQuestionFromUser(int questionId)
    {
        var user = await _dbcontext.Users.FirstOrDefaultAsync(u => u.Id == _userContextService.GetUserId);
        if (user == null)
        {
            return new ServiceResponse<string>("User not found") { Success = false };
        }
        if(!user.WrongBaseIds.Contains(questionId))
        {
            return new ServiceResponse<string>("Question not found in wrong questions") { Success = false };
        }
        user.WrongBaseIds.Remove(questionId);
        await _dbcontext.SaveChangesAsync();
        return new ServiceResponse<string>("Question removed"){Success = true};
    }

    public async Task<ServiceResponse<string>> AddTaggedBaseQuestionToUser(int questionId)
    {
        var user = await _dbcontext.Users.FirstOrDefaultAsync(u => u.Id == _userContextService.GetUserId);
        var question = await _dbcontext.BaseQuestions.FirstOrDefaultAsync(u => u.Id == questionId);
        if (user == null)
        {
            return new ServiceResponse<string>("User not found") { Success = false };
        }
        if(question == null)
        {
            return new ServiceResponse<string>("Question not found") { Success = false };
        }
        if(user.TaggedBaseIds.Contains(questionId))
        {
             user.TaggedBaseIds.Remove(questionId);
             await _dbcontext.SaveChangesAsync();
             return new ServiceResponse<string>("Question removed from tagged") { Success = true };
        }
        user.TaggedBaseIds.Add(questionId);
        await _dbcontext.SaveChangesAsync();
        return new ServiceResponse<string>("Question added"){Success = true};
    }

    public async Task<ServiceResponse<string>> AddTaggedSpecialQuestionToUser(int questionId)
    {
        var user = await _dbcontext.Users.FirstOrDefaultAsync(u => u.Id == _userContextService.GetUserId);
        var question = await _dbcontext.SpecialQuestions.FirstOrDefaultAsync(u => u.Id == questionId);
        if(question == null)
        {
            return new ServiceResponse<string>("Question not found") { Success = false };
        }   
        if (user == null)
        {
            return new ServiceResponse<string>("User not found") { Success = false };
        }
        if(user.TaggedSpecialIds.Contains(questionId))
        {
            user.TaggedSpecialIds.Remove(questionId);
             await _dbcontext.SaveChangesAsync();
             return new ServiceResponse<string>("Question removed from tagged"){Success = true};
        }
        user.TaggedSpecialIds.Add(questionId);
        await _dbcontext.SaveChangesAsync();
        return new ServiceResponse<string>("Question added"){Success = true};
    }

    public async Task<ServiceResponse<UserDto>> GetUserInfo()
    {
        var user = await _dbcontext.Users.FirstOrDefaultAsync(u => u.Id == _userContextService.GetUserId);
        if (user == null)
        {
            return new ServiceResponse<UserDto>("User not found") { Success = false };
        }
        var userDto = new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            WrongBaseIds = user.WrongBaseIds,
            WrongSpecialIds = user.WrongSpecialIds,
            TaggedBaseIds = user.TaggedBaseIds,
            TaggedSpecialIds = user.TaggedSpecialIds
        };
        return new ServiceResponse<UserDto>(userDto,true,"User info retrieved");
    }
}