using CourierService.App.Domain;
using CourierService.App.Services;

// Load offers from configuration (offers.json). Falls back to defaults if missing/invalid.
var offers = OfferConfigLoader.Load();

var offerService = new OfferService(offers);
var costCalculator = new CostCalculator(offerService);
var scheduler = new DeliveryScheduler();

// Read input from STDIN
// Expected input patterns per the challenge; we support Problem 01 and Problem 02
string? line = Console.ReadLine();
if (string.IsNullOrWhiteSpace(line))
{
    Console.Error.WriteLine("No input");
    return;
}

var (baseDeliveryCost, packageCount) = InputParser.ParseHeader(line);
var packages = new List<Package>();
for (int i = 0; i < packageCount; i++)
{
    var pkgLine = Console.ReadLine();
    if (string.IsNullOrWhiteSpace(pkgLine)) { i--; continue; }
    packages.Add(InputParser.ParsePackage(pkgLine));
}

// Check if fleet line is provided (Problem 02)
string? fleetLine = Console.ReadLine();
bool haveFleet = !string.IsNullOrWhiteSpace(fleetLine);
int vehicles = 0, maxSpeed = 0, maxCarriable = 0;
if (haveFleet)
{
    var f = InputParser.ParseFleet(fleetLine!);
    vehicles = f.vehicles; maxSpeed = f.maxSpeed; maxCarriable = f.maxCarriable;
}

// Calculate costs
costCalculator.ComputeCosts(baseDeliveryCost, packages);

if (haveFleet)
{
    scheduler.Schedule(packages, vehicles, maxSpeed, maxCarriable);
}

// Output
foreach (var p in packages)
{
    if (p.EstimatedDeliveryTimeHours.HasValue)
        Console.WriteLine($"{p.Id} {p.DiscountAmount:0} {p.TotalCost:0} {p.EstimatedDeliveryTimeHours:0.##}");
    else
        Console.WriteLine($"{p.Id} {p.DiscountAmount:0} {p.TotalCost:0}");
}
