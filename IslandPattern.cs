using System;
using System.Collections.Generic;
using System.Linq;

public class IslandPattern
{
    // =================================================
    // DFS (Depth-First Search) Approach
    // =================================================

    /// <summary>
    /// Finds the maximum area of an island in a grid using DFS.
    /// It iterates through each cell of the grid. If a cell contains a '1',
    /// it triggers a DFS traversal to find all connected '1's, calculating the area of that island.
    /// </summary>
    /// <param name="grid">A 2D grid of 0s (water) and 1s (land).</param>
    /// <returns>The area of the largest island found.</returns>
    public int MaxAreaOfIslandDfs(int[][] grid)
    {
        if (grid == null || grid.Length == 0)
        {
            return 0;
        }

        int rows = grid.Length;
        int cols = grid[0].Length;
        int maxArea = 0;
        int islandCount = 0;

        // Create a copy of the grid to avoid modifying the original one passed to the method.
        int[][] gridCopy = new int[rows][];
        for(int i = 0; i < rows; i++)
        {
            gridCopy[i] = new int[cols];
            // Array.Copy is a built-in method that efficiently copies elements from one array to another
            // Parameters: source array, destination array, length to copy
            // This creates a deep copy of each row to prevent modifying the original grid
            Array.Copy(grid[i], gridCopy[i], cols);
        }


        for (int i = 0; i < rows; i++)
        {
            for (int j = 0; j < cols; j++)
            {
                // If we find a piece of land ('1'), it's the start of a new island.
                if (gridCopy[i][j] == 1)
                {
                    islandCount++;
                    int currentArea = GetIslandAreaDfs(gridCopy, i, j);
                    maxArea = Math.Max(maxArea, currentArea);
                }
            }
        }

        Console.WriteLine($"[DFS] Total number of islands found: {islandCount}");
        return maxArea;
    }

    /// <summary>
    /// A recursive helper function that performs DFS from a given cell (r, c).
    /// It calculates the area of the island connected to this cell.
    /// </summary>
    /// <param name="grid">The grid being traversed.</param>
    /// <param name="r">The current row.</param>
    /// <param name="c">The current column.</param>
    /// <returns>The area of the island.</returns>
    private int GetIslandAreaDfs(int[][] grid, int r, int c)
    {
        int rows = grid.Length;
        int cols = grid[0].Length;

        // Boundary checks: If we go out of bounds or hit water ('0'), we stop.
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] == 0)
        {
            return 0;
        }

        // Mark the current cell as visited by "sinking" it (changing its value to 0).
        // This is crucial to prevent infinite loops and recounting the same cell.
        grid[r][c] = 0;

        // The area of the current cell is 1.
        int area = 1;

        // Explore all 4 directions (up, down, left, right) recursively and add their areas.
        area += GetIslandAreaDfs(grid, r + 1, c); // Down
        area += GetIslandAreaDfs(grid, r - 1, c); // Up
        area += GetIslandAreaDfs(grid, r, c + 1); // Right
        area += GetIslandAreaDfs(grid, r, c - 1); // Left

        return area;
    }

    // =================================================
    // BFS (Breadth-First Search) Approach
    // =================================================

    /// <summary>
    /// Finds the maximum area of an island in a grid using BFS.
    /// It uses a queue to explore the island layer by layer.
    /// </summary>
    /// <param name="grid">A 2D grid of 0s (water) and 1s (land).</param>
    /// <returns>The area of the largest island found.</returns>
    public int MaxAreaOfIslandBfs(int[][] grid)
    {
        if (grid == null || grid.Length == 0)
        {
            return 0;
        }

        int rows = grid.Length;
        int cols = grid[0].Length;
        int maxArea = 0;
        int islandCount = 0;
        
        // Create a copy of the grid to avoid modifying the original one passed to the method.
        int[][] gridCopy = new int[rows][];
        for(int i = 0; i < rows; i++)
        {
            gridCopy[i] = new int[cols];
            Array.Copy(grid[i], gridCopy[i], cols);
        }

        for (int i = 0; i < rows; i++)
        {
            for (int j = 0; j < cols; j++)
            {
                if (gridCopy[i][j] == 1)
                {
                    islandCount++;
                    int currentArea = 0;
                    var queue = new Queue<(int, int)>();
                    
                    // Start BFS from the current land cell
                    queue.Enqueue((i, j));
                    gridCopy[i][j] = 0; // Mark as visited

                    while (queue.Count > 0)
                    {
                        var (r, c) = queue.Dequeue();
                        currentArea++;

                        // Define the 4 directions
                        int[] dr = { -1, 1, 0, 0 };
                        int[] dc = { 0, 0, -1, 1 };

                        for (int k = 0; k < 4; k++)
                        {
                            int nr = r + dr[k];
                            int nc = c + dc[k];

                            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && gridCopy[nr][nc] == 1)
                            {
                                queue.Enqueue((nr, nc));
                                gridCopy[nr][nc] = 0; // Mark as visited
                            }
                        }
                    }
                    maxArea = Math.Max(maxArea, currentArea);
                }
            }
        }
        Console.WriteLine($"[BFS] Total number of islands found: {islandCount}");
        return maxArea;
    }


    // =================================================
    // VISUALIZATION METHODS
    // =================================================

    /// <summary>
    /// Visualizes the original grid with water (0) and land (1)
    /// </summary>
    public void VisualizeOriginalGrid(int[][] grid)
    {
        Console.WriteLine("ORIGINAL GRID:");
        Console.WriteLine("==============");
        Console.WriteLine("Legend: 🌊 = Water (0), 🏝️ = Land (1)");
        Console.WriteLine();

        for (int i = 0; i < grid.Length; i++)
        {
            Console.Write($"Row {i:D2}: ");
            for (int j = 0; j < grid[i].Length; j++)
            {
                Console.Write(grid[i][j] == 0 ? "🌊 " : "🏝️ ");
            }
            Console.WriteLine();
        }
        Console.WriteLine();
    }

    /// <summary>
    /// Finds and visualizes all islands with different colors/symbols
    /// </summary>
    public void VisualizeIslandsWithColors(int[][] grid)
    {
        if (grid == null || grid.Length == 0) return;

        int rows = grid.Length;
        int cols = grid[0].Length;

        // Create a grid to track island IDs
        int[,] islandGrid = new int[rows, cols];
        int islandId = 1;
        List<IslandInfo> islands = new List<IslandInfo>();

        // Create a copy to work with
        int[][] gridCopy = new int[rows][];
        for(int i = 0; i < rows; i++)
        {
            gridCopy[i] = new int[cols];
            Array.Copy(grid[i], gridCopy[i], cols);
        }

        Console.WriteLine("ISLANDS VISUALIZATION:");
        Console.WriteLine("======================");

        // Find all islands and assign unique IDs
        for (int i = 0; i < rows; i++)
        {
            for (int j = 0; j < cols; j++)
            {
                if (gridCopy[i][j] == 1)
                {
                    var islandCells = new List<(int, int)>();
                    int area = MarkIslandWithId(gridCopy, islandGrid, i, j, islandId, islandCells);

                    islands.Add(new IslandInfo
                    {
                        Id = islandId,
                        Area = area,
                        StartRow = i,
                        StartCol = j,
                        Cells = islandCells
                    });

                    Console.WriteLine($"🏝️ Island #{islandId}: Area = {area}, Starting at ({i}, {j})");
                    islandId++;
                }
            }
        }

        Console.WriteLine($"\nTotal Islands Found: {islands.Count}");
        Console.WriteLine($"Largest Island: #{islands.OrderByDescending(x => x.Area).First().Id} with area {islands.Max(x => x.Area)}");
        Console.WriteLine();

        // Display the colored grid
        DisplayColoredGrid(islandGrid, islands);

        // Display detailed island information
        DisplayIslandDetails(islands);
    }

    /// <summary>
    /// Marks an island with a unique ID and collects all its cells
    /// </summary>
    private int MarkIslandWithId(int[][] grid, int[,] islandGrid, int r, int c, int islandId, List<(int, int)> cells)
    {
        int rows = grid.Length;
        int cols = grid[0].Length;

        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] == 0)
            return 0;

        grid[r][c] = 0; // Mark as visited
        islandGrid[r, c] = islandId; // Assign island ID
        cells.Add((r, c)); // Track this cell

        int area = 1;
        area += MarkIslandWithId(grid, islandGrid, r + 1, c, islandId, cells); // Down
        area += MarkIslandWithId(grid, islandGrid, r - 1, c, islandId, cells); // Up
        area += MarkIslandWithId(grid, islandGrid, r, c + 1, islandId, cells); // Right
        area += MarkIslandWithId(grid, islandGrid, r, c - 1, islandId, cells); // Left

        return area;
    }

    /// <summary>
    /// Displays the grid with different symbols for each island
    /// </summary>
    private void DisplayColoredGrid(int[,] islandGrid, List<IslandInfo> islands)
    {
        string[] islandSymbols = { "🌊", "🟥", "🟩", "🟦", "🟨", "🟪", "🟫", "⬜", "🟧", "⬛" };

        Console.WriteLine("COLORED ISLAND GRID:");
        Console.WriteLine("Legend: 🌊 = Water");

        for (int i = 1; i <= Math.Min(islands.Count, islandSymbols.Length - 1); i++)
        {
            Console.WriteLine($"        {islandSymbols[i]} = Island #{i}");
        }
        Console.WriteLine();

        for (int i = 0; i < islandGrid.GetLength(0); i++)
        {
            Console.Write($"Row {i:D2}: ");
            for (int j = 0; j < islandGrid.GetLength(1); j++)
            {
                int islandId = islandGrid[i, j];
                if (islandId == 0)
                {
                    Console.Write("🌊 ");
                }
                else if (islandId < islandSymbols.Length)
                {
                    Console.Write($"{islandSymbols[islandId]} ");
                }
                else
                {
                    Console.Write("🏝️ "); // Fallback for too many islands
                }
            }
            Console.WriteLine();
        }
        Console.WriteLine();
    }

    /// <summary>
    /// Displays detailed information about each island
    /// </summary>
    private void DisplayIslandDetails(List<IslandInfo> islands)
    {
        Console.WriteLine("DETAILED ISLAND INFORMATION:");
        Console.WriteLine("=============================");

        foreach (var island in islands.OrderByDescending(x => x.Area))
        {
            Console.WriteLine($"🏝️ Island #{island.Id}:");
            Console.WriteLine($"   📏 Area: {island.Area} cells");
            Console.WriteLine($"   📍 Starting position: ({island.StartRow}, {island.StartCol})");
            Console.WriteLine($"   🗺️ All coordinates: {string.Join(", ", island.Cells.Select(c => $"({c.Item1},{c.Item2})"))}");
            Console.WriteLine();
        }
    }

    /// <summary>
    /// Helper class to store island information
    /// </summary>
    private class IslandInfo
    {
        public int Id { get; set; }
        public int Area { get; set; }
        public int StartRow { get; set; }
        public int StartCol { get; set; }
        public List<(int, int)> Cells { get; set; } = new List<(int, int)>();
    }

    // =================================================
    // ALGORITHM COMPARISON DEMONSTRATION
    // =================================================

    /// <summary>
    /// Demonstrates why BFS and DFS work for Island pattern while Ternary Search fails
    /// </summary>
    public void DemonstrateAlgorithmComparison()
    {
        Console.WriteLine("=== SELECTED ANSWER: BFS or DFS for Island Pattern ===");
        Console.WriteLine("=======================================================");

        int[][] testGrid = new int[][]
        {
            new int[] {1, 1, 0, 0, 0},
            new int[] {1, 1, 0, 0, 0},
            new int[] {0, 0, 1, 0, 0},
            new int[] {0, 0, 0, 1, 1}
        };

        Console.WriteLine("Test Grid:");
        DisplaySimpleGrid(testGrid);
        Console.WriteLine();

        // Demonstrate DFS approach
        Console.WriteLine("✅ APPROACH 1: DEPTH-FIRST SEARCH (DFS)");
        Console.WriteLine("========================================");
        DemonstrateDFSSteps(testGrid);

        Console.WriteLine("\n✅ APPROACH 2: BREADTH-FIRST SEARCH (BFS)");
        Console.WriteLine("==========================================");
        DemonstrateBFSSteps(testGrid);

        Console.WriteLine("\n❌ APPROACH 3: TERNARY SEARCH (Why it fails)");
        Console.WriteLine("==============================================");
        DemonstrateTernarySearchFailure(testGrid);

        Console.WriteLine("\n=== ALGORITHM COMPARISON SUMMARY ===");
        CompareAlgorithmCharacteristics();
    }

    private void DisplaySimpleGrid(int[][] grid)
    {
        for (int i = 0; i < grid.Length; i++)
        {
            Console.Write($"Row {i}: ");
            for (int j = 0; j < grid[i].Length; j++)
            {
                Console.Write(grid[i][j] == 0 ? "🌊 " : "🏝️ ");
            }
            Console.WriteLine();
        }
    }

    private void DemonstrateDFSSteps(int[][] grid)
    {
        Console.WriteLine("DFS explores islands by going DEEP into each connected component:");
        Console.WriteLine();

        int[][] gridCopy = CopyGrid(grid);
        int islandCount = 0;
        List<string> steps = new List<string>();

        for (int i = 0; i < gridCopy.Length; i++)
        {
            for (int j = 0; j < gridCopy[i].Length; j++)
            {
                if (gridCopy[i][j] == 1)
                {
                    islandCount++;
                    Console.WriteLine($"🔍 Found new island #{islandCount} starting at ({i}, {j})");

                    var visitedCells = new List<(int, int)>();
                    int area = DFSWithTracking(gridCopy, i, j, visitedCells, 1);

                    Console.WriteLine($"   📍 DFS traversal path: {string.Join(" → ", visitedCells.Select(c => $"({c.Item1},{c.Item2})"))}");
                    Console.WriteLine($"   📏 Island area: {area} cells");
                    Console.WriteLine();
                }
            }
        }

        Console.WriteLine($"✅ DFS Result: Found {islandCount} islands total");
        Console.WriteLine("🎯 DFS Characteristics:");
        Console.WriteLine("   • Explores each connected component completely");
        Console.WriteLine("   • Uses recursion (or stack) to go deep");
        Console.WriteLine("   • Marks visited cells to avoid cycles");
        Console.WriteLine("   • Perfect for finding connected components");
    }

    private void DemonstrateBFSSteps(int[][] grid)
    {
        Console.WriteLine("BFS explores islands by expanding LAYER BY LAYER:");
        Console.WriteLine();

        int[][] gridCopy = CopyGrid(grid);
        int islandCount = 0;

        for (int i = 0; i < gridCopy.Length; i++)
        {
            for (int j = 0; j < gridCopy[i].Length; j++)
            {
                if (gridCopy[i][j] == 1)
                {
                    islandCount++;
                    Console.WriteLine($"🔍 Found new island #{islandCount} starting at ({i}, {j})");

                    var queue = new Queue<(int, int)>();
                    var visitedOrder = new List<(int, int)>();

                    queue.Enqueue((i, j));
                    gridCopy[i][j] = 0;
                    visitedOrder.Add((i, j));
                    int area = 0;

                    while (queue.Count > 0)
                    {
                        var (r, c) = queue.Dequeue();
                        area++;

                        // Check all 4 directions
                        int[] dr = { -1, 1, 0, 0 };
                        int[] dc = { 0, 0, -1, 1 };

                        for (int k = 0; k < 4; k++)
                        {
                            int nr = r + dr[k];
                            int nc = c + dc[k];

                            if (nr >= 0 && nr < gridCopy.Length && nc >= 0 && nc < gridCopy[nr].Length && gridCopy[nr][nc] == 1)
                            {
                                queue.Enqueue((nr, nc));
                                gridCopy[nr][nc] = 0;
                                visitedOrder.Add((nr, nc));
                            }
                        }
                    }

                    Console.WriteLine($"   📍 BFS traversal path: {string.Join(" → ", visitedOrder.Select(c => $"({c.Item1},{c.Item2})"))}");
                    Console.WriteLine($"   📏 Island area: {area} cells");
                    Console.WriteLine();
                }
            }
        }

        Console.WriteLine($"✅ BFS Result: Found {islandCount} islands total");
        Console.WriteLine("🎯 BFS Characteristics:");
        Console.WriteLine("   • Explores neighbors level by level");
        Console.WriteLine("   • Uses queue for layer-by-layer expansion");
        Console.WriteLine("   • Marks visited cells to avoid cycles");
        Console.WriteLine("   • Also perfect for finding connected components");
    }

    private void DemonstrateTernarySearchFailure(int[][] grid)
    {
        Console.WriteLine("Ternary Search attempts to find target by dividing search space into thirds:");
        Console.WriteLine();

        Console.WriteLine("❌ WHY TERNARY SEARCH FAILS FOR ISLANDS:");
        Console.WriteLine();

        Console.WriteLine("1. 🎯 PURPOSE MISMATCH:");
        Console.WriteLine("   • Ternary Search: Find specific VALUE in sorted data");
        Console.WriteLine("   • Island Pattern: Find CONNECTED COMPONENTS in 2D grid");
        Console.WriteLine();

        Console.WriteLine("2. 📊 DATA STRUCTURE MISMATCH:");
        Console.WriteLine("   • Ternary Search: Requires SORTED 1D array");
        Console.WriteLine("   • Island Pattern: Works on UNSORTED 2D grid");
        Console.WriteLine();

        Console.WriteLine("3. 🔍 SEARCH STRATEGY MISMATCH:");
        Console.WriteLine("   • Ternary Search: Eliminates 2/3 of search space each iteration");
        Console.WriteLine("   • Island Pattern: Must visit ALL connected cells");
        Console.WriteLine();

        // Attempt to show why ternary search doesn't work
        Console.WriteLine("4. 🧪 DEMONSTRATION OF FAILURE:");
        Console.WriteLine("   Attempting to apply ternary search logic to grid...");
        Console.WriteLine();

        int[] flattenedGrid = grid.SelectMany(row => row).ToArray();
        Console.WriteLine($"   Flattened grid: [{string.Join(", ", flattenedGrid)}]");
        Console.WriteLine("   Even if we flatten the grid, ternary search can only find:");
        Console.WriteLine("   • Whether value 1 exists (yes/no)");
        Console.WriteLine("   • Position of first/last occurrence");
        Console.WriteLine("   But it CANNOT determine:");
        Console.WriteLine("   • Which 1's are connected to each other");
        Console.WriteLine("   • How many separate islands exist");
        Console.WriteLine("   • The area of each island");
        Console.WriteLine();

        Console.WriteLine("❌ CONCLUSION: Ternary Search is fundamentally incompatible with Island pattern");
        Console.WriteLine();

        // Now show where Ternary Search IS applicable
        Console.WriteLine("✅ BUT... Let's see where TERNARY SEARCH IS APPLICABLE:");
        Console.WriteLine("========================================================");
        DemonstrateProperTernarySearchUsage();
    }

    /// <summary>
    /// Demonstrates proper use cases for Ternary Search
    /// </summary>
    private void DemonstrateProperTernarySearchUsage()
    {
        Console.WriteLine("🎯 TERNARY SEARCH: Proper Applications");
        Console.WriteLine("======================================");
        Console.WriteLine();

        // Use Case 1: Finding element in sorted array
        Console.WriteLine("✅ USE CASE 1: Finding Element in Sorted Array");
        Console.WriteLine("-----------------------------------------------");
        int[] sortedArray = { 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25 };
        int target = 15;

        Console.WriteLine($"Sorted Array: [{string.Join(", ", sortedArray)}]");
        Console.WriteLine($"Target: {target}");
        Console.WriteLine();

        int position = TernarySearch(sortedArray, target, 0, sortedArray.Length - 1);
        Console.WriteLine($"✅ Ternary Search Result: Found {target} at index {position}");
        Console.WriteLine();

        // Use Case 2: Finding maximum in unimodal function
        Console.WriteLine("✅ USE CASE 2: Finding Maximum in Unimodal Function");
        Console.WriteLine("---------------------------------------------------");
        Console.WriteLine("Function: f(x) = -(x-10)² + 100 (inverted parabola with peak at x=10)");

        double maxX = TernarySearchMaximum(0, 20, x => -(x - 10) * (x - 10) + 100);
        double maxValue = -(maxX - 10) * (maxX - 10) + 100;

        Console.WriteLine($"✅ Maximum found at x = {maxX:F3}, f(x) = {maxValue:F3}");
        Console.WriteLine();

        // Use Case 3: Optimization problem
        Console.WriteLine("✅ USE CASE 3: Optimization Problem");
        Console.WriteLine("-----------------------------------");
        Console.WriteLine("Problem: Find optimal speed to minimize travel time + fuel cost");
        Console.WriteLine("Cost function: time/speed + speed²/1000 (fuel increases quadratically)");

        double optimalSpeed = TernarySearchMinimum(1, 100, speed => 100.0/speed + speed*speed/1000.0);
        double minCost = 100.0/optimalSpeed + optimalSpeed*optimalSpeed/1000.0;

        Console.WriteLine($"✅ Optimal speed: {optimalSpeed:F2} units");
        Console.WriteLine($"✅ Minimum cost: {minCost:F3} units");
        Console.WriteLine();

        Console.WriteLine("🎯 TERNARY SEARCH CHARACTERISTICS:");
        Console.WriteLine("• Works on SORTED arrays or UNIMODAL functions");
        Console.WriteLine("• Eliminates 2/3 of search space each iteration");
        Console.WriteLine("• Time complexity: O(log₃ n)");
        Console.WriteLine("• Perfect for optimization problems");
        Console.WriteLine("• Cannot handle connectivity or graph problems");
    }

    /// <summary>
    /// Ternary Search implementation for finding element in sorted array
    /// </summary>
    private int TernarySearch(int[] arr, int target, int left, int right)
    {
        Console.WriteLine($"   Searching range [{left}, {right}]");

        if (left > right)
        {
            Console.WriteLine("   ❌ Target not found");
            return -1;
        }

        // Divide into three parts
        int mid1 = left + (right - left) / 3;
        int mid2 = right - (right - left) / 3;

        Console.WriteLine($"   Checking positions: mid1={mid1} (value={arr[mid1]}), mid2={mid2} (value={arr[mid2]})");

        if (arr[mid1] == target)
        {
            Console.WriteLine($"   ✅ Found at mid1={mid1}");
            return mid1;
        }
        if (arr[mid2] == target)
        {
            Console.WriteLine($"   ✅ Found at mid2={mid2}");
            return mid2;
        }

        // Eliminate 2/3 of search space
        if (target < arr[mid1])
        {
            Console.WriteLine($"   Target < {arr[mid1]}, searching left third");
            return TernarySearch(arr, target, left, mid1 - 1);
        }
        else if (target > arr[mid2])
        {
            Console.WriteLine($"   Target > {arr[mid2]}, searching right third");
            return TernarySearch(arr, target, mid2 + 1, right);
        }
        else
        {
            Console.WriteLine($"   {arr[mid1]} < Target < {arr[mid2]}, searching middle third");
            return TernarySearch(arr, target, mid1 + 1, mid2 - 1);
        }
    }

    /// <summary>
    /// Ternary Search for finding maximum of unimodal function
    /// </summary>
    private double TernarySearchMaximum(double left, double right, Func<double, double> function)
    {
        const double epsilon = 1e-6;
        int iterations = 0;

        while (right - left > epsilon && iterations < 100)
        {
            iterations++;
            double mid1 = left + (right - left) / 3.0;
            double mid2 = right - (right - left) / 3.0;

            if (iterations <= 5) // Show first few iterations
            {
                Console.WriteLine($"   Iteration {iterations}: [{left:F3}, {right:F3}] → mid1={mid1:F3}, mid2={mid2:F3}");
                Console.WriteLine($"   f(mid1)={function(mid1):F3}, f(mid2)={function(mid2):F3}");
            }

            if (function(mid1) < function(mid2))
            {
                left = mid1;
            }
            else
            {
                right = mid2;
            }
        }

        Console.WriteLine($"   Converged after {iterations} iterations");
        return (left + right) / 2.0;
    }

    /// <summary>
    /// Ternary Search for finding minimum of unimodal function
    /// </summary>
    private double TernarySearchMinimum(double left, double right, Func<double, double> function)
    {
        const double epsilon = 1e-6;
        int iterations = 0;

        while (right - left > epsilon && iterations < 100)
        {
            iterations++;
            double mid1 = left + (right - left) / 3.0;
            double mid2 = right - (right - left) / 3.0;

            if (iterations <= 3) // Show first few iterations
            {
                Console.WriteLine($"   Iteration {iterations}: speed range [{left:F2}, {right:F2}]");
                Console.WriteLine($"   Testing speeds: {mid1:F2} (cost={function(mid1):F3}), {mid2:F2} (cost={function(mid2):F3})");
            }

            if (function(mid1) > function(mid2))
            {
                left = mid1;
            }
            else
            {
                right = mid2;
            }
        }

        Console.WriteLine($"   Optimization completed after {iterations} iterations");
        return (left + right) / 2.0;
    }

    private void CompareAlgorithmCharacteristics()
    {
        Console.WriteLine("ALGORITHM COMPARISON TABLE:");
        Console.WriteLine("===========================");
        Console.WriteLine();

        Console.WriteLine("| Algorithm      | Island Pattern | Time Complexity | Space Complexity | Connectivity |");
        Console.WriteLine("|----------------|----------------|-----------------|------------------|--------------|");
        Console.WriteLine("| DFS            | ✅ Perfect     | O(m×n)          | O(m×n)          | ✅ Yes       |");
        Console.WriteLine("| BFS            | ✅ Perfect     | O(m×n)          | O(m×n)          | ✅ Yes       |");
        Console.WriteLine("| Ternary Search | ❌ Incompatible| O(log n)        | O(1)            | ❌ No        |");
        Console.WriteLine();

        Console.WriteLine("🎯 WHY DFS/BFS ARE CORRECT:");
        Console.WriteLine("• Both can traverse 2D grids");
        Console.WriteLine("• Both can track visited cells");
        Console.WriteLine("• Both can explore connected components");
        Console.WriteLine("• Both can count island areas");
        Console.WriteLine();

        Console.WriteLine("❌ WHY TERNARY SEARCH IS WRONG:");
        Console.WriteLine("• Designed for sorted 1D arrays");
        Console.WriteLine("• Cannot handle 2D connectivity");
        Console.WriteLine("• Cannot track visited cells");
        Console.WriteLine("• Cannot explore connected components");
    }

    private int[][] CopyGrid(int[][] original)
    {
        int[][] copy = new int[original.Length][];
        for (int i = 0; i < original.Length; i++)
        {
            copy[i] = new int[original[i].Length];
            Array.Copy(original[i], copy[i], original[i].Length);
        }
        return copy;
    }

    private int DFSWithTracking(int[][] grid, int r, int c, List<(int, int)> visited, int depth)
    {
        if (r < 0 || r >= grid.Length || c < 0 || c >= grid[r].Length || grid[r][c] == 0)
            return 0;

        grid[r][c] = 0;
        visited.Add((r, c));

        int area = 1;
        area += DFSWithTracking(grid, r + 1, c, visited, depth + 1);
        area += DFSWithTracking(grid, r - 1, c, visited, depth + 1);
        area += DFSWithTracking(grid, r, c + 1, visited, depth + 1);
        area += DFSWithTracking(grid, r, c - 1, visited, depth + 1);

        return area;
    }

    public static void Main(string[] args)
    {
        IslandPattern solution = new IslandPattern();

        Console.WriteLine("🔍 ISLAND PATTERN: ALGORITHM COMPARISON DEMO 🔍");
        Console.WriteLine("================================================");
        Console.WriteLine();

        // Demonstrate why BFS/DFS work and Ternary Search doesn't
        solution.DemonstrateAlgorithmComparison();
    }
}