public interface IAuthService
{
    public Task<ServiceResponse<LoginUserInfoDto>> GenerateToken(LoginUserDto loginUserInfo);
    public Task<ServiceResponse<string>> RegisterUser(RegisterUserDto registerUserInfo);
    public Task<ServiceResponse<string>> AddWrongBaseQuestionToUser(int questionId);
    public Task<ServiceResponse<string>> AddWrongBaseQuestionToUser(List<int> questionIdList);
    public Task<ServiceResponse<string>> AddWrongSpecialQuestionToUser(int questionId);
    public Task<ServiceResponse<string>> AddWrongSpecialQuestionToUser(List<int> questionIdList);
    public Task<ServiceResponse<string>> AddTaggedBaseQuestionToUser(int questionId);
    public Task<ServiceResponse<string>> AddTaggedSpecialQuestionToUser(int questionId);
    public Task<ServiceResponse<string>> RemoveWrongBaseQuestionFromUser(int questionId);
    public Task<ServiceResponse<string>> RemoveWrongBaseQuestionFromUser(List<int> questionIdList);
    public Task<ServiceResponse<string>> RemoveWrongSpecialQuestionFromUser(int questionId);
    public Task<ServiceResponse<string>> RemoveWrongSpecialQuestionFromUser(List<int> questionIdList);
    public Task<ServiceResponse<UserDto>> GetUserInfo(); 
}