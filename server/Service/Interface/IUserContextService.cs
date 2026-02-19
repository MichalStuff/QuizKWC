using System.Security.Claims;

public interface IUserContextService
{
    ClaimsPrincipal User { get; }
    int? GetUserId {get; }
}