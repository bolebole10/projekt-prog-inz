using System.Text.Json;
using System.Text.Json.Serialization;

namespace WebApplication1.Services;

public class OpenRouteServiceService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey = "5b3ce3597851110001cf6248226ba5474b5c4ddeab00ed0e87d3fc49"; // zamijeni pravim API ključem

    public OpenRouteServiceService(IHttpClientFactory clientFactory)
    {
        _httpClient = clientFactory.CreateClient("OpenRouteService");
    }

    public async Task<double[]?> GetCoordinatesAsync(string location)
    {
        var url = $"https://api.openrouteservice.org/geocode/search?api_key={_apiKey}&text={Uri.EscapeDataString(location)}&size=1";

        var response = await _httpClient.GetAsync(url);
        if (!response.IsSuccessStatusCode) return null;

        using var stream = await response.Content.ReadAsStreamAsync();
        using var doc = await JsonDocument.ParseAsync(stream);
        var coords = doc.RootElement
            .GetProperty("features")[0]
            .GetProperty("geometry")
            .GetProperty("coordinates");

        return new[] { coords[0].GetDouble(), coords[1].GetDouble() }; // lon, lat
    }

    public async Task<(double distanceKm, double durationMin)?> GetDrivingInfoAsync(string from, string to)
    {
        var fromCoords = await GetCoordinatesAsync(from);
        var toCoords = await GetCoordinatesAsync(to);
        if (fromCoords == null || toCoords == null) return null;

        var body = new
        {
            coordinates = new[] { fromCoords, toCoords }
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openrouteservice.org/v2/directions/driving-car/geojson");
        request.Headers.Add("Authorization", _apiKey);
        request.Content = new StringContent(JsonSerializer.Serialize(body), System.Text.Encoding.UTF8, "application/json");

        var response = await _httpClient.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        using var stream = await response.Content.ReadAsStreamAsync();
        using var doc = await JsonDocument.ParseAsync(stream);
        var summary = doc.RootElement
            .GetProperty("features")[0]
            .GetProperty("properties")
            .GetProperty("summary");

        double distance = summary.GetProperty("distance").GetDouble() / 1000; // km
        double duration = summary.GetProperty("duration").GetDouble() / 60;   // min

        return (distance, duration);
    }
}
