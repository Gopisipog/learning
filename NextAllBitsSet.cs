using System;

class NextAllBitsSet
{
    public static int AllBitsSet(int n)
    {
        // Find the number of bits needed
        int bits = 0;
        int temp = n;

        // Find position of the most significant bit
        while (temp > 0)
        {
            bits++;
            temp >>= 1;
        }

        // Create a number with all bits set up to that position
        return (1 << bits) - 1;
    }
}