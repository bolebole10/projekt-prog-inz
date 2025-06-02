using WebApplication1.Services;  // namespace
using TripPlanner.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.Json;

public class RoutePlannerService
{
    private readonly NearestAirportService _nearestAirportService;
    private readonly AmadeusService _amadeusService;

    public RoutePlannerService(string city1, string city2, DateTime date, AmadeusService amadeusService)
    {
        //ovdje treba svoj absolute path stavit za file
        string airportCsvPath = "/home/bojan/Documents/PROG_ING/projekt-prog-inz/backend/TripPlanner/airports-size.csv";
        _nearestAirportService = new NearestAirportService(airportCsvPath);
        _amadeusService = amadeusService;
    }


    //OVDJE TRAŽI AERODROME U RADIJUSU OKO FROM I TO GRADOVA
    public async Task<(List<NearestAirportResult> AirportsFromCity1, List<NearestAirportResult> AirportsFromCity2)>
       FindAirportsForTwoCitiesAsync(string city1, string city2, double radiusKm)
    {
        var airportsCity1 = await _nearestAirportService.FindAirportsWithinRadiusAsync(city1, radiusKm);
        var airportsCity2 = await _nearestAirportService.FindAirportsWithinRadiusAsync(city2, radiusKm);

        return (airportsCity1, airportsCity2);
    }

    public async Task<List<SimpleFlightOffer>> FlightCall(string IATA_from, string IATA_to, DateTime date)
    {
        var result = await _amadeusService.SearchFlightsAsync(IATA_from, IATA_to, date.ToString("yyyy-MM-dd"));
        List<SimpleFlightOffer> offers = ParseFlightOffers(result);

        return offers;
    }


    //Parsira JSON koji dobijemo kad pretražujemo letove jer izgleda očajno
    public static List<SimpleFlightOffer> ParseFlightOffers(JsonElement root)
    {
        var results = new List<SimpleFlightOffer>();

        if (!root.TryGetProperty("data", out var dataArray)) return results;

        foreach (var offer in dataArray.EnumerateArray())
        {
            var itineraries = offer.GetProperty("itineraries");
            var firstItinerary = itineraries[0];
            var segments = firstItinerary.GetProperty("segments");
            var firstSegment = segments[0];

            var departure = firstSegment.GetProperty("departure");
            var arrival = firstSegment.GetProperty("arrival");

            var carrierCode = firstSegment.GetProperty("carrierCode").GetString();
            var duration = firstItinerary.GetProperty("duration").GetString();

            var price = offer.GetProperty("price").GetProperty("total").GetString();

            results.Add(new SimpleFlightOffer
            {
                Origin = departure.GetProperty("iataCode").GetString(),
                Destination = arrival.GetProperty("iataCode").GetString(),
                DepartureTime = DateTime.Parse(departure.GetProperty("at").GetString()),
                ArrivalTime = DateTime.Parse(arrival.GetProperty("at").GetString()),
                CarrierCode = carrierCode,
                Duration = duration,
                Price = price
            });
        }

        return results;
    }



    //ALGORITAM JE OVDJE
    public async Task<PlannedRouteResult> PlanRouteAsync(string city1, string city2, DateTime date)
    {
        var (airportsCity1, airportsCity2) = await FindAirportsForTwoCitiesAsync(city1, city2, radiusKm: 200);
        var airports_from = airportsCity1
            .Where(a => !string.IsNullOrWhiteSpace(a.IATA) && a.IATA != "\\N")
            .Take(3)
            .ToList();

        var airports_to = airportsCity2
            .Where(a => !string.IsNullOrWhiteSpace(a.IATA) && a.IATA != "\\N")
            .Take(3)
            .ToList();

        var allFilteredFlights = new List<SimpleFlightOffer>();

        foreach (var fromA in airports_from)
        {
            foreach (var toA in airports_to)
            {

                var flights_list = await FlightCall(fromA.IATA, toA.IATA, date);

                var filtered_flights = flights_list
                    .Where(f => f.Origin == fromA.IATA && f.Destination == toA.IATA)
                    .ToList();

                allFilteredFlights.AddRange(filtered_flights);
                Console.WriteLine($"From: {fromA.IATA}, To: {toA.IATA}, Flights found: {filtered_flights.Count}");
                await Task.Delay(600); // pauza od 300 ms da smanjiš broj poziva u sekundi
            }
        }



        return new PlannedRouteResult
        {
            FromCity = city1,
            ToCity = city2,
            Date = date,
            FromAirport = airports_from,
            ToAirport = airports_to,
            flights = allFilteredFlights
        };
    }

    //ovo je za određivanje vjerojatnosti da će aerodrom imati let,
    //U suštini nalazi najveće pa gore uzimamo par tih najvećih
    //Ne koristi se trenutno a možda nikad ni neće
    private double EstimateFlightProbability(NearestAirportResult airport)
    {
        double score = 0;

        if (!string.IsNullOrWhiteSpace(airport.IATA) && airport.IATA != "\\N")
            score += 2;

        if (!string.IsNullOrWhiteSpace(airport.AirportName))
        {
            if (airport.AirportName.Contains("International", StringComparison.OrdinalIgnoreCase))
                score += 10;

            else if (airport.AirportName.Contains("Airport", StringComparison.OrdinalIgnoreCase))
                score += 0.5;
        }

        return score;
    }
}
