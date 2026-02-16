public class BaseAnswer : Answer
{
    public int BaseQuestionId { get; set; }
    public virtual BaseQuestion BaseQuestion { get; set; } = null!;
}