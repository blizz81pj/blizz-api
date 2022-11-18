using BeerStuff.DataAccess.Accessors.DB;
using BeerStuff.DataAccess.Entities.BeerNetContext;
using BeerStuff.DataAccess.Interfaces.Accessors;
using BeerStuff.DataAccess.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace BeerStuff.DataAccess
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
            services.AddGrpc(
                options =>
                {
                    options.EnableDetailedErrors = true;
                    options.MaxReceiveMessageSize = int.MaxValue;
                    options.MaxSendMessageSize = int.MaxValue;
                });

            services.AddScoped<IBeerGrainAccessor, BeerGrainAccessor>();

            services.AddDbContext<BeerNetContext>(
                BeerNetContext.BuildConnection(
                    Config.GetConnectionString("MySql.Beer_Net")));
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
