using System.Text.Json.Serialization;

public class BaseQuestion : Question
{
    [JsonPropertyName("answers")]
    public virtual List<BaseAnswer> Answers { get; set; } = new();
}