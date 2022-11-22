using BeerStuff.DataAccess.BeerGrain;
using BeerStuff.DataAccess.Entities.BeerNetContext;
using BeerStuff.DataAccess.Interfaces.Accessors;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using EntityModel = BeerStuff.DataAccess.Entities.BeerNetContext.Models;

namespace BeerStuff.DataAccess.Accessors.DB
{
    public class BeerGrainAccessor : IBeerGrainAccessor
    {
        private readonly BeerNetContext _beerNetContext;

        public BeerGrainAccessor(BeerNetContext beerNetContext)
        {
            _beerNetContext = beerNetContext;
        }

        public async Task<EntityModel.BeerGrain?> GetBeerGrainAsync(uint beerGrainId, CancellationToken cancellationToken = default)
        {
            return await _beerNetContext.BeerGrain.FirstOrDefaultAsync(
                bg => bg.BeerGrainId == beerGrainId, cancellationToken);
        }

        public async Task<uint> SaveBeerGrainAsync(CreateBeerGrainRequest createBeerGrainRequest, CancellationToken cancellationToken = default)
        {
            var beerGrain = new EntityModel.BeerGrain
            {
                Name = createBeerGrainRequest.Name,
                Manufacturer = createBeerGrainRequest.Manufacturer,
                Lovibond = createBeerGrainRequest.Lovibond,
            };

            if (createBeerGrainRequest.PotentialGravity != null && createBeerGrainRequest.PotentialGravity > 0)
            {
                beerGrain.PotentialGravity = createBeerGrainRequest.PotentialGravity;
            }

            _beerNetContext.BeerGrain.Add(beerGrain);
            await _beerNetContext.SaveChangesAsync(cancellationToken);

            return beerGrain.BeerGrainId;
        }
    }
}
