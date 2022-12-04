using OrionSample.Api.Calculator;
using OrionSample.Api.Interfaces;
using OrionSample.Api.Utilities;

namespace OrionSample.Api.Wrappers
{
    public class MathUtilsWrapper : IMathUtilsWrapper
    {
        public (CalculatorOperation? operation, decimal? operationResult) EvaluateSingleExpression(
            CalculatorOperation leadingOperation,
            CalculatorOperation trailingOperand,
            bool lastPossibleEvaluationGroup)
        {
            return MathUtils.EvaluateSingleExpression(leadingOperation, trailingOperand, lastPossibleEvaluationGroup);
        }
    }
}
