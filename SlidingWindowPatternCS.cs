using System;
using System.Collections.Generic;
using System.Linq;

namespace CodingPatterns
{
    /// <summary>
    /// Comprehensive Sliding Window Pattern Implementation
    /// Educational focus: Fixed and variable window sizes, optimization techniques
    /// </summary>
    public class SlidingWindowPatternCS
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("🪟 Sliding Window Pattern - C# Implementation");
            Console.WriteLine("=" * 50);
            
            var demo = new SlidingWindowPatternCS();
            demo.RunAllDemonstrations();
        }

        public void RunAllDemonstrations()
        {
            Console.WriteLine("\n📚 EDUCATIONAL OVERVIEW:");
            Console.WriteLine("Sliding Window optimizes problems involving contiguous subarrays/substrings");
            Console.WriteLine("Two types: Fixed size window and Variable size window");
            Console.WriteLine("Time Complexity: O(n) vs O(n²) or O(n³) brute force");
            
            // Fixed Window Problems
            DemonstrateMaxSumSubarray();
            DemonstrateAverageOfSubarrays();
            
            // Variable Window Problems
            DemonstrateLongestSubstringKDistinct();
            DemonstrateMinWindowSubstring();
            DemonstrateLongestSubarrayOnes();
            DemonstratePermutationInString();
        }

        #region Problem 1: Maximum Sum Subarray of Size K (Fixed Window)
        /// <summary>
        /// Find maximum sum of any contiguous subarray of size k
        /// Pseudocode:
        /// 1. Calculate sum of first k elements (initial window)
        /// 2. Slide window: remove leftmost, add rightmost element
        /// 3. Track maximum sum seen so far
        /// 4. Return maximum sum
        /// </summary>
        public void DemonstrateMaxSumSubarray()
        {
            Console.WriteLine("\n🔍 Problem 1: Maximum Sum Subarray of Size K");
            int[] nums = { 2, 1, 5, 1, 3, 2, 7, 4, 2 };
            int k = 3;
            
            Console.WriteLine($"Array: [{string.Join(", ", nums)}]");
            Console.WriteLine($"Window size K: {k}");
            
            int maxSum = MaxSumSubarrayOfSizeK(nums, k);
            Console.WriteLine($"✅ Maximum sum: {maxSum}");
            
            // Show step-by-step process
            Console.WriteLine("\n📊 Step-by-step sliding:");
            ShowSlidingProcess(nums, k);
        }

        public int MaxSumSubarrayOfSizeK(int[] nums, int k)
        {
            if (nums.Length < k) return -1;
            
            // Calculate sum of first window
            int windowSum = 0;
            for (int i = 0; i < k; i++)
            {
                windowSum += nums[i];
            }
            
            int maxSum = windowSum;
            
            // Slide the window
            for (int i = k; i < nums.Length; i++)
            {
                windowSum = windowSum - nums[i - k] + nums[i]; // Remove left, add right
                maxSum = Math.Max(maxSum, windowSum);
            }
            
            return maxSum;
        }

        private void ShowSlidingProcess(int[] nums, int k)
        {
            int windowSum = nums.Take(k).Sum();
            Console.WriteLine($"Window [0-{k-1}]: [{string.Join(", ", nums.Take(k))}] = {windowSum}");
            
            for (int i = k; i < nums.Length; i++)
            {
                windowSum = windowSum - nums[i - k] + nums[i];
                var window = nums.Skip(i - k + 1).Take(k);
                Console.WriteLine($"Window [{i-k+1}-{i}]: [{string.Join(", ", window)}] = {windowSum}");
            }
        }
        #endregion

        #region Problem 2: Average of Subarrays of Size K
        /// <summary>
        /// Calculate average of all contiguous subarrays of size k
        /// Pseudocode:
        /// 1. Initialize window sum with first k elements
        /// 2. Add first average to result
        /// 3. For remaining elements: slide window and calculate new average
        /// 4. Return array of averages
        /// </summary>
        public void DemonstrateAverageOfSubarrays()
        {
            Console.WriteLine("\n🔍 Problem 2: Average of Subarrays of Size K");
            int[] nums = { 1, 3, 2, 6, -1, 4, 1, 8, 2 };
            int k = 5;
            
            Console.WriteLine($"Array: [{string.Join(", ", nums)}]");
            Console.WriteLine($"Window size K: {k}");
            
            double[] averages = FindAverages(nums, k);
            Console.WriteLine($"✅ Averages: [{string.Join(", ", averages.Select(x => x.ToString("F1")))}]");
        }

        public double[] FindAverages(int[] nums, int k)
        {
            double[] result = new double[nums.Length - k + 1];
            
            // Calculate sum of first window
            double windowSum = 0;
            for (int i = 0; i < k; i++)
            {
                windowSum += nums[i];
            }
            result[0] = windowSum / k;
            
            // Slide window and calculate averages
            for (int i = k; i < nums.Length; i++)
            {
                windowSum = windowSum - nums[i - k] + nums[i];
                result[i - k + 1] = windowSum / k;
            }
            
            return result;
        }
        #endregion

        #region Problem 3: Longest Substring with K Distinct Characters (Variable Window)
        /// <summary>
        /// Find length of longest substring with at most k distinct characters
        /// Pseudocode:
        /// 1. Use two pointers (start, end) and character frequency map
        /// 2. Expand window by moving end pointer
        /// 3. If distinct characters > k: shrink window from start
        /// 4. Track maximum window size
        /// 5. Return maximum length
        /// </summary>
        public void DemonstrateLongestSubstringKDistinct()
        {
            Console.WriteLine("\n🔍 Problem 3: Longest Substring with K Distinct Characters");
            string s = "araaci";
            int k = 2;
            
            Console.WriteLine($"String: '{s}'");
            Console.WriteLine($"Max distinct characters K: {k}");
            
            int maxLength = LongestSubstringKDistinct(s, k);
            Console.WriteLine($"✅ Longest substring length: {maxLength}");
            
            Console.WriteLine("\n💡 Variable window technique:");
            Console.WriteLine("Expand window when valid, shrink when invalid");
        }

        public int LongestSubstringKDistinct(string s, int k)
        {
            if (string.IsNullOrEmpty(s) || k == 0) return 0;
            
            var charFreq = new Dictionary<char, int>();
            int start = 0;
            int maxLength = 0;
            
            for (int end = 0; end < s.Length; end++)
            {
                // Expand window: add character at end
                char rightChar = s[end];
                charFreq[rightChar] = charFreq.GetValueOrDefault(rightChar, 0) + 1;
                
                // Shrink window if we have more than k distinct characters
                while (charFreq.Count > k)
                {
                    char leftChar = s[start];
                    charFreq[leftChar]--;
                    if (charFreq[leftChar] == 0)
                    {
                        charFreq.Remove(leftChar);
                    }
                    start++;
                }
                
                // Update maximum length
                maxLength = Math.Max(maxLength, end - start + 1);
            }
            
            return maxLength;
        }
        #endregion

        #region Problem 4: Minimum Window Substring
        /// <summary>
        /// Find minimum window in string s that contains all characters of string t
        /// Pseudocode:
        /// 1. Create frequency map for target string t
        /// 2. Use sliding window with two pointers
        /// 3. Expand window until all characters of t are included
        /// 4. Shrink window while maintaining all characters
        /// 5. Track minimum window found
        /// </summary>
        public void DemonstrateMinWindowSubstring()
        {
            Console.WriteLine("\n🔍 Problem 4: Minimum Window Substring");
            string s = "ADOBECODEBANC";
            string t = "ABC";
            
            Console.WriteLine($"String S: '{s}'");
            Console.WriteLine($"Target T: '{t}'");
            
            string minWindow = MinWindow(s, t);
            Console.WriteLine($"✅ Minimum window: '{minWindow}'");
        }

        public string MinWindow(string s, string t)
        {
            if (string.IsNullOrEmpty(s) || string.IsNullOrEmpty(t)) return "";
            
            // Frequency map for target string
            var targetFreq = new Dictionary<char, int>();
            foreach (char c in t)
            {
                targetFreq[c] = targetFreq.GetValueOrDefault(c, 0) + 1;
            }
            
            int required = targetFreq.Count; // Number of unique characters in t
            int formed = 0; // Number of unique characters in current window with desired frequency
            
            var windowCounts = new Dictionary<char, int>();
            int left = 0, right = 0;
            
            // Answer tuple: (window length, left, right)
            int[] ans = { -1, 0, 0 };
            
            while (right < s.Length)
            {
                // Add character from right to window
                char c = s[right];
                windowCounts[c] = windowCounts.GetValueOrDefault(c, 0) + 1;
                
                // Check if frequency of current character matches target frequency
                if (targetFreq.ContainsKey(c) && windowCounts[c] == targetFreq[c])
                {
                    formed++;
                }
                
                // Try to shrink window from left
                while (left <= right && formed == required)
                {
                    c = s[left];
                    
                    // Save smallest window
                    if (ans[0] == -1 || right - left + 1 < ans[0])
                    {
                        ans[0] = right - left + 1;
                        ans[1] = left;
                        ans[2] = right;
                    }
                    
                    // Remove character from left
                    windowCounts[c]--;
                    if (targetFreq.ContainsKey(c) && windowCounts[c] < targetFreq[c])
                    {
                        formed--;
                    }
                    
                    left++;
                }
                
                right++;
            }
            
            return ans[0] == -1 ? "" : s.Substring(ans[1], ans[0]);
        }
        #endregion

        #region Problem 5: Longest Subarray with Ones after Replacement
        /// <summary>
        /// Find length of longest subarray with all 1s after replacing at most k 0s
        /// Pseudocode:
        /// 1. Use sliding window with two pointers
        /// 2. Count zeros in current window
        /// 3. If zeros > k: shrink window from left
        /// 4. Track maximum window size
        /// 5. Return maximum length
        /// </summary>
        public void DemonstrateLongestSubarrayOnes()
        {
            Console.WriteLine("\n🔍 Problem 5: Longest Subarray with 1s after Replacement");
            int[] nums = { 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0 };
            int k = 2;
            
            Console.WriteLine($"Array: [{string.Join(", ", nums)}]");
            Console.WriteLine($"Max replacements K: {k}");
            
            int maxLength = LongestOnes(nums, k);
            Console.WriteLine($"✅ Longest subarray length: {maxLength}");
        }

        public int LongestOnes(int[] nums, int k)
        {
            int left = 0;
            int maxLength = 0;
            int zeroCount = 0;
            
            for (int right = 0; right < nums.Length; right++)
            {
                // Expand window
                if (nums[right] == 0)
                {
                    zeroCount++;
                }
                
                // Shrink window if we have more than k zeros
                while (zeroCount > k)
                {
                    if (nums[left] == 0)
                    {
                        zeroCount--;
                    }
                    left++;
                }
                
                // Update maximum length
                maxLength = Math.Max(maxLength, right - left + 1);
            }
            
            return maxLength;
        }
        #endregion

        #region Problem 6: Permutation in String
        /// <summary>
        /// Check if any permutation of s1 exists as substring in s2
        /// Pseudocode:
        /// 1. Create frequency map for s1
        /// 2. Use sliding window of size s1.length on s2
        /// 3. Compare frequency maps of current window and s1
        /// 4. If they match: permutation found
        /// 5. Slide window and repeat
        /// </summary>
        public void DemonstratePermutationInString()
        {
            Console.WriteLine("\n🔍 Problem 6: Permutation in String");
            string s1 = "ab";
            string s2 = "eidbaooo";
            
            Console.WriteLine($"Pattern S1: '{s1}'");
            Console.WriteLine($"Text S2: '{s2}'");
            
            bool hasPermutation = CheckInclusion(s1, s2);
            Console.WriteLine($"✅ Contains permutation: {hasPermutation}");
        }

        public bool CheckInclusion(string s1, string s2)
        {
            if (s1.Length > s2.Length) return false;
            
            // Frequency map for s1
            var s1Freq = new Dictionary<char, int>();
            foreach (char c in s1)
            {
                s1Freq[c] = s1Freq.GetValueOrDefault(c, 0) + 1;
            }
            
            // Sliding window on s2
            var windowFreq = new Dictionary<char, int>();
            int windowSize = s1.Length;
            
            for (int i = 0; i < s2.Length; i++)
            {
                // Add character to window
                char rightChar = s2[i];
                windowFreq[rightChar] = windowFreq.GetValueOrDefault(rightChar, 0) + 1;
                
                // Remove character from window if window size exceeds s1 length
                if (i >= windowSize)
                {
                    char leftChar = s2[i - windowSize];
                    windowFreq[leftChar]--;
                    if (windowFreq[leftChar] == 0)
                    {
                        windowFreq.Remove(leftChar);
                    }
                }
                
                // Check if current window is a permutation of s1
                if (DictionariesEqual(s1Freq, windowFreq))
                {
                    return true;
                }
            }
            
            return false;
        }

        private bool DictionariesEqual(Dictionary<char, int> dict1, Dictionary<char, int> dict2)
        {
            if (dict1.Count != dict2.Count) return false;
            
            foreach (var kvp in dict1)
            {
                if (!dict2.ContainsKey(kvp.Key) || dict2[kvp.Key] != kvp.Value)
                {
                    return false;
                }
            }
            
            return true;
        }
        #endregion
    }
}
