using BeerStuff.Api.Services;
using Grpc.Core;
using Grpc.Net.Client;
using Grpc.Net.ClientFactory;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace BeerStuff.Api
{
    public class Startup
    {
        public Startup(IConfiguration config)
        {
            Config = config;
        }

        public IConfiguration Config { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            static Action<GrpcChannelOptions> ConfigureChannel()
            {
                return o =>
                {
                    o.Credentials = ChannelCredentials.Insecure;
                    o.MaxReceiveMessageSize = int.MaxValue;
                    o.MaxSendMessageSize = int.MaxValue;
                };
            }

            Action<IServiceProvider, GrpcClientFactoryOptions> ConfigureOrchestratorClient()
            {
                return (_, o) =>
                {
                    o.Address = Config.GetServiceUri("beer-stuff-orchestrator");
                };
            }

            services.AddGrpcClient<Orchestrator.BeerGrain.BeerGrainService.BeerGrainServiceClient>(
                    ConfigureOrchestratorClient())
                .ConfigureChannel(ConfigureChannel())
                .AddPolicyHandler(GrpcPolicyUtils.RetryPolicy);

            services.AddGrpc(
                options =>
                {
                    options.EnableDetailedErrors = true;
                    options.MaxReceiveMessageSize = int.MaxValue;
                    options.MaxSendMessageSize = int.MaxValue;
                }).AddJsonTranscoding();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseEndpoints(
                endpoints =>
                {
                    endpoints.MapGrpcService<BeerGrainSvc>();

                    endpoints.MapGet(
                        "/", async context =>
                        {
                            await context.Response.WriteAsync(
                                "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");
                        });
                });
        }
    }
}
