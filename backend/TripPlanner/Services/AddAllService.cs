using Neo4j.Driver;
public class AddAllService
{
    private readonly IDriver _driver;

    public AddAllService(IDriver driver)
    {
        _driver = driver;
    }

    public async Task CreateConnectionAsync(
        string fromCity, double fromLat, double fromLon,
        string toCity, double toLat, double toLon,
        string mode, double price, int duration,
        DateTime departureTime, DateTime arrivalTime,
        string tripId, string operatorName)
    {
        var query = @"
            MERGE (from:City {name: $fromCity})
            SET from.location = point({latitude: $fromLat, longitude: $fromLon})
            MERGE (to:City {name: $toCity})
            SET to.location = point({latitude: $toLat, longitude: $toLon})
            MERGE (from)-[r:CONNECTED_VIA {
                mode: $mode,
                price: $price,
                duration: $duration,
                departure_time: $departureTime,
                arrival_time: $arrivalTime,
                trip_id: $tripId,
                operator: $operator
            }]->(to)
        ";

        var session = _driver.AsyncSession();
        try
        {
            await session.RunAsync(query, new
            {
                fromCity,
                fromLat,
                fromLon,
                toCity,
                toLat,
                toLon,
                mode,
                price,
                duration,
                departureTime = departureTime.ToString("o"),
                arrivalTime = arrivalTime.ToString("o"),
                tripId,
                @operator = operatorName
            });
        }
        finally
        {
            await session.CloseAsync();
        }
    }

    public async Task GenerateSimulatedNetworkAsync()
    {
        var random = new Random();
        var now = DateTime.UtcNow.Date.AddHours(8);

        var cities = new List<(string Name, double Lat, double Lon)>
        {
            ("Zagreb", 45.8150, 15.9819),
            ("Ljubljana", 46.0569, 14.5058),
            ("Vienna", 48.2082, 16.3738),
            ("Budapest", 47.4979, 19.0402),
            ("Bratislava", 48.1486, 17.1077),
            ("Prague", 50.0755, 14.4378),
            ("Munich", 48.1351, 11.5820),
            ("Berlin", 52.5200, 13.4050),
            ("Warsaw", 52.2297, 21.0122),
            ("Amsterdam", 52.3676, 4.9041),
            ("Brussels", 50.8503, 4.3517),
            ("Paris", 48.8566, 2.3522),
            ("Milan", 45.4642, 9.1900),
            ("Rome", 41.9028, 12.4964),
            ("Barcelona", 41.3851, 2.1734),
            ("Madrid", 40.4168, -3.7038),
            ("Lisbon", 38.7169, -9.1399),
            ("Copenhagen", 55.6761, 12.5683),
            ("Oslo", 59.9139, 10.7522),
            ("Stockholm", 59.3293, 18.0686)
        };

        foreach (var (name, lat, lon) in cities)
        {
            await CreateCityAsync(name, lat, lon);
        }

        var transportModes = new[] { "bus", "train", "flight" };
        var operators = new[] { "FlixBus", "Deutsche Bahn", "Ryanair", "Air France", "ÖBB", "RegioJet", "ITA Airways" };

        for (int i = 0; i < 100; i++)
        {
            var from = cities[random.Next(cities.Count)];
            var to = cities[random.Next(cities.Count)];

            if (from.Name == to.Name)
                continue;

            int numConnections = random.Next(1, 4);

            for (int j = 0; j < numConnections; j++)
            {
                string mode = transportModes[random.Next(transportModes.Length)];
                string op = operators[random.Next(operators.Length)];

                double price = Math.Round(random.NextDouble() * 100 + 10, 2);
                int duration = random.Next(60, 720);

                var depTime = now.AddHours(random.Next(0, 48));
                var arrTime = depTime.AddMinutes(duration);

                string tripId = $"{mode}_{op}_{random.Next(10000, 99999)}";

                await CreateConnectionAsync(from.Name, from.Lat, from.Lon,
                                            to.Name, to.Lat, to.Lon,
                                            mode, price, duration,
                                            depTime, arrTime,
                                            tripId, op);
            }
        }
    }

    private async Task CreateCityAsync(string name, double lat, double lon)
    {
        var query = @"
            MERGE (c:City {name: $name})
            SET c.location = point({latitude: $lat, longitude: $lon})
        ";
        var session = _driver.AsyncSession();
        try
        {
            await session.RunAsync(query, new { name, lat, lon });
        }
        finally
        {
            await session.CloseAsync();
        }
    }
}
