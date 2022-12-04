using FakeItEasy;
using FluentAssertions;
using OrionSample.Api.Calculator;
using OrionSample.Api.Interfaces;
using OrionSample.Api.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace OrionSample.Api.Tests.Services
{
    public class CalculatorSvcTests
    {
        private readonly ICalculatorLogic _calculatorLogicFake;
        private readonly CalculatorSvc _target;

        public CalculatorSvcTests()
        {
            _calculatorLogicFake = A.Fake<ICalculatorLogic>();
            _target = new CalculatorSvc(_calculatorLogicFake);
        }

        [Fact]
        public void Calculator_Validation_Failure_Not_Enough_Operations()
        {
            // arrange
            var calculatorRequest = new CalculatorRequest();
            calculatorRequest.CalculatorOperation.Add(BuildCalculatorOperationMessage(2, CalculatorOperationType.Add));
            
            // act
            var result = _target.Calculator(calculatorRequest, default).GetAwaiter().GetResult();

            // assert
            A.CallTo(() => _calculatorLogicFake.EvaluateExpression(A<List<CalculatorOperation>>._)).MustNotHaveHappened();

            result.Should().NotBeNull();
            result.Success.Should().BeFalse();
            result.Message.Should().Contain("There must be at least two operands supplied");
        }

        [Fact]
        public void Calculator_Validation_Failure_Too_Many_Operations()
        {
            // arrange
            var calculatorRequest = new CalculatorRequest();
            calculatorRequest.CalculatorOperation.Add(BuildCalculatorOperationMessage(2, CalculatorOperationType.Add));
            calculatorRequest.CalculatorOperation.Add(BuildCalculatorOperationMessage(2, CalculatorOperationType.Subtract));
            calculatorRequest.CalculatorOperation.Add(BuildCalculatorOperationMessage(2, CalculatorOperationType.Multiply));
            calculatorRequest.CalculatorOperation.Add(BuildCalculatorOperationMessage(2, CalculatorOperationType.Divide));
            calculatorRequest.CalculatorOperation.Add(BuildCalculatorOperationMessage(2, CalculatorOperationType.Add));
            calculatorRequest.CalculatorOperation.Add(BuildCalculatorOperationMessage(2, CalculatorOperationType.Evaluate));

            // act
            var result = _target.Calculator(calculatorRequest, default).GetAwaiter().GetResult();

            // assert
            A.CallTo(() => _calculatorLogicFake.EvaluateExpression(A<List<CalculatorOperation>>._)).MustNotHaveHappened();

            result.Should().NotBeNull();
            result.Success.Should().BeFalse();
            result.Message.Should().Contain("The number of operands supplied exceeds the maximum allowed amount of 5");
        }

        [Fact]
        public void Calculator_Validation_Failure_Multiple_Evaluate_Operations()
        {
            // arrange
            var calculatorRequest = new CalculatorRequest();
            calculatorRequest.CalculatorOperation.Add(BuildCalculatorOperationMessage(2, CalculatorOperationType.Add));
            calculatorRequest.CalculatorOperation.Add(BuildCalculatorOperationMessage(2, CalculatorOperationType.Subtract));
            calculatorRequest.CalculatorOperation.Add(BuildCalculatorOperationMessage(2, CalculatorOperationType.Evaluate));
            calculatorRequest.CalculatorOperation.Add(BuildCalculatorOperationMessage(2, CalculatorOperationType.Divide));
            calculatorRequest.CalculatorOperation.Add(BuildCalculatorOperationMessage(2, CalculatorOperationType.Evaluate));

            // act
            var result = _target.Calculator(calculatorRequest, default).GetAwaiter().GetResult();

            // assert
            A.CallTo(() => _calculatorLogicFake.EvaluateExpression(A<List<CalculatorOperation>>._)).MustNotHaveHappened();

            result.Should().NotBeNull();
            result.Success.Should().BeFalse();
            result.Message.Should().Contain($"One operation must have OperationType {CalculatorOperationType.Evaluate} and it must be the type on the last operation supplied");
        }

        [Fact]
        public void Calculator_Validation_Failure_Evaluate_Operation_Not_Last_Operation()
        {
            // arrange
            var calculatorRequest = new CalculatorRequest();
            calculatorRequest.CalculatorOperation.Add(BuildCalculatorOperationMessage(2, CalculatorOperationType.Add));
            calculatorRequest.CalculatorOperation.Add(BuildCalculatorOperationMessage(2, CalculatorOperationType.Subtract));
            calculatorRequest.CalculatorOperation.Add(BuildCalculatorOperationMessage(2, CalculatorOperationType.Evaluate));
            calculatorRequest.CalculatorOperation.Add(BuildCalculatorOperationMessage(2, CalculatorOperationType.Divide));

            // act
            var result = _target.Calculator(calculatorRequest, default).GetAwaiter().GetResult();

            // assert
            A.CallTo(() => _calculatorLogicFake.EvaluateExpression(A<List<CalculatorOperation>>._)).MustNotHaveHappened();

            result.Should().NotBeNull();
            result.Success.Should().BeFalse();
            result.Message.Should().Contain($"One operation must have OperationType {CalculatorOperationType.Evaluate} and it must be the type on the last operation supplied");
        }

        private CalculatorOperation BuildCalculatorOperationMessage(decimal operand, CalculatorOperationType operationType)
        {
            return new CalculatorOperation
            {
                Operand = operand,
                OperationType = operationType,
            };
        }
    }
}
