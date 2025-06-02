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
        List<SimpleFlightOffer> offers = ParseFlightOffers(result, IATA_from, IATA_to);

        return offers;
    }


    //Parsira JSON koji dobijemo kad pretražujemo letove jer izgleda očajno
    public static List<SimpleFlightOffer> ParseFlightOffers(JsonElement root, string IATA_from, string IATA_to)
    {
        var results = new List<SimpleFlightOffer>();

        if (!root.TryGetProperty("data", out var dataArray)) return results;

        foreach (var offer in dataArray.EnumerateArray())
        {
            var itineraries = offer.GetProperty("itineraries");
            var firstItinerary = itineraries[0];
            var segments = firstItinerary.GetProperty("segments");

            // ⛔️ Preskoči ako ima više od 1 presjedanja
            if (segments.GetArrayLength() > 2)
                continue;

            var departure = segments[0].GetProperty("departure");
            var arrival = segments[segments.GetArrayLength() - 1].GetProperty("arrival");

            string origin = departure.GetProperty("iataCode").GetString();
            string destination = arrival.GetProperty("iataCode").GetString();

            // ✅ Provjera da je stvarni let od IATA_from do IATA_to
            if (origin != IATA_from || destination != IATA_to)
                continue;

            var connections = new List<string>();
            foreach (var segment in segments.EnumerateArray())
            {
                var dep = segment.GetProperty("departure").GetProperty("iataCode").GetString();
                var arr = segment.GetProperty("arrival").GetProperty("iataCode").GetString();
                connections.Add($"{dep} → {arr}");
            }

            var carrierCode = segments[0].GetProperty("carrierCode").GetString();
            var duration = firstItinerary.GetProperty("duration").GetString();
            var priceStr = offer.GetProperty("price").GetProperty("total").GetString();
            if (!decimal.TryParse(priceStr, out var priceDecimal))
                continue;

            results.Add(new SimpleFlightOffer
            {
                Origin = origin,
                Destination = destination,
                DepartureTime = DateTime.Parse(departure.GetProperty("at").GetString()),
                ArrivalTime = DateTime.Parse(arrival.GetProperty("at").GetString()),
                CarrierCode = carrierCode,
                Duration = duration,
                Price = priceStr,
                PriceDecimal = priceDecimal, // dodaj ovo svojstvo u klasu SimpleFlightOffer
                Connections = connections
            });
        }

        // ✅ Vrati samo 5 najjeftinijih letova
        return results
            .OrderBy(f => f.PriceDecimal)
            .Take(5)
            .ToList();
    }


    //ALGORITAM JE OVDJE
    public async Task<PlannedRouteResult> PlanRouteAsync(string city1, string city2, DateTime date)
    {
        var (airportsCity1, airportsCity2) = await FindAirportsForTwoCitiesAsync(city1, city2, radiusKm: 200);

        var validFromAirports = airportsCity1
            .Where(a => !string.IsNullOrWhiteSpace(a.IATA) && a.IATA != "\\N")
            .ToList();

        var validToAirports = airportsCity2
            .Where(a => !string.IsNullOrWhiteSpace(a.IATA) && a.IATA != "\\N")
            .ToList();

        var allFilteredFlights = new List<SimpleFlightOffer>();

        foreach (var fromA in validFromAirports)
        {
            foreach (var toA in validToAirports)
            {
                var flights_list = await FlightCall(fromA.IATA, toA.IATA, date);

                if (flights_list.Count > 0)
                {
                    Console.WriteLine($"From: {fromA.IATA}, To: {toA.IATA}, Flights found: {flights_list.Count}");
                    allFilteredFlights.AddRange(flights_list);
                }

                await Task.Delay(700); // pauza da izbjegneš 429
            }
        }

        // Ako nikada nije pronašao nijedan let, vrati sve aerodrome (ili samo batch?)
        var finalFrom = validFromAirports.ToList();
        var finalTo = validToAirports.ToList();

        return new PlannedRouteResult
        {
            FromCity = city1,
            ToCity = city2,
            Date = date,
            FromAirport = finalFrom,
            ToAirport = finalTo,
            flights = allFilteredFlights
        };
    }

}
