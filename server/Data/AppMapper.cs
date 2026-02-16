using AutoMapper;

public class AppMapper : Profile
{
    public AppMapper()
    {
        CreateMap<User, UserDto>();
        CreateMap<BaseQuestion, QuestionDto>().ForMember(dest => dest.Type, opt => opt.MapFrom(src => QuestionType.Base));
        CreateMap<SpecialQuestion, QuestionDto>().ForMember(dest => dest.Type, opt => opt.MapFrom(src => QuestionType.Special));
        CreateMap<SpecialAnswer, AnswerDto>();
        CreateMap<BaseAnswer, AnswerDto>(); 
    }
} 