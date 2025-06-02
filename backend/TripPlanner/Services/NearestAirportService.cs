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
            HasHeaderRecord = true
        });

        csv.Read();
        csv.ReadHeader();
        if (!csv.Context.Reader.HeaderRecord.Contains("id") ||
            !csv.Context.Reader.HeaderRecord.Contains("name") ||
            !csv.Context.Reader.HeaderRecord.Contains("municipality") ||
            !csv.Context.Reader.HeaderRecord.Contains("iso_country") ||
            !csv.Context.Reader.HeaderRecord.Contains("iata_code") ||
            !csv.Context.Reader.HeaderRecord.Contains("icao_code") ||
            !csv.Context.Reader.HeaderRecord.Contains("latitude_deg") ||
            !csv.Context.Reader.HeaderRecord.Contains("longitude_deg") ||
            !csv.Context.Reader.HeaderRecord.Contains("type"))
        {
            throw new Exception("CSV file is missing required headers.");
        }

        var records = new List<Airport>();

        while (csv.Read())
        {
            var airport = new Airport
            {
                Id = csv.GetField<int>("id"),
                Name = csv.GetField<string>("name"),
                City = csv.GetField<string>("municipality"),
                Country = csv.GetField<string>("iso_country"),
                IATA = csv.GetField<string>("iata_code"),
                ICAO = csv.GetField<string>("icao_code"),
                Lat = csv.GetField<double>("latitude_deg"),
                Lon = csv.GetField<double>("longitude_deg"),
                size = csv.GetField<string>("type")
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

    public async Task<List<NearestAirportResult>> FindAirportsWithinRadiusAsync(string cityName, double radiusKm)
    {
        var (cityLat, cityLon) = await GeocodeCityAsync(cityName);
        var airports = LoadAirports();

        var results = new List<NearestAirportResult>();

        foreach (var airport in airports)
        {
            // Filter by type
            if (airport.size == "medium_airport" || airport.size == "large_airport")
            {
                double distance = Haversine(cityLat, cityLon, airport.Lat, airport.Lon);
                if (distance <= radiusKm)
                {
                    if (distance <= 70 || airport.size == "large_airport")
                        results.Add(new NearestAirportResult
                        {
                            AirportName = airport.Name,
                            IATA = airport.IATA,
                            DistanceKm = Math.Round(distance, 2)
                        });
                }
            }
        }

        return results.OrderBy(r => r.DistanceKm).ToList();
    }

}
