using BeerStuff.Orchestrator.BeerGrain;
using BeerStuff.Orchestrator.Mappings;
using FluentAssertions;
using Xunit;

namespace BeerStuff.Orchestrator.Tests.Mappings
{
    public class CreateBeerGrainRequestMapTests
    {
        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        public void Map_Success(bool nullableFieldsOmitted)
        {
            // arrange
            var orchRequest = new CreateBeerGrainRequest
            {
                Name = "Grain Name",
            };

            if (!nullableFieldsOmitted)
            {
                orchRequest.Manufacturer = "GrainCorp";
                orchRequest.Lovibond = 50;
                orchRequest.PotentialGravity = new decimal(1.1);
            }

            // act
            var result = CreateBeerGrainRequestMap.Map(orchRequest);

            // assert
            result.Should().NotBeNull();
            result.Name.Should().Be(orchRequest.Name);
            result.Manufacturer.Should().Be(orchRequest.Manufacturer);
            result.Lovibond.Should().Be(orchRequest.Lovibond);

            if (nullableFieldsOmitted)
            {
                result.PotentialGravity.Should().BeNull();
            }
            else
            {
                var potentialGravity = (decimal)result.PotentialGravity;
                potentialGravity.Should().Be(new decimal(1.1));
            }
        }
    }
}
