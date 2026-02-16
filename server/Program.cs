using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;


var builder = WebApplication.CreateBuilder(args);

//PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        "Host=127.0.0.1;Port=5432;Database=QuizDb;Username=postgres;Password=postgres"));



//AutoMapper
builder.Services.AddAutoMapper(cfg =>{}, typeof(AppMapper));



//Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Quiz API",
        Version = "v1",
        Description = "API do quizu"
    });
});

//Services

builder.Services.AddScoped<AppSeeder>();
builder.Services.AddScoped<IQuestionService, QuestionService>();
builder.Services.AddControllers();

var app = builder.Build();

//Seeder
var scope = app.Services.CreateScope();
var seeder = scope.ServiceProvider.GetRequiredService<AppSeeder>();


if(app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Quiz API v1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseRouting();
app.UseHttpsRedirection();
app.MapControllers();

seeder.Seed();
app.Run();