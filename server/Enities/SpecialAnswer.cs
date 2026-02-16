public class SpecialAnswer : Answer
{
    public int SpecialQuestionId { get; set; }
    public virtual SpecialQuestion SpecialQuestion { get; set; } = null!;
}