using Neo4j.Driver;

public class GraphSearchService
{
    private readonly IDriver _driver;

    public GraphSearchService(IDriver driver)
    {
        _driver = driver;
    }

    //     public async Task<List<TripStep>> FindOptimalTrip(
    //      string from, string to, DateTime earliestDeparture, string optimizeFor = "price")
    //     {
    //         var query = @"
    //     MATCH (start:City {name: $from}), (end:City {name: $to})
    // CALL apoc.algo.dijkstra(start, end, 'CONNECTED_VIA>', $optimizeFor) YIELD path, weight
    // WITH nodes(path) AS ns, relationships(path) AS rs
    // WHERE ALL(i IN RANGE(0, size(rs)-2)
    //     WHERE datetime(rs[i+1].departure_time) >= datetime(rs[i].arrival_time)
    //       AND duration.inSeconds(datetime(rs[i].arrival_time), datetime(rs[i+1].departure_time)).seconds <= 43200)
    // AND datetime(rs[0].departure_time) >= datetime($earliestDeparture)
    // AND datetime(rs[0].departure_time) < datetime($earliestDeparture) + duration({days:1})
    // RETURN [r IN rs | {
    //     from: startNode(r).name,
    //     to: endNode(r).name,
    //     departure_time: r.departure_time,
    //     arrival_time: r.arrival_time,
    //     price: r.price,
    //     duration: r.duration,
    //     operator: r.operator,
    //     mode: r.mode,
    //     trip_id: r.trip_id
    // }] AS trips

    // ";


    //         var session = _driver.AsyncSession();

    //         // Pretpostavimo da je earliestDeparture ulazni parametar (DateTime)
    //         var earliestDepartureDate = earliestDeparture.Date; // Točno ponoć tog dana
    //         string earliestDepartureIso = earliestDepartureDate.ToString("o"); // ISO 8601 format


    //         try
    //         {
    //             var result = await session.RunAsync(query, new
    //             {
    //                 from,
    //                 to,
    //                 earliestDeparture = earliestDepartureIso,
    //                 optimizeFor
    //             });

    //             if (await result.FetchAsync())
    //             {
    //                 var records = result.Current["trips"].As<List<Dictionary<string, object>>>();

    //                 return records.Select(r => new TripStep
    //                 {
    //                     From = r["from"].ToString(),
    //                     To = r["to"].ToString(),
    //                     DepartureTime = DateTime.Parse(r["departure_time"].ToString()),
    //                     ArrivalTime = DateTime.Parse(r["arrival_time"].ToString()),
    //                     Duration = Convert.ToInt32(r["duration"]),
    //                     Price = Convert.ToDouble(r["price"]),
    //                     Operator = r["operator"].ToString(),
    //                     Mode = r["mode"].ToString(),
    //                     TripId = r["trip_id"].ToString()
    //                 }).ToList();
    //             }

    //             return new List<TripStep>();
    //         }
    //         finally
    //         {
    //             await session.CloseAsync();
    //         }
    //     }

    public async Task<List<TripEdge>> LoadAllEdgesAsync(DateTime earliestDeparture)
    {
        var query = @"
            MATCH (from:City)-[r:CONNECTED_VIA]->(to:City)
            WHERE datetime(r.departure_time) >= datetime($earliestDeparture)
            RETURN from.name AS from, to.name AS to, 
            r.departure_time AS departure_time, r.arrival_time AS arrival_time, 
            r.duration AS duration, r.price AS price, 
            r.operator AS operator, r.mode AS mode, r.trip_id AS trip_id";


        var session = _driver.AsyncSession();
        var result = await session.RunAsync(query, new { earliestDeparture = earliestDeparture.ToString("o") });

        var edges = new List<TripEdge>();

        while (await result.FetchAsync())
        {
            var r = result.Current;

            edges.Add(new TripEdge
            {
                From = r["from"].As<string>(),
                To = r["to"].As<string>(),
                DepartureTime = DateTime.Parse(r["departure_time"].As<string>()),
                ArrivalTime = DateTime.Parse(r["arrival_time"].As<string>()),
                Duration = Convert.ToInt32(r["duration"].As<string>()),
                Price = Convert.ToDouble(r["price"].As<string>()),
                Operator = r["operator"].As<string>(),
                Mode = r["mode"].As<string>(),
                TripId = r["trip_id"].As<string>()
            });
        }

        await session.CloseAsync();
        return edges;
    }


    public async Task<List<List<TripEdge>>> FindTopOptimalTripsOffline(
        string from, string to, DateTime startTime, string optimizeFor = "price", int maxResults = 3)
    {
        var edges = await LoadAllEdgesAsync(startTime);

        var queue = new PriorityQueue<(string city, DateTime arriveAt, List<TripEdge> path, double totalCost), double>();
        var visited = new Dictionary<(string city, DateTime time), double>();

        var results = new List<(List<TripEdge> path, double totalCost)>();

        // Start with only those trips that depart from 'from' city and on the correct date
        foreach (var edge in edges.Where(e =>
            e.From == from &&
            e.DepartureTime.Date == startTime.Date &&
            e.DepartureTime >= startTime))
        {
            double edgeCost = optimizeFor == "price" ? edge.Price : edge.Duration;
            queue.Enqueue((edge.To, edge.ArrivalTime, new List<TripEdge> { edge }, edgeCost), edgeCost);
        }

        while (queue.Count > 0 && results.Count < maxResults)
        {
            var (currentCity, currentTime, path, totalCost) = queue.Dequeue();

            if (currentCity == to)
            {
                results.Add((path, totalCost));
                continue;
            }

            var key = (currentCity, currentTime);
            if (visited.TryGetValue(key, out var prevCost) && prevCost <= totalCost)
                continue;

            visited[key] = totalCost;

            foreach (var edge in edges.Where(e =>
                e.From == currentCity &&
                e.DepartureTime >= currentTime &&
                (e.DepartureTime - currentTime).TotalHours <= 12))
            {
                // Limit total number of edges to less than 5 (i.e. 4 connections max)
                if (path.Count >= 4)
                    continue;

                double edgeCost = optimizeFor == "price" ? edge.Price : edge.Duration;
                var newPath = new List<TripEdge>(path) { edge };
                var newTotalCost = totalCost + edgeCost;

                queue.Enqueue((edge.To, edge.ArrivalTime, newPath, newTotalCost), newTotalCost);
            }
        }

        return results
            .OrderBy(r => r.totalCost)
            .Take(maxResults)
            .Select(r => r.path)
            .ToList();
    }



}

