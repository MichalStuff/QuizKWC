
public enum QuestionType
{
    Base,
    Special
}

public class QuestionDto
{
    public int Id { get; set;}
    public string Content { get; set; } = string.Empty;
    public string? Image { get; set; }
    public int CorrectAnswerId { get; set; }
    public QuestionType Type { get; set; }
    public List<AnswerDto> Answers { get; set; } = new();
}