using FluentAssertions;
using OrionSample.Api.Calculator;
using OrionSample.Api.Models;
using OrionSample.Api.Utilities;
using Xunit;

namespace OrionSample.Api.Tests.Utilities
{
    public class MathUtilsTests
    {
        [Theory]
        [InlineData(2, 2)]
        [InlineData(0, -2)]
        [InlineData(1, -2)]
        [InlineData(1.23, 4.56)]
        [InlineData(43.120, -32.108)]
        public void Calculate_Addition(decimal operand1, decimal operand2)
        {
            // arrange
            var operationDto = new CalculatorOperationDto
            {
                OperandOne = operand1,
                OperandTwo = operand2,
                OperationType = CalculatorOperationType.Add,
            };

            // act
            var result = MathUtils.Calculate(operationDto);

            // assert
            result.Should().Be(operand1 + operand2);
        }

        [Theory]
        [InlineData(2, 2)]
        [InlineData(0, -2)]
        [InlineData(1, -2)]
        [InlineData(1.23, 4.56)]
        [InlineData(43.120, -32.108)]
        public void Calculate_Subtraction(decimal operand1, decimal operand2)
        {
            // arrange
            var operationDto = new CalculatorOperationDto
            {
                OperandOne = operand1,
                OperandTwo = operand2,
                OperationType = CalculatorOperationType.Subtract,
            };

            // act
            var result = MathUtils.Calculate(operationDto);

            // assert
            result.Should().Be(operand1 - operand2);
        }

        [Theory]
        [InlineData(2, 2)]
        [InlineData(0, -2)]
        [InlineData(1, -2)]
        [InlineData(1.23, 4.56)]
        [InlineData(43.120, -32.108)]
        public void Calculate_Multiplication(decimal operand1, decimal operand2)
        {
            // arrange
            var operationDto = new CalculatorOperationDto
            {
                OperandOne = operand1,
                OperandTwo = operand2,
                OperationType = CalculatorOperationType.Multiply,
            };

            // act
            var result = MathUtils.Calculate(operationDto);

            // assert
            result.Should().Be(Math.Round(operand1 * operand2, 8));
        }

        [Theory]
        [InlineData(2, 2)]
        [InlineData(0, -2)]
        [InlineData(1, -2)]
        [InlineData(1.23, 4.56)]
        [InlineData(43.120, -32.108)]
        public void Calculate_Division(decimal operand1, decimal operand2)
        {
            // arrange
            var operationDto = new CalculatorOperationDto
            {
                OperandOne = operand1,
                OperandTwo = operand2,
                OperationType = CalculatorOperationType.Divide,
            };

            // act
            var result = MathUtils.Calculate(operationDto);

            // assert
            result.Should().Be(Math.Round(operand1 / operand2, 8));
        }

        [Fact]
        public void Calculate_Division_By_Zero_Throws_Exception()
        {
            // arrange
            var operationDto = new CalculatorOperationDto
            {
                OperandOne = 14,
                OperandTwo = 0,
                OperationType = CalculatorOperationType.Divide,
            };

            // act
            Action act = () => MathUtils.Calculate(operationDto);

            // assert
            act.Should().Throw<DivideByZeroException>();
        }

        [Theory]
        [InlineData(4, 2, CalculatorOperationType.Add, CalculatorOperationType.Subtract, false)]
        [InlineData(9.214, 7.129, CalculatorOperationType.Divide, CalculatorOperationType.Add, true)]
        [InlineData(0.124, 5.317, CalculatorOperationType.Multiply, CalculatorOperationType.Divide, false)]
        [InlineData(0.983, 3.141, CalculatorOperationType.Divide, CalculatorOperationType.Evaluate, false)]
        [InlineData(4.921, -13.6932, CalculatorOperationType.Subtract, CalculatorOperationType.Evaluate, true)]
        public void EvaluateSingleExpression_Happy_Path(
            decimal operand1,
            decimal operand2,
            CalculatorOperationType operationType1,
            CalculatorOperationType operationType2,
            bool lastEvaluationGroup)
        {
            // arrange
            var op1 = new CalculatorOperation { Operand = operand1, OperationType = operationType1 };
            var op2 = new CalculatorOperation { Operand = operand2, OperationType = operationType2 };

            // act
            var result = MathUtils.EvaluateSingleExpression(op1, op2, lastEvaluationGroup);
            var evaluationResult = MathUtils.Calculate(
                new CalculatorOperationDto
                {
                    OperandOne = operand1,
                    OperandTwo = operand2,
                    OperationType = operationType1,
                });

            // assert
            result.Should().NotBeNull();

            if (lastEvaluationGroup && operationType2 == CalculatorOperationType.Evaluate)
            {
                result.operation.Should().BeNull();
                result.operationResult.Should().Be(evaluationResult);
            }
            else
            {
                result.operation.Should().NotBeNull();

                var operand = (decimal)result.operation.Operand;
                operand.Should().Be(evaluationResult);
                result.operation.OperationType.Should().Be(operationType2);
                result.operationResult.Should().BeNull();
            }
        }
    }
}
