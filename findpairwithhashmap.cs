using System;
using System.Collections.Generic;
using System.Linq;

class SortingExamples
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

    // 1. ARRAY.SORT() - Most Common and Efficient
    public static void ArraySortExamples()
    {
        Console.WriteLine("=== Array.Sort() Examples ===");

        // Basic sorting (ascending)
        int[] numbers = { 64, 34, 25, 12, 22, 11, 90 };
        Console.WriteLine("Original: " + string.Join(", ", numbers));

        Array.Sort(numbers);
        Console.WriteLine("Sorted (ascending): " + string.Join(", ", numbers));

        // Descending order
        int[] numbers2 = { 64, 34, 25, 12, 22, 11, 90 };
        Array.Sort(numbers2);
        Array.Reverse(numbers2);
        Console.WriteLine("Sorted (descending): " + string.Join(", ", numbers2));

        // Custom comparison
        string[] words = { "apple", "pie", "a", "elephant" };
        Console.WriteLine("Original words: " + string.Join(", ", words));
        Array.Sort(words, (x, y) => x.Length.CompareTo(y.Length));
        Console.WriteLine("Sorted by length: " + string.Join(", ", words));
    }

    // 2. LINQ ORDERBY - Functional Style
    public static void LinqSortExamples()
    {
        Console.WriteLine("\n=== LINQ Sorting Examples ===");

        int[] numbers = { 64, 34, 25, 12, 22, 11, 90 };

        // Ascending
        var sortedAsc = numbers.OrderBy(x => x).ToArray();
        Console.WriteLine("LINQ Ascending: " + string.Join(", ", sortedAsc));

        // Descending
        var sortedDesc = numbers.OrderByDescending(x => x).ToArray();
        Console.WriteLine("LINQ Descending: " + string.Join(", ", sortedDesc));

        // Multiple criteria
        var people = new[]
        {
            new { Name = "John", Age = 25 },
            new { Name = "Alice", Age = 30 },
            new { Name = "Bob", Age = 25 }
        };

        var sortedPeople = people.OrderBy(p => p.Age).ThenBy(p => p.Name).ToArray();
        Console.WriteLine("Sorted by Age, then Name:");
        foreach (var person in sortedPeople)
            Console.WriteLine($"  {person.Name}, {person.Age}");
    }

    // 3. LIST.SORT() - For Lists
    public static void ListSortExamples()
    {
        Console.WriteLine("\n=== List.Sort() Examples ===");

        List<int> numbers = new List<int> { 64, 34, 25, 12, 22, 11, 90 };
        Console.WriteLine("Original List: " + string.Join(", ", numbers));

        numbers.Sort();
        Console.WriteLine("Sorted List: " + string.Join(", ", numbers));

        // Custom comparison
        List<string> words = new List<string> { "apple", "pie", "a", "elephant" };
        words.Sort((x, y) => y.Length.CompareTo(x.Length)); // Descending by length
        Console.WriteLine("Words by length (desc): " + string.Join(", ", words));
    }

    // 4. MANUAL SORTING ALGORITHMS
    public static void ManualSortingExamples()
    {
        Console.WriteLine("\n=== Manual Sorting Algorithms ===");

        // Bubble Sort
        int[] bubbleArray = { 64, 34, 25, 12, 22, 11, 90 };
        Console.WriteLine("Before Bubble Sort: " + string.Join(", ", bubbleArray));
        BubbleSort(bubbleArray);
        Console.WriteLine("After Bubble Sort: " + string.Join(", ", bubbleArray));

        // Quick Sort
        int[] quickArray = { 64, 34, 25, 12, 22, 11, 90 };
        Console.WriteLine("Before Quick Sort: " + string.Join(", ", quickArray));
        QuickSort(quickArray, 0, quickArray.Length - 1);
        Console.WriteLine("After Quick Sort: " + string.Join(", ", quickArray));
    }

    // Bubble Sort Implementation
    public static void BubbleSort(int[] arr)
    {
        int n = arr.Length;
        for (int i = 0; i < n - 1; i++)
        {
            for (int j = 0; j < n - i - 1; j++)
            {
                if (arr[j] > arr[j + 1])
                {
                    // Swap
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    // Quick Sort Implementation
    public static void QuickSort(int[] arr, int low, int high)
    {
        if (low < high)
        {
            int pi = Partition(arr, low, high);
            QuickSort(arr, low, pi - 1);
            QuickSort(arr, pi + 1, high);
        }
    }

    private static int Partition(int[] arr, int low, int high)
    {
        int pivot = arr[high];
        int i = (low - 1);

        for (int j = low; j < high; j++)
        {
            if (arr[j] < pivot)
            {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }

        int temp1 = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp1;

        return i + 1;
    }

    // 5. SORTING WITH TWO POINTERS (After Sorting)
    public static bool FindPairWithTwoPointers(int[] nums, int target)
    {
        // First, sort the array
        Array.Sort(nums);

        int left = 0;
        int right = nums.Length - 1;

        while (left < right)
        {
            int currentSum = nums[left] + nums[right];

            if (currentSum == target)
            {
                Console.WriteLine($"Found pair: {nums[left]} + {nums[right]} = {target}");
                return true;
            }
            else if (currentSum < target)
                left++;
            else
                right--;
        }

        return false;
    }

    // WRONG IMPLEMENTATION: Trying to use Two Pointers for Islands problem
    public static int CountIslandsWrongTwoPointers(int[,] grid)
    {
        Console.WriteLine("=== WRONG: Attempting Two Pointers for Islands ===");
        Console.WriteLine("This is fundamentally flawed because:");
        Console.WriteLine("1. Two Pointers needs linear, sequential data");
        Console.WriteLine("2. Islands problem requires 2D traversal");
        Console.WriteLine("3. Islands need DFS/BFS, not pointer movement");

        int rows = grid.GetLength(0);
        int cols = grid.GetLength(1);

        // This approach is completely wrong!
        int left = 0, right = cols - 1;
        int islands = 0;

        Console.WriteLine("\nAttempting flawed Two Pointers approach:");
        for (int row = 0; row < rows; row++)
        {
            left = 0;
            right = cols - 1;

            // This doesn't work because:
            // - We can't determine islands by just looking at edges
            // - Islands can be in the middle, connected diagonally, etc.
            // - Two pointers can't explore connected components

            while (left <= right)
            {
                if (grid[row, left] == 1)
                {
                    Console.WriteLine($"Found land at ({row}, {left}) - but can't determine if it's a new island!");
                    islands++; // This count will be completely wrong!
                }
                if (left != right && grid[row, right] == 1)
                {
                    Console.WriteLine($"Found land at ({row}, {right}) - but can't determine if it's a new island!");
                    islands++; // This count will be completely wrong!
                }
                left++;
                right--;
            }
        }

        Console.WriteLine($"Wrong result: {islands} (This is meaningless!)");
        return islands;
    }

    // CORRECT IMPLEMENTATION: Using DFS for Islands problem
    public static int CountIslandsCorrectDFS(int[,] grid)
    {
        Console.WriteLine("\n=== CORRECT: Using DFS for Islands ===");
        int rows = grid.GetLength(0);
        int cols = grid.GetLength(1);
        int islands = 0;
        bool[,] visited = new bool[rows, cols];

        for (int i = 0; i < rows; i++)
        {
            for (int j = 0; j < cols; j++)
            {
                if (grid[i, j] == 1 && !visited[i, j])
                {
                    islands++;
                    DFS(grid, visited, i, j, rows, cols);
                    Console.WriteLine($"Found island #{islands} starting at ({i}, {j})");
                }
            }
        }

        Console.WriteLine($"Correct result: {islands} islands");
        return islands;
    }

    private static void DFS(int[,] grid, bool[,] visited, int row, int col, int rows, int cols)
    {
        if (row < 0 || row >= rows || col < 0 || col >= cols ||
            visited[row, col] || grid[row, col] == 0)
            return;

        visited[row, col] = true;

        // Explore all 4 directions
        DFS(grid, visited, row + 1, col, rows, cols); // Down
        DFS(grid, visited, row - 1, col, rows, cols); // Up
        DFS(grid, visited, row, col + 1, rows, cols); // Right
        DFS(grid, visited, row, col - 1, rows, cols); // Left
    }

    static void Main()
    {
        Console.WriteLine("TWO POINTERS WITH UNSORTED ARRAYS");
        Console.WriteLine("=================================");

        AnalyzeUnsortedArrayApproaches();

        Console.WriteLine("\n" + new string('=', 60));
        Console.WriteLine("FIXED POINTER vs TRADITIONAL TWO POINTERS");
        Console.WriteLine(new string('=', 60));

        CompareFixedPointerWithUnsorted();
    }

    public static void AnalyzeUnsortedArrayApproaches()
    {
        Console.WriteLine("=== QUESTION: Can I use Two Pointers with Fixed Pointer on Unsorted Array? ===");
        Console.WriteLine("SHORT ANSWER: YES, but it's not efficient and not truly 'Two Pointers'");
        Console.WriteLine();

        int[] unsortedArray = { 64, 34, 25, 12, 22, 11, 90, 5 };
        int target = 46;

        Console.WriteLine($"Unsorted Array: [{string.Join(", ", unsortedArray)}]");
        Console.WriteLine($"Target Sum: {target}");
        Console.WriteLine();

        Console.WriteLine("=== APPROACH 1: Fixed Pointer (Works but Inefficient) ===");
        bool foundFixed = DemonstrateFixedPointerUnsorted(unsortedArray, target);

        Console.WriteLine("\n=== APPROACH 2: Traditional Two Pointers (Fails on Unsorted) ===");
        bool foundTraditional = DemonstrateTraditionalTwoPointersUnsorted(unsortedArray, target);

        Console.WriteLine("\n=== APPROACH 3: Hash Map (Optimal for Unsorted) ===");
        bool foundHashMap = FindPairWithHashMap(unsortedArray, target);
        Console.WriteLine($"Hash Map result: {foundHashMap}");

        Console.WriteLine("\n=== APPROACH 4: Sort First, Then Two Pointers ===");
        int[] sortedCopy = (int[])unsortedArray.Clone();
        Array.Sort(sortedCopy);
        Console.WriteLine($"Sorted Array: [{string.Join(", ", sortedCopy)}]");
        bool foundSorted = FindPairWithTwoPointers(sortedCopy, target);

        Console.WriteLine("\n=== SUMMARY ===");
        Console.WriteLine($"Fixed Pointer on Unsorted:     {foundFixed} (O(n²) time, O(1) space)");
        Console.WriteLine($"Traditional Two Pointers:      {foundTraditional} (Fails - wrong algorithm)");
        Console.WriteLine($"Hash Map:                       {foundHashMap} (O(n) time, O(n) space)");
        Console.WriteLine($"Sort + Two Pointers:           {foundSorted} (O(n log n) time, O(1) space)");
    }

    public static bool DemonstrateFixedPointerUnsorted(int[] array, int target)
    {
        Console.WriteLine("Using Fixed Pointer approach on UNSORTED array:");
        int operations = 0;

        for (int fixedIndex = 0; fixedIndex < array.Length - 1; fixedIndex++)
        {
            Console.WriteLine($"  Fixed at index {fixedIndex} (value {array[fixedIndex]}):");

            for (int moving = fixedIndex + 1; moving < array.Length; moving++)
            {
                operations++;
                int sum = array[fixedIndex] + array[moving];
                Console.WriteLine($"    Op {operations}: {array[fixedIndex]} + {array[moving]} = {sum}");

                if (sum == target)
                {
                    Console.WriteLine($"    ✓ FOUND: ({array[fixedIndex]}, {array[moving]})");
                    Console.WriteLine($"  Total operations: {operations}");
                    return true;
                }
            }
        }

        Console.WriteLine($"  No pair found. Total operations: {operations}");
        return false;
    }

    public static bool DemonstrateTraditionalTwoPointersUnsorted(int[] array, int target)
    {
        Console.WriteLine("Attempting Traditional Two Pointers on UNSORTED array:");
        Console.WriteLine("(This will likely fail because array is not sorted)");

        int left = 0, right = array.Length - 1;
        int operations = 0;

        while (left < right)
        {
            operations++;
            int sum = array[left] + array[right];
            Console.WriteLine($"  Op {operations}: array[{left}] + array[{right}] = {array[left]} + {array[right]} = {sum}");

            if (sum == target)
            {
                Console.WriteLine($"  ✓ Lucky find: ({array[left]}, {array[right]})");
                return true;
            }
            else if (sum < target)
            {
                Console.WriteLine($"    Sum {sum} < {target}, moving left pointer right");
                left++;
            }
            else
            {
                Console.WriteLine($"    Sum {sum} > {target}, moving right pointer left");
                right--;
            }

            if (operations > 10) // Prevent infinite output
            {
                Console.WriteLine("  ... (stopping demo, this approach is unreliable on unsorted data)");
                break;
            }
        }

        Console.WriteLine($"  Traditional Two Pointers failed. Operations: {operations}");
        return false;
    }

    public static void CompareFixedPointerWithUnsorted()
    {
        Console.WriteLine("=== DETAILED COMPARISON: Fixed Pointer vs Other Approaches ===");

        int[] testArray = { 15, 3, 9, 2, 8, 1, 7, 12 };
        int target = 10;

        Console.WriteLine($"Test Array: [{string.Join(", ", testArray)}]");
        Console.WriteLine($"Target: {target}");
        Console.WriteLine();

        // Test all approaches
        Console.WriteLine("1. FIXED POINTER APPROACH:");
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        bool result1 = TestFixedPointer(testArray, target);
        stopwatch.Stop();
        Console.WriteLine($"   Result: {result1}, Time: {stopwatch.ElapsedTicks} ticks");

        Console.WriteLine("\n2. HASH MAP APPROACH:");
        stopwatch.Restart();
        bool result2 = FindPairWithHashMap(testArray, target);
        stopwatch.Stop();
        Console.WriteLine($"   Result: {result2}, Time: {stopwatch.ElapsedTicks} ticks");

        Console.WriteLine("\n3. SORT + TWO POINTERS:");
        stopwatch.Restart();
        int[] sortedArray = (int[])testArray.Clone();
        Array.Sort(sortedArray);
        bool result3 = FindPairWithTwoPointers(sortedArray, target);
        stopwatch.Stop();
        Console.WriteLine($"   Result: {result3}, Time: {stopwatch.ElapsedTicks} ticks");

        Console.WriteLine("\n=== WHEN TO USE FIXED POINTER WITH UNSORTED ARRAYS ===");
        Console.WriteLine("✓ PROS:");
        Console.WriteLine("  - Works on unsorted arrays");
        Console.WriteLine("  - O(1) space complexity");
        Console.WriteLine("  - Simple to implement");
        Console.WriteLine("  - No need to sort first");

        Console.WriteLine("\n✗ CONS:");
        Console.WriteLine("  - O(n²) time complexity");
        Console.WriteLine("  - Not truly 'Two Pointers' technique");
        Console.WriteLine("  - Much slower than hash map for large arrays");
        Console.WriteLine("  - Brute force approach in disguise");

        Console.WriteLine("\n=== RECOMMENDATION ===");
        Console.WriteLine("For UNSORTED arrays:");
        Console.WriteLine("• Small arrays (n < 100): Fixed pointer is acceptable");
        Console.WriteLine("• Large arrays: Use Hash Map (O(n) time)");
        Console.WriteLine("• If space is critical: Sort first, then use Two Pointers");
        Console.WriteLine("• Fixed pointer is NOT the classic Two Pointers pattern");
    }

    private static bool TestFixedPointer(int[] array, int target)
    {
        for (int i = 0; i < array.Length - 1; i++)
        {
            for (int j = i + 1; j < array.Length; j++)
            {
                if (array[i] + array[j] == target)
                {
                    Console.WriteLine($"   Found: {array[i]} + {array[j]} = {target}");
                    return true;
                }
            }
        }
        return false;
    }

    // SOLUTION: Demonstrate how pointers move in typical Two Pointers approach
    public static void DemonstrateTwoPointersMovement()
    {
        Console.WriteLine("=== SELECTED ANSWER: 'They start at opposite ends and move towards each other' ===");

        int[] sortedArray = { 1, 3, 5, 7, 9, 11, 13, 15, 17, 19 };
        int target = 20;

        Console.WriteLine($"Array: [{string.Join(", ", sortedArray)}]");
        Console.WriteLine($"Target sum: {target}");
        Console.WriteLine($"Array indices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]");
        Console.WriteLine();

        // Demonstrate step-by-step movement
        int left = 0;
        int right = sortedArray.Length - 1;
        int step = 1;
        bool found = false;

        Console.WriteLine("STEP-BY-STEP POINTER MOVEMENT:");
        Console.WriteLine("==============================");

        while (left < right && !found)
        {
            int currentSum = sortedArray[left] + sortedArray[right];

            // Visual representation
            string visualization = CreateVisualization(sortedArray, left, right);

            Console.WriteLine($"Step {step}:");
            Console.WriteLine($"  {visualization}");
            Console.WriteLine($"  Left pointer:  index {left} → value {sortedArray[left]}");
            Console.WriteLine($"  Right pointer: index {right} → value {sortedArray[right]}");
            Console.WriteLine($"  Sum: {sortedArray[left]} + {sortedArray[right]} = {currentSum}");

            if (currentSum == target)
            {
                Console.WriteLine($"  ✓ FOUND! Target sum {target} achieved");
                found = true;
            }
            else if (currentSum < target)
            {
                Console.WriteLine($"  Sum {currentSum} < target {target} → Move LEFT pointer RIGHT");
                left++;
            }
            else
            {
                Console.WriteLine($"  Sum {currentSum} > target {target} → Move RIGHT pointer LEFT");
                right--;
            }

            Console.WriteLine();
            step++;
        }

        if (!found)
        {
            Console.WriteLine("No pair found with target sum.");
        }

        Console.WriteLine("=== KEY CHARACTERISTICS OF SELECTED ANSWER ===");
        Console.WriteLine("1. Pointers START at OPPOSITE ENDS (index 0 and n-1)");
        Console.WriteLine("2. Pointers MOVE TOWARDS EACH OTHER");
        Console.WriteLine("3. Left pointer moves RIGHT (index++)");
        Console.WriteLine("4. Right pointer moves LEFT (index--)");
        Console.WriteLine("5. They CONVERGE until they meet or cross");
        Console.WriteLine("6. This works because array is SORTED");
    }

    private static string CreateVisualization(int[] array, int left, int right)
    {
        string result = "  ";
        for (int i = 0; i < array.Length; i++)
        {
            if (i == left && i == right)
                result += "[LR]"; // Both pointers at same position
            else if (i == left)
                result += "[L]";
            else if (i == right)
                result += "[R]";
            else
                result += $" {array[i]} ";

            if (i < array.Length - 1)
                result += " ";
        }
        return result;
    }

    public static void CompareMovementPatterns()
    {
        Console.WriteLine("=== SELECTED vs INPUT COMPARISON ===");
        Console.WriteLine("Selected: 'They start at opposite ends and move towards each other'");
        Console.WriteLine("Input:    'One pointer is fixed while the other moves'");
        Console.WriteLine();

        int[] array = { 2, 4, 6, 8, 10, 12, 14, 16 };
        int target = 18;

        Console.WriteLine($"Test Array: [{string.Join(", ", array)}]");
        Console.WriteLine($"Target: {target}");
        Console.WriteLine();

        // Demonstrate CORRECT approach (selected answer)
        Console.WriteLine("=== CORRECT APPROACH: Opposite Ends Moving Towards Each Other ===");
        DemonstrateOppositeEndsApproach(array, target);

        Console.WriteLine("\n=== INCORRECT APPROACH: One Fixed, One Moving ===");
        DemonstrateFixedPointerApproach(array, target);

        Console.WriteLine("\n=== ANALYSIS ===");
        Console.WriteLine("✓ SELECTED ANSWER is the standard Two Pointers technique");
        Console.WriteLine("✗ INPUT ITEM describes a different, less efficient approach");
        Console.WriteLine("  - Fixed pointer approach requires O(n²) time");
        Console.WriteLine("  - Moving towards each other requires O(n) time");
        Console.WriteLine("  - The efficiency comes from the convergent movement");
    }

    private static void DemonstrateOppositeEndsApproach(int[] array, int target)
    {
        int left = 0, right = array.Length - 1;
        int operations = 0;

        Console.WriteLine("Starting: left=0, right=7");

        while (left < right)
        {
            operations++;
            int sum = array[left] + array[right];
            Console.WriteLine($"  Operation {operations}: array[{left}] + array[{right}] = {array[left]} + {array[right]} = {sum}");

            if (sum == target)
            {
                Console.WriteLine($"  ✓ Found pair: ({array[left]}, {array[right]})");
                break;
            }
            else if (sum < target)
            {
                left++;
                Console.WriteLine($"    Sum too small, move left pointer: left={left}");
            }
            else
            {
                right--;
                Console.WriteLine($"    Sum too large, move right pointer: right={right}");
            }
        }

        Console.WriteLine($"Total operations: {operations} (O(n) efficiency)");
    }

    private static void DemonstrateFixedPointerApproach(int[] array, int target)
    {
        Console.WriteLine("Simulating 'one fixed, one moving' approach:");
        int operations = 0;
        bool found = false;

        // Fix left pointer at each position, move right pointer
        for (int fixedIndex = 0; fixedIndex < array.Length - 1 && !found; fixedIndex++)
        {
            Console.WriteLine($"Fixed pointer at index {fixedIndex} (value {array[fixedIndex]}):");

            for (int moving = fixedIndex + 1; moving < array.Length; moving++)
            {
                operations++;
                int sum = array[fixedIndex] + array[moving];
                Console.WriteLine($"  Operation {operations}: array[{fixedIndex}] + array[{moving}] = {array[fixedIndex]} + {array[moving]} = {sum}");

                if (sum == target)
                {
                    Console.WriteLine($"  ✓ Found pair: ({array[fixedIndex]}, {array[moving]})");
                    found = true;
                    break;
                }
            }
        }

        Console.WriteLine($"Total operations: {operations} (O(n²) efficiency)");
        Console.WriteLine("This approach is much less efficient!");
    }

    public static void AnalyzeTwoPointersDrawbacks()
    {
        Console.WriteLine("\n=== SELECTED ANSWER vs INPUT ITEM ===");
        Console.WriteLine("Selected: 'Its applicability is limited to specific types of problems.'");
        Console.WriteLine("Input:    'It always requires extra space.'");

        Console.WriteLine("\n=== THE GAP ANALYSIS ===");

        // Demonstrate space complexity
        Console.WriteLine("\n1. SPACE COMPLEXITY ANALYSIS:");
        Console.WriteLine("   Two Pointers: O(1) extra space");
        Console.WriteLine("   Hash Map:     O(n) extra space");

        int[] testArray = { 1, 2, 3, 4, 5, 6, 7, 8, 9 };

        Console.WriteLine("\n   Two Pointers Implementation:");
        Console.WriteLine("   - Uses only 2 integer variables (left, right)");
        Console.WriteLine("   - No additional data structures needed");
        Console.WriteLine("   - Space complexity: O(1)");

        Console.WriteLine("\n   Hash Map Implementation:");
        Console.WriteLine("   - Creates HashSet to store seen elements");
        Console.WriteLine("   - Worst case: stores all n elements");
        Console.WriteLine("   - Space complexity: O(n)");

        Console.WriteLine("\n2. APPLICABILITY ANALYSIS:");
        Console.WriteLine("   Two Pointers works ONLY when:");
        Console.WriteLine("   ✓ Data is sorted (or can be sorted)");
        Console.WriteLine("   ✓ Linear traversal makes sense");
        Console.WriteLine("   ✓ Problem involves finding pairs/subarrays");
        Console.WriteLine("   ✓ Can make decisions about pointer movement");

        Console.WriteLine("\n   Two Pointers FAILS when:");
        Console.WriteLine("   ✗ Data is unsorted and sorting changes the problem");
        Console.WriteLine("   ✗ Need to track multiple elements (not just pairs)");
        Console.WriteLine("   ✗ Problem requires 2D/graph traversal");
        Console.WriteLine("   ✗ Need random access patterns");

        Console.WriteLine("\n=== THE FUNDAMENTAL GAP ===");
        Console.WriteLine("Selected Answer: CORRECT ✓");
        Console.WriteLine("- Limited applicability IS the main drawback");
        Console.WriteLine("- Two Pointers only works for specific problem types");
        Console.WriteLine("- Many problems require different approaches");

        Console.WriteLine("\nInput Item: INCORRECT ✗");
        Console.WriteLine("- 'Always requires extra space' is FALSE");
        Console.WriteLine("- Two Pointers actually uses O(1) space");
        Console.WriteLine("- This is actually an ADVANTAGE, not a drawback");

        Console.WriteLine("\n=== PROOF: Space Efficiency ===");
        DemonstrateSpaceEfficiency(testArray, 10);

        Console.WriteLine("\n=== CONCLUSION ===");
        Console.WriteLine("The gap is that the input item states the OPPOSITE of reality:");
        Console.WriteLine("• Two Pointers is SPACE-EFFICIENT (O(1) space)");
        Console.WriteLine("• The real drawback is LIMITED APPLICABILITY");
        Console.WriteLine("• Your selected answer correctly identifies the actual limitation");
    }

    public static void DemonstrateSpaceEfficiency(int[] nums, int target)
    {
        Console.WriteLine($"\nFinding pair with sum {target} in array of {nums.Length} elements:");

        // Two Pointers - O(1) space
        Console.WriteLine("\nTwo Pointers approach:");
        Console.WriteLine("Memory used: 2 integers (left=0, right=8) = O(1) space");

        int left = 0, right = nums.Length - 1;
        bool foundTwoPointers = false;

        while (left < right)
        {
            int sum = nums[left] + nums[right];
            if (sum == target)
            {
                Console.WriteLine($"Found: {nums[left]} + {nums[right]} = {target}");
                foundTwoPointers = true;
                break;
            }
            else if (sum < target) left++;
            else right--;
        }

        // Hash Map - O(n) space
        Console.WriteLine("\nHash Map approach:");
        HashSet<int> seen = new HashSet<int>();
        bool foundHashMap = false;

        foreach (int num in nums)
        {
            int complement = target - num;
            if (seen.Contains(complement))
            {
                Console.WriteLine($"Found: {complement} + {num} = {target}");
                foundHashMap = true;
                break;
            }
            seen.Add(num);
        }

        Console.WriteLine($"Memory used: HashSet with {seen.Count} elements = O(n) space");

        Console.WriteLine($"\nResults: Two Pointers={foundTwoPointers}, Hash Map={foundHashMap}");
        Console.WriteLine("Space efficiency: Two Pointers wins with O(1) vs O(n)");
    }
}