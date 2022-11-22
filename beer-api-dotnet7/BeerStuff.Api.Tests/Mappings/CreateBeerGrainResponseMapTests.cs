using BeerStuff.Orchestrator.BeerGrain;
using BeerStuff.Orchestrator.Shared;
using BeerStuff.Api.Mappings;
using FluentAssertions;
using Xunit;

namespace BeerStuff.Api.Tests.Mappings
{
    public class CreateBeerGrainResponseMapTests
    {
        [Fact]
        public void Map_Success()
        {
            // arrange
            var orchResponse = new CreateBeerGrainResponse
            {
                BeerGrainId = 1u,
                Result = new ResponseResult
                {
                    Successful = true,
                    Message = "test message",
                },
            };

            // act
            var result = CreateBeerGrainResponseMap.Map(orchResponse);

            // assert
            result.Should().NotBeNull();
            result.BeerGrainId.Should().Be(orchResponse.BeerGrainId);
            result.Result.Successful.Should().Be(orchResponse.Result.Successful);
            result.Result.Message.Should().Be(orchResponse.Result.Message);
        }
    }
}
