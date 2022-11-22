using BeerStuff.Api.BeerGrain;
using BeerStuff.Api.Mappings;
using FluentAssertions;
using Xunit;

namespace BeerStuff.Api.Tests.Mappings
{
    public class RetrieveBeerGrainRequestMapTests
    {
        [Fact]
        public void Map_Success()
        {
            // arrange
            var apiRequest = new RetrieveBeerGrainRequest
            {
                BeerGrainId = 1u,
            };

            // act
            var result = RetrieveBeerGrainRequestMap.Map(apiRequest);

            // assert
            result.Should().NotBeNull();
            result.BeerGrainId.Should().Be(apiRequest.BeerGrainId);
        }
    }
}
