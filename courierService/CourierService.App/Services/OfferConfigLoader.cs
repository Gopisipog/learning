using System.Text.Json;
using CourierService.App.Domain;

namespace CourierService.App.Services;

public static class OfferConfigLoader
{
    public sealed class OfferConfig
    {
        public List<OfferItem> Offers { get; set; } = new();
    }

    public sealed class OfferItem
    {
        public string Code { get; set; } = string.Empty;
        public decimal DiscountPercent { get; set; }
        public int? MinDistanceKm { get; set; }
        public bool MinDistanceInclusive { get; set; }
        public int? MaxDistanceKm { get; set; }
        public bool MaxDistanceInclusive { get; set; }
        public int? MinWeightKg { get; set; }
        public bool MinWeightInclusive { get; set; }
        public int? MaxWeightKg { get; set; }
        public bool MaxWeightInclusive { get; set; }
    }

    public static List<Offer> Load(string? path = null)
    {
        path ??= Path.Combine(AppContext.BaseDirectory, "offers.json");
        if (!File.Exists(path))
        {
            return GetDefaultOffers();
        }
        var json = File.ReadAllText(path);
        var cfg = JsonSerializer.Deserialize<OfferConfig>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
        if (cfg?.Offers == null || cfg.Offers.Count == 0)
        {
            return GetDefaultOffers();
        }
        return cfg.Offers.Select(o => new Offer(
            o.Code,
            o.DiscountPercent,
            o.MinDistanceKm,
            o.MinDistanceInclusive,
            o.MaxDistanceKm,
            o.MaxDistanceInclusive,
            o.MinWeightKg,
            o.MinWeightInclusive,
            o.MaxWeightKg,
            o.MaxWeightInclusive
        )).ToList();
    }
    // Fallback strategy in case config is missing/invalid
    private static List<Offer> GetDefaultOffers() => new()
    {
        new("OFR001", 10m, null, false, 200, false, 70, true, 200, true),
        new("OFR002", 7m, 50, true, 150, true, 100, true, 250, true),
        new("OFR003", 5m, 50, true, 250, true, 10, true, 150, true),
    };
}

