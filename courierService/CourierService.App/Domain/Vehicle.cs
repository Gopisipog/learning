namespace CourierService.App.Domain;

public class Vehicle
{
    public int Id { get; }
    public int MaxCarriableWeightKg { get; }
    public int SpeedKmPerHour { get; }

    public double AvailableAtHour { get; set; } // when the vehicle becomes available

    public Vehicle(int id, int speedKmPerHour, int maxCarriableWeightKg)
    {
        Id = id;
        SpeedKmPerHour = speedKmPerHour;
        MaxCarriableWeightKg = maxCarriableWeightKg;
        AvailableAtHour = 0.0;
    }
}

