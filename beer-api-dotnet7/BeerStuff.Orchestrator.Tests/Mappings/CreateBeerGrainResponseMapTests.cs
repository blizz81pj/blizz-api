using BeerStuff.DataAccess.BeerGrain;
using BeerStuff.DataAccess.Shared;
using BeerStuff.Orchestrator.Mappings;
using FluentAssertions;
using Xunit;

namespace BeerStuff.Orchestrator.Tests.Mappings
{
    public class CreateBeerGrainResponseMapTests
    {
        [Fact]
        public void Map_Success()
        {
            // arrange
            var dataAccessResponse = new CreateBeerGrainResponse
            {
                BeerGrainId = 1u,
                Result = new ResponseResult
                {
                    Successful = true,
                    Message = "test message",
                },
            };

            // act
            var result = CreateBeerGrainResponseMap.Map(dataAccessResponse);

            // assert
            result.Should().NotBeNull();
            result.BeerGrainId.Should().Be(dataAccessResponse.BeerGrainId);
            result.Result.Successful.Should().Be(dataAccessResponse.Result.Successful);
            result.Result.Message.Should().Be(dataAccessResponse.Result.Message);
        }
    }
}
