namespace TripPlanner.Models
{
    public class FlixBusAutocompleteResult
    {
        public string Zipcode { get; set; }
        public double Score { get; set; }
        public FlixBusCountry Country { get; set; }
        public string Address { get; set; }
        public FlixBusCity City { get; set; }
        public string Name { get; set; }
        public int Legacy_Id { get; set; }
        public FlixBusLocation Location { get; set; }
        public string Id { get; set; }
        public int Importance_Order { get; set; }
        public string Slug { get; set; }
        public bool Is_Train { get; set; }
    }

    public class FlixBusCountry
    {
        public string Code { get; set; }
        public string Name { get; set; }
    }

    public class FlixBusCity
    {
        public string Name { get; set; }
        public int Legacy_Id { get; set; }
        public string Id { get; set; }
        public string Slug { get; set; }
    }

    public class FlixBusLocation
    {
        public double Lat { get; set; }
        public double Lon { get; set; }
    }
}
