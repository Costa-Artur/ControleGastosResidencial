using AutoMapper;
using GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands;
using GerenciadorFinanceiroResidencial.Application.Features.Persons.Queries.GetPersonsDetail;
using GerenciadorFinanceiroResidencial.Application.Models;
using GerenciadorFinanceiroResidencial.Domain.Entities;

namespace GerenciadorFinanceiroResidencial.Application.Profiles;

public class PersonProfile : Profile
{
    public PersonProfile()
    {
        CreateMap<Person, PersonDto>();
        CreateMap<Person, CreatePersonDto>();
        CreateMap<Person, GetPersonsDetailDto>();
        CreateMap<CreatePersonCommand, Person>().ReverseMap();
        CreateMap<PersonForCreationDto, CreatePersonCommand>();
    }
}