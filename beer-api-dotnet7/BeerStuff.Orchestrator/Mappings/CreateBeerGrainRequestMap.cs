using BeerStuff.DataAccess.Shared;

namespace BeerStuff.Orchestrator.Mappings
{
    public static class CreateBeerGrainRequestMap
    {
        public static DataAccess.BeerGrain.CreateBeerGrainRequest Map(BeerGrain.CreateBeerGrainRequest request)
        {
            return new DataAccess.BeerGrain.CreateBeerGrainRequest
            {
                Name = request.Name,
                Manufacturer = request.Manufacturer,
                Lovibond = request.Lovibond,
                PotentialGravity = request.PotentialGravity != null ? new Decimal(request.PotentialGravity.Units, request.PotentialGravity.Nanos) : null,
            };
        }
    }
}
