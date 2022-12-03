using OrionSample.Api.Interfaces;
using OrionSample.Api.Logic;
using OrionSample.Api.Services;

namespace OrionSample.Api
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
                }).AddJsonTranscoding();

            services.AddScoped<ICalculatorLogic, CalculatorLogic>();
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
                    endpoints.MapGrpcService<CalculatorSvc>();

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
