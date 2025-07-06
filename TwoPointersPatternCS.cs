using System;
using System.Collections.Generic;
using System.Linq;

namespace CodingPatterns
{
    /// <summary>
    /// Comprehensive Two Pointers Pattern Implementation
    /// Educational focus: When to use two pointers and performance benefits
    /// </summary>
    public class TwoPointersPatternCS
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("🎯 Two Pointers Pattern - C# Implementation");
            Console.WriteLine("=" * 50);
            
            var demo = new TwoPointersPatternCS();
            demo.RunAllDemonstrations();
        }

        public void RunAllDemonstrations()
        {
            Console.WriteLine("\n📚 EDUCATIONAL OVERVIEW:");
            Console.WriteLine("Two Pointers technique uses two pointers to traverse data structure");
            Console.WriteLine("Time Complexity: O(n) vs O(n²) brute force");
            Console.WriteLine("Space Complexity: O(1) - constant extra space");
            
            // Problem 1: Two Sum in Sorted Array
            DemonstrateTwoSum();
            
            // Problem 2: Remove Duplicates
            DemonstrateRemoveDuplicates();
            
            // Problem 3: Container With Most Water
            DemonstrateContainerWithMostWater();
            
            // Problem 4: Valid Palindrome
            DemonstrateValidPalindrome();
            
            // Problem 5: Three Sum
            DemonstrateThreeSum();
            
            // Problem 6: Linked List Cycle Detection
            DemonstrateLinkedListCycle();
        }

        #region Problem 1: Two Sum in Sorted Array
        /// <summary>
        /// Find two numbers in sorted array that add up to target
        /// Pseudocode:
        /// 1. Initialize left = 0, right = array.length - 1
        /// 2. While left < right:
        ///    - Calculate sum = array[left] + array[right]
        ///    - If sum == target: return indices
        ///    - If sum < target: move left pointer right
        ///    - If sum > target: move right pointer left
        /// 3. Return empty if no solution found
        /// </summary>
        public void DemonstrateTwoSum()
        {
            Console.WriteLine("\n🔍 Problem 1: Two Sum in Sorted Array");
            int[] nums = { 2, 7, 11, 15, 20, 25 };
            int target = 22;
            
            Console.WriteLine($"Array: [{string.Join(", ", nums)}]");
            Console.WriteLine($"Target: {target}");
            
            var result = TwoSumSorted(nums, target);
            if (result.Length > 0)
            {
                Console.WriteLine($"✅ Found pair at indices [{result[0]}, {result[1]}]");
                Console.WriteLine($"   Values: {nums[result[0]]} + {nums[result[1]]} = {target}");
            }
            else
            {
                Console.WriteLine("❌ No valid pair found");
            }
            
            // Performance comparison
            Console.WriteLine("\n📊 Performance Analysis:");
            Console.WriteLine("Two Pointers: O(n) time, O(1) space");
            Console.WriteLine("Brute Force: O(n²) time, O(1) space");
        }

        public int[] TwoSumSorted(int[] nums, int target)
        {
            int left = 0;
            int right = nums.Length - 1;
            
            while (left < right)
            {
                int currentSum = nums[left] + nums[right];
                
                if (currentSum == target)
                {
                    return new int[] { left, right };
                }
                else if (currentSum < target)
                {
                    left++; // Need larger sum
                }
                else
                {
                    right--; // Need smaller sum
                }
            }
            
            return new int[0]; // No solution found
        }
        #endregion

        #region Problem 2: Remove Duplicates from Sorted Array
        /// <summary>
        /// Remove duplicates in-place from sorted array
        /// Pseudocode:
        /// 1. Initialize slow = 0 (unique elements pointer)
        /// 2. For fast = 1 to array.length:
        ///    - If array[fast] != array[slow]:
        ///      - Increment slow
        ///      - Copy array[fast] to array[slow]
        /// 3. Return slow + 1 (length of unique array)
        /// </summary>
        public void DemonstrateRemoveDuplicates()
        {
            Console.WriteLine("\n🔍 Problem 2: Remove Duplicates from Sorted Array");
            int[] nums = { 1, 1, 2, 2, 2, 3, 4, 4, 5 };
            
            Console.WriteLine($"Original: [{string.Join(", ", nums)}]");
            
            int newLength = RemoveDuplicates(nums);
            
            Console.WriteLine($"After removal: [{string.Join(", ", nums.Take(newLength))}]");
            Console.WriteLine($"New length: {newLength}");
            
            Console.WriteLine("\n📊 Algorithm Details:");
            Console.WriteLine("Slow pointer: tracks position for next unique element");
            Console.WriteLine("Fast pointer: scans through array");
            Console.WriteLine("Time: O(n), Space: O(1)");
        }

        public int RemoveDuplicates(int[] nums)
        {
            if (nums.Length == 0) return 0;
            
            int slow = 0; // Points to last unique element
            
            for (int fast = 1; fast < nums.Length; fast++)
            {
                if (nums[fast] != nums[slow])
                {
                    slow++;
                    nums[slow] = nums[fast];
                }
            }
            
            return slow + 1; // Length of unique array
        }
        #endregion

        #region Problem 3: Container With Most Water
        /// <summary>
        /// Find two lines that form container with maximum water
        /// Pseudocode:
        /// 1. Initialize left = 0, right = array.length - 1, maxArea = 0
        /// 2. While left < right:
        ///    - Calculate area = min(height[left], height[right]) * (right - left)
        ///    - Update maxArea if current area is larger
        ///    - Move pointer with smaller height inward
        /// 3. Return maxArea
        /// </summary>
        public void DemonstrateContainerWithMostWater()
        {
            Console.WriteLine("\n🔍 Problem 3: Container With Most Water");
            int[] heights = { 1, 8, 6, 2, 5, 4, 8, 3, 7 };
            
            Console.WriteLine($"Heights: [{string.Join(", ", heights)}]");
            
            int maxArea = MaxArea(heights);
            Console.WriteLine($"✅ Maximum water area: {maxArea}");
            
            Console.WriteLine("\n💡 Strategy:");
            Console.WriteLine("Always move the pointer with smaller height");
            Console.WriteLine("Why? Moving taller pointer can't increase area");
        }

        public int MaxArea(int[] height)
        {
            int left = 0;
            int right = height.Length - 1;
            int maxArea = 0;
            
            while (left < right)
            {
                // Calculate current area
                int currentArea = Math.Min(height[left], height[right]) * (right - left);
                maxArea = Math.Max(maxArea, currentArea);
                
                // Move pointer with smaller height
                if (height[left] < height[right])
                {
                    left++;
                }
                else
                {
                    right--;
                }
            }
            
            return maxArea;
        }
        #endregion

        #region Problem 4: Valid Palindrome
        /// <summary>
        /// Check if string is a valid palindrome (ignoring non-alphanumeric)
        /// Pseudocode:
        /// 1. Initialize left = 0, right = string.length - 1
        /// 2. While left < right:
        ///    - Skip non-alphanumeric characters from both ends
        ///    - Compare characters (case-insensitive)
        ///    - If different: return false
        ///    - Move both pointers inward
        /// 3. Return true
        /// </summary>
        public void DemonstrateValidPalindrome()
        {
            Console.WriteLine("\n🔍 Problem 4: Valid Palindrome");
            string[] testCases = {
                "A man, a plan, a canal: Panama",
                "race a car",
                "Was it a car or a cat I saw?",
                "Madam"
            };
            
            foreach (string test in testCases)
            {
                bool result = IsPalindrome(test);
                Console.WriteLine($"'{test}' → {(result ? "✅ Valid" : "❌ Invalid")} palindrome");
            }
            
            Console.WriteLine("\n📝 Note: Ignores spaces, punctuation, and case");
        }

        public bool IsPalindrome(string s)
        {
            int left = 0;
            int right = s.Length - 1;
            
            while (left < right)
            {
                // Skip non-alphanumeric characters from left
                while (left < right && !char.IsLetterOrDigit(s[left]))
                {
                    left++;
                }
                
                // Skip non-alphanumeric characters from right
                while (left < right && !char.IsLetterOrDigit(s[right]))
                {
                    right--;
                }
                
                // Compare characters (case-insensitive)
                if (char.ToLower(s[left]) != char.ToLower(s[right]))
                {
                    return false;
                }
                
                left++;
                right--;
            }
            
            return true;
        }
        #endregion

        #region Problem 5: Three Sum
        /// <summary>
        /// Find all unique triplets that sum to zero
        /// Pseudocode:
        /// 1. Sort the array
        /// 2. For each element (as first element):
        ///    - Skip duplicates
        ///    - Use two pointers for remaining elements
        ///    - Find pairs that sum to negative of first element
        /// 3. Return all unique triplets
        /// </summary>
        public void DemonstrateThreeSum()
        {
            Console.WriteLine("\n🔍 Problem 5: Three Sum (Find triplets that sum to 0)");
            int[] nums = { -1, 0, 1, 2, -1, -4, -2, -3, 3, 0, 4 };
            
            Console.WriteLine($"Array: [{string.Join(", ", nums)}]");
            
            var triplets = ThreeSum(nums);
            
            Console.WriteLine($"✅ Found {triplets.Count} unique triplets:");
            foreach (var triplet in triplets)
            {
                Console.WriteLine($"   [{string.Join(", ", triplet)}] = {triplet.Sum()}");
            }
        }

        public IList<IList<int>> ThreeSum(int[] nums)
        {
            var result = new List<IList<int>>();
            Array.Sort(nums); // Sort for two pointers technique
            
            for (int i = 0; i < nums.Length - 2; i++)
            {
                // Skip duplicates for first element
                if (i > 0 && nums[i] == nums[i - 1]) continue;
                
                int left = i + 1;
                int right = nums.Length - 1;
                int target = -nums[i]; // We want nums[left] + nums[right] = target
                
                while (left < right)
                {
                    int sum = nums[left] + nums[right];
                    
                    if (sum == target)
                    {
                        result.Add(new List<int> { nums[i], nums[left], nums[right] });
                        
                        // Skip duplicates
                        while (left < right && nums[left] == nums[left + 1]) left++;
                        while (left < right && nums[right] == nums[right - 1]) right--;
                        
                        left++;
                        right--;
                    }
                    else if (sum < target)
                    {
                        left++;
                    }
                    else
                    {
                        right--;
                    }
                }
            }
            
            return result;
        }
        #endregion

        #region Problem 6: Linked List Cycle Detection (Floyd's Algorithm)
        public class ListNode
        {
            public int val;
            public ListNode next;
            public ListNode(int x) { val = x; }
        }

        /// <summary>
        /// Detect cycle in linked list using Floyd's cycle detection
        /// Pseudocode:
        /// 1. Initialize slow = head, fast = head
        /// 2. While fast and fast.next exist:
        ///    - Move slow one step: slow = slow.next
        ///    - Move fast two steps: fast = fast.next.next
        ///    - If slow == fast: cycle detected
        /// 3. Return false if no cycle
        /// </summary>
        public void DemonstrateLinkedListCycle()
        {
            Console.WriteLine("\n🔍 Problem 6: Linked List Cycle Detection");
            
            // Create linked list with cycle: 1 -> 2 -> 3 -> 4 -> 2 (cycle)
            var head = new ListNode(1);
            head.next = new ListNode(2);
            head.next.next = new ListNode(3);
            head.next.next.next = new ListNode(4);
            head.next.next.next.next = head.next; // Create cycle
            
            bool hasCycle = HasCycle(head);
            Console.WriteLine($"Linked list: 1 -> 2 -> 3 -> 4 -> 2 (cycle)");
            Console.WriteLine($"✅ Cycle detected: {hasCycle}");
            
            Console.WriteLine("\n🐢🐰 Floyd's Algorithm (Tortoise and Hare):");
            Console.WriteLine("Slow pointer moves 1 step, fast pointer moves 2 steps");
            Console.WriteLine("If there's a cycle, they will eventually meet");
        }

        public bool HasCycle(ListNode head)
        {
            if (head == null || head.next == null) return false;
            
            ListNode slow = head;
            ListNode fast = head;
            
            while (fast != null && fast.next != null)
            {
                slow = slow.next;           // Move 1 step
                fast = fast.next.next;      // Move 2 steps
                
                if (slow == fast)           // Cycle detected
                {
                    return true;
                }
            }
            
            return false; // No cycle
        }
        #endregion
    }
}
