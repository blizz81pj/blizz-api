using OrionSample.Api.Calculator;

namespace OrionSample.Api.Interfaces
{
    public interface IMathUtilsWrapper
    {
        (CalculatorOperation? operation, decimal? operationResult) EvaluateSingleExpression(
            CalculatorOperation leadingOperation,
            CalculatorOperation trailingOperand,
            bool lastPossibleEvaluationGroup);
    }
}
