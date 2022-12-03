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
                Operation = CalculatorOperation.Add,
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
                Operation = CalculatorOperation.Subtract,
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
                Operation = CalculatorOperation.Multiply,
            };

            // act
            var result = MathUtils.Calculate(operationDto);

            // assert
            result.Should().Be(operand1 * operand2);
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
                Operation = CalculatorOperation.Divide,
            };

            // act
            var result = MathUtils.Calculate(operationDto);

            // assert
            result.Should().Be(operand1 / operand2);
        }
    }
}
