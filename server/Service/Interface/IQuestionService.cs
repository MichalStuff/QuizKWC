public interface IQuestionService
{
    Task<ServiceResponse<List<QuestionDto>>> GetBaseQuestions();
    Task<ServiceResponse<List<QuestionDto>>> GetSpecialQuestions();
    Task<ServiceResponse<QuestionDto>> GetBaseQuestionById(int id);
    Task<ServiceResponse<QuestionDto>> GetSpecialQuestionById(int id);
    Task<ServiceResponse<TestDto>> GetTest();
    Task<ServiceResponse<int>> GetBaseQuestionsQuantity();
    Task<ServiceResponse<int>> GetSpecialQuestionsQuantity();
}