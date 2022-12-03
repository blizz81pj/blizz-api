using OrionSample.Api.Calculator;

namespace OrionSample.Api.Interfaces
{
    public interface ICalculatorLogic
    {
        CalculatorResponse EvaluateExpression(List<CalculatorOperation> operations);
    }
}
