using System;

class CountNumbersWithSameBits
{
    public static int Count(int n)
    {
        // Count set bits in n
        int setBitsInN = CountSetBits(n);

        // Calculate f(n) - the next number with all bits set
        int limit = NextAllBitsSet(n);

        // Count numbers less than limit with same number of set bits
        int count = 0;
        for (int i = 0; i < limit; i++)
        {
            if (CountSetBits(i) == setBitsInN)
                count++;
        }

        return count % 1000000007;
    }

    private static int CountSetBits(int num)
{
    int count = 0;
    while (num > 0)
    {
        count += num & 1;
        num >>= 1;
    }
    return count;
}

private static int NextAllBitsSet(int n)
{
    // Find position of the most significant bit
    int bits = 0;
    int temp = n;
    
    while (temp > 0)
    {
        bits++;
        temp >>= 1;
    }
    
    // Create a number with all bits set up to that position
    return (1 << bits) - 1;
    }
}
