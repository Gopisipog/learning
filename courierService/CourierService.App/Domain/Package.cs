namespace CourierService.App.Domain;

public class Package
{
    public string Id { get; }
    public int WeightKg { get; }
    public int DistanceKm { get; }
    public string OfferCode { get; }

    // Results
    public decimal DiscountAmount { get; set; }
    public decimal TotalCost { get; set; }
    public double? EstimatedDeliveryTimeHours { get; set; }

    public Package(string id, int weightKg, int distanceKm, string offerCode)
    {
        Id = id;
        WeightKg = weightKg;
        DistanceKm = distanceKm;
        OfferCode = offerCode;
    }
}

