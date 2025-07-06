using System;
using System.Collections.Generic;
using System.Linq;

namespace CodingPatterns
{
    /// <summary>
    /// Comprehensive Dynamic Programming Pattern Implementation
    /// Educational focus: Memoization, tabulation, optimal substructure
    /// </summary>
    public class DynamicProgrammingPatternCS
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("💎 Dynamic Programming Pattern - C# Implementation");
            Console.WriteLine("=" * 50);
            
            var demo = new DynamicProgrammingPatternCS();
            demo.RunAllDemonstrations();
        }

        public void RunAllDemonstrations()
        {
            Console.WriteLine("\n📚 EDUCATIONAL OVERVIEW:");
            Console.WriteLine("Dynamic Programming: Solve complex problems by breaking into subproblems");
            Console.WriteLine("Key principles: Optimal substructure + Overlapping subproblems");
            Console.WriteLine("Two approaches: Top-down (Memoization) vs Bottom-up (Tabulation)");
            
            // Classic DP Problems
            DemonstrateFibonacci();
            DemonstrateClimbingStairs();
            DemonstrateHouseRobber();
            DemonstrateCoinChange();
            DemonstrateLongestIncreasingSubsequence();
            DemonstrateKnapsack();
        }

        #region Problem 1: Fibonacci Sequence
        /// <summary>
        /// Calculate nth Fibonacci number using different DP approaches
        /// Pseudocode (Bottom-up):
        /// 1. Initialize dp[0] = 0, dp[1] = 1
        /// 2. For i from 2 to n: dp[i] = dp[i-1] + dp[i-2]
        /// 3. Return dp[n]
        /// </summary>
        public void DemonstrateFibonacci()
        {
            Console.WriteLine("\n🔍 Problem 1: Fibonacci Sequence");
            int n = 10;
            
            Console.WriteLine($"Calculate F({n}) using different approaches:");
            
            // Naive recursive (exponential time)
            var watch = System.Diagnostics.Stopwatch.StartNew();
            long fibRecursive = FibonacciRecursive(n);
            watch.Stop();
            Console.WriteLine($"Recursive: F({n}) = {fibRecursive} (Time: {watch.ElapsedMilliseconds}ms)");
            
            // Memoization (top-down DP)
            watch.Restart();
            var memo = new Dictionary<int, long>();
            long fibMemo = FibonacciMemoization(n, memo);
            watch.Stop();
            Console.WriteLine($"Memoization: F({n}) = {fibMemo} (Time: {watch.ElapsedMilliseconds}ms)");
            
            // Tabulation (bottom-up DP)
            watch.Restart();
            long fibTabulation = FibonacciTabulation(n);
            watch.Stop();
            Console.WriteLine($"Tabulation: F({n}) = {fibTabulation} (Time: {watch.ElapsedMilliseconds}ms)");
            
            // Space optimized
            watch.Restart();
            long fibOptimized = FibonacciOptimized(n);
            watch.Stop();
            Console.WriteLine($"Optimized: F({n}) = {fibOptimized} (Time: {watch.ElapsedMilliseconds}ms)");
        }

        // O(2^n) time - exponential
        public long FibonacciRecursive(int n)
        {
            if (n <= 1) return n;
            return FibonacciRecursive(n - 1) + FibonacciRecursive(n - 2);
        }

        // O(n) time, O(n) space - memoization
        public long FibonacciMemoization(int n, Dictionary<int, long> memo)
        {
            if (n <= 1) return n;
            if (memo.ContainsKey(n)) return memo[n];
            
            memo[n] = FibonacciMemoization(n - 1, memo) + FibonacciMemoization(n - 2, memo);
            return memo[n];
        }

        // O(n) time, O(n) space - tabulation
        public long FibonacciTabulation(int n)
        {
            if (n <= 1) return n;
            
            long[] dp = new long[n + 1];
            dp[0] = 0;
            dp[1] = 1;
            
            for (int i = 2; i <= n; i++)
            {
                dp[i] = dp[i - 1] + dp[i - 2];
            }
            
            return dp[n];
        }

        // O(n) time, O(1) space - space optimized
        public long FibonacciOptimized(int n)
        {
            if (n <= 1) return n;
            
            long prev2 = 0, prev1 = 1;
            
            for (int i = 2; i <= n; i++)
            {
                long current = prev1 + prev2;
                prev2 = prev1;
                prev1 = current;
            }
            
            return prev1;
        }
        #endregion

        #region Problem 2: Climbing Stairs
        /// <summary>
        /// Count ways to climb n stairs (1 or 2 steps at a time)
        /// Pseudocode:
        /// 1. Base cases: ways[0] = 1, ways[1] = 1
        /// 2. For each step i: ways[i] = ways[i-1] + ways[i-2]
        /// 3. Return ways[n]
        /// </summary>
        public void DemonstrateClimbingStairs()
        {
            Console.WriteLine("\n🔍 Problem 2: Climbing Stairs");
            int n = 5;
            
            Console.WriteLine($"Number of stairs: {n}");
            Console.WriteLine("Can take 1 or 2 steps at a time");
            
            int ways = ClimbStairs(n);
            Console.WriteLine($"✅ Number of ways to climb: {ways}");
            
            Console.WriteLine("\n💡 This is essentially Fibonacci sequence!");
            Console.WriteLine("ways(n) = ways(n-1) + ways(n-2)");
        }

        public int ClimbStairs(int n)
        {
            if (n <= 1) return 1;
            
            int[] dp = new int[n + 1];
            dp[0] = 1; // One way to stay at ground
            dp[1] = 1; // One way to reach first step
            
            for (int i = 2; i <= n; i++)
            {
                dp[i] = dp[i - 1] + dp[i - 2];
            }
            
            return dp[n];
        }
        #endregion

        #region Problem 3: House Robber
        /// <summary>
        /// Maximum money that can be robbed without robbing adjacent houses
        /// Pseudocode:
        /// 1. For each house i: decide to rob or not rob
        /// 2. If rob: money = nums[i] + dp[i-2] (can't rob adjacent)
        /// 3. If not rob: money = dp[i-1] (take previous max)
        /// 4. dp[i] = max(rob, not_rob)
        /// </summary>
        public void DemonstrateHouseRobber()
        {
            Console.WriteLine("\n🔍 Problem 3: House Robber");
            int[] houses = { 2, 7, 9, 3, 1 };
            
            Console.WriteLine($"House values: [{string.Join(", ", houses)}]");
            Console.WriteLine("Cannot rob adjacent houses");
            
            int maxMoney = Rob(houses);
            Console.WriteLine($"✅ Maximum money: {maxMoney}");
            
            // Show the decision process
            ShowRobberDecisions(houses);
        }

        public int Rob(int[] nums)
        {
            if (nums.Length == 0) return 0;
            if (nums.Length == 1) return nums[0];
            
            int[] dp = new int[nums.Length];
            dp[0] = nums[0];
            dp[1] = Math.Max(nums[0], nums[1]);
            
            for (int i = 2; i < nums.Length; i++)
            {
                // Either rob current house + money from i-2, or don't rob (take i-1)
                dp[i] = Math.Max(nums[i] + dp[i - 2], dp[i - 1]);
            }
            
            return dp[nums.Length - 1];
        }

        private void ShowRobberDecisions(int[] houses)
        {
            Console.WriteLine("\n📊 Decision process:");
            if (houses.Length == 0) return;
            
            int[] dp = new int[houses.Length];
            dp[0] = houses[0];
            Console.WriteLine($"House 0: Rob {houses[0]} → Total: {dp[0]}");
            
            if (houses.Length > 1)
            {
                dp[1] = Math.Max(houses[0], houses[1]);
                Console.WriteLine($"House 1: Max({houses[0]}, {houses[1]}) → Total: {dp[1]}");
            }
            
            for (int i = 2; i < houses.Length; i++)
            {
                int robCurrent = houses[i] + dp[i - 2];
                int skipCurrent = dp[i - 1];
                dp[i] = Math.Max(robCurrent, skipCurrent);
                
                Console.WriteLine($"House {i}: Max(rob {houses[i]}+{dp[i-2]}={robCurrent}, skip={skipCurrent}) → Total: {dp[i]}");
            }
        }
        #endregion

        #region Problem 4: Coin Change
        /// <summary>
        /// Minimum coins needed to make amount
        /// Pseudocode:
        /// 1. Initialize dp array with infinity, dp[0] = 0
        /// 2. For each amount from 1 to target:
        ///    - For each coin: if coin <= amount:
        ///      dp[amount] = min(dp[amount], dp[amount-coin] + 1)
        /// 3. Return dp[target] or -1 if impossible
        /// </summary>
        public void DemonstrateCoinChange()
        {
            Console.WriteLine("\n🔍 Problem 4: Coin Change");
            int[] coins = { 1, 3, 4 };
            int amount = 6;
            
            Console.WriteLine($"Coins: [{string.Join(", ", coins)}]");
            Console.WriteLine($"Target amount: {amount}");
            
            int minCoins = CoinChange(coins, amount);
            if (minCoins != -1)
            {
                Console.WriteLine($"✅ Minimum coins needed: {minCoins}");
            }
            else
            {
                Console.WriteLine("❌ Cannot make the amount with given coins");
            }
            
            // Show the DP table
            ShowCoinChangeTable(coins, amount);
        }

        public int CoinChange(int[] coins, int amount)
        {
            int[] dp = new int[amount + 1];
            Array.Fill(dp, amount + 1); // Initialize with impossible value
            dp[0] = 0; // Base case: 0 coins needed for amount 0
            
            for (int i = 1; i <= amount; i++)
            {
                foreach (int coin in coins)
                {
                    if (coin <= i)
                    {
                        dp[i] = Math.Min(dp[i], dp[i - coin] + 1);
                    }
                }
            }
            
            return dp[amount] > amount ? -1 : dp[amount];
        }

        private void ShowCoinChangeTable(int[] coins, int amount)
        {
            Console.WriteLine("\n📊 DP Table:");
            int[] dp = new int[amount + 1];
            Array.Fill(dp, amount + 1);
            dp[0] = 0;
            
            Console.Write("Amount: ");
            for (int i = 0; i <= amount; i++)
            {
                Console.Write($"{i,3}");
            }
            Console.WriteLine();
            
            for (int i = 1; i <= amount; i++)
            {
                foreach (int coin in coins)
                {
                    if (coin <= i)
                    {
                        dp[i] = Math.Min(dp[i], dp[i - coin] + 1);
                    }
                }
            }
            
            Console.Write("Coins:  ");
            for (int i = 0; i <= amount; i++)
            {
                Console.Write($"{(dp[i] > amount ? -1 : dp[i]),3}");
            }
            Console.WriteLine();
        }
        #endregion

        #region Problem 5: Longest Increasing Subsequence
        /// <summary>
        /// Find length of longest increasing subsequence
        /// Pseudocode:
        /// 1. Initialize dp[i] = 1 for all i (each element forms subsequence of length 1)
        /// 2. For each i from 1 to n:
        ///    - For each j from 0 to i-1:
        ///      if nums[j] < nums[i]: dp[i] = max(dp[i], dp[j] + 1)
        /// 3. Return max value in dp array
        /// </summary>
        public void DemonstrateLongestIncreasingSubsequence()
        {
            Console.WriteLine("\n🔍 Problem 5: Longest Increasing Subsequence");
            int[] nums = { 10, 9, 2, 5, 3, 7, 101, 18 };
            
            Console.WriteLine($"Array: [{string.Join(", ", nums)}]");
            
            int length = LengthOfLIS(nums);
            Console.WriteLine($"✅ Length of LIS: {length}");
            
            // Show one possible LIS
            var lis = FindLIS(nums);
            Console.WriteLine($"One possible LIS: [{string.Join(", ", lis)}]");
        }

        public int LengthOfLIS(int[] nums)
        {
            if (nums.Length == 0) return 0;
            
            int[] dp = new int[nums.Length];
            Array.Fill(dp, 1); // Each element forms a subsequence of length 1
            
            for (int i = 1; i < nums.Length; i++)
            {
                for (int j = 0; j < i; j++)
                {
                    if (nums[j] < nums[i])
                    {
                        dp[i] = Math.Max(dp[i], dp[j] + 1);
                    }
                }
            }
            
            return dp.Max();
        }

        private List<int> FindLIS(int[] nums)
        {
            if (nums.Length == 0) return new List<int>();
            
            int[] dp = new int[nums.Length];
            int[] parent = new int[nums.Length];
            Array.Fill(dp, 1);
            Array.Fill(parent, -1);
            
            int maxLength = 1;
            int maxIndex = 0;
            
            for (int i = 1; i < nums.Length; i++)
            {
                for (int j = 0; j < i; j++)
                {
                    if (nums[j] < nums[i] && dp[j] + 1 > dp[i])
                    {
                        dp[i] = dp[j] + 1;
                        parent[i] = j;
                    }
                }
                
                if (dp[i] > maxLength)
                {
                    maxLength = dp[i];
                    maxIndex = i;
                }
            }
            
            // Reconstruct LIS
            var lis = new List<int>();
            int current = maxIndex;
            while (current != -1)
            {
                lis.Add(nums[current]);
                current = parent[current];
            }
            
            lis.Reverse();
            return lis;
        }
        #endregion

        #region Problem 6: 0/1 Knapsack
        /// <summary>
        /// Maximum value that can be obtained with given weight capacity
        /// Pseudocode:
        /// 1. Create 2D DP table: dp[i][w] = max value with first i items and weight w
        /// 2. For each item i and weight w:
        ///    - If item weight > w: dp[i][w] = dp[i-1][w] (can't include)
        ///    - Else: dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])
        /// 3. Return dp[n][capacity]
        /// </summary>
        public void DemonstrateKnapsack()
        {
            Console.WriteLine("\n🔍 Problem 6: 0/1 Knapsack");
            int[] weights = { 1, 3, 4, 5 };
            int[] values = { 1, 4, 5, 7 };
            int capacity = 7;
            
            Console.WriteLine($"Weights: [{string.Join(", ", weights)}]");
            Console.WriteLine($"Values:  [{string.Join(", ", values)}]");
            Console.WriteLine($"Capacity: {capacity}");
            
            int maxValue = Knapsack(weights, values, capacity);
            Console.WriteLine($"✅ Maximum value: {maxValue}");
            
            // Show which items to include
            var selectedItems = FindKnapsackItems(weights, values, capacity);
            Console.WriteLine($"Selected items: [{string.Join(", ", selectedItems)}]");
        }

        public int Knapsack(int[] weights, int[] values, int capacity)
        {
            int n = weights.Length;
            int[,] dp = new int[n + 1, capacity + 1];
            
            for (int i = 1; i <= n; i++)
            {
                for (int w = 1; w <= capacity; w++)
                {
                    if (weights[i - 1] <= w)
                    {
                        // Can include item: max of (include, exclude)
                        dp[i, w] = Math.Max(
                            dp[i - 1, w], // Exclude item
                            dp[i - 1, w - weights[i - 1]] + values[i - 1] // Include item
                        );
                    }
                    else
                    {
                        // Cannot include item
                        dp[i, w] = dp[i - 1, w];
                    }
                }
            }
            
            return dp[n, capacity];
        }

        private List<int> FindKnapsackItems(int[] weights, int[] values, int capacity)
        {
            int n = weights.Length;
            int[,] dp = new int[n + 1, capacity + 1];
            
            // Fill DP table
            for (int i = 1; i <= n; i++)
            {
                for (int w = 1; w <= capacity; w++)
                {
                    if (weights[i - 1] <= w)
                    {
                        dp[i, w] = Math.Max(
                            dp[i - 1, w],
                            dp[i - 1, w - weights[i - 1]] + values[i - 1]
                        );
                    }
                    else
                    {
                        dp[i, w] = dp[i - 1, w];
                    }
                }
            }
            
            // Backtrack to find selected items
            var selectedItems = new List<int>();
            int i = n, w = capacity;
            
            while (i > 0 && w > 0)
            {
                if (dp[i, w] != dp[i - 1, w])
                {
                    selectedItems.Add(i - 1); // Item index
                    w -= weights[i - 1];
                }
                i--;
            }
            
            selectedItems.Reverse();
            return selectedItems;
        }
        #endregion
    }
}
