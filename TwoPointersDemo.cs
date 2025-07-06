using System;

class TwoPointersDemo
{
    // Problem: Find a pair of numbers in a sorted array that sum to a target value
    
    // O(n²) solution - Brute force approach
    public static bool FindPairBruteForce(int[] nums, int target)
    {
        Console.WriteLine("Running brute force solution - O(n²) time complexity");
        int comparisons = 0;
        
        for (int i = 0; i < nums.Length; i++)
        {
            for (int j = i + 1; j < nums.Length; j++)
            {
                comparisons++;
                if (nums[i] + nums[j] == target)
                {
                    Console.WriteLine($"Found pair: {nums[i]} + {nums[j]} = {target}");
                    Console.WriteLine($"Required {comparisons} comparisons");
                    return true;
                }
            }
        }
        
        Console.WriteLine($"No pair found. Required {comparisons} comparisons");
        return false;
    }
    
    // O(n) solution - Two Pointers technique
    public static bool FindPairTwoPointers(int[] nums, int target)
    {
        Console.WriteLine("Running Two Pointers solution - O(n) time complexity");
        int comparisons = 0;
        
        int left = 0;
        int right = nums.Length - 1;
        
        while (left < right)
        {
            comparisons++;
            int currentSum = nums[left] + nums[right];
            
            if (currentSum == target)
            {
                Console.WriteLine($"Found pair: {nums[left]} + {nums[right]} = {target}");
                Console.WriteLine($"Required {comparisons} comparisons");
                return true;
            }
            
            if (currentSum < target)
                left++;
            else
                right--;
        }
        
        Console.WriteLine($"No pair found. Required {comparisons} comparisons");
        return false;
    }
    
    public static void Main()
    {
        int[] sortedArray = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        int target = 15;
        
        Console.WriteLine("Demonstrating the primary advantage of Two Pointers technique:");
        Console.WriteLine("Finding a pair that sums to " + target + " in a sorted array");
        Console.WriteLine();
        
        FindPairBruteForce(sortedArray, target);
        Console.WriteLine();
        FindPairTwoPointers(sortedArray, target);
        
        Console.WriteLine();
        Console.WriteLine("The Two Pointers technique reduced the time complexity from O(n²) to O(n)");
        Console.WriteLine("This is the primary advantage of the Two Pointers technique.");
    }
}