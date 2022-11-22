using BeerStuff.Orchestrator.BeerGrain;
using BeerStuff.Orchestrator.Mappings;
using FluentAssertions;
using Xunit;

namespace BeerStuff.Orchestrator.Tests.Mappings
{
    public class RetrieveBeerGrainRequestMapTests
    {
        [Fact]
        public void Map_Success()
        {
            // arrange
            var orchRequest = new RetrieveBeerGrainRequest
            {
                BeerGrainId = 1u,
            };

            // act
            var result = RetrieveBeerGrainRequestMap.Map(orchRequest);

            // assert
            result.Should().NotBeNull();
            result.BeerGrainId.Should().Be(orchRequest.BeerGrainId);
        }
    }
}
