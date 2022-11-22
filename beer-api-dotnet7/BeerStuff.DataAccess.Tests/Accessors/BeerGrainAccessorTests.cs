using AutoBogus;
using BeerStuff.DataAccess.Accessors.DB;
using BeerStuff.DataAccess.BeerGrain;
using BeerStuff.DataAccess.Entities.BeerNetContext;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;
using EntityModel = BeerStuff.DataAccess.Entities.BeerNetContext.Models;

namespace BeerStuff.DataAccess.Tests.Accessors
{
    public class BeerGrainAccessorTests : IDisposable
    {
        private readonly BeerNetContext _beerNextContextFake;
        private readonly BeerGrainAccessor _target;

        public BeerGrainAccessorTests()
        {
            _beerNextContextFake = new BeerNetContext(
                new DbContextOptionsBuilder<BeerNetContext>()
                    .UseInMemoryDatabase(Guid.NewGuid().ToString())
                    .Options);

            _target = new BeerGrainAccessor(_beerNextContextFake);
        }

        public void Dispose()
        {
            ((IDisposable) _beerNextContextFake).Dispose();
        }

        [Fact]
        public void GetBeerGrainAsync_Success()
        {
            // arrange
            ClearDatabase();
            SaveBeerGrain(1, "Dark");
            SaveBeerGrain(2, "Light");

            // act
            var result = _target.GetBeerGrainAsync(1).GetAwaiter().GetResult();

            // assert
            result.Should().NotBeNull();
            result.Name.Should().Be("Dark");
        }

        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        public void SaveBeerGrainAsync_Success(bool expectedPotentialGravityNull)
        {
            // arrange
            ClearDatabase();

            var createRequest = new CreateBeerGrainRequest
            {
                Name = "test grain",
            };

            if (!expectedPotentialGravityNull)
            {
                createRequest.PotentialGravity = new Decimal(1.45);
            }

            // act
            var result = _target.SaveBeerGrainAsync(createRequest).GetAwaiter().GetResult();
            var dbResult = _beerNextContextFake.BeerGrain.First(x => x.Name == "test grain");

            // assert
            result.Should().BeGreaterThan(0);
            if (expectedPotentialGravityNull)
            {
                dbResult.PotentialGravity.Should().BeNull();
            }
            else
            {
                dbResult.PotentialGravity.Should().NotBeNull();
            }
        }

        private void ClearDatabase()
        {
            _beerNextContextFake.BeerGrain.RemoveRange(_beerNextContextFake.BeerGrain);
        }

        private void SaveBeerGrain(uint beerGrainId, string beerGrainName)
        {
            var beerGrain = new AutoFaker<EntityModel.BeerGrain>()
                .RuleFor(x => x.BeerGrainId, beerGrainId)
                .RuleFor(x => x.Name, beerGrainName)
                .Generate();

            _beerNextContextFake.BeerGrain.Add(beerGrain);
            _beerNextContextFake.SaveChanges();
        }
    }
}
