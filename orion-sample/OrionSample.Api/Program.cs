using Microsoft.AspNetCore.Server.Kestrel.Core;

namespace OrionSample.Api
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args)
        {
            return Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(
                    webBuilder =>
                    {
                        webBuilder.UseKestrel(
                            opt =>
                            {
                                opt.ConfigureEndpointDefaults(lo => lo.Protocols = HttpProtocols.Http2);
                                opt.Limits.MaxRequestBodySize = null;
                            });
                        webBuilder.UseStartup<Startup>();
                    });
        }
    }
}