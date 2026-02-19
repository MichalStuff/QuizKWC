using AutoMapper;
using Microsoft.EntityFrameworkCore;

public class QuestionService : IQuestionService 
{
    private readonly AppDbContext _dbContext;
    private readonly IMapper _mapper;

    public QuestionService(AppDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<ServiceResponse<List<QuestionDto>>> GetBaseQuestions()
    {
        var baseQuestions = await _dbContext.BaseQuestions.Include(q => q.Answers).ToListAsync();
        
        var mappedQuestions = _mapper.Map<List<QuestionDto>>(baseQuestions);
        return new ServiceResponse<List<QuestionDto>>(mappedQuestions, true, "List of base questions");
    }
    public async Task<ServiceResponse<List<QuestionDto>>> GetSpecialQuestions()
    {
        var specialQuestions = await _dbContext.SpecialQuestions.Include(q => q.Answers).ToListAsync();
        var mappedQuestions = _mapper.Map<List<QuestionDto>>(specialQuestions);
        return new ServiceResponse<List<QuestionDto>>(mappedQuestions, true, "List of special questions");
    }

    public async Task<ServiceResponse<QuestionDto>> GetBaseQuestionById(int id)
    {
        var baseQuestion = await _dbContext.BaseQuestions.Include(q => q.Answers).FirstOrDefaultAsync(q => q.Id == id);
        if(baseQuestion == null) throw new NotFoundException("Base question not found");
        var mappedQuestion = _mapper.Map<QuestionDto>(baseQuestion);
        return new ServiceResponse<QuestionDto>(mappedQuestion, true, "Base question retrieved");
    }
    public async Task<ServiceResponse<QuestionDto>> GetSpecialQuestionById(int id)
    {
        var specialQuestion = await _dbContext.SpecialQuestions.Include(q => q.Answers).FirstOrDefaultAsync(q => q.Id == id);
        if(specialQuestion != null) throw new NotFoundException("Special question not found");
        var mappedQuestion = _mapper.Map<QuestionDto>(specialQuestion);
        return new ServiceResponse<QuestionDto>(mappedQuestion, true, "Special question retrieved");
    }

    public async Task<ServiceResponse<TestDto>> GetTest()
    {
        int baseCount = 20;
        int specialCount = 10;
        var questions = await _dbContext.BaseQuestions.Include(q => q.Answers)
        .OrderBy(q => Guid.NewGuid())
        .Take(baseCount)
        .ToListAsync();
        var specialQuestions = await _dbContext.SpecialQuestions.Include(q => q.Answers)
        .OrderBy(q => Guid.NewGuid())
        .Take(specialCount)
        .ToListAsync();
        var testDto = new TestDto
        {
            BaseQuestions = _mapper.Map<List<QuestionDto>>(questions),
            SpecialQuestions = _mapper.Map<List<QuestionDto>>(specialQuestions)
        };
        return new ServiceResponse<TestDto>(testDto, true, "Test data retrieved");
    }
}