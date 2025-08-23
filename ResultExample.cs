using System;
using System.Collections.Generic;

// 1. Define the generic Result record
public record Result<T>(T Value, string[] Warnings);

// 2. Create a sample class that uses the Result record
public class DataProcessor
{
    public static Result<int> ProcessData(string[] data)
    {
        var numbers = new List<int>();
        var warnings = new List<string>();
        int sum = 0;

        for (int i = 0; i < data.Length; i++)
        {
            if (int.TryParse(data[i], out int number))
            {
                sum += number;
            }
            else
            {
                // If parsing fails, add a warning instead of throwing an exception
                warnings.Add($"Warning: Could not parse '{data[i]}' at index {i}. It was ignored.");
            }
        }

        // Return both the calculated sum and any warnings that were generated
        return new Result<int>(sum, warnings.ToArray());
    }
}

// 3. Main program to demonstrate the usage
public class Program
{
    public static void Main(string[] args)
    {
        Console.WriteLine("--- Scenario 1: Processing with valid and invalid data ---");
        string[] mixedData = { "10", "20", "thirty", "40", "50" };
        
        Result<int> result1 = DataProcessor.ProcessData(mixedData);

        // Access the successfully calculated value
        Console.WriteLine($"Calculated Sum: {result1.Value}");

        // Check for and display any warnings
        if (result1.Warnings.Length > 0)
        {
            Console.WriteLine("Processing generated the following warnings:");
            foreach (var warning in result1.Warnings)
            {
                Console.WriteLine($"- {warning}");
            }
        }

        Console.WriteLine("\n------------------------------------------------------\n");

        Console.WriteLine("--- Scenario 2: Processing with only valid data ---");
        string[] validData = { "5", "15", "25" };

        Result<int> result2 = DataProcessor.ProcessData(validData);

        Console.WriteLine($"Calculated Sum: {result2.Value}");

        if (result2.Warnings.Length == 0)
        {
            Console.WriteLine("No warnings were generated during processing.");
        }
    }
}