using BeerStuff.Orchestrator.BeerGrain;
using BeerStuff.Orchestrator.Shared;

namespace BeerStuff.Orchestrator.Mappings
{
    public static class CreateBeerGrainResponseMap
    {
        public static CreateBeerGrainResponse Map(DataAccess.BeerGrain.CreateBeerGrainResponse response)
        {
            return new CreateBeerGrainResponse
            {
                BeerGrainId = response.BeerGrainId,
                Result = new ResponseResult
                {
                    Successful = response.Result.Successful,
                    Message = response.Result.Message,
                },
            };
        }
    }
}
