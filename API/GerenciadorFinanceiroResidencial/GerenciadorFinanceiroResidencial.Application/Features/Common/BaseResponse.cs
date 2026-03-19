using FluentValidation.Results;

namespace GerenciadorFinanceiroResidencial.Application.Features.Common;


public enum Error {ValidationProblem , NotFoundProblem}

public abstract class BaseResponse
{
    
    public bool IsSuccess {get
    {
        return Errors.Count == 0;
    }}

    public Dictionary<string, string[]> Errors {get; set;} = new();

    public void FillErrors(ValidationResult validationResult)
    {
        foreach (var error in validationResult.ToDictionary())
        {
            Errors.Add(error.Key, error.Value);
        }
    }
    
    public Error? ErrorType {get;set;} = null!;
}