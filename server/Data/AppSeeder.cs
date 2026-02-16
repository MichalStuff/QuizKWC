

using System.Text.Json;
using Microsoft.EntityFrameworkCore;

public class AppSeeder
{
    private readonly AppDbContext _dbContext;

    public AppSeeder(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public void Seed()
    {
        if(_dbContext.Database.CanConnect())
        {
            if(!_dbContext.Users.Any())
            {
                var users = GetUsers();
                _dbContext.Users.AddRange(users);   
                _dbContext.SaveChanges();
                // Console.WriteLine("Users seeded");
            }
            if(!_dbContext.BaseQuestions.Any())
            {
                var baseQuestions = GetBaseQuestions();
                _dbContext.BaseQuestions.AddRange(baseQuestions);   
                _dbContext.SaveChanges();
                // Console.WriteLine("BaseQuestions seeded");

            }
            if(!_dbContext.SpecialQuestions.Any())
            {
                var specialQuestions = GetSpecialQuestions();
                _dbContext.SpecialQuestions.AddRange(specialQuestions);   
                _dbContext.SaveChanges();
                // Console.WriteLine("SpecialQuestions seeded");
            }

        }
    }

    public IEnumerable<User> GetUsers()
    {
        var users = new List<User>()
        {
            new User { Name = "John Doe", Email = "john.doe@example.com", BaseProggress = 5, SpecialProggress = 3 },
            new User { Name = "Jane Smith", Email = "jane.smith@example.com", BaseProggress = 2, SpecialProggress = 4 }
        };
        return users;
    }

    public IEnumerable<BaseQuestion> GetBaseQuestions()
    {
        var json = File.ReadAllText(@"D:\C#\KwalifikacjeC\base.json");
        var baseQuestions = JsonSerializer.Deserialize<List<BaseQuestion>>(json);
        var questions = new List<BaseQuestion>();

        if(baseQuestions == null) return questions;

        foreach(var question in baseQuestions)
        {
            var q = new BaseQuestion
            {
                Content = question.Content,
                Image = question.Image,
                CorrectAnswerId = question.CorrectAnswerId,
                Answers = question.Answers.Select(a => new BaseAnswer
                {
                    Content = a.Content,
                    AnswerIndex = a.Id 
                }).ToList()
            };
            questions.Add(q);
        }
        return questions;
    }

    public IEnumerable<SpecialQuestion> GetSpecialQuestions()
    {
        var json = File.ReadAllText(@"D:\C#\KwalifikacjeC\special.json");
        var specialQuestions = JsonSerializer.Deserialize<List<SpecialQuestion>>(json);
        var questions = new List<SpecialQuestion>();
        

        if(specialQuestions == null) return questions;

        foreach(var question in specialQuestions)
        {
            Console.WriteLine(question.CorrectAnswerId);
            var q = new SpecialQuestion
            {
                Content = question.Content,
                Image = question.Image,
                CorrectAnswerId = question.CorrectAnswerId,
                Answers = question.Answers.Select(a => new SpecialAnswer
                {
                    Content = a.Content,
                    AnswerIndex = a.Id
                }).ToList()
            };
            questions.Add(q);
        }
        return questions;
    }

}