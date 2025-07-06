using System;
using System.Collections.Generic;
using System.Linq;

namespace CodingPatterns
{
    /// <summary>
    /// Comprehensive Greedy Algorithms Pattern Implementation
    /// Educational focus: Local optimal choices leading to global optimum
    /// </summary>
    public class GreedyAlgorithmsPatternCS
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("🎯 Greedy Algorithms Pattern - C# Implementation");
            Console.WriteLine("=" * 50);
            
            var demo = new GreedyAlgorithmsPatternCS();
            demo.RunAllDemonstrations();
        }

        public void RunAllDemonstrations()
        {
            Console.WriteLine("\n📚 EDUCATIONAL OVERVIEW:");
            Console.WriteLine("Greedy Algorithm: Make locally optimal choice at each step");
            Console.WriteLine("Key insight: Local optimum leads to global optimum");
            Console.WriteLine("Use when: Problem has greedy choice property and optimal substructure");
            
            // Classic Greedy Problems
            DemonstrateActivitySelection();
            DemonstrateFractionalKnapsack();
            DemonstrateHuffmanCoding();
            DemonstrateJobScheduling();
            DemonstrateMinimumCoins();
            DemonstrateGasStation();
        }

        #region Problem 1: Activity Selection
        /// <summary>
        /// Select maximum number of non-overlapping activities
        /// Pseudocode:
        /// 1. Sort activities by finish time
        /// 2. Select first activity
        /// 3. For each subsequent activity:
        ///    - If start time >= last selected finish time: select it
        /// 4. Return selected activities
        /// </summary>
        public void DemonstrateActivitySelection()
        {
            Console.WriteLine("\n🔍 Problem 1: Activity Selection");
            
            var activities = new List<(int start, int finish, string name)>
            {
                (1, 4, "A1"), (3, 5, "A2"), (0, 6, "A3"),
                (5, 7, "A4"), (3, 9, "A5"), (5, 9, "A6"),
                (6, 10, "A7"), (8, 11, "A8"), (8, 12, "A9"),
                (2, 14, "A10"), (12, 16, "A11")
            };
            
            Console.WriteLine("Activities (start, finish):");
            foreach (var activity in activities)
            {
                Console.WriteLine($"  {activity.name}: ({activity.start}, {activity.finish})");
            }
            
            var selected = ActivitySelection(activities);
            Console.WriteLine($"\n✅ Maximum activities selected: {selected.Count}");
            
            foreach (var activity in selected)
            {
                Console.WriteLine($"  {activity.name}: ({activity.start}, {activity.finish})");
            }
            
            Console.WriteLine("\n💡 Greedy choice: Always pick activity that finishes earliest");
        }

        public List<(int start, int finish, string name)> ActivitySelection(
            List<(int start, int finish, string name)> activities)
        {
            // Sort by finish time (greedy choice)
            var sorted = activities.OrderBy(a => a.finish).ToList();
            var selected = new List<(int start, int finish, string name)>();
            
            if (sorted.Count == 0) return selected;
            
            // Select first activity
            selected.Add(sorted[0]);
            int lastFinishTime = sorted[0].finish;
            
            // Select subsequent non-overlapping activities
            for (int i = 1; i < sorted.Count; i++)
            {
                if (sorted[i].start >= lastFinishTime)
                {
                    selected.Add(sorted[i]);
                    lastFinishTime = sorted[i].finish;
                }
            }
            
            return selected;
        }
        #endregion

        #region Problem 2: Fractional Knapsack
        /// <summary>
        /// Maximize value in knapsack where items can be fractionally taken
        /// Pseudocode:
        /// 1. Calculate value-to-weight ratio for each item
        /// 2. Sort items by ratio in descending order
        /// 3. For each item: take as much as possible (greedy choice)
        /// 4. Return maximum value achieved
        /// </summary>
        public void DemonstrateFractionalKnapsack()
        {
            Console.WriteLine("\n🔍 Problem 2: Fractional Knapsack");
            
            var items = new List<(double weight, double value, string name)>
            {
                (10, 60, "Item1"), (20, 100, "Item2"), (30, 120, "Item3")
            };
            double capacity = 50;
            
            Console.WriteLine($"Knapsack capacity: {capacity}");
            Console.WriteLine("Items (weight, value, ratio):");
            
            foreach (var item in items)
            {
                double ratio = item.value / item.weight;
                Console.WriteLine($"  {item.name}: ({item.weight}, {item.value}, {ratio:F2})");
            }
            
            double maxValue = FractionalKnapsack(items, capacity);
            Console.WriteLine($"\n✅ Maximum value: {maxValue:F2}");
        }

        public double FractionalKnapsack(List<(double weight, double value, string name)> items, double capacity)
        {
            // Sort by value-to-weight ratio (greedy choice)
            var sorted = items.OrderByDescending(item => item.value / item.weight).ToList();
            
            double totalValue = 0;
            double remainingCapacity = capacity;
            
            Console.WriteLine("\nGreedy selection process:");
            
            foreach (var item in sorted)
            {
                if (remainingCapacity >= item.weight)
                {
                    // Take entire item
                    totalValue += item.value;
                    remainingCapacity -= item.weight;
                    Console.WriteLine($"  Take full {item.name}: +{item.value} value");
                }
                else if (remainingCapacity > 0)
                {
                    // Take fraction of item
                    double fraction = remainingCapacity / item.weight;
                    double fractionalValue = item.value * fraction;
                    totalValue += fractionalValue;
                    Console.WriteLine($"  Take {fraction:F2} of {item.name}: +{fractionalValue:F2} value");
                    remainingCapacity = 0;
                    break;
                }
            }
            
            return totalValue;
        }
        #endregion

        #region Problem 3: Huffman Coding (Simplified)
        public class HuffmanNode
        {
            public char Character { get; set; }
            public int Frequency { get; set; }
            public HuffmanNode Left { get; set; }
            public HuffmanNode Right { get; set; }
            
            public bool IsLeaf => Left == null && Right == null;
        }

        /// <summary>
        /// Build Huffman tree for optimal character encoding
        /// Pseudocode:
        /// 1. Create leaf node for each character with its frequency
        /// 2. Build min-heap of all leaf nodes
        /// 3. While heap has more than one node:
        ///    - Extract two nodes with minimum frequency
        ///    - Create new internal node with these as children
        ///    - Add new node back to heap
        /// 4. Root of tree gives optimal encoding
        /// </summary>
        public void DemonstrateHuffmanCoding()
        {
            Console.WriteLine("\n🔍 Problem 3: Huffman Coding");
            
            var frequencies = new Dictionary<char, int>
            {
                {'a', 5}, {'b', 9}, {'c', 12}, {'d', 13}, {'e', 16}, {'f', 45}
            };
            
            Console.WriteLine("Character frequencies:");
            foreach (var kvp in frequencies)
            {
                Console.WriteLine($"  '{kvp.Key}': {kvp.Value}");
            }
            
            var root = BuildHuffmanTree(frequencies);
            var codes = new Dictionary<char, string>();
            GenerateHuffmanCodes(root, "", codes);
            
            Console.WriteLine("\n✅ Huffman codes:");
            foreach (var kvp in codes.OrderBy(x => x.Key))
            {
                Console.WriteLine($"  '{kvp.Key}': {kvp.Value}");
            }
            
            Console.WriteLine("\n💡 Greedy choice: Always merge two least frequent nodes");
        }

        public HuffmanNode BuildHuffmanTree(Dictionary<char, int> frequencies)
        {
            var heap = new SortedSet<HuffmanNode>(Comparer<HuffmanNode>.Create((x, y) => 
            {
                int freqCompare = x.Frequency.CompareTo(y.Frequency);
                return freqCompare != 0 ? freqCompare : x.Character.CompareTo(y.Character);
            }));
            
            // Create leaf nodes
            foreach (var kvp in frequencies)
            {
                heap.Add(new HuffmanNode { Character = kvp.Key, Frequency = kvp.Value });
            }
            
            // Build tree
            while (heap.Count > 1)
            {
                var left = heap.Min;
                heap.Remove(left);
                var right = heap.Min;
                heap.Remove(right);
                
                var merged = new HuffmanNode
                {
                    Character = '\0', // Internal node
                    Frequency = left.Frequency + right.Frequency,
                    Left = left,
                    Right = right
                };
                
                heap.Add(merged);
            }
            
            return heap.FirstOrDefault();
        }

        private void GenerateHuffmanCodes(HuffmanNode node, string code, Dictionary<char, string> codes)
        {
            if (node == null) return;
            
            if (node.IsLeaf)
            {
                codes[node.Character] = code.Length > 0 ? code : "0"; // Handle single character case
                return;
            }
            
            GenerateHuffmanCodes(node.Left, code + "0", codes);
            GenerateHuffmanCodes(node.Right, code + "1", codes);
        }
        #endregion

        #region Problem 4: Job Scheduling with Deadlines
        /// <summary>
        /// Schedule jobs to maximize profit within deadlines
        /// Pseudocode:
        /// 1. Sort jobs by profit in descending order
        /// 2. Create time slots array
        /// 3. For each job: find latest available slot before deadline
        /// 4. If slot found: schedule job and mark slot as occupied
        /// 5. Return total profit
        /// </summary>
        public void DemonstrateJobScheduling()
        {
            Console.WriteLine("\n🔍 Problem 4: Job Scheduling with Deadlines");
            
            var jobs = new List<(string id, int deadline, int profit)>
            {
                ("J1", 4, 20), ("J2", 1, 10), ("J3", 1, 40),
                ("J4", 1, 30), ("J5", 2, 50), ("J6", 3, 60)
            };
            
            Console.WriteLine("Jobs (ID, deadline, profit):");
            foreach (var job in jobs)
            {
                Console.WriteLine($"  {job.id}: deadline={job.deadline}, profit={job.profit}");
            }
            
            var (scheduledJobs, totalProfit) = JobScheduling(jobs);
            
            Console.WriteLine($"\n✅ Maximum profit: {totalProfit}");
            Console.WriteLine("Scheduled jobs:");
            foreach (var job in scheduledJobs)
            {
                Console.WriteLine($"  {job}");
            }
        }

        public (List<string> jobs, int totalProfit) JobScheduling(List<(string id, int deadline, int profit)> jobs)
        {
            // Sort by profit (greedy choice)
            var sortedJobs = jobs.OrderByDescending(j => j.profit).ToList();
            
            int maxDeadline = jobs.Max(j => j.deadline);
            var timeSlots = new string[maxDeadline + 1]; // 1-indexed
            var scheduledJobs = new List<string>();
            int totalProfit = 0;
            
            foreach (var job in sortedJobs)
            {
                // Find latest available slot before deadline
                for (int slot = job.deadline; slot >= 1; slot--)
                {
                    if (timeSlots[slot] == null)
                    {
                        timeSlots[slot] = job.id;
                        scheduledJobs.Add(job.id);
                        totalProfit += job.profit;
                        break;
                    }
                }
            }
            
            return (scheduledJobs, totalProfit);
        }
        #endregion

        #region Problem 5: Minimum Coins (Greedy - works for standard coin systems)
        /// <summary>
        /// Find minimum coins needed to make change (greedy approach)
        /// Pseudocode:
        /// 1. Sort coins in descending order
        /// 2. For each coin denomination:
        ///    - Use as many coins as possible without exceeding amount
        ///    - Reduce amount by coins used
        /// 3. Return total coins used
        /// </summary>
        public void DemonstrateMinimumCoins()
        {
            Console.WriteLine("\n🔍 Problem 5: Minimum Coins (Greedy Approach)");
            
            int[] coins = { 25, 10, 5, 1 }; // US coin system
            int amount = 67;
            
            Console.WriteLine($"Coin denominations: [{string.Join(", ", coins)}]");
            Console.WriteLine($"Amount to make: {amount}");
            
            var result = MinimumCoinsGreedy(coins, amount);
            
            Console.WriteLine($"\n✅ Minimum coins needed: {result.totalCoins}");
            Console.WriteLine("Coins used:");
            foreach (var kvp in result.coinsUsed)
            {
                Console.WriteLine($"  {kvp.Value} coins of denomination {kvp.Key}");
            }
            
            Console.WriteLine("\n⚠️  Note: Greedy works for standard coin systems but not all systems");
        }

        public (int totalCoins, Dictionary<int, int> coinsUsed) MinimumCoinsGreedy(int[] coins, int amount)
        {
            var coinsUsed = new Dictionary<int, int>();
            int totalCoins = 0;
            int remainingAmount = amount;
            
            // Sort coins in descending order (greedy choice)
            var sortedCoins = coins.OrderByDescending(c => c).ToArray();
            
            foreach (int coin in sortedCoins)
            {
                if (remainingAmount >= coin)
                {
                    int count = remainingAmount / coin;
                    coinsUsed[coin] = count;
                    totalCoins += count;
                    remainingAmount %= coin;
                }
            }
            
            return (totalCoins, coinsUsed);
        }
        #endregion

        #region Problem 6: Gas Station
        /// <summary>
        /// Find starting gas station to complete circular tour
        /// Pseudocode:
        /// 1. Calculate net gas at each station (gas[i] - cost[i])
        /// 2. If total net gas < 0: impossible to complete tour
        /// 3. Use greedy approach: start from station where we can maintain positive tank
        /// 4. If tank becomes negative: reset start to next station
        /// </summary>
        public void DemonstrateGasStation()
        {
            Console.WriteLine("\n🔍 Problem 6: Gas Station Circuit");
            
            int[] gas = { 1, 2, 3, 4, 5 };
            int[] cost = { 3, 4, 5, 1, 2 };
            
            Console.WriteLine("Gas stations:");
            for (int i = 0; i < gas.Length; i++)
            {
                Console.WriteLine($"  Station {i}: gas={gas[i]}, cost={cost[i]}, net={gas[i] - cost[i]}");
            }
            
            int startStation = CanCompleteCircuit(gas, cost);
            
            if (startStation != -1)
            {
                Console.WriteLine($"\n✅ Can start from station: {startStation}");
            }
            else
            {
                Console.WriteLine("\n❌ Cannot complete the circuit");
            }
        }

        public int CanCompleteCircuit(int[] gas, int[] cost)
        {
            int totalTank = 0;
            int currentTank = 0;
            int startStation = 0;
            
            for (int i = 0; i < gas.Length; i++)
            {
                int netGas = gas[i] - cost[i];
                totalTank += netGas;
                currentTank += netGas;
                
                // If current tank becomes negative, we can't reach next station
                // Reset start to next station (greedy choice)
                if (currentTank < 0)
                {
                    startStation = i + 1;
                    currentTank = 0;
                }
            }
            
            // If total gas is non-negative, we can complete the circuit
            return totalTank >= 0 ? startStation : -1;
        }
        #endregion
    }
}
