using System.Text.Json.Serialization;

public abstract class Question
{
    public int Id { get; set;}
    public string Content { get; set; } = string.Empty;
    public string? Image { get; set; }
    [JsonPropertyName("CorrectAnsId")]
    public int CorrectAnswerId { get; set; }
}