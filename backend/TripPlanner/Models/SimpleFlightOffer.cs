public class SimpleFlightOffer
{
    public string Origin { get; set; }
    public string Destination { get; set; }
    public DateTime DepartureTime { get; set; }
    public DateTime ArrivalTime { get; set; }
    public string CarrierCode { get; set; }
    public string Duration { get; set; }
    public string Price { get; set; }
    public List<string> Connections { get; set; }

    public decimal PriceDecimal { get; set; }
    public double? TotalGasPriceSuper { get; set; }
    public double? TotalGasPriceDiesel { get; set; }
    public int? TotalDriveMinutes { get; set; }
    public int TotalDriveHours { get; set; }
    public int TotalDriveMinutesRemainder { get; set; }


    // Driving info: city -> origin airport
    public double DistanceToAirportKm { get; set; }
    public int DurationToAirportMinutes { get; set; }
    public double GasPriceSuperToAirport { get; set; }
    public double GasPriceDieselToAirport { get; set; }

    // Driving info: destination airport -> city
    public double DistanceFromAirportKm { get; set; }
    public int DurationFromAirportMinutes { get; set; }
    public double GasPriceSuperFromAirport { get; set; }
    public double GasPriceDieselFromAirport { get; set; }



}
