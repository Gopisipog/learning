using CourierService.App.Domain;

namespace CourierService.App.Services;

public interface IOfferService
{
    decimal CalculateDiscount(Package pkg, decimal deliveryCostWithBase);
}

public class OfferService : IOfferService
{
    private readonly Dictionary<string, Offer> _offersByCode;

    public OfferService(IEnumerable<Offer> offers)
    {
        _offersByCode = offers.ToDictionary(o => o.Code, StringComparer.OrdinalIgnoreCase);
    }

    public decimal CalculateDiscount(Package pkg, decimal deliveryCostWithBase)
    {
        if (string.IsNullOrWhiteSpace(pkg.OfferCode) || pkg.OfferCode.Equals("NA", StringComparison.OrdinalIgnoreCase))
            return 0m;

        if (_offersByCode.TryGetValue(pkg.OfferCode, out var offer) && offer.IsApplicable(pkg))
        {
            // Discount is percent of Delivery Cost including Base cost (as per problem statement examples)
            return Math.Round((offer.DiscountPercent / 100m) * deliveryCostWithBase, 2, MidpointRounding.AwayFromZero);
        }
        return 0m;
    }
}

internal static class CostFormula
{
    public static decimal DeliveryCost(Package pkg, decimal baseDeliveryCost)
    {
        // Base Delivery Cost + (Package Total Weight * 10) + (Distance to Destination * 5)
        return baseDeliveryCost + (pkg.WeightKg * 10m) + (pkg.DistanceKm * 5m);
    }
}

