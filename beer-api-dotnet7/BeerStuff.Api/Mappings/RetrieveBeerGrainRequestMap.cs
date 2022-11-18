using BeerStuff.Orchestrator.BeerGrain;

namespace BeerStuff.Api.Mappings
{
    public static class RetrieveBeerGrainRequestMap
    {
        public static RetrieveBeerGrainRequest Map(BeerGrain.RetrieveBeerGrainRequest request)
        {
            var orchestratorRequest = new RetrieveBeerGrainRequest
            {
                BeerGrainId = request.BeerGrainId,
                NameContains = request.NameContains,
            };

            if (request.PagingParameters != null)
            {
                orchestratorRequest.PagingParameters = new PagingParams()
                {
                    Limit = request.PagingParameters.Limit,
                };
            }

            return orchestratorRequest;
        }
    }
}
