using CourierService.App.Domain;
using CourierService.App.Services;
using Xunit;

namespace CourierService.Tests;

public class DeliverySchedulerUnitTests
{
    [Fact]
    public void Selects_Max_Packages_Then_Heaviest_Then_Earliest_By_MaxDistance()
    {
        // One vehicle, capacity allows 2 of 3 (55+55), tie on weight, choose pair with smaller max distance
        var scheduler = new DeliveryScheduler();
        var pkgs = new List<Package>
        {
            new("P1", 55, 50, "NA"),
            new("P2", 55, 60, "NA"),
            new("P3", 55, 150, "NA"),
        };

        // speed 100km/h, capacity 110 => first trip should take P1 & P2 (max distance 60)
        scheduler.Schedule(pkgs, numberOfVehicles: 1, maxSpeedKmPerHour: 100, maxCarriableWeightKg: 110);

        // First two should be delivered at t=0.5h and t=0.6h respectively
        var p1 = pkgs.Single(p => p.Id == "P1");
        var p2 = pkgs.Single(p => p.Id == "P2");
        var p3 = pkgs.Single(p => p.Id == "P3");

        Assert.Equal(0.5, p1.EstimatedDeliveryTimeHours!.Value, 2);
        Assert.Equal(0.6, p2.EstimatedDeliveryTimeHours!.Value, 2);

        // After returning from the farthest (60km): availability = 2 * 0.6 = 1.2h; then deliver P3 at 1.2 + 1.5 = 2.7h
        Assert.Equal(2.7, p3.EstimatedDeliveryTimeHours!.Value, 2);
    }

    [Fact]
    public void Prefers_Heavier_Shipment_When_Same_Package_Count()
    {
        // One vehicle, four packages form two possible 2-item shipments under capacity; heavier pair should go first
        var scheduler = new DeliveryScheduler();
        var pkgs = new List<Package>
        {
            new("A", 90, 10, "NA"),  // pair A+B sum 130 (heavier)
            new("B", 40, 10, "NA"),
            new("C", 100, 1, "NA"),  // pair C+D sum 125 (lighter)
            new("D", 25, 1, "NA"),
        };

        // speed 10km/h, capacity 130 => (A,B) first; ETAs for A,B = 10/10=1.0; then return 2.0; then C,D at 2.1
        scheduler.Schedule(pkgs, numberOfVehicles: 1, maxSpeedKmPerHour: 10, maxCarriableWeightKg: 130);

        var A = pkgs.Single(p => p.Id == "A");
        var B = pkgs.Single(p => p.Id == "B");
        var C = pkgs.Single(p => p.Id == "C");
        var D = pkgs.Single(p => p.Id == "D");

        Assert.Equal(1.0, A.EstimatedDeliveryTimeHours!.Value, 2);
        Assert.Equal(1.0, B.EstimatedDeliveryTimeHours!.Value, 2);
        Assert.Equal(2.1, C.EstimatedDeliveryTimeHours!.Value, 2);
        Assert.Equal(2.1, D.EstimatedDeliveryTimeHours!.Value, 2);
    }
}

