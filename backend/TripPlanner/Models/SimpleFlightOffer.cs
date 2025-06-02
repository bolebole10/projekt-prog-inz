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


}
