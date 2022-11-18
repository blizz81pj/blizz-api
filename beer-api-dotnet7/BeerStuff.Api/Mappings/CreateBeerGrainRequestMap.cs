using BeerStuff.Orchestrator.Shared;

namespace BeerStuff.Api.Mappings
{
    public static class CreateBeerGrainRequestMap
    {
        public static Orchestrator.BeerGrain.CreateBeerGrainRequest Map(BeerGrain.CreateBeerGrainRequest request)
        {
            return new Orchestrator.BeerGrain.CreateBeerGrainRequest
            {
                Name = request.Name,
                Manufacturer = request.Manufacturer,
                Lovibond = request.Lovibond,
                PotentialGravity = new Decimal(request.PotentialGravity.Units, request.PotentialGravity.Nanos),
            };
        }
    }
}
