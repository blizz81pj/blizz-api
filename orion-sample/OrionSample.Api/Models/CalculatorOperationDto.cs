using OrionSample.Api.Calculator;

namespace OrionSample.Api.Models
{
    public class CalculatorOperationDto
    {
        public CalculatorOperationType OperationType { get; set; }

        public decimal OperandOne { get; set; }

        public decimal OperandTwo { get; set; }
    }
}
