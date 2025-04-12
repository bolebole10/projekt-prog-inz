using System.Text.Json;

namespace WebApplication1.Services
{
    public class AmadeusService
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _config;
        private string? _accessToken;

        public AmadeusService(IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _client = httpClientFactory.CreateClient("Amadeus");
            _config = config;
        }

        public async Task<string> GetAccessTokenAsync()
        {
            if (!string.IsNullOrEmpty(_accessToken))
                return _accessToken;

            var values = new Dictionary<string, string>
        {
            { "grant_type", "client_credentials" },
            { "client_id", _config["Amadeus:ClientId"]! },
            { "client_secret", _config["Amadeus:ClientSecret"]! }
        };

            var content = new FormUrlEncodedContent(values);
            var response = await _client.PostAsync("/v1/security/oauth2/token", content);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<JsonElement>();
            _accessToken = result.GetProperty("access_token").GetString();

            return _accessToken!;
        }

        public async Task<JsonElement> SearchFlightsAsync(string origin, string destination, string date)
        {
            var token = await GetAccessTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

            var response = await _client.GetAsync($"/v2/shopping/flight-offers?originLocationCode={origin}&destinationLocationCode={destination}&departureDate={date}&adults=1");
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<JsonElement>();
        }

        public async Task<JsonElement> SearchFlightsWithReturnAsync(string origin, string destination, string departureDate, string returnDate)
        {
            var token = await GetAccessTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

            var response = await _client.GetAsync($"/v2/shopping/flight-offers?originLocationCode={origin}&destinationLocationCode={destination}&departureDate={departureDate}&returnDate={returnDate}&adults=1");
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<JsonElement>();
        }
    }

}
