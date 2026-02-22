using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Authorize]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }
    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserDto registerUserDto)
    {
        return Ok(await _authService.RegisterUser(registerUserDto));
    }
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUserDto loginUserDto)
    {
    return Ok(await _authService.GenerateToken(loginUserDto));
    }

    [HttpPost("addWrongBaseQuestion/{questionId:int}")]
    public async Task<IActionResult> AddWrongBaseQuestionToUser([FromRoute] int questionId)
    {
        return Ok(await _authService.AddWrongBaseQuestionToUser(questionId));
    }
    [HttpPost("addWrongBaseQuestions")]
    public async Task<IActionResult> AddWrongBaseQuestionToUser([FromBody] List<int> questionsIds)
    {
        return Ok(await _authService.AddWrongBaseQuestionToUser(questionsIds));
    }

    [HttpPost("addWrongSpecialQuestion/{questionId:int}")]
    public async Task<IActionResult> AddWrongSpecialQuestionToUser([FromRoute] int questionId)
    {
        return Ok(await _authService.AddWrongSpecialQuestionToUser(questionId));
    }
    [HttpPost("addWrongSpecialQuestions")]
    public async Task<IActionResult> AddWrongSpecialQuestionToUser([FromBody] List<int> questionsIds)
    {
        return Ok(await _authService.AddWrongSpecialQuestionToUser(questionsIds));
    }

    [HttpPost("addTaggedBaseQuestion/{questionId:int}")]
    public async Task<IActionResult> AddTaggedBaseQuestionToUser([FromRoute] int questionId)
    {
        return Ok(await _authService.AddTaggedBaseQuestionToUser(questionId));
    }

    [HttpPost("addTaggedSpecialQuestion/{questionId:int}")]
    public async Task<IActionResult> AddTaggedSpecialQuestionToUser([FromRoute]int questionId)
    {
        return Ok(await _authService.AddTaggedSpecialQuestionToUser(questionId));
    }
    [HttpDelete("removeWrongBaseQuestion/{questionId:int}")]
    public async Task<IActionResult> RemoveWrongBaseQuestionFromUser([FromRoute] int questionId)
    {
        return Ok(await _authService.RemoveWrongBaseQuestionFromUser(questionId));
    }
    [HttpDelete("removeWrongBaseQuestions")]
    public async Task<IActionResult> RemoveWrongBaseQuestionFromUser([FromBody] List<int> questionsIds)
    {
        return Ok(await _authService.RemoveWrongBaseQuestionFromUser(questionsIds));
    }
    [HttpDelete("removeWrongSpecialQuestion/{questionId:int}")]
    public async Task<IActionResult> RemoveWrongSpecialQuestionFromUser([FromRoute] int questionId)
    {
        return Ok(await _authService.RemoveWrongSpecialQuestionFromUser(questionId));
    }
    [HttpDelete("removeWrongSpecialQuestions")]
    public async Task<IActionResult> RemoveWrongSpecialQuestionFromUser([FromBody] List<int> questionsIds)
    {
        return Ok(await _authService.RemoveWrongSpecialQuestionFromUser(questionsIds));
    }
    [HttpGet("getUserInfo")]
    public async Task<IActionResult> GetUserInfo()
    {
        return Ok(await _authService.GetUserInfo());
    }
}