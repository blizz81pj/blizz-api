using BeerStuff.Orchestrator.BeerGrain;
using BeerStuff.Orchestrator.Shared;

namespace BeerStuff.Orchestrator.Mappings
{
    public static class RetrieveBeerGrainResponseMap
    {
        public static RetrieveBeerGrainResponse Map(DataAccess.BeerGrain.RetrieveBeerGrainResponse response)
        {
            return new RetrieveBeerGrainResponse
            {
                BeerGrain = new BeerGrain.BeerGrain
                {
                    BeerGrainId = response.BeerGrain.BeerGrainId,
                    Name = response.BeerGrain.Name,
                    Manufacturer = response.BeerGrain.Manufacturer,
                    Lovibond = response.BeerGrain.Lovibond,
                    PotentialGravity = new Decimal(response.BeerGrain.PotentialGravity.Units, response.BeerGrain.PotentialGravity.Nanos),
                    RowCreated = response.BeerGrain.RowCreated,
                    RowModified = response.BeerGrain.RowModified,
                },
            };
        }
    }
}
