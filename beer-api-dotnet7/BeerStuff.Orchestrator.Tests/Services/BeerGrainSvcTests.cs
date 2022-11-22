using AutoBogus;
using BeerStuff.DataAccess.BeerGrain;
using BeerStuff.Orchestrator.Services;
using FakeItEasy;
using FluentAssertions;
using Xunit;
using ResponseResult = BeerStuff.DataAccess.Shared.ResponseResult;

namespace BeerStuff.Orchestrator.Tests.Services
{
    public class BeerGrainSvcTests
    {
        private readonly BeerGrainService.BeerGrainServiceClient _beerGrainServiceClientFake;
        private readonly BeerGrainSvc _target;

        public BeerGrainSvcTests()
        {
            _beerGrainServiceClientFake = A.Fake<BeerGrainService.BeerGrainServiceClient>();
            _target = new BeerGrainSvc(_beerGrainServiceClientFake);
        }

        [Fact]
        public void CreateBeerGrain_Success()
        {
            // arrange
            var dataAccessResponse = new CreateBeerGrainResponse
            {
                BeerGrainId = 1u,
                Result = new ResponseResult
                {
                    Successful = true,
                },
            };

            var orchRequest = new BeerGrain.CreateBeerGrainRequest
            {
                Name = "test grain",
            };

            A.CallTo(() => _beerGrainServiceClientFake.CreateBeerGrainAsync(
                        A<CreateBeerGrainRequest>._,
                        null,
                        null,
                        CancellationToken.None))
                .Returns(RpcTestUtils.MockRpcCall(dataAccessResponse));

            // act
            var result = _target.CreateBeerGrain(orchRequest, default)
                .GetAwaiter().GetResult();

            // assert
            result.Should().NotBeNull();
            result.BeerGrainId.Should().Be(1u);
            result.Result.Successful.Should().BeTrue();
        }

        [Fact]
        public void CreateBeerGrain_Throws_Exception()
        {
            // arrange
            var orchRequest = new BeerGrain.CreateBeerGrainRequest
            {
                Name = "test grain",
            };

            A.CallTo(() => _beerGrainServiceClientFake.CreateBeerGrainAsync(
                    A<CreateBeerGrainRequest>._,
                    null,
                    null,
                    CancellationToken.None))
                .Throws(new Exception("some exception happened"));

            // act
            var result = _target.CreateBeerGrain(orchRequest, default)
                .GetAwaiter().GetResult();

            // assert
            result.Should().NotBeNull();
            result.Result.Successful.Should().BeFalse();
            result.Result.Message.Should().Contain("some exception happened");
        }

        [Fact]
        public void RetrieveBeerGrain_Success()
        {
            // arrange
            var beerGrain = AutoFaker.Generate<DataAccess.BeerGrain.BeerGrain>();
            beerGrain.BeerGrainId = 1u;

            var dataAccessResponse = new RetrieveBeerGrainResponse
            {
                BeerGrain = beerGrain,
                Result = new ResponseResult
                {
                    Successful = true,
                },
            };

            var orchRequest = new BeerGrain.RetrieveBeerGrainRequest
            {
                BeerGrainId = 1u,
            };

            A.CallTo(() => _beerGrainServiceClientFake.RetrieveBeerGrainAsync(
                        A<RetrieveBeerGrainRequest>._,
                        null,
                        null,
                        CancellationToken.None))
                .Returns(RpcTestUtils.MockRpcCall(dataAccessResponse));

            // act
            var result = _target.RetrieveBeerGrain(orchRequest, default)
                .GetAwaiter().GetResult();

            // assert
            result.Should().NotBeNull();
            result.BeerGrain.BeerGrainId.Should().Be(1u);
            result.Result.Successful.Should().BeTrue();
        }

        [Fact]
        public void RetrieveBeerGrain_Throws_Exception()
        {
            // arrange
            var orchRequest = new BeerGrain.RetrieveBeerGrainRequest
            {
                BeerGrainId = 1u,
            };

            A.CallTo(() => _beerGrainServiceClientFake.RetrieveBeerGrainAsync(
                    A<RetrieveBeerGrainRequest>._,
                    null,
                    null,
                    CancellationToken.None))
                .Throws(new Exception("some exception happened"));

            // act
            var result = _target.RetrieveBeerGrain(orchRequest, default)
                .GetAwaiter().GetResult();

            // assert
            result.Should().NotBeNull();
            result.Result.Successful.Should().BeFalse();
            result.Result.Message.Should().Contain("some exception happened");
        }
    }
}
