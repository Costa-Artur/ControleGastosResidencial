using AutoMapper;
using FluentValidation;
using GerenciadorFinanceiroResidencial.Application.Contracts;
using GerenciadorFinanceiroResidencial.Domain.Entities;
using MediatR;

namespace GerenciadorFinanceiroResidencial.Application.Features.Categories.Commands.CreateCategory;

public class CreateCategoryCommandHandler(
    ITransactionRepository transactionRepository,
    IMapper mapper,
    IValidator<CreateCategoryCommand> validator)
    :IRequestHandler<CreateCategoryCommand, CreateCategoryCommandResponse>
{
    public async Task<CreateCategoryCommandResponse> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        CreateCategoryCommandResponse createCategoryCommandResponse = new();
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        
        if (!validationResult.IsValid)
        {
            createCategoryCommandResponse.FillErrors(validationResult);
            return createCategoryCommandResponse;
        }
        
        var categoryEntity = mapper.Map<Category>(request);
        
        transactionRepository.AddCategory(categoryEntity);
        await transactionRepository.SaveChangesAsync();
        
        createCategoryCommandResponse.Category = mapper.Map<CreateCategoryDto>(categoryEntity);
        return createCategoryCommandResponse;
    }
}