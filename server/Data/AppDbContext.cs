using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

public class AppDbContext : DbContext
{
    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<BaseQuestion> BaseQuestions { get; set; }
    public virtual DbSet<SpecialQuestion> SpecialQuestions { get; set; }
    public virtual DbSet<BaseAnswer> BaseAnswers { get; set; }
    public virtual DbSet<SpecialAnswer> SpecialAnswers { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<BaseAnswer>()
            .HasOne(a => a.BaseQuestion)
            .WithMany(q => q.Answers)
            .HasForeignKey(a => a.BaseQuestionId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<SpecialAnswer>()
            .HasOne(a => a.SpecialQuestion)
            .WithMany(q => q.Answers)
            .HasForeignKey(a => a.SpecialQuestionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}