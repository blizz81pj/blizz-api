using BeerStuff.DataAccess.BeerGrain;
using BeerStuff.DataAccess.Shared;
using BeerStuff.Orchestrator.Mappings;
using FluentAssertions;
using Google.Protobuf.WellKnownTypes;
using Xunit;

namespace BeerStuff.Orchestrator.Tests.Mappings
{
    public class RetrieveBeerGrainResponseMapTests
    {
        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        public void Map_Success(bool optionalFieldsNull)
        {
            // arrange
            var dataAccessBeerGrain = new DataAccess.BeerGrain.BeerGrain
            {
                BeerGrainId = 1u,
                Name = "Some Grain",
            };

            if (!optionalFieldsNull)
            {
                dataAccessBeerGrain.Manufacturer = "GrainCorp";
                dataAccessBeerGrain.Lovibond = 50;
                dataAccessBeerGrain.PotentialGravity = new decimal(1.1);
                dataAccessBeerGrain.RowCreated = DateTime.UtcNow.ToTimestamp();
                dataAccessBeerGrain.RowModified = DateTime.UtcNow.ToTimestamp();
            }

            var dataAccessResponse = new RetrieveBeerGrainResponse
            {
                BeerGrain = dataAccessBeerGrain,
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
            result.BeerGrain.BeerGrainId.Should().Be(dataAccessBeerGrain.BeerGrainId);
            result.BeerGrain.Manufacturer.Should().Be(dataAccessBeerGrain.Manufacturer);
            result.BeerGrain.Lovibond.Should().Be(dataAccessBeerGrain.Lovibond);
            result.BeerGrain.RowCreated.Should().Be(dataAccessBeerGrain.RowCreated);
            result.BeerGrain.RowModified.Should().Be(dataAccessBeerGrain.RowModified);

            if (!optionalFieldsNull)
            {
                var potentialGravity = (decimal)result.BeerGrain.PotentialGravity;
                potentialGravity.Should().Be(new decimal(1.1));
            }
        }
    }
}
