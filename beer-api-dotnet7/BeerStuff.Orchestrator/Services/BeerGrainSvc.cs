using BeerStuff.Orchestrator.BeerGrain;
using BeerStuff.Orchestrator.Mappings;
using Grpc.Core;
using System.Threading.Tasks;

namespace BeerStuff.Orchestrator.Services
{
    public class BeerGrainSvc : BeerGrainService.BeerGrainServiceBase
    {
        private readonly DataAccess.BeerGrain.BeerGrainService.BeerGrainServiceClient _beerGrainServiceClient;

        public BeerGrainSvc(
            DataAccess.BeerGrain.BeerGrainService.BeerGrainServiceClient beerGrainServiceClient)
        {
            _beerGrainServiceClient = beerGrainServiceClient;
        }

        public override async Task<CreateBeerGrainResponse> CreateBeerGrain(
            CreateBeerGrainRequest request,
            ServerCallContext context)
        {
            // in theory this orchestration layer would be where we'd do things like perform any necessary business logic,
            // string together calls to multiple services if needed, allow an entry point for something other than an API call
            // (batch job / cron job operation), have a common place to output logging for visibility/alerting, etc.
            // in actuality here we're doing pretty much straight CRUD operations where contracts between services all the way
            // down are generally identical, so a bit redundant
            var response = await _beerGrainServiceClient.CreateBeerGrainAsync(CreateBeerGrainRequestMap.Map(request));

            return CreateBeerGrainResponseMap.Map(response);
        }

        public override async Task<RetrieveBeerGrainResponse> RetrieveBeerGrain(
            RetrieveBeerGrainRequest request,
            ServerCallContext context)
        {
            var response =
                await _beerGrainServiceClient.RetrieveBeerGrainAsync(RetrieveBeerGrainRequestMap.Map(request));

            return RetrieveBeerGrainResponseMap.Map(response);
        }
    }
}
