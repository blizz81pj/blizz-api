using Grpc.Core;
using Polly;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;

namespace BeerStuff.Orchestrator
{
    public static class GrpcPolicyUtils
    {
        public static readonly Func<HttpRequestMessage, IAsyncPolicy<HttpResponseMessage>> RetryPolicy = (request) =>
        {
            return Policy
                .HandleResult<HttpResponseMessage>(r =>
                {
                    var grpcStatus = GetStatusCode(r);
                    var httpStatusCode = r.StatusCode;

                    return (grpcStatus == null &&
                            ServerErrors.Contains(httpStatusCode)) || // if the server send an error before gRPC pipeline
                           (httpStatusCode == HttpStatusCode.OK && grpcStatus != null &&
                            GrpcErrors.Contains(grpcStatus.Value)); // if gRPC pipeline handled the request (gRPC always answers OK)
                })
                .Or<RpcException>(exception =>
                {
                    return true;
                })
                .WaitAndRetryAsync(
                    3,
                    (input) => TimeSpan.FromSeconds(3 + input));
        };

        private static readonly HttpStatusCode[] ServerErrors =
        {
            HttpStatusCode.BadGateway,
            HttpStatusCode.GatewayTimeout,
            HttpStatusCode.ServiceUnavailable,
            HttpStatusCode.InternalServerError,
            HttpStatusCode.TooManyRequests,
            HttpStatusCode.RequestTimeout,
        };

        private static readonly StatusCode[] GrpcErrors =
        {
            StatusCode.DeadlineExceeded,
            StatusCode.Internal,
            StatusCode.NotFound,
            StatusCode.ResourceExhausted,
            StatusCode.Unavailable,
            StatusCode.Unknown,
        };

        private static StatusCode? GetStatusCode(HttpResponseMessage response)
        {
            var headers = response.Headers;

            if (!headers.Contains("grpc-status") && response.StatusCode == HttpStatusCode.OK)
            {
                return StatusCode.OK;
            }

            if (headers.Contains("grpc-status"))
            {
                return (StatusCode)int.Parse(headers.GetValues("grpc-status").First());
            }

            return null;
        }
    }
}
