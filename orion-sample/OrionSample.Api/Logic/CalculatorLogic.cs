﻿using OrionSample.Api.Calculator;
using OrionSample.Api.Interfaces;
using OrionSample.Api.Utilities;

namespace OrionSample.Api.Logic
{
    public class CalculatorLogic : ICalculatorLogic
    {
        public CalculatorResponse EvaluateExpression(List<CalculatorOperation> operations)
        {
            try
            {
                bool lastOperationEvaluated = false;
                decimal finalResult = 0;
                var prioritizedOperationsQueue = new Queue<List<CalculatorOperationType>>();

                // the sample doc said to watch out for additional types to be added so I'm hedging bets against exponential maths here
                prioritizedOperationsQueue.Enqueue(
                    new List<CalculatorOperationType>
                    {
                        CalculatorOperationType.Multiply,
                        CalculatorOperationType.Divide,
                    });

                prioritizedOperationsQueue.Enqueue(
                    new List<CalculatorOperationType>
                    {
                        CalculatorOperationType.Add,
                        CalculatorOperationType.Subtract,
                    });

                do
                {
                    while (prioritizedOperationsQueue.Count > 0)
                    {
                        var prioritizedOperation = prioritizedOperationsQueue.Dequeue();
                        var nextOperationIndex = 0;

                        do
                        {
                            // grab index of next operation up in the current operations group so we can
                            // 1) evaluate it
                            // 2) substitute in place the operation in the collection with the evaluated result (as necessary) and
                            // 3) whittle down our list of operations one at a time until the last operand in the last operations group is evaluated
                            nextOperationIndex =
                                operations.FindIndex(x => prioritizedOperation.Contains(x.OperationType));

                            if (nextOperationIndex >= 0)
                            {
                                var operand1 = operations[nextOperationIndex];
                                var operand2 = operations[nextOperationIndex + 1];
                                var evaluationResult = MathUtils.EvaluateSingleExpression(
                                    operand1,
                                    operand2,
                                    prioritizedOperationsQueue.Count == 0);

                                if (evaluationResult.operationResult != null)
                                {
                                    lastOperationEvaluated = true;
                                    finalResult = (decimal)evaluationResult.operationResult;

                                    break;
                                }
                                else
                                {
                                    operations[nextOperationIndex] = evaluationResult.operation;
                                    operations.RemoveAt(nextOperationIndex + 1);
                                }
                            }
                        } while (nextOperationIndex >= 0);
                    }
                } while (!lastOperationEvaluated);

                return new CalculatorResponse
                {
                    Success = true,
                    Total = finalResult,
                };
            }
            catch (DivideByZeroException)
            {
                return new CalculatorResponse
                {
                    Success = false,
                    Message = "Invalid Expression: cannot divide by zero",
                };
            }
            catch (Exception ex)
            {
                return new CalculatorResponse
                {
                    Success = false,
                    Message = ex.Message,
                };
            }
        }
    }
}
