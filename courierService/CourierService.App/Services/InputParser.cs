using System.Globalization;
using CourierService.App.Domain;

namespace CourierService.App.Services;

public static class InputParser
{
    public static (decimal baseDeliveryCost, int packageCount) ParseHeader(string line)
    {
        var parts = Split(line);
        if (parts.Length < 2)
            throw new ArgumentException("Invalid header line. Expected: base_delivery_cost no_of_packages");
        var baseCost = decimal.Parse(parts[0], CultureInfo.InvariantCulture);
        var count = int.Parse(parts[1], CultureInfo.InvariantCulture);
        return (baseCost, count);
    }

    public static Package ParsePackage(string line)
    {
        var p = Split(line);
        if (p.Length < 4) throw new ArgumentException("Invalid package line. Expected: id weight distance offer");
        var id = p[0];
        var weight = int.Parse(p[1], CultureInfo.InvariantCulture);
        var distance = int.Parse(p[2], CultureInfo.InvariantCulture);
        var offer = p[3];
        return new Package(id, weight, distance, offer);
    }

    public static (int vehicles, int maxSpeed, int maxCarriable) ParseFleet(string line)
    {
        var p = Split(line);
        if (p.Length < 3) throw new ArgumentException("Invalid fleet line. Expected: no_of_vehicles max_speed max_carriable_weight");
        var vehicles = int.Parse(p[0], CultureInfo.InvariantCulture);
        var maxSpeed = int.Parse(p[1], CultureInfo.InvariantCulture);
        var maxCarriable = int.Parse(p[2], CultureInfo.InvariantCulture);
        return (vehicles, maxSpeed, maxCarriable);
    }

    private static string[] Split(string line)
    {
        return line.Split(new[] { ' ', '\t' }, StringSplitOptions.RemoveEmptyEntries);
    }
}

