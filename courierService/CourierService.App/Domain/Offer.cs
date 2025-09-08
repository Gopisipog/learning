namespace CourierService.App.Domain;

public class Offer
{
    public string Code { get; }
    public int? MinDistanceKm { get; }
    public bool MinDistanceInclusive { get; }
    public int? MaxDistanceKm { get; }
    public bool MaxDistanceInclusive { get; }
    public int? MinWeightKg { get; }
    public bool MinWeightInclusive { get; }
    public int? MaxWeightKg { get; }
    public bool MaxWeightInclusive { get; }
    public decimal DiscountPercent { get; }

    public Offer(
        string code,
        decimal discountPercent,
        int? minDistanceKm,
        bool minDistanceInclusive,
        int? maxDistanceKm,
        bool maxDistanceInclusive,
        int? minWeightKg,
        bool minWeightInclusive,
        int? maxWeightKg,
        bool maxWeightInclusive)
    {
        Code = code;
        DiscountPercent = discountPercent;
        MinDistanceKm = minDistanceKm;
        MinDistanceInclusive = minDistanceInclusive;
        MaxDistanceKm = maxDistanceKm;
        MaxDistanceInclusive = maxDistanceInclusive;
        MinWeightKg = minWeightKg;
        MinWeightInclusive = minWeightInclusive;
        MaxWeightKg = maxWeightKg;
        MaxWeightInclusive = maxWeightInclusive;
    }

    public bool IsApplicable(Package pkg)
    {
        bool distanceOk = true;
        if (MinDistanceKm.HasValue)
            distanceOk &= MinDistanceInclusive ? pkg.DistanceKm >= MinDistanceKm : pkg.DistanceKm > MinDistanceKm;
        if (MaxDistanceKm.HasValue)
            distanceOk &= MaxDistanceInclusive ? pkg.DistanceKm <= MaxDistanceKm : pkg.DistanceKm < MaxDistanceKm;

        bool weightOk = true;
        if (MinWeightKg.HasValue)
            weightOk &= MinWeightInclusive ? pkg.WeightKg >= MinWeightKg : pkg.WeightKg > MinWeightKg;
        if (MaxWeightKg.HasValue)
            weightOk &= MaxWeightInclusive ? pkg.WeightKg <= MaxWeightKg : pkg.WeightKg < MaxWeightKg;

        return distanceOk && weightOk;
    }
}

