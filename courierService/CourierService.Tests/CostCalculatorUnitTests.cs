using System;
using System.Collections.Generic;
using System.Linq;
using CourierService.App.Domain;
using CourierService.App.Services;
using Xunit;

namespace CourierService.Tests;

public sealed class CostCalculatorUnitTests
{
    private sealed class RecordingOfferService : IOfferService
    {
        private readonly Func<Package, decimal, decimal> _fn;
        public List<(Package pkg, decimal delivery)> Calls { get; } = new();
        public RecordingOfferService(Func<Package, decimal, decimal> fn) => _fn = fn;
        public decimal CalculateDiscount(Package pkg, decimal deliveryCostWithBase)
        {
            Calls.Add((pkg, deliveryCostWithBase));
            return _fn(pkg, deliveryCostWithBase);
        }
    }

    [Fact]
    public void ComputeCosts_Sets_Discount_And_Rounded_Total()
    {
        // Arrange
        var a = new Package("A", weightKg: 10, distanceKm: 10, offerCode: "NA"); // delivery = 50 + 100 + 50 = 200
        var b = new Package("B", weightKg: 5, distanceKm: 5, offerCode: "NA");   // delivery = 50 + 50 + 25 = 125
        var offers = new RecordingOfferService((pkg, del) => pkg.Id switch
        {
            "A" => 23.456m,  // total = 176.544 -> 176.54
            "B" => 100.234m, // total = 24.766  -> 24.77
            _ => 0m
        });
        var sut = new CostCalculator(offers);

        // Act
        sut.ComputeCosts(50m, new List<Package> { a, b });

        // Assert
        Assert.Equal(23.456m, a.DiscountAmount);
        Assert.Equal(176.54m, a.TotalCost);
        Assert.Equal(100.234m, b.DiscountAmount);
        Assert.Equal(24.77m, b.TotalCost);
    }

    [Fact]
    public void ComputeCosts_Passes_Correct_DeliveryCost_To_OfferService()
    {
        // Arrange
        var p1 = new Package("P1", 12, 8, "NA");  // base 10 + (12*10)=120 + (8*5)=40 -> 170
        var p2 = new Package("P2", 7, 4, "NA");   // base 10 + (7*10)=70  + (4*5)=20 -> 100
        var offers = new RecordingOfferService((pkg, del) => 0m);
        var sut = new CostCalculator(offers);

        // Act
        sut.ComputeCosts(10m, new List<Package> { p1, p2 });

        // Assert
        Assert.Equal(2, offers.Calls.Count);
        var c1 = offers.Calls.Single(c => c.pkg.Id == "P1");
        var c2 = offers.Calls.Single(c => c.pkg.Id == "P2");
        Assert.Equal(170m, c1.delivery);
        Assert.Equal(100m, c2.delivery);
    }

    [Fact]
    public void ComputeCosts_Rounds_Half_Away_From_Zero()
    {
        // Arrange
        var a = new Package("A", 10, 10, "NA"); // delivery = 200
        var offers = new RecordingOfferService((pkg, del) => 23.995m); // total = 176.005 -> 176.01 (away from zero)
        var sut = new CostCalculator(offers);

        // Act
        sut.ComputeCosts(50m, new List<Package> { a });

        // Assert
        Assert.Equal(176.01m, a.TotalCost);
    }

    [Fact]
    public void ComputeCosts_EmptyList_NoOfferCalls()
    {
        var offers = new RecordingOfferService((pkg, del) => 0m);
        var sut = new CostCalculator(offers);
        sut.ComputeCosts(0m, new List<Package>());
        Assert.Empty(offers.Calls);
    }

    [Fact]
    public void ComputeCosts_NullList_Throws()
    {
        var offers = new RecordingOfferService((pkg, del) => 0m);
        var sut = new CostCalculator(offers);
        Assert.Throws<NullReferenceException>(() => sut.ComputeCosts(0m, null!));
    }
}

