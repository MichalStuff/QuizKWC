using FluentValidation;
using Microsoft.EntityFrameworkCore;

public class RegisterUserDtoValidator : AbstractValidator<RegisterUserDto>
{
    public RegisterUserDtoValidator(AppDbContext dbContext)
    {
        RuleFor(x => x.Email)
        .NotEmpty()
        .EmailAddress()
        .Custom((value, context) => {
                   var emailInUse =  dbContext.Users.Any(u => u.Email == value);
                   if(emailInUse)
                   {
                        context.AddFailure("Email", "Email is already in use");
                   }
                });
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
        RuleFor(x => x.ConfirmPassword).Equal(x => x.Password).WithMessage("Passwords do not match");
        RuleFor(x => x.Name).NotEmpty().MinimumLength(2).MaximumLength(100);
    }
}   