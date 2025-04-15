using TripPlanner.Models;
using System.Net.Http.Headers;
using System.Text.Json;


public class FlixBusService
{
    private readonly HttpClient _httpClient;

    public FlixBusService(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient("FlixBus");
    }

    public async Task<JsonElement> SearchTripsAsync(string fromId, string toId, string date)
    {
        var url = $"trips?from_id={fromId}&to_id={toId}&date={date}&adult=1&children=0&bikes=0&search_by=cities&currency=EUR&locale=en";

        _httpClient.DefaultRequestHeaders.Accept.Clear();
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var response = await _httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<JsonElement>();
    }



    public async Task<List<FlixBusAutocompleteResult>> AutocompleteCityAsync(string query)
    {
        var url = $"autocomplete?query={Uri.EscapeDataString(query)}&locale=en";

        var response = await _httpClient.GetAsync(url);
        var content = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Autocomplete error: {response.StatusCode} - {content}");
        }

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

        var results = JsonSerializer.Deserialize<List<FlixBusAutocompleteResult>>(content, options);
        return results ?? new List<FlixBusAutocompleteResult>();
    }




}
