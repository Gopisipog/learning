using CourierService.App.Domain;

namespace CourierService.App.Services;

public interface IDeliveryScheduler
{
    void Schedule(IList<Package> packages, int numberOfVehicles, int maxSpeedKmPerHour, int maxCarriableWeightKg);
}

public class DeliveryScheduler : IDeliveryScheduler
{
    public void Schedule(IList<Package> packages, int numberOfVehicles, int maxSpeedKmPerHour, int maxCarriableWeightKg)
    {
        // Initialize vehicles with identical characteristics
        var vehicles = new List<Vehicle>();
        for (int i = 0; i < numberOfVehicles; i++)
            vehicles.Add(new Vehicle(i + 1, maxSpeedKmPerHour, maxCarriableWeightKg));

        var pending = packages.Select(p => p).ToList();

        while (pending.Count > 0)
        {
            // pick the earliest available vehicle
            var vehicle = vehicles.OrderBy(v => v.AvailableAtHour).First();

            // choose the best shipment at this time from remaining packages under weight limit
            var shipment = ChooseBestShipment(pending, maxCarriableWeightKg);
            if (shipment.Count == 0)
            {
                // No package can fit - break to avoid infinite loop
                break;
            }

            // Compute trip time based on farthest distance in shipment
            int farthestKm = shipment.Max(p => p.DistanceKm);
            double timeToFarthest = (double)farthestKm / vehicle.SpeedKmPerHour;

            foreach (var pkg in shipment)
            {
                // Estimated delivery time is when vehicle starts (its availability) plus time to that package's distance
                var travelTime = (double)pkg.DistanceKm / vehicle.SpeedKmPerHour;
                pkg.EstimatedDeliveryTimeHours = Math.Round(vehicle.AvailableAtHour + travelTime, 2, MidpointRounding.AwayFromZero);
            }

            // update vehicle availability after returning
            vehicle.AvailableAtHour = Math.Round(vehicle.AvailableAtHour + (timeToFarthest * 2), 2, MidpointRounding.AwayFromZero);

            // remove shipped packages
            foreach (var p in shipment)
                pending.Remove(p);
        }
    }

    private static List<Package> ChooseBestShipment(List<Package> candidates, int capacity)
    {
        // We aim to maximize number of packages, then maximize total weight, then minimize max distance (earlier deliverable)
        // Brute-force all subsets is exponential; for modest N typical in coding challenge it's fine.
        // To be safe for larger N, we can limit to combinations up to a reasonable size.
        var best = new List<Package>();
        int bestCount = 0;
        int bestWeight = 0;
        int bestMaxDistance = int.MaxValue;

        // Generate subsets using bitmask if count <= 20; else use greedy heuristic
        if (candidates.Count <= 20)
        {
            int total = 1 << candidates.Count;
            for (int mask = 1; mask < total; mask++)
            {
                int sumW = 0, count = 0, maxD = 0;
                var subset = new List<Package>();
                for (int i = 0; i < candidates.Count; i++)
                {
                    if (((mask >> i) & 1) == 1)
                    {
                        var p = candidates[i];
                        sumW += p.WeightKg;
                        maxD = Math.Max(maxD, p.DistanceKm);
                        count++;
                        subset.Add(p);
                    }
                }
                if (sumW <= capacity)
                {
                    if (count > bestCount ||
                        (count == bestCount && sumW > bestWeight) ||
                        (count == bestCount && sumW == bestWeight && maxD < bestMaxDistance))
                    {
                        best = subset;
                        bestCount = count;
                        bestWeight = sumW;
                        bestMaxDistance = maxD;
                    }
                }
            }
        }
        else
        {
            // Greedy: sort by weight desc, try to add while capacity allows
            var sorted = candidates.OrderByDescending(p => p.WeightKg).ThenBy(p => p.DistanceKm).ToList();
            var subset = new List<Package>();
            int sumW = 0;
            int maxD = 0;
            foreach (var p in sorted)
            {
                if (sumW + p.WeightKg <= capacity)
                {
                    subset.Add(p);
                    sumW += p.WeightKg;
                    maxD = Math.Max(maxD, p.DistanceKm);
                }
            }
            best = subset;
        }

        return best;
    }
}

