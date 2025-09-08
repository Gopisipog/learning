using CourierService.App.Domain;
using CourierService.App.Services;

namespace CourierService.Tests;

public class OfferAndCostTests
{
    private static List<Offer> Offers => new()
    {
        new("OFR001", 10m, null, false, 200, false, 70, true, 200, true),
        new("OFR002", 7m, 50, true, 150, true, 100, true, 250, true),
        new("OFR003", 5m, 50, true, 250, true, 10, true, 150, true),
    };

    [Fact]
    public void Cost_And_Discount_Sample_Problem01()
    {
        var offerSvc = new OfferService(Offers);
        var calc = new CostCalculator(offerSvc);

        var pkgs = new List<Package>
        {
            new("PKG1", 5, 5, "OFR001"),
            new("PKG2", 15, 5, "OFR002"),
            new("PKG3", 10, 100, "OFR003")
        };

        calc.ComputeCosts(100m, pkgs);

        Assert.Equal(0m, pkgs[0].DiscountAmount);
        Assert.Equal(175m, pkgs[0].TotalCost);
        Assert.Equal(0m, pkgs[1].DiscountAmount);
        Assert.Equal(275m, pkgs[1].TotalCost);
        Assert.Equal(35m, pkgs[2].DiscountAmount);
        Assert.Equal(665m, pkgs[2].TotalCost);
    }

    [Fact]
    public void Cost_And_Discount_EdgeCases()
    {
        var offerSvc = new OfferService(Offers);
        var calc = new CostCalculator(offerSvc);

        var pkgs = new List<Package>
        {
            // OFR001: distance < 200, weight 70-200 - should apply
            new("PKG_A", 100, 150, "OFR001"),
            // OFR002: distance 50-150, weight 100-250 - should apply
            new("PKG_B", 200, 100, "OFR002"),
            // OFR003: distance 50-250, weight 10-150 - should apply
            new("PKG_C", 50, 200, "OFR003"),
            // Invalid offer code - no discount
            new("PKG_D", 50, 50, "INVALID"),
            // No offer code - no discount
            new("PKG_E", 25, 75, "NA")
        };

        calc.ComputeCosts(50m, pkgs);

        // PKG_A: 50 + (100*10) + (150*5) = 1800, discount 10% = 180
        Assert.Equal(180m, pkgs[0].DiscountAmount);
        Assert.Equal(1620m, pkgs[0].TotalCost);

        // PKG_B: 50 + (200*10) + (100*5) = 2550, discount 7% = 178.5
        Assert.Equal(178.5m, pkgs[1].DiscountAmount);
        Assert.Equal(2371.5m, pkgs[1].TotalCost);

        // PKG_C: 50 + (50*10) + (200*5) = 1550, discount 5% = 77.5
        Assert.Equal(77.5m, pkgs[2].DiscountAmount);
        Assert.Equal(1472.5m, pkgs[2].TotalCost);

        // PKG_D: 50 + (50*10) + (50*5) = 800, no discount
        Assert.Equal(0m, pkgs[3].DiscountAmount);
        Assert.Equal(800m, pkgs[3].TotalCost);

        // PKG_E: 50 + (25*10) + (75*5) = 675, no discount
        Assert.Equal(0m, pkgs[4].DiscountAmount);
        Assert.Equal(675m, pkgs[4].TotalCost);
    }

    [Fact]
    public void Cost_And_Discount_BoundaryConditions()
    {
        var offerSvc = new OfferService(Offers);
        var calc = new CostCalculator(offerSvc);

        var pkgs = new List<Package>
        {
            // OFR001: distance exactly 200 (exclusive) - should NOT apply
            new("PKG_1", 100, 200, "OFR001"),
            // OFR001: distance 199 (< 200) - should apply
            new("PKG_2", 100, 199, "OFR001"),
            // OFR002: weight exactly 100 (inclusive) - should apply
            new("PKG_3", 100, 75, "OFR002"),
            // OFR002: weight 99 (< 100) - should NOT apply
            new("PKG_4", 99, 75, "OFR002"),
        };

        calc.ComputeCosts(0m, pkgs);

        // PKG_1: 0 + (100*10) + (200*5) = 2000, no discount (distance = 200, not < 200)
        Assert.Equal(0m, pkgs[0].DiscountAmount);
        Assert.Equal(2000m, pkgs[0].TotalCost);

        // PKG_2: 0 + (100*10) + (199*5) = 1995, discount 10% = 199.5
        Assert.Equal(199.5m, pkgs[1].DiscountAmount);
        Assert.Equal(1795.5m, pkgs[1].TotalCost);

        // PKG_3: 0 + (100*10) + (75*5) = 1375, discount 7% = 96.25
        Assert.Equal(96.25m, pkgs[2].DiscountAmount);
        Assert.Equal(1278.75m, pkgs[2].TotalCost);

        // PKG_4: 0 + (99*10) + (75*5) = 1365, no discount (weight = 99, not >= 100)
        Assert.Equal(0m, pkgs[3].DiscountAmount);
        Assert.Equal(1365m, pkgs[3].TotalCost);
    }
}

public class SchedulerTests
{
    private static List<Offer> Offers => new()
    {
        new("OFR001", 10m, null, false, 200, false, 70, true, 200, true),
        new("OFR002", 7m, 50, true, 150, true, 100, true, 250, true),
        new("OFR003", 5m, 50, true, 250, true, 10, true, 150, true),
    };

    [Fact]
    public void Delivery_Times_Sample_Problem02()
    {
        var offerSvc = new OfferService(Offers);
        var calc = new CostCalculator(offerSvc);
        var scheduler = new DeliveryScheduler();

        var pkgs = new List<Package>
        {
            new("PKG1", 50, 30, "OFR001"),
            new("PKG4", 110, 60, "OFFR002"),
            new("PKG5", 155, 95, "NA"),
            new("PKG2", 75, 125, "OFFR0008"),
            new("PKG3", 175, 100, "OFR003"),
        };

        calc.ComputeCosts(100m, pkgs);
        scheduler.Schedule(pkgs, 2, 70, 200);

        // Validate cost & discounts
        Assert.Equal(0m, pkgs[0].DiscountAmount);
        Assert.Equal(750m, pkgs[0].TotalCost);
        Assert.Equal(0m, pkgs[1].DiscountAmount);
        Assert.Equal(1500m, pkgs[1].TotalCost);
        Assert.Equal(0m, pkgs[2].DiscountAmount);
        Assert.Equal(2125m, pkgs[2].TotalCost);
        Assert.Equal(0m, pkgs[3].DiscountAmount);
        Assert.Equal(1475m, pkgs[3].TotalCost);
        Assert.Equal(0m, pkgs[4].DiscountAmount);
        Assert.Equal(2350m, pkgs[4].TotalCost);

        // Validate estimated delivery times (rounded)
        Assert.Equal(4.00, pkgs[0].EstimatedDeliveryTimeHours!.Value, 2);
        Assert.Equal(0.86, pkgs[1].EstimatedDeliveryTimeHours!.Value, 2);
        Assert.Equal(4.22, pkgs[2].EstimatedDeliveryTimeHours!.Value, 2);
        Assert.Equal(1.79, pkgs[3].EstimatedDeliveryTimeHours!.Value, 2);
        Assert.Equal(1.43, pkgs[4].EstimatedDeliveryTimeHours!.Value, 2);
    }
}
