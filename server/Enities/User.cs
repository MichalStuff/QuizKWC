public class User
{
     public int Id { get; set;}
     public string Name { get; set; } = string.Empty;
     public string Email { get; set; } = string.Empty;
     public string PasswordHash { get; set; } = string.Empty;
     public int BaseProggress = 0;
     public int SpecialProggress = 0;
    public List<int> TaggedBaseIds { get; set; } = new();
    public List<int> WrongBaseIds { get; set; } = new();
    public List<int> TaggedSpecialIds { get; set; } = new();
    public List<int> WrongSpecialIds { get; set; } = new();
}