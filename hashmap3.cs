using System.Collections.Generic;

public class HashMapProblems3
{
    // For unsorted arrays, use hash map instead of two pointers
    public static bool FindPairWithHashMap(int[] nums, int target)
    {
        HashSet<int> seen = new HashSet<int>();
        
        foreach (int num in nums)
        {
            int complement = target - num;
            if (seen.Contains(complement))
                return true;
            seen.Add(num);
        }
        return false;
    }
}