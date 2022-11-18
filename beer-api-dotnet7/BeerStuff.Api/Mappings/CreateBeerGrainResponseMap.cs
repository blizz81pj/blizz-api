using BeerStuff.Api.BeerGrain;
using BeerStuff.Api.Shared;

namespace BeerStuff.Api.Mappings
{
    public static class CreateBeerGrainResponseMap
    {
        public static CreateBeerGrainResponse Map(Orchestrator.BeerGrain.CreateBeerGrainResponse response)
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
