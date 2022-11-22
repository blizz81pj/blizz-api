using AutoBogus;
using BeerStuff.DataAccess.BeerGrain;
using BeerStuff.DataAccess.Interfaces.Accessors;
using BeerStuff.DataAccess.Services;
using FakeItEasy;
using FluentAssertions;
using Xunit;
using EntityModel = BeerStuff.DataAccess.Entities.BeerNetContext.Models;

namespace BeerStuff.DataAccess.Tests.Services
{
    public class BeerGrainSvcTests
    {
        private readonly IBeerGrainAccessor _beerGrainAccessorFake;
        private readonly BeerGrainSvc _target;

        public BeerGrainSvcTests()
        {
            _beerGrainAccessorFake = A.Fake<IBeerGrainAccessor>();
            _target = new BeerGrainSvc(_beerGrainAccessorFake);
        }

        [Fact]
        public void CreateBeerGrain_HappyPath()
        {
            // arrange
            var createBeerGrainRequest = AutoFaker.Generate<CreateBeerGrainRequest>();

            A.CallTo(() => _beerGrainAccessorFake.SaveBeerGrainAsync(A<CreateBeerGrainRequest>._, A<CancellationToken>._)).Returns(1u);

            // act
            var result = _target.CreateBeerGrain(createBeerGrainRequest, default).GetAwaiter().GetResult();

            // assert
            result.Should().NotBeNull();
            result.Result.Successful.Should().BeTrue();
            result.BeerGrainId.Should().Be(1u);
        }

        [Fact]
        public void CreateBeerGrain_Exception_Thrown()
        {
            // arrange
            var createBeerGrainRequest = AutoFaker.Generate<CreateBeerGrainRequest>();

            A.CallTo(() => _beerGrainAccessorFake.SaveBeerGrainAsync(
                        A<CreateBeerGrainRequest>._, A<CancellationToken>._))
                .Throws(new Exception("there was an error"));

            // act
            var result = _target.CreateBeerGrain(createBeerGrainRequest, default).GetAwaiter().GetResult();

            // assert
            result.Should().NotBeNull();
            result.Result.Successful.Should().BeFalse();
            result.Result.Message.Should().Contain("there was an error");
        }

        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        public void RetrieveBeerGrain_Happy_Path(bool nullableFieldsOmitted)
        {
            // arrange
            var beerGrain = new EntityModel.BeerGrain()
            {
                BeerGrainId = 1u,
                Name = "test grain",
            };

            if (!nullableFieldsOmitted)
            {
                beerGrain.PotentialGravity = new decimal(1.1);
                beerGrain.Manufacturer = "GrainCorp";
                beerGrain.Lovibond = 50;
                beerGrain.RowCreated = DateTime.Now;
                beerGrain.RowModified = DateTime.Now;
            }

            var retrieveBeerGrainReq = new RetrieveBeerGrainRequest
            {
                BeerGrainId = 1u,
            };

            A.CallTo(() => _beerGrainAccessorFake.GetBeerGrainAsync(A<uint>._, A<CancellationToken>._))
                .Returns(beerGrain);

            // act
            var result = _target.RetrieveBeerGrain(retrieveBeerGrainReq, default).GetAwaiter().GetResult();

            // assert
            result?.BeerGrain.Should().NotBeNull();
            result.Result.Successful.Should().BeTrue();
            result.BeerGrain.Name.Should().Be("test grain");

            if (!nullableFieldsOmitted)
            {
                var potentialGravity = (decimal)result.BeerGrain.PotentialGravity;
                potentialGravity.Should().Be(new decimal(1.1));
                result.BeerGrain.Manufacturer.Should().Be("GrainCorp");
                result.BeerGrain.Lovibond.Should().Be(50);
                result.BeerGrain.RowCreated.ToDateTime().Should().BeAfter(DateTime.Now.AddMinutes(-3));
                result.BeerGrain.RowModified.ToDateTime().Should().BeAfter(DateTime.Now.AddMinutes(-3));
            }
        }

        [Fact]
        public void RetrieveBeerGrain_Exception_Thrown()
        {
            // arrange
            var retrieveBeerGrainReq = new RetrieveBeerGrainRequest
            {
                BeerGrainId = 1u,
            };

            A.CallTo(() => _beerGrainAccessorFake.GetBeerGrainAsync(A<uint>._, A<CancellationToken>._))
                .Throws(new Exception("An error occurred"));

            // act
            var result = _target.RetrieveBeerGrain(retrieveBeerGrainReq, default).GetAwaiter().GetResult();

            // assert
            result.Should().NotBeNull();
            result.Result.Successful.Should().BeFalse();
            result.Result.Message.Should().Contain("An error occurred");
        }
    }
}
