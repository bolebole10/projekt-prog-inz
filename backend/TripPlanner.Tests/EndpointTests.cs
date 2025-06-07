using Xunit;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;

public class EndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public EndpointTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CarRouteEndpoint_ReturnsCorrectCalculation()
    {
        // Arrange
        var from = "Zagreb";
        var to = "Split";
        var url = $"/carroute?from={from}&to={to}";

        // Act
        var response = await _client.GetAsync(url);

        // Assert
        response.EnsureSuccessStatusCode(); // Verify HTTP 200 OK
        var content = await response.Content.ReadAsStringAsync();

        Assert.Contains("\"from\":\"Zagreb\"", content); // Verify 'from' field
        Assert.Contains("\"to\":\"Split\"", content);   // Verify 'to' field
        Assert.Contains("\"distance_km\":", content);  // Verify distance is calculated
        Assert.Contains("\"duration_hours\":", content); // Verify duration hours
        Assert.Contains("\"gas_price_super\":", content); // Verify gas price (super)
        Assert.Contains("\"gas_price_diesel\":", content); // Verify gas price (diesel)
    }

    [Fact]
    public async Task AirportsInRadiusEndpoint_ReturnsAirports()
    {
        // Arrange
        var city = "Zagreb";
        var radius = 50.0;
        var url = $"/airports/in-radius?city={city}&radius={radius}";

        // Act
        var response = await _client.GetAsync(url);

        // Assert
        response.EnsureSuccessStatusCode(); // Verify HTTP 200 OK
        var content = await response.Content.ReadAsStringAsync();

        // Verify the response contains the expected airport data
        Assert.Contains("\"airportName\":\"Zagreb Franjo Tuđman International Airport\"", content); // Verify airport name
        Assert.Contains("\"iata\":\"ZAG\"", content); // Verify IATA code
        Assert.Contains("\"distanceKm\":10.55", content); // Verify distance
    }
}