using WebApplication1.Services;
using Neo4j.Driver; // <--- Dodano za Neo4j
using Microsoft.AspNetCore.Mvc;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);



// Neo4j konfiguracija
builder.Services.AddSingleton(GraphDatabase.Driver(
    //"neo4j+s://65b4ca19.databases.neo4j.io",
    //AuthTokens.Basic("neo4j", "Gh9DIh0CEJdusYaQk7VzHg-9dDWIVO5OgrzIAgnPtuQ")));
    "bolt://localhost:7687" ,                      
    AuthTokens.Basic("neo4j", "password")));   //za lokalnu bazu

builder.Services.AddSingleton<AddAllService>();
builder.Services.AddSingleton<GraphSearchService>();






        // Add services to the container.
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddSingleton<AirportService>();
        builder.Services.AddSingleton<NearestAirportService>(sp =>
            new NearestAirportService("airports-size.csv"));


        //httpClient - za povezivanje s Amadeus API
        builder.Services.AddHttpClient("Amadeus", client =>
        {
            client.BaseAddress = new Uri("https://test.api.amadeus.com"); // ili prod URL ako koristiš production
        });
        //amadeus service
        builder.Services.AddScoped<AmadeusService>();

        //FlixBusService
        builder.Services.AddHttpClient("FlixBus", client =>
        {
            client.BaseAddress = new Uri("https://flixbus2.p.rapidapi.com/");
            client.DefaultRequestHeaders.Add("X-RapidAPI-Key", "5eeca30f0cmsh8a9385eb3fffb1ap135724jsn35d3e07b3f70");
            client.DefaultRequestHeaders.Add("X-RapidAPI-Host", "flixbus2.p.rapidapi.com");
        });

        builder.Services.AddScoped<FlixBusService>();

        // Neo4j konfiguracija
        builder.Services.AddSingleton(GraphDatabase.Driver(
            "neo4j+s://65b4ca19.databases.neo4j.io",
            AuthTokens.Basic("neo4j", "Gh9DIh0CEJdusYaQk7VzHg-9dDWIVO5OgrzIAgnPtuQ")));
        //"bolt://localhost:7687" ,                      
        //AuthTokens.Basic("neo4j", "password")));   //za lokalnu bazu

        builder.Services.AddSingleton<AddAllService>();

        builder.Services.AddHttpClient("OpenRouteService");
        builder.Services.AddScoped<OpenRouteServiceService>();

        //cors -- za povezivanje s frontendom - ako je frontend na drugom portu
        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader();
            });
        });

        var app = builder.Build();

        //middleware
        //omogućavanje CORS-a
        app.UseCors();


        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();


        //ENDPOINTS

        //LETOVI FROM TO ENDPOINT
        app.MapGet("/flights", async (string origin, string destination, string date, AmadeusService amadeusService, AirportService airportService) =>
        {
            origin = airportService.GetIataCode(origin);
            destination = airportService.GetIataCode(destination);

            var flights = await amadeusService.SearchFlightsAsync(origin, destination, date);
            return Results.Ok(flights);
        });

        //LETOVI SA POVRATKOM
        app.MapGet("/flights-return", async (string origin, string destination, string date, string returnDate, AmadeusService amadeusService, AirportService airportService) =>
        {
            origin = airportService.GetIataCode(origin);
            destination = airportService.GetIataCode(destination);

            var flights = await amadeusService.SearchFlightsWithReturnAsync(origin, destination, date, returnDate);
            return Results.Ok(flights);
        });


        //Dohvat najbližeg aerodroma prema gradu
        app.MapGet("/airports/nearest", async (
            string city,
            NearestAirportService nearestAirportService) =>
        {
            if (string.IsNullOrWhiteSpace(city))
            {
                return Results.BadRequest("City is required.");
            }

            try
            {
                var result = await nearestAirportService.FindNearestAsync(city);
                if (result == null)
                {
                    return Results.NotFound("No airport found.");
                }

                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.Problem($"Error: {ex.Message}");
            }
        });

        //Dohvati aerodrome u određenom radijusu od grada
        app.MapGet("/airports/in-radius", async (
            string city,
            double radius,
            NearestAirportService nearestAirportService) =>
        {
            if (string.IsNullOrWhiteSpace(city))
                return Results.BadRequest("City is required.");
            if (radius <= 0)
                return Results.BadRequest("Radius must be a positive number.");

            try
            {
                var airports = await nearestAirportService.FindAirportsWithinRadiusAsync(city, radius);
                return airports.Any()
                    ? Results.Ok(airports)
                    : Results.NotFound("No airports found within the specified radius.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return Results.Problem($"Error: {ex.Message}");
            }
        });



        //PRETRAZIVANJE SVIH AERODROMA PREMA IMENU GRADA
        app.MapGet("/search-airports", (string query, AirportService airportService) =>
        {
            var matchingAirports = airportService.SearchAirports(query);
            return Results.Ok(matchingAirports);
        });


        //DOHVAT KODOVA AUTOBUSNIM KOLODVORA GRADOVA
        app.MapGet("/flixbus/autocomplete", async (string query, FlixBusService flixService) =>
        {
            var results = await flixService.AutocompleteCityAsync(query);
            return Results.Ok(results);
        });

        //BUSEVI SAMO UPISOM GRADOVA
        app.MapGet("/flixbus/trips-by-city", async (
            string from,
            string to,
            string date,
            FlixBusService flixBusService) =>
        {
            // Autocomplete za FROM grad
            var fromList = await flixBusService.AutocompleteCityAsync(from);
            var fromCityMatch = fromList.FirstOrDefault(x =>
                x.City != null &&
                x.City.Name.Equals(from, StringComparison.OrdinalIgnoreCase));

            if (fromCityMatch == null)
                return Results.BadRequest($"Could not find valid city match for '{from}'.");

            var fromId = fromCityMatch.City.Id;

            // Autocomplete za TO grad
            var toList = await flixBusService.AutocompleteCityAsync(to);
            var toCityMatch = toList.FirstOrDefault(x =>
                x.City != null &&
                x.City.Name.Equals(to, StringComparison.OrdinalIgnoreCase));

            if (toCityMatch == null)
                return Results.BadRequest($"Could not find valid city match for '{to}'.");

            var toId = toCityMatch.City.Id;

            // Traži rute
            var trips = await flixBusService.SearchTripsAsync(fromId, toId, date);
            return Results.Ok(trips);
        });

        // NEO4J TEST ENDPOINT (DODANO)
        app.MapGet("/neo4j-test", async (IDriver driver) =>
        {
            var session = driver.AsyncSession();
            var result = await session.RunAsync("RETURN 'Hello from Neo4j!' AS message");
            var message = await result.SingleAsync(r => r["message"].As<string>());
            await session.CloseAsync();

            return Results.Ok(message);
        });

        app.MapPost("/gtfs/generate-simulated-network", async (AddAllService service) =>
        {
            await service.GenerateSimulatedNetworkAsync();
            return Results.Ok("Simulirana europska mreža generirana.");
        });

        app.MapPost("/neo4j/add-all", async (
            string fromCity, double fromLat, double fromLon,
            string toCity, double toLat, double toLon,
            string mode, double price, int duration,
            DateTime departureTime, DateTime arrivalTime,
            string tripId, string operatorName,
            AddAllService service) =>
        {
            await service.CreateConnectionAsync(
                fromCity, fromLat, fromLon,
                toCity, toLat, toLon,
                mode, price, duration,
                departureTime, arrivalTime,
                tripId, operatorName);
            return Results.Ok("Connection added.");
        });

        //IZRAČUN VREMENA I CIJENE AUTMOBILOM
        app.MapGet("/carroute", async (
            string from,
            string to,
            OpenRouteServiceService orsService) =>
        {
            var result = await orsService.GetDrivingInfoAsync(from, to);
            if (result == null)
                return Results.BadRequest("Could not calculate route.");

            var (distanceKm, durationMin) = result.Value;

            var gasPriceSuper = distanceKm / 100 * 6 * 1.41;
            var gasPriceDiesel = distanceKm / 100 * 6 * 1.28;

            int hours = (int)durationMin / 60;
            int minutes = (int)durationMin % 60;

            return Results.Ok(new
            {
                from,
                to,
                distance_km = Math.Round(distanceKm, 2),
                duration_hours = hours,
                duration_minutes = minutes,
                gas_price_super = Math.Round(gasPriceSuper, 1),
                gas_price_diesel = Math.Round(gasPriceDiesel, 1)
            });
        });



app.MapGet("/algoritam", async (AmadeusService amadeusService, OpenRouteServiceService OpenRouteService, string city1, string city2, DateTime date) =>
{
    // Napravi instancu RoutePlannerService - constructor možeš refaktorirati da ne prima gradove/datum ako želiš
    var service = new RoutePlannerService(city1, city2, date, amadeusService, OpenRouteService);

    var routes = await service.PlanRouteAsync(city1, city2, date);

    return Results.Ok(routes);
});
      
  app.Run();


app.MapGet("/api/optimal-trip", async (
    GraphSearchService graphService,
    string from,
    string to,
    DateTime departureAfter,
    string optimizeFor  // "price" ili "duration"
) =>
{
    var path = await graphService.FindTopOptimalTripsOffline(from, to, departureAfter, optimizeFor);

    return path.Any()
        ? Results.Ok(new { from, to, path })
        : Results.NotFound($"No path found from '{from}' to '{to}'");
});



    }

}