namespace WebApplication1.Services;

using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using CsvHelper;
using TripPlanner.Models;

public class NearestAirportService
{
    private readonly string _airportCsvPath;

    public NearestAirportService(string airportCsvPath)
    {
        _airportCsvPath = airportCsvPath;
    }

    public async Task<NearestAirportResult> FindNearestAsync(string cityName)
    {
        var (cityLat, cityLon) = await GeocodeCityAsync(cityName);
        var airports = LoadAirports();

        Airport nearest = null;
        double minDist = double.MaxValue;

        foreach (var airport in airports)
        {
            double dist = Haversine(cityLat, cityLon, airport.Lat, airport.Lon);
            if (dist < minDist)
            {
                minDist = dist;
                nearest = airport;
            }
        }

        return nearest == null ? null : new NearestAirportResult
        {
            AirportName = nearest.Name,
            IATA = nearest.IATA,
            DistanceKm = Math.Round(minDist, 2)
        };
    }

    private async Task<(double lat, double lon)> GeocodeCityAsync(string city)
    {
        using var client = new HttpClient();
        client.DefaultRequestHeaders.UserAgent.ParseAdd("NearestAirportApp/1.0 (your@email.com)");

        string url = $"https://nominatim.openstreetmap.org/search?q={Uri.EscapeDataString(city)}&format=json&limit=1";
        var result = await client.GetFromJsonAsync<List<NominatimResult>>(url);

        if (result != null && result.Count > 0)
        {
            return (double.Parse(result[0].lat), double.Parse(result[0].lon));
        }

        throw new Exception("City not found");
    }

    private List<Airport> LoadAirports()
    {
        using var reader = new StreamReader(_airportCsvPath);
        using var csv = new CsvReader(reader, new CsvHelper.Configuration.CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = false 
        });

        var records = new List<Airport>();

        while (csv.Read())
        {
            var airport = new Airport
            {
                Id = csv.GetField<int>(0),
                Name = csv.GetField<string>(1),
                City = csv.GetField<string>(2),
                Country = csv.GetField<string>(3),
                IATA = csv.GetField<string>(4),
                ICAO = csv.GetField<string>(5),
                Lat = csv.GetField<double>(6),
                Lon = csv.GetField<double>(7),
            };

         
            if (!string.IsNullOrWhiteSpace(airport.IATA))
            {
                records.Add(airport);
            }
        }

        return records;
    }

    private static double Haversine(double lat1, double lon1, double lat2, double lon2)
    {
        double R = 6371; // Earth radius in km
        double dLat = DegreesToRadians(lat2 - lat1);
        double dLon = DegreesToRadians(lon2 - lon1);
        double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                   Math.Cos(DegreesToRadians(lat1)) * Math.Cos(DegreesToRadians(lat2)) *
                   Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return R * c;
    }

    private static double DegreesToRadians(double deg) => deg * (Math.PI / 180);

    private class NominatimResult
    {
        [JsonPropertyName("lat")]
        public string lat { get; set; }

        [JsonPropertyName("lon")]
        public string lon { get; set; }
    }
}
