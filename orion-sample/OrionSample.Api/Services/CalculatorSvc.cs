using Grpc.Core;
using OrionSample.Api.Calculator;
using OrionSample.Api.Interfaces;

namespace OrionSample.Api.Services
{
    public class CalculatorSvc : CalculatorService.CalculatorServiceBase
    {
        private readonly ICalculatorLogic _calculatorLogic;

        public CalculatorSvc(ICalculatorLogic calculatorLogic)
        {
            _calculatorLogic = calculatorLogic;
        }

        public override async Task<CalculatorResponse> Calculator(
            CalculatorRequest request,
            ServerCallContext context)
        {
            try
            {
                var validateResult = ValidateCalculatorRequest(request);
                if (!validateResult.Item1)
                {
                    return new CalculatorResponse
                    {
                        Success = false,
                        Message = validateResult.Item2,
                    };
                }

                return await Task.FromResult(_calculatorLogic.EvaluateExpression(request.CalculatorOperation.ToList()));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new CalculatorResponse
                {
                    Success = false,
                    Message = ex.Message,
                });
            }
        }

        private static (bool, string) ValidateCalculatorRequest(CalculatorRequest request)
        {
            if (request.CalculatorOperation.Count <= 1)
            {
                return (false, "There must be at least two operands supplied for evaluation");
            }

            if (request.CalculatorOperation.Count > 5)
            {
                return (false, "The number of operands supplied exceeds the maximum allowed amount of 5");
            }

            if (request.CalculatorOperation.ToList().FindIndex(
                    x => x.OperationType == CalculatorOperationType.Evaluate) != request.CalculatorOperation.Count - 1)
            {
                return (false,
                    $"One operation must have OperationType {CalculatorOperationType.Evaluate} and it must be the type on the last operation supplied");
            }

            return (true, string.Empty);
        }
    }
}
