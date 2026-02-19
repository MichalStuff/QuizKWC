using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class QuestionController : ControllerBase
{
    private readonly IQuestionService _questionService;
    public QuestionController(IQuestionService questionService)
    {
        _questionService = questionService;
    }

    [HttpGet("base")]
    public async Task<ServiceResponse<List<QuestionDto>>> GetBaseQuestions()
    {
        return await _questionService.GetBaseQuestions();
    }

    [HttpGet("special")]
    public async Task<ServiceResponse<List<QuestionDto>>> GetSpecialQuestions()
    {
        return await _questionService.GetSpecialQuestions();
    }
    [HttpGet("base/{id:int}")]
    public async Task<ServiceResponse<QuestionDto>> GetBaseQuestion(int id)
    {
        var baseQuestions = await _questionService.GetBaseQuestionById(id);
        return baseQuestions;
    }

    [HttpGet("special/{id:int}")]
    public async Task<ServiceResponse<QuestionDto>> GetSpecialQuestion(int id)
    {
        var specialQuestions = await _questionService.GetSpecialQuestionById(id);

        return specialQuestions;
    }
    [HttpGet("test")]
    public async Task<ServiceResponse<TestDto>> GetTest()
    {
        return await _questionService.GetTest();
    }


}