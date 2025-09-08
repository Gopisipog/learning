using System;
using System.Collections.Generic;
using CourierService.App.Domain;
using CourierService.App.Services;
using Xunit;

namespace CourierService.Tests;

public sealed class OfferServiceUnitTests
{
    private static List<Offer> DefaultOffers => new()
    {
        new("OFR001", 10m, null, false, 200, false, 70, true, 200, true),
        new("OFR002", 7m, 50, true, 150, true, 100, true, 250, true),
        new("OFR003", 5m, 50, true, 250, true, 10, true, 150, true),
    };

    [Fact]
    public void ReturnsZero_When_NoOfferCodeOrNA()
    {
        var svc = new OfferService(DefaultOffers);
        var p1 = new Package("P1", 50, 50, "");
        var p2 = new Package("P2", 50, 50, "NA");
        Assert.Equal(0m, svc.CalculateDiscount(p1, 100m));
        Assert.Equal(0m, svc.CalculateDiscount(p2, 100m));
    }

    [Fact]
    public void ReturnsZero_When_OfferCode_NotFound()
    {
        var svc = new OfferService(DefaultOffers);
        var p = new Package("P", 50, 50, "BADCODE");
        Assert.Equal(0m, svc.CalculateDiscount(p, 100m));
    }

    [Fact]
    public void Applies_Discount_When_Applicable()
    {
        var svc = new OfferService(DefaultOffers);
        var p1 = new Package("P1", 80, 150, "OFR001"); // OFR001 applies; discount 10%
        var p2 = new Package("P2", 120, 120, "OFR002"); // OFR002 applies; discount 7%
        var p3 = new Package("P3", 20, 200, "OFR003");  // OFR003 applies; discount 5%

        Assert.Equal(20m, svc.CalculateDiscount(p1, 200m));
        Assert.Equal(14m, svc.CalculateDiscount(p2, 200m));
        Assert.Equal(10m, svc.CalculateDiscount(p3, 200m));
    }

    [Fact]
    public void Respects_Inclusive_Exclusive_Bounds()
    {
        // OFR001: distance < 200 (exclusive), weight 70..200 (inclusive)
        var svc = new OfferService(DefaultOffers);

        var atMaxDistance = new Package("D1", 100, 200, "OFR001"); // distance=200 => not applicable
        var belowMaxDistance = new Package("D2", 100, 199, "OFR001"); // applicable

        var atMinWeight = new Package("W1", 70, 100, "OFR001");  // min inclusive => applicable
        var belowMinWeight = new Package("W2", 69, 100, "OFR001"); // not applicable

        Assert.Equal(0m, svc.CalculateDiscount(atMaxDistance, 100m));
        Assert.Equal(10m, svc.CalculateDiscount(belowMaxDistance, 100m));
        Assert.Equal(10m, svc.CalculateDiscount(atMinWeight, 100m));
        Assert.Equal(0m, svc.CalculateDiscount(belowMinWeight, 100m));
    }

    [Fact]
    public void Rounds_Discount_To_Two_Decimals_AwayFromZero()
    {
        var svc = new OfferService(DefaultOffers);
        var p = new Package("P", 100, 50, "OFR001"); // 10% of 123.455 = 12.3455 => 12.35
        var discount = svc.CalculateDiscount(p, 123.455m);
        Assert.Equal(12.35m, discount);
    }
}

