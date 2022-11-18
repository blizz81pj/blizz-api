using BeerStuff.DataAccess.BeerGrain;
using BeerStuff.DataAccess.Interfaces.Accessors;
using BeerStuff.DataAccess.Shared;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using System;
using System.Threading.Tasks;

namespace BeerStuff.DataAccess.Services
{
    public class BeerGrainSvc : BeerGrainService.BeerGrainServiceBase
    {
        private readonly IBeerGrainAccessor _beerGrainAccessor;

        public BeerGrainSvc(IBeerGrainAccessor beerGrainAccessor)
        {
            _beerGrainAccessor = beerGrainAccessor;
        }

        public override async Task<CreateBeerGrainResponse> CreateBeerGrain(
            CreateBeerGrainRequest request,
            ServerCallContext context)
        {
            try
            {
                var beerGrainId = await _beerGrainAccessor.SaveBeerGrainAsync(request);

                return new CreateBeerGrainResponse
                {
                    BeerGrainId = beerGrainId,
                    Result = new ResponseResult
                    {
                        Successful = true,
                    },
                };
            }
            catch (Exception ex)
            {
                // ideally we would handle any specific EF exceptions that may be thrown but generalizing for agile sake here
                return new CreateBeerGrainResponse
                {
                    Result = new ResponseResult
                    {
                        Successful = false,
                        Message = ex.Message,
                    },
                };
            }
        }

        public override async Task<RetrieveBeerGrainResponse> RetrieveBeerGrain(
            RetrieveBeerGrainRequest request,
            ServerCallContext context)
        {
            try
            {
                var beerGrainEntity = await _beerGrainAccessor.GetBeerGrainAsync(request.BeerGrainId);

                if (beerGrainEntity == null)
                {
                    return new RetrieveBeerGrainResponse
                    {
                        Result = new ResponseResult
                        {
                            Successful = false,
                            Message = "Beer grain not found",
                        },
                    };
                }

                return new RetrieveBeerGrainResponse
                {
                    BeerGrain = new BeerGrain.BeerGrain
                    {
                        BeerGrainId = beerGrainEntity.BeerGrainId,
                        Name = beerGrainEntity.Name,
                        Manufacturer = beerGrainEntity.Manufacturer,
                        Lovibond = beerGrainEntity.Lovibond,
                        PotentialGravity = beerGrainEntity.PotentialGravity,
                        RowCreated = beerGrainEntity.RowCreated.ToUniversalTime().ToTimestamp(),
                        RowModified = beerGrainEntity.RowModified.ToUniversalTime().ToTimestamp(),
                    },
                    Result = new ResponseResult
                    {
                        Successful = true,
                    },
                };
            }
            catch (Exception ex)
            {
                // ideally we would handle any specific EF & response translation exceptions that may be thrown but generalizing for agile sake here
                return new RetrieveBeerGrainResponse
                {
                    Result = new ResponseResult
                    {
                        Successful = false,
                        Message = ex.Message,
                    },
                };
            }
        }
    }
}
