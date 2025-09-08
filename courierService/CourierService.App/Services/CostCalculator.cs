using CourierService.App.Domain;

namespace CourierService.App.Services;

public interface ICostCalculator
{
    void ComputeCosts(decimal baseDeliveryCost, IList<Package> packages);
}

public class CostCalculator : ICostCalculator
{
    private readonly IOfferService _offerService;

    public CostCalculator(IOfferService offerService)
    {
        _offerService = offerService;
    }

    public void ComputeCosts(decimal baseDeliveryCost, IList<Package> packages)
    {
        foreach (var pkg in packages)
        {
            var deliveryCost = CostFormula.DeliveryCost(pkg, baseDeliveryCost);
            var discount = _offerService.CalculateDiscount(pkg, deliveryCost);
            pkg.DiscountAmount = discount;
            pkg.TotalCost = Math.Round(deliveryCost - discount, 2, MidpointRounding.AwayFromZero);
        }
    }
}

