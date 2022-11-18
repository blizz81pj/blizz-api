using BeerStuff.DataAccess.BeerGrain;

namespace BeerStuff.Orchestrator.Mappings
{
    public static class RetrieveBeerGrainRequestMap
    {
        public static RetrieveBeerGrainRequest Map(BeerGrain.RetrieveBeerGrainRequest request)
        {
            var dataAccessRequest = new RetrieveBeerGrainRequest
            {
                BeerGrainId = request.BeerGrainId,
                NameContains = request.NameContains,
            };

            if (request.PagingParameters != null)
            {
                dataAccessRequest.PagingParameters = new PagingParams
                {
                    Limit = request.PagingParameters.Limit,
                };
            }

            return dataAccessRequest;
        }
    }
}
