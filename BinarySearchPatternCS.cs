using System;
using System.Collections.Generic;

namespace CodingPatterns
{
    /// <summary>
    /// Comprehensive Binary Search Pattern Implementation
    /// Educational focus: Search space reduction, boundary conditions, variations
    /// </summary>
    public class BinarySearchPatternCS
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("🔍 Binary Search Pattern - C# Implementation");
            Console.WriteLine("=" * 50);
            
            var demo = new BinarySearchPatternCS();
            demo.RunAllDemonstrations();
        }

        public void RunAllDemonstrations()
        {
            Console.WriteLine("\n📚 EDUCATIONAL OVERVIEW:");
            Console.WriteLine("Binary Search reduces search space by half in each iteration");
            Console.WriteLine("Time Complexity: O(log n) vs O(n) linear search");
            Console.WriteLine("Key: Identify the search space and elimination condition");
            
            // Classic Binary Search
            DemonstrateClassicBinarySearch();
            
            // Search in Rotated Array
            DemonstrateSearchInRotatedArray();
            
            // Find First and Last Position
            DemonstrateFindFirstLastPosition();
            
            // Search Insert Position
            DemonstrateSearchInsertPosition();
            
            // Find Peak Element
            DemonstrateFindPeakElement();
            
            // Search in 2D Matrix
            DemonstrateSearch2DMatrix();
        }

        #region Problem 1: Classic Binary Search
        /// <summary>
        /// Find target in sorted array using binary search
        /// Pseudocode:
        /// 1. Initialize left = 0, right = array.length - 1
        /// 2. While left <= right:
        ///    - Calculate mid = left + (right - left) / 2
        ///    - If array[mid] == target: return mid
        ///    - If array[mid] < target: search right half (left = mid + 1)
        ///    - If array[mid] > target: search left half (right = mid - 1)
        /// 3. Return -1 if not found
        /// </summary>
        public void DemonstrateClassicBinarySearch()
        {
            Console.WriteLine("\n🔍 Problem 1: Classic Binary Search");
            int[] nums = { 1, 3, 5, 7, 9, 11, 13, 15, 17, 19 };
            int target = 11;
            
            Console.WriteLine($"Sorted Array: [{string.Join(", ", nums)}]");
            Console.WriteLine($"Target: {target}");
            
            int index = BinarySearch(nums, target);
            if (index != -1)
            {
                Console.WriteLine($"✅ Found at index: {index}");
            }
            else
            {
                Console.WriteLine("❌ Not found");
            }
            
            // Show search process
            Console.WriteLine("\n📊 Search Process:");
            ShowBinarySearchProcess(nums, target);
        }

        public int BinarySearch(int[] nums, int target)
        {
            int left = 0;
            int right = nums.Length - 1;
            
            while (left <= right)
            {
                int mid = left + (right - left) / 2; // Avoid overflow
                
                if (nums[mid] == target)
                {
                    return mid;
                }
                else if (nums[mid] < target)
                {
                    left = mid + 1; // Search right half
                }
                else
                {
                    right = mid - 1; // Search left half
                }
            }
            
            return -1; // Not found
        }

        private void ShowBinarySearchProcess(int[] nums, int target)
        {
            int left = 0, right = nums.Length - 1, step = 1;
            
            while (left <= right)
            {
                int mid = left + (right - left) / 2;
                Console.WriteLine($"Step {step}: left={left}, right={right}, mid={mid}, nums[mid]={nums[mid]}");
                
                if (nums[mid] == target)
                {
                    Console.WriteLine($"✅ Found target {target} at index {mid}");
                    break;
                }
                else if (nums[mid] < target)
                {
                    Console.WriteLine($"   {nums[mid]} < {target}, search right half");
                    left = mid + 1;
                }
                else
                {
                    Console.WriteLine($"   {nums[mid]} > {target}, search left half");
                    right = mid - 1;
                }
                step++;
            }
        }
        #endregion

        #region Problem 2: Search in Rotated Sorted Array
        /// <summary>
        /// Search target in rotated sorted array
        /// Pseudocode:
        /// 1. Use binary search with modification
        /// 2. At each mid, determine which half is sorted
        /// 3. Check if target is in the sorted half
        /// 4. If yes: search that half, else: search other half
        /// 5. Continue until found or search space exhausted
        /// </summary>
        public void DemonstrateSearchInRotatedArray()
        {
            Console.WriteLine("\n🔍 Problem 2: Search in Rotated Sorted Array");
            int[] nums = { 4, 5, 6, 7, 0, 1, 2 };
            int target = 0;
            
            Console.WriteLine($"Rotated Array: [{string.Join(", ", nums)}]");
            Console.WriteLine($"Target: {target}");
            
            int index = SearchInRotatedArray(nums, target);
            if (index != -1)
            {
                Console.WriteLine($"✅ Found at index: {index}");
            }
            else
            {
                Console.WriteLine("❌ Not found");
            }
            
            Console.WriteLine("\n💡 Key insight: One half is always sorted");
        }

        public int SearchInRotatedArray(int[] nums, int target)
        {
            int left = 0;
            int right = nums.Length - 1;
            
            while (left <= right)
            {
                int mid = left + (right - left) / 2;
                
                if (nums[mid] == target)
                {
                    return mid;
                }
                
                // Determine which half is sorted
                if (nums[left] <= nums[mid]) // Left half is sorted
                {
                    if (target >= nums[left] && target < nums[mid])
                    {
                        right = mid - 1; // Target in left half
                    }
                    else
                    {
                        left = mid + 1; // Target in right half
                    }
                }
                else // Right half is sorted
                {
                    if (target > nums[mid] && target <= nums[right])
                    {
                        left = mid + 1; // Target in right half
                    }
                    else
                    {
                        right = mid - 1; // Target in left half
                    }
                }
            }
            
            return -1;
        }
        #endregion

        #region Problem 3: Find First and Last Position
        /// <summary>
        /// Find first and last position of target in sorted array
        /// Pseudocode:
        /// 1. Use two binary searches: one for first occurrence, one for last
        /// 2. For first occurrence: when found, continue searching left
        /// 3. For last occurrence: when found, continue searching right
        /// 4. Return [first, last] or [-1, -1] if not found
        /// </summary>
        public void DemonstrateFindFirstLastPosition()
        {
            Console.WriteLine("\n🔍 Problem 3: Find First and Last Position");
            int[] nums = { 5, 7, 7, 8, 8, 8, 10 };
            int target = 8;
            
            Console.WriteLine($"Array: [{string.Join(", ", nums)}]");
            Console.WriteLine($"Target: {target}");
            
            int[] range = SearchRange(nums, target);
            Console.WriteLine($"✅ First and last positions: [{range[0]}, {range[1]}]");
        }

        public int[] SearchRange(int[] nums, int target)
        {
            int[] result = { -1, -1 };
            
            // Find first occurrence
            result[0] = FindFirst(nums, target);
            if (result[0] == -1) return result; // Target not found
            
            // Find last occurrence
            result[1] = FindLast(nums, target);
            
            return result;
        }

        private int FindFirst(int[] nums, int target)
        {
            int left = 0, right = nums.Length - 1;
            int first = -1;
            
            while (left <= right)
            {
                int mid = left + (right - left) / 2;
                
                if (nums[mid] == target)
                {
                    first = mid;
                    right = mid - 1; // Continue searching left for first occurrence
                }
                else if (nums[mid] < target)
                {
                    left = mid + 1;
                }
                else
                {
                    right = mid - 1;
                }
            }
            
            return first;
        }

        private int FindLast(int[] nums, int target)
        {
            int left = 0, right = nums.Length - 1;
            int last = -1;
            
            while (left <= right)
            {
                int mid = left + (right - left) / 2;
                
                if (nums[mid] == target)
                {
                    last = mid;
                    left = mid + 1; // Continue searching right for last occurrence
                }
                else if (nums[mid] < target)
                {
                    left = mid + 1;
                }
                else
                {
                    right = mid - 1;
                }
            }
            
            return last;
        }
        #endregion

        #region Problem 4: Search Insert Position
        /// <summary>
        /// Find position where target should be inserted in sorted array
        /// Pseudocode:
        /// 1. Use binary search
        /// 2. If target found: return index
        /// 3. If not found: return the position where it should be inserted
        /// 4. This is the position where left pointer ends up
        /// </summary>
        public void DemonstrateSearchInsertPosition()
        {
            Console.WriteLine("\n🔍 Problem 4: Search Insert Position");
            int[] nums = { 1, 3, 5, 6 };
            int[] targets = { 5, 2, 7, 0 };
            
            Console.WriteLine($"Array: [{string.Join(", ", nums)}]");
            
            foreach (int target in targets)
            {
                int position = SearchInsert(nums, target);
                Console.WriteLine($"Target {target} should be at position: {position}");
            }
        }

        public int SearchInsert(int[] nums, int target)
        {
            int left = 0;
            int right = nums.Length - 1;
            
            while (left <= right)
            {
                int mid = left + (right - left) / 2;
                
                if (nums[mid] == target)
                {
                    return mid;
                }
                else if (nums[mid] < target)
                {
                    left = mid + 1;
                }
                else
                {
                    right = mid - 1;
                }
            }
            
            return left; // Insert position
        }
        #endregion

        #region Problem 5: Find Peak Element
        /// <summary>
        /// Find any peak element (element greater than its neighbors)
        /// Pseudocode:
        /// 1. Use binary search on the array
        /// 2. Compare mid with mid+1
        /// 3. If nums[mid] > nums[mid+1]: peak is in left half (including mid)
        /// 4. Else: peak is in right half
        /// 5. Continue until single element remains
        /// </summary>
        public void DemonstrateFindPeakElement()
        {
            Console.WriteLine("\n🔍 Problem 5: Find Peak Element");
            int[] nums = { 1, 2, 3, 1 };
            
            Console.WriteLine($"Array: [{string.Join(", ", nums)}]");
            
            int peakIndex = FindPeakElement(nums);
            Console.WriteLine($"✅ Peak element {nums[peakIndex]} found at index: {peakIndex}");
            
            Console.WriteLine("\n💡 Key insight: Always move towards the higher neighbor");
        }

        public int FindPeakElement(int[] nums)
        {
            int left = 0;
            int right = nums.Length - 1;
            
            while (left < right)
            {
                int mid = left + (right - left) / 2;
                
                if (nums[mid] > nums[mid + 1])
                {
                    right = mid; // Peak is in left half (including mid)
                }
                else
                {
                    left = mid + 1; // Peak is in right half
                }
            }
            
            return left; // left == right, pointing to peak
        }
        #endregion

        #region Problem 6: Search 2D Matrix
        /// <summary>
        /// Search target in 2D matrix (sorted row-wise and column-wise)
        /// Pseudocode:
        /// 1. Treat 2D matrix as 1D sorted array
        /// 2. Use binary search with index conversion
        /// 3. Convert 1D index to 2D: row = index / cols, col = index % cols
        /// 4. Apply standard binary search logic
        /// </summary>
        public void DemonstrateSearch2DMatrix()
        {
            Console.WriteLine("\n🔍 Problem 6: Search in 2D Matrix");
            int[,] matrix = {
                { 1,  4,  7, 11 },
                { 2,  5,  8, 12 },
                { 3,  6,  9, 16 },
                { 10, 13, 14, 17 }
            };
            int target = 5;
            
            Console.WriteLine("Matrix:");
            PrintMatrix(matrix);
            Console.WriteLine($"Target: {target}");
            
            bool found = SearchMatrix(matrix, target);
            Console.WriteLine($"✅ Target found: {found}");
        }

        public bool SearchMatrix(int[,] matrix, int target)
        {
            int rows = matrix.GetLength(0);
            int cols = matrix.GetLength(1);
            
            int left = 0;
            int right = rows * cols - 1;
            
            while (left <= right)
            {
                int mid = left + (right - left) / 2;
                
                // Convert 1D index to 2D coordinates
                int row = mid / cols;
                int col = mid % cols;
                int midValue = matrix[row, col];
                
                if (midValue == target)
                {
                    return true;
                }
                else if (midValue < target)
                {
                    left = mid + 1;
                }
                else
                {
                    right = mid - 1;
                }
            }
            
            return false;
        }

        private void PrintMatrix(int[,] matrix)
        {
            int rows = matrix.GetLength(0);
            int cols = matrix.GetLength(1);
            
            for (int i = 0; i < rows; i++)
            {
                Console.Write("  [");
                for (int j = 0; j < cols; j++)
                {
                    Console.Write($"{matrix[i, j],2}");
                    if (j < cols - 1) Console.Write(", ");
                }
                Console.WriteLine("]");
            }
        }
        #endregion
    }
}
