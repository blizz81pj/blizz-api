using BeerStuff.Orchestrator.BeerGrain;
using BeerStuff.Orchestrator.Shared;
using BeerStuff.Api.Mappings;
using FluentAssertions;
using Google.Protobuf.WellKnownTypes;
using Xunit;

namespace BeerStuff.Api.Tests.Mappings
{
    public class RetrieveBeerGrainResponseMapTests
    {
        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        public void Map_Success(bool optionalFieldsNull)
        {
            // arrange
            var orchBeerGrain = new Orchestrator.BeerGrain.BeerGrain
            {
                BeerGrainId = 1u,
                Name = "Some Grain",
            };

            if (!optionalFieldsNull)
            {
                orchBeerGrain.Manufacturer = "GrainCorp";
                orchBeerGrain.Lovibond = 50;
                orchBeerGrain.PotentialGravity = new decimal(1.1);
                orchBeerGrain.RowCreated = DateTime.UtcNow.ToTimestamp();
                orchBeerGrain.RowModified = DateTime.UtcNow.ToTimestamp();
            }

            var dataAccessResponse = new RetrieveBeerGrainResponse
            {
                BeerGrain = orchBeerGrain,
                Result = new ResponseResult
                {
                    Successful = true,
                    Message = "test message text",
                },
            };

            // act
            var result = RetrieveBeerGrainResponseMap.Map(dataAccessResponse);

            // assert
            result.Should().NotBeNull();
            result.BeerGrain.BeerGrainId.Should().Be(orchBeerGrain.BeerGrainId);
            result.BeerGrain.Manufacturer.Should().Be(orchBeerGrain.Manufacturer);
            result.BeerGrain.Lovibond.Should().Be(orchBeerGrain.Lovibond);
            result.BeerGrain.RowCreated.Should().Be(orchBeerGrain.RowCreated);
            result.BeerGrain.RowModified.Should().Be(orchBeerGrain.RowModified);

            if (!optionalFieldsNull)
            {
                var potentialGravity = (decimal)result.BeerGrain.PotentialGravity;
                potentialGravity.Should().Be(new decimal(1.1));
            }
        }
    }
}
