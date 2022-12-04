using FakeItEasy;
using FluentAssertions;
using OrionSample.Api.Calculator;
using OrionSample.Api.Interfaces;
using OrionSample.Api.Logic;
using Xunit;

namespace OrionSample.Api.Tests.Logic
{
    public class CalculatorLogicTests : CalculatorTestBase
    {
        private readonly IMathUtilsWrapper _mathUtilsWrapperFake;
        private readonly CalculatorLogic _target;

        public CalculatorLogicTests()
        {
            _mathUtilsWrapperFake = A.Fake<IMathUtilsWrapper>();
            _target = new CalculatorLogic(_mathUtilsWrapperFake);
        }

        [Fact]
        public void EvaluateExpression_One_Successful_Expression()
        {
            // arrange
            var operand1 = 2;
            var operand2 = 3;

            var operationsList = BuildCalculatorOperationsList(operand1, 1, CalculatorOperationType.Add);
            operationsList.AddRange(BuildCalculatorOperationsList(operand2, 1, CalculatorOperationType.Evaluate));

            (CalculatorOperation?, decimal?) evaluationResponse = (null, operand1 + operand2);

            A.CallTo(() => _mathUtilsWrapperFake.EvaluateSingleExpression(
                A<CalculatorOperation>._,
                A<CalculatorOperation>._,
                A<bool>._)).Returns(evaluationResponse);

            // act
            var result = _target.EvaluateExpression(operationsList);

            // assert
            A.CallTo(() => _mathUtilsWrapperFake.EvaluateSingleExpression(
                A<CalculatorOperation>._, A<CalculatorOperation>._, A<bool>._)).MustHaveHappenedOnceExactly();

            result.Should().NotBeNull();
            result.Success.Should().BeTrue();

            var total = (decimal)result.Total;
            total.Should().Be(operand1 + operand2);
        }

        [Fact]
        public void EvaluateExpression_Addition_And_Subtraction_Group_Multiple_Expressions()
        {
            // arrange
            var operand = 2;
            var operationsList = BuildCalculatorOperationsList(operand, 2, CalculatorOperationType.Add);
            operationsList.AddRange(BuildCalculatorOperationsList(operand, 1, CalculatorOperationType.Subtract));
            operationsList.AddRange(BuildCalculatorOperationsList(operand, 1, CalculatorOperationType.Evaluate));

            (CalculatorOperation?, decimal?) evaluationResponse1 = (new CalculatorOperation
                {
                    Operand = operand + operand,
                    OperationType = CalculatorOperationType.Add,
                },
                null);

            (CalculatorOperation?, decimal?) evaluationResponse2 = (new CalculatorOperation
                {
                    Operand = operand + operand - operand,
                    OperationType = CalculatorOperationType.Subtract,
                },
                null);

            (CalculatorOperation?, decimal?) evaluationResponse3 = (null, operand + operand + operand - operand);

            A.CallTo(() => _mathUtilsWrapperFake.EvaluateSingleExpression(
                A<CalculatorOperation>._,
                A<CalculatorOperation>._,
                A<bool>._)).ReturnsNextFromSequence(evaluationResponse1, evaluationResponse2, evaluationResponse3);

            // act
            var result = _target.EvaluateExpression(operationsList);

            // assert
            A.CallTo(() => _mathUtilsWrapperFake.EvaluateSingleExpression(
                A<CalculatorOperation>._, A<CalculatorOperation>._, A<bool>._)).MustHaveHappenedANumberOfTimesMatching(x => x == 3);

            result.Should().NotBeNull();
            result.Success.Should().BeTrue();

            var total = (decimal)result.Total;
            total.Should().Be(operand + operand + operand - operand);
        }

        [Fact]
        public void EvaluateExpression_Two_Groups_Multiple_Expressions()
        {
            // arrange
            var operand = 2;
            var operationsList = BuildCalculatorOperationsList(operand, 1, CalculatorOperationType.Add);
            operationsList.AddRange(BuildCalculatorOperationsList(operand, 1, CalculatorOperationType.Multiply));
            operationsList.AddRange(BuildCalculatorOperationsList(operand, 1, CalculatorOperationType.Subtract));
            operationsList.AddRange(BuildCalculatorOperationsList(operand, 1, CalculatorOperationType.Divide));
            operationsList.AddRange(BuildCalculatorOperationsList(operand, 1, CalculatorOperationType.Evaluate));

            // this is probably the best illustration as to how the calculator evaluates expression-by-expression in operation order
            // 2+ 2* 2- 2/ 2= (operation 1 = 2*2, returns - operation type)
            // 2+ 4- 2/ 2= (operation 2 = 2/2, returns = operation type)
            // 2+ 4- 1= (operation 3 = 2+4, returns - operation type)
            // 6- 1= (operation 4 = 6-1, because 2nd operation type is = and we're in the last operation group, finish calculating)
            (CalculatorOperation?, decimal?) evaluationResponse1 = (new CalculatorOperation
            {
                Operand = operand + operand,
                OperationType = CalculatorOperationType.Subtract,
            },
                null);

            (CalculatorOperation?, decimal?) evaluationResponse2 = (new CalculatorOperation
            {
                Operand = operand / operand,
                OperationType = CalculatorOperationType.Evaluate,
            },
                null);

            (CalculatorOperation?, decimal?) evaluationResponse3 = (new CalculatorOperation
                {
                    Operand = (operand * operand) + operand,
                    OperationType = CalculatorOperationType.Subtract,
                },
                null);

            (CalculatorOperation?, decimal?) evaluationResponse4 = (null, ((operand * operand) + operand) - (operand / operand));

            A.CallTo(() => _mathUtilsWrapperFake.EvaluateSingleExpression(
                A<CalculatorOperation>._,
                A<CalculatorOperation>._,
                A<bool>._)).ReturnsNextFromSequence(evaluationResponse1, evaluationResponse2, evaluationResponse3, evaluationResponse4);

            // act
            var result = _target.EvaluateExpression(operationsList);

            // assert
            A.CallTo(() => _mathUtilsWrapperFake.EvaluateSingleExpression(
                A<CalculatorOperation>._, A<CalculatorOperation>._, A<bool>._)).MustHaveHappenedANumberOfTimesMatching(x => x == 4);

            result.Should().NotBeNull();
            result.Success.Should().BeTrue();

            var total = (decimal)result.Total;
            total.Should().Be(((operand * operand) + operand) - (operand / operand));
        }

        [Fact]
        public void EvaluateExpression_Divide_By_Zero_Exception()
        {
            // arrange
            var operationsList = BuildCalculatorOperationsList(5, 1, CalculatorOperationType.Divide);
            operationsList.AddRange(BuildCalculatorOperationsList(0, 1, CalculatorOperationType.Evaluate));

            A.CallTo(() => _mathUtilsWrapperFake.EvaluateSingleExpression(
                        A<CalculatorOperation>._, A<CalculatorOperation>._, A<bool>._))
                .Throws(new DivideByZeroException());

            // act
            var result = _target.EvaluateExpression(operationsList);

            // assert
            result.Should().NotBeNull();
            result.Success.Should().BeFalse();
            result.Message.Should().Contain("Invalid Expression: cannot divide by zero");
        }

        [Fact]
        public void EvaluateExpression_Handle_Unexpected_Exception()
        {
            // arrange
            var operationsList = BuildCalculatorOperationsList(5, 1, CalculatorOperationType.Divide);
            operationsList.AddRange(BuildCalculatorOperationsList(0, 1, CalculatorOperationType.Evaluate));

            A.CallTo(() => _mathUtilsWrapperFake.EvaluateSingleExpression(
                    A<CalculatorOperation>._, A<CalculatorOperation>._, A<bool>._))
                .Throws(new InvalidOperationException("Something went terribly wrong"));

            // act
            var result = _target.EvaluateExpression(operationsList);

            // assert
            result.Should().NotBeNull();
            result.Success.Should().BeFalse();
            result.Message.Should().Contain("Something went terribly wrong");
        }
    }
}
