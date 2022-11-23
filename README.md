# Public Repo for Phil Jonak's home projects and spit-balling

## Beer Recipe Book Conversion
One side project goal I'm working towards in these repositories is replacing a physical binder that contains many recipes for beers I have brewed at home.

## beer-api-java
This directory contains a Spring Boot Java application with some JPA wrangling for beer recipe models that are persisted in a local MySQL instance.

Going back to 2019, I think there's some limited REST functionality here and a bit of yuckyness (ex. the database username/pw are stored in plain text config).

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
