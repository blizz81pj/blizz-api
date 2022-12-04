using OrionSample.Api.Calculator;
using OrionSample.Api.Models;

namespace OrionSample.Api.Utilities
{
    public static class MathUtils
    {
        public static decimal Calculate(CalculatorOperationDto calculatorOperation)
        {
            return calculatorOperation.OperationType switch
            {
                CalculatorOperationType.Add => calculatorOperation.OperandOne + calculatorOperation.OperandTwo,
                CalculatorOperationType.Subtract => calculatorOperation.OperandOne - calculatorOperation.OperandTwo,
                CalculatorOperationType.Multiply => Math.Round(calculatorOperation.OperandOne * calculatorOperation.OperandTwo, 8),
                CalculatorOperationType.Divide => Math.Round(calculatorOperation.OperandOne / calculatorOperation.OperandTwo, 8),
                _ => 0,
            };
        }

        public static (CalculatorOperation? operation, decimal? operationResult) EvaluateSingleExpression(
            CalculatorOperation leadingOperation,
            CalculatorOperation trailingOperand,
            bool lastPossibleEvaluationGroup)
        {
            var evaluationResult = Calculate(
                new CalculatorOperationDto
                {
                    OperandOne = leadingOperation.Operand,
                    OperandTwo = trailingOperand.Operand,
                    OperationType = leadingOperation.OperationType,
                });

            if (!lastPossibleEvaluationGroup || trailingOperand.OperationType != CalculatorOperationType.Evaluate)
            {
                // if we do not reach a final evaluation type in the last evaluated operation group, return another operation after calculating
                return (operation: new CalculatorOperation
                    {
                        Operand = evaluationResult,
                        OperationType = trailingOperand.OperationType,
                    },
                    operationResult: null);
            }

            // otherwise if we do reach the final operation to be evaluated, return the numeric result
            return (operation: null, operationResult: evaluationResult);
        }
    }
}
