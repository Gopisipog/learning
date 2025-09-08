# Courier Service Console Application

This repository contains a C# console application that solves the Everest Engineering courier service challenge:
- Problem 01: Delivery cost estimation with offers
- Problem 02: Delivery time estimation with a fleet of vehicles

The app is cross‑platform and can be run on Windows, macOS, or Linux using the .NET SDK.

## Requirements
- .NET SDK 9.0 or later (tested with 9.0.6)
  - Download: https://dotnet.microsoft.com/en-us/download/dotnet/9.0

If you specifically need .NET 8, the project can be retargeted to `net8.0` by updating `CourierService.App.csproj` (ask and I can switch it for you).

## Repository layout
- Solution file: `CourierService.sln` (at the repository root)
- App project: `CourierService.App`
- Test project: `CourierService.Tests`

Note: If you see references to `courierService/CourierService.sln`, the correct path in this repo is the root `CourierService.sln`.

## Build
```
dotnet build CourierService.sln -v minimal
```

## Run (Problem 01: cost only)
1) Start the app:
```
dotnet run --project CourierService.App
```
2) Paste input (end with an empty line):
```
100 3
PKG1 5 5 OFR001
PKG2 15 5 OFR002
PKG3 10 100 OFR003
```
3) Example output:
```
PKG1 0 175
PKG2 0 275
PKG3 35 665
```

## Run (Problem 02: cost + delivery time)
1) Start the app:
```
dotnet run --project CourierService.App
```
2) Paste input (end with an empty line):
```
100 5
PKG1 50 30 OFR001
PKG4 110 60 OFFR002
PKG5 155 95 NA
PKG2 75 125 OFFR0008
PKG3 175 100 OFR003
2 70 200
```
3) Example output:
```
PKG1 0 750 4
PKG4 0 1500 0.86
PKG5 0 2125 4.22
PKG2 0 1475 1.79
PKG3 0 2350 1.43
```

Notes:
- Input format:
  - Header: `base_delivery_cost no_of_packages`
  - Packages (N lines): `pkg_id pkg_weight_in_kg distance_in_km offer_code`
  - Optional fleet line (Problem 02): `no_of_vehicles max_speed max_carriable_weight`
- Output format:
  - Problem 01: `pkg_id discount total_cost`
  - Problem 02: `pkg_id discount total_cost estimated_delivery_time_in_hours`

## Test
Run all unit tests:
```
dotnet test CourierService.sln -v minimal
```

## Implementation highlights
- Clean separation of concerns:
  - Domain: `Package`, `Offer`, `Vehicle`
  - Services: `OfferService` (discount rules), `CostCalculator` (cost/discount), `DeliveryScheduler` (shipment scheduling & ETAs), `InputParser`
- Offer rules are modelled with inclusive/exclusive bounds to match the problem’s offer table precisely.
- Scheduling chooses shipments that maximize package count, then total weight, then minimize max distance. Vehicle availability advances by round-trip time to the farthest destination in the shipment.

## Troubleshooting
- If `dotnet` is not found, install the .NET SDK 9.0+ and ensure it’s on your PATH.
- If your environment only supports .NET 8, retarget the project to `net8.0`:
  - Edit the `<TargetFramework>` in `CourierService.App/CourierService.App.csproj` and `CourierService.Tests/CourierService.Tests.csproj`, or ask me to apply the change.

## License
This code is provided for the purposes of completing the Everest Engineering coding challenge. See challenge materials for original problem statement.

