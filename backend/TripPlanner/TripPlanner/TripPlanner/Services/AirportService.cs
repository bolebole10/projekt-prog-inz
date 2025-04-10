using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;

public class Airport
{
   public string City { get; set; }
   public string Name { get; set; }
   public string IataCode { get; set; }
}

public class AirportService
{
   private readonly List<Airport> _airports = new();

   public AirportService()
   {
      LoadAirportData("airports.csv"); // Replace with your file path
   }

   private void LoadAirportData(string filePath)
   {
      if (!File.Exists(filePath))
         throw new FileNotFoundException($"File not found: {filePath}");

      var lines = File.ReadAllLines(filePath);
      foreach (var line in lines.Skip(1)) // Skip the header row
      {
         var parts = line.Split(',');
         if (parts.Length >= 5)
         {
            _airports.Add(new Airport
            {
               City = parts[2].Trim('"'), // City name
               Name = parts[1].Trim('"'), // Airport name
               IataCode = parts[4].Trim('"') // IATA code
            });
         }
      }
   }

   public List<Airport> SearchAirports(string query)
   {
      return _airports
          .Where(a => a.City.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                      a.Name.Contains(query, StringComparison.OrdinalIgnoreCase))
          .ToList();
   }

   public List<string> GetIataCodes(string city)
   {
      return _airports
          .Where(a => a.City.Equals(city, StringComparison.OrdinalIgnoreCase))
          .Select(a => a.IataCode)
          .ToList();
   }

   public string GetIataCode(string city)
   {
      var iataCodes = GetIataCodes(city);
      return iataCodes.Count == 1 ? iataCodes.First() : city; // Return city if multiple matches
   }
}