public class LoginUserInfoDto
{
    public string Token { get; set; }
    
    public LoginUserInfoDto(string token)
    {
        Token = token;  
    }
}