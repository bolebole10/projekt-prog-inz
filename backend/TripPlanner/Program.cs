using WebApplication1.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<AirportService>();
builder.Services.AddSingleton<NearestAirportService>(sp =>
    new NearestAirportService("airports.csv"));


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


app.Run();

