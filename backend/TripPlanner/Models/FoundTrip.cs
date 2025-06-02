namespace TripPlanner.Models
{
    public class PlannedRouteResult
    {
        public required string FromCity { get; set; }
        public required string ToCity { get; set; }
        public DateTime Date { get; set; }
        public required List<NearestAirportResult> FromAirport { get; set; }
        public required List<NearestAirportResult> ToAirport { get; set; }
        public List<SimpleFlightOffer> flights { get; set; }
    }
}
