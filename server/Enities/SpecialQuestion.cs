using System.Text.Json.Serialization;

public class SpecialQuestion : Question
{
    [JsonPropertyName("answers")]
    public virtual List<SpecialAnswer> Answers { get; set; } = new();
}