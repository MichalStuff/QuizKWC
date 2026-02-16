public class UserDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public int BaseProgress { get; set; }
    public int SpecialProgress { get; set; }

    public List<int> TaggedBaseIds { get; set; } = new();
    public List<int> WrongBaseIds { get; set; } = new();

    public List<int> TaggedSpecialIds { get; set; } = new();
    public List<int> WrongSpecialIds { get; set; } = new();
}
