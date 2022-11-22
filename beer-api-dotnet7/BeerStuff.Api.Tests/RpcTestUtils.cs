using Grpc.Core;
using Grpc.Core.Testing;

namespace BeerStuff.Orchestrator.Tests
{
    public static class RpcTestUtils
    {
        public static AsyncUnaryCall<T> MockRpcCall<T>(T respObj)
        {
            return TestCalls.AsyncUnaryCall(
                Task.FromResult(respObj),
                Task.FromResult(new Metadata()),
                () => Status.DefaultSuccess,
                () => new Metadata(),
                () => { });
        }
    }
}
