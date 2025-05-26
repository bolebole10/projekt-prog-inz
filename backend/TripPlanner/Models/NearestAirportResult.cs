namespace TripPlanner.Models;

public class NearestAirportResult
{
    public string AirportName { get; set; }
    public string IATA { get; set; }
    public double DistanceKm { get; set; }
}
