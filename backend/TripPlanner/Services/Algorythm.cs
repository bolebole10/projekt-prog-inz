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
    private readonly OpenRouteServiceService _openRouteService;

    public RoutePlannerService(string city1, string city2, DateTime date, AmadeusService amadeusService, OpenRouteServiceService openRouteService)
    {
        //ovdje treba svoj absolute path stavit za file
        string airportCsvPath = "/home/bojan/Documents/PROG_ING/projekt-prog-inz/backend/TripPlanner/airports-size.csv";
        _nearestAirportService = new NearestAirportService(airportCsvPath);
        _amadeusService = amadeusService;
        _openRouteService = openRouteService;
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

            // Preskoči ako ima više od 1 presjedanja
            if (segments.GetArrayLength() > 2)
                continue;

            var departure = segments[0].GetProperty("departure");
            var arrival = segments[segments.GetArrayLength() - 1].GetProperty("arrival");

            string origin = departure.GetProperty("iataCode").GetString();
            string destination = arrival.GetProperty("iataCode").GetString();

            // Provjera da je stvarni let od IATA_from do IATA_to
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
                PriceDecimal = priceDecimal,
                Connections = connections
            });
        }

        // Vrati samo 5 najjeftinijih letova
        return results
            .OrderBy(f => f.PriceDecimal)
            .Take(2)
            .ToList();
    }


    //ALGORITAM JE OVDJE
    public async Task<PlannedRouteResult> PlanRouteAsync(string city1, string city2, DateTime date)
    {
        //PRONALAZAK AERODROMA U RADIJUSU OKO PRVOG I ZADNJEG GRADA
        var (airportsCity1, airportsCity2) = await FindAirportsForTwoCitiesAsync(city1, city2, radiusKm: 200);

        var validFromAirports = airportsCity1
            .Where(a => !string.IsNullOrWhiteSpace(a.IATA) && a.IATA != "\\N")
            .ToList();

        var validToAirports = airportsCity2
            .Where(a => !string.IsNullOrWhiteSpace(a.IATA) && a.IATA != "\\N")
            .ToList();


        //IZMEĐU 2 SKUPA AERODROMA (2 radijusa) POZIVA API ZA LETOVE I VRAĆA MAX 5 NAJJEFTINIJIH ZA SVAKI
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

                await Task.Delay(700); // pauza da izbjegnemo 429
            }
        }

        var finalFrom = validFromAirports.ToList();
        var finalTo = validToAirports.ToList();

        allFilteredFlights.OrderBy(f => f.PriceDecimal).Take(5).ToList();

        foreach (var flight in allFilteredFlights)
        {
            // 1. Drive from city1 to flight.Origin (origin airport)
            var fullName1 = finalFrom.FirstOrDefault(a => a.IATA == flight.Origin)?.AirportName;
            var drivingToAirport = await _openRouteService.GetDrivingInfoAsync(city1, fullName1);

            // 2. Drive from flight.Destination (destination airport) to city2
            var fullName2 = finalTo.FirstOrDefault(a => a.IATA == flight.Destination)?.AirportName;
            var drivingFromAirport = await _openRouteService.GetDrivingInfoAsync(fullName2, city2);

            double distanceToAirport = drivingToAirport?.distanceKm ?? 0;
            double distanceFromAirport = drivingFromAirport?.distanceKm ?? 0;
            double durationToAirport = drivingToAirport?.durationMin ?? 0;
            double durationFromAirport = drivingFromAirport?.durationMin ?? 0;

            double gasPriceSuperToAirport = distanceToAirport / 100 * 6 * 1.41;
            double gasPriceDieselToAirport = distanceToAirport / 100 * 6 * 1.28;

            double gasPriceSuperFromAirport = distanceFromAirport / 100 * 6 * 1.41;
            double gasPriceDieselFromAirport = distanceFromAirport / 100 * 6 * 1.28;

            double totalDistanceKm = distanceToAirport + distanceFromAirport;

            // Skip if total distance too long
            if (totalDistanceKm > 300)
                continue;

            int totalMinutes = (int)(durationToAirport + durationFromAirport);
            int totalHours = totalMinutes / 60;
            int totalMinutesRemainder = totalMinutes % 60;

            int hoursToAirport = (int)(durationToAirport / 60);
            int minutesToAirport = (int)(durationToAirport % 60);

            int hoursFromAirport = (int)(durationFromAirport / 60);
            int minutesFromAirport = (int)(durationFromAirport % 60);

            // Store all info in flight (extend flight model accordingly)
            flight.DistanceToAirportKm = Math.Round(distanceToAirport, 2);
            flight.DistanceFromAirportKm = Math.Round(distanceFromAirport, 2);

            flight.DurationToAirportMinutes = (int)durationToAirport;
            flight.DurationFromAirportMinutes = (int)durationFromAirport;

            flight.GasPriceSuperToAirport = Math.Round(gasPriceSuperToAirport, 2);
            flight.GasPriceDieselToAirport = Math.Round(gasPriceDieselToAirport, 2);

            flight.GasPriceSuperFromAirport = Math.Round(gasPriceSuperFromAirport, 2);
            flight.GasPriceDieselFromAirport = Math.Round(gasPriceDieselFromAirport, 2);

            flight.TotalGasPriceSuper = Math.Round(gasPriceSuperToAirport + gasPriceSuperFromAirport, 2);
            flight.TotalGasPriceDiesel = Math.Round(gasPriceDieselToAirport + gasPriceDieselFromAirport, 2);

            flight.TotalDriveMinutes = totalMinutes;
            flight.TotalDriveHours = totalHours;
            flight.TotalDriveMinutesRemainder = totalMinutesRemainder;

            Console.WriteLine($"Flight {flight.Origin} → {flight.Destination}:\n" +
                $" To Airport: {hoursToAirport}h {minutesToAirport}m, Gas Super = {flight.GasPriceSuperToAirport} EUR\n" +
                $" From Airport: {hoursFromAirport}h {minutesFromAirport}m, Gas Super = {flight.GasPriceSuperFromAirport} EUR\n" +
                $" Total Drive: {totalHours}h {totalMinutesRemainder}m, Total Gas Super = {flight.TotalGasPriceSuper} EUR");
        }


        return new PlannedRouteResult
        {
            FromCity = city1,
            ToCity = city2,
            Date = date,
            FromAirport = finalFrom,
            ToAirport = finalTo,
            flights = allFilteredFlights.OrderBy(f => f.PriceDecimal).Take(5).ToList()
        };
    }

}
