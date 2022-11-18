using BeerStuff.DataAccess.BeerGrain;
using System.Threading;
using System.Threading.Tasks;
using EntityModel = BeerStuff.DataAccess.Entities.BeerNetContext.Models;

namespace BeerStuff.DataAccess.Interfaces.Accessors
{
    public interface IBeerGrainAccessor
    {
        Task<EntityModel.BeerGrain?> GetBeerGrainAsync(uint beerGrainId, CancellationToken cancellationToken = default);

        Task<uint> SaveBeerGrainAsync(
            CreateBeerGrainRequest createBeerGrainRequest,
            CancellationToken cancellationToken = default);
    }
}
