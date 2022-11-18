﻿using BeerStuff.Api.BeerGrain;
using BeerStuff.Api.Mappings;
using Grpc.Core;
using System.Threading.Tasks;

namespace BeerStuff.Api.Services
{
    public class BeerGrainSvc : BeerGrainService.BeerGrainServiceBase
    {
        private readonly Orchestrator.BeerGrain.BeerGrainService.BeerGrainServiceClient _beerGrainServiceClient;

        public BeerGrainSvc(
            Orchestrator.BeerGrain.BeerGrainService.BeerGrainServiceClient beerGrainServiceClient)
        {
            _beerGrainServiceClient = beerGrainServiceClient;
        }

        public override async Task<CreateBeerGrainResponse> CreateBeerGrain(
            CreateBeerGrainRequest request,
            ServerCallContext context)
        {
            // this layer is analogous to a REST / MVC Controller layer and should only have enough responsibility to receive
            // an externally-exposed request from a web client & return an appropriate response to that client
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
