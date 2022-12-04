# Public Repo for Phil Jonak's home projects and spit-balling

## Orion Sample
Calculator service done in .net 7 as a GRPC service with json transcoding.  Directions didn't specify, but I assumed the calculator should honor order of operations.  See [calculator.proto](https://github.com/blizz81pj/blizz-api/blob/master/orion-sample/OrionSample.Api.Protobufs/calculator.proto) for the service contract protobuf.

There is float/double support in proto, but no native Decimal support, so a class with a utility implicit conversion operator has been built in.  I may rework this to double just to make request/response model values and translations easier.

### Operation
Operations are passed to the calculator service as a collection of objects that have an `operand` and an `operation_type`.  Each `operand` is supplied with a `units` and `nanos` value to attain decimal precision.  `units` represents the whole units part of the amount, and `nanos` represents the decimal precision using a range of possible values from 0.999_999_999 to -0.999_999_999.  To represent 1.37, `units` would be 1 and `nanos` would be 37000000.  To represent 2, `units` would be 2 and `nanos` would simply be 0.  See [Microsoft documentation](https://learn.microsoft.com/en-us/dotnet/architecture/grpc-for-wcf-developers/protobuf-data-types) for more details.

`operation_type` must be a value belonging to the `CalculatorOperationType` enum defined in [calculator.proto](https://github.com/blizz81pj/blizz-api/blob/master/orion-sample/OrionSample.Api.Protobufs/calculator.proto).  I haven't found how the service will take a string value for the enum, so in my testing I've been supplying the enum int value.

An example of an equation represented by operand + operation type pair values can be seen in the example json POST request body below:
1.37 + 2 * 3 - 4 / 2 = x

[1.37,+] [2,*] [3,-] [4,/] [2,=]  x
```
{
	"calculator_operation": [
		{
			"operand": {
				"units": 1,
				"nanos": 37000000
			},
			"operation_type": 0
		},
		{
			"operand": {
				"units": 2,
				"nanos": 0
			},
			"operation_type": 2
		},
		{
			"operand": {
				"units": 3,
				"nanos": 0
			},
			"operation_type": 1
		},
		{
			"operand": {
				"units": 4,
				"nanos": 0
			},
			"operation_type": 3
		},
		{
			"operand": {
				"units": 2,
				"nanos": 0
			},
			"operation_type": 4
		}
	]
}
```

Maintaining order of operations, the steps to evaluate this equation would be:
- 2 * 3 = 6
- 4 / 2 = 2
- 1.37 + 6 = 7.37
- 7.37 - 2 = 5.37

### Validations / Limitations
The service will return a HTTP 200 response with a `success` field of false and an appropriate `message` if the application experiences an error or if the request supplied is considered invalid for the following reasons:
- if zero or only one operation is supplied
- more than 5 operations are supplied
- if the collection of operations has multiple instances of the operation type `CalculatorOperationType.Evaluate` supplied (essentially more than one = sign)
- if the collection of operations has an instance of the operation type `CalculatorOperationType.Evaluate` somewhere other than the final operation supplied
- if the collection of operations does not have an instance of the operation type `CalculatorOperationType.Evaluate` supplied

If the request fields are supplied in incorrect format (ex: `units` is supplied as a string), the generated proto code itself currently throws a 400 Bad Request with some detail about what went wrong.

### Testing locally
If this application is run locally, it will accept https requests on port 7232.  The routing path is defined in [calculator.proto](https://github.com/blizz81pj/blizz-api/blob/master/orion-sample/OrionSample.Api.Protobufs/calculator.proto) - full example URL running locally would be `https://localhost:7232/v1/calculator`.  The request is currently an http **POST** request with a json request body.

---
## Beer Recipe Book Conversion
One side project goal I'm working towards in these repositories is replacing a physical binder that contains many recipes for beers I have brewed at home.

## beer-api-java
This directory contains a Spring Boot Java application with some JPA wrangling for beer recipe models that are persisted in a local MySQL instance.

Going back to 2019, I think there's some limited REST functionality here and a bit of yuckyness (ex. the database username/pw are stored in plain text config).

---
## beer-api-dotnet7
This directory contains a .net solution with some projects - mostly .net 7-targeted gRPC services.  In a microservice application world, each project would likely live as its own separate application.  The protobuf / contract projects would probably be deployed as nuget packages and the gRPC services themselves deployed to some sort of CI/CD cloud presence, but I don't intend to pay $ for these apps and will rather run them locally.

This solution has a DbUp project with all of the MySQL scripts stored in version control so all that should be needed to run this application locally is
1) supply a MySQL connection string in config (I'm using a secrets.json override, you could add it to launchSettings config) with the name **"ConnectionStrings:MySql.Beer_Net"** that has a value of a MySQL connection string pointing at an available db instance pointing at a Database named **beer_net**
2) run the DbUp project manually and any previously-not-run .sql scripts should execute (this is controlled by a .schemaversions table that gets created by DbUp on your db)

Example of my secrets.json:
```
{
  // these normally would be stored in something like Azure app config + Azure key vault but that costs me $$
  "ConnectionStrings": {
    "MySql.Beer_Net": "Server=localhost;Database=beer_net;Uid=some_user_id;Pwd=some_password;"
  }
}
```

I am using Tye (https://github.com/dotnet/tye) to run the microservices on Windows - once installed, in the root directory with the tye.yaml config, you can run `tye run` and Tye will spin up the applications and assign them ports dynamically.

A tye **GetServiceUri** extension method is used in Startup.cs for pointing clients to their respective RPC services (Tye essentially does this by smushing together three environment variables - protocol, hostname, port - that get dynamically generated).

The top-level **BeerStuff.Api** project represents the external-facing application that web clients would interact with.  I am playing around with .net 7's gRPC JSON transcoding here so there's no standard REST MVC "Controller" class - code is generated by means of the RPC services and routing defined in the .proto files.

Much of this is overblown for the simple CRUD operations happening, and I may explore less redundant ways of implementing moving forward.

Next steps on the list:
- ~~unit tests~~
- ~~fix MySQL timestamp -> c# DateTime weirdness (currently the values are stored as UTC on a POST but a further conversion adds another +x offset hours onto the same value on a subsequent GET)~~
- add __nameContains__ url param searching & __limit__ response record limiting to GET BeerGrain
- flesh out remaining CRUD functionality for BeerGrain & expand to the other entities / tables
