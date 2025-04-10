using WebApplication1.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<AirportService>();

//httpClient - za povezivanje s Amadeus API
builder.Services.AddHttpClient("Amadeus", client =>
{
    client.BaseAddress = new Uri("https://test.api.amadeus.com"); // ili prod URL ako koristiš production
});
//amadeus service
builder.Services.AddScoped<AmadeusService>();

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


app.MapGet("/flights", async (string origin, string destination, string date, AmadeusService amadeusService, AirportService airportService) =>
{
    origin = airportService.GetIataCode(origin);
    destination = airportService.GetIataCode(destination);

    var flights = await amadeusService.SearchFlightsAsync(origin, destination, date);
    return Results.Ok(flights);
});

app.MapGet("/search-airports", (string query, AirportService airportService) =>
{
    var matchingAirports = airportService.SearchAirports(query);
    return Results.Ok(matchingAirports);
});

app.Run();

