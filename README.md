# 🎯 Comprehensive C# Coding Patterns for Interview Preparation

A complete collection of essential coding patterns implemented in C# with educational examples, detailed explanations, and performance analysis. Perfect for technical interview preparation and algorithmic problem-solving skills development.

## 📚 **What's Included**

### **7 Major Coding Patterns**
- **Two Pointers Pattern** - Efficient O(n) solutions for array/string problems
- **Sliding Window Pattern** - Optimize contiguous subarray/substring problems  
- **Binary Search Pattern** - Logarithmic search techniques and variations
- **DFS/BFS Pattern** - Tree and graph traversal algorithms
- **Dynamic Programming** - Optimal substructure and overlapping subproblems
- **Backtracking** - Systematic exploration with pruning
- **Greedy Algorithms** - Local optimal choices for global optimum

### **40+ Problem Examples**
Each pattern includes 6+ carefully selected problems that demonstrate the core concepts and common interview questions.

## 🚀 **Quick Start**

### **Prerequisites**
- .NET 6.0 or later
- C# development environment (Visual Studio, VS Code, or Rider)

### **Running the Examples**
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/coding-patterns-csharp.git
cd coding-patterns-csharp

# Run any pattern implementation
dotnet run --project . TwoPointersPatternCS.cs
dotnet run --project . SlidingWindowPatternCS.cs
dotnet run --project . DynamicProgrammingPatternCS.cs
```

## 📖 **Pattern Overview**

### **1. Two Pointers Pattern**
```csharp
// Example: Two Sum in Sorted Array - O(n) solution
public int[] TwoSumSorted(int[] nums, int target)
{
    int left = 0, right = nums.Length - 1;
    while (left < right)
    {
        int sum = nums[left] + nums[right];
        if (sum == target) return new int[] { left, right };
        else if (sum < target) left++;
        else right--;
    }
    return new int[0];
}
```

**Problems Covered:**
- Two Sum, Remove Duplicates, Container With Most Water
- Valid Palindrome, Three Sum, Linked List Cycle Detection

### **2. Sliding Window Pattern**
```csharp
// Example: Maximum Sum Subarray of Size K
public int MaxSumSubarray(int[] nums, int k)
{
    int windowSum = 0, maxSum = 0;
    
    // Calculate sum of first window
    for (int i = 0; i < k; i++)
        windowSum += nums[i];
    maxSum = windowSum;
    
    // Slide the window
    for (int i = k; i < nums.Length; i++)
    {
        windowSum = windowSum - nums[i - k] + nums[i];
        maxSum = Math.Max(maxSum, windowSum);
    }
    return maxSum;
}
```

**Problems Covered:**
- Fixed Window: Maximum Sum, Average of Subarrays
- Variable Window: Longest Substring K Distinct, Minimum Window Substring

### **3. Dynamic Programming Pattern**
```csharp
// Example: Fibonacci with Memoization
public long FibonacciMemo(int n, Dictionary<int, long> memo)
{
    if (n <= 1) return n;
    if (memo.ContainsKey(n)) return memo[n];
    
    memo[n] = FibonacciMemo(n - 1, memo) + FibonacciMemo(n - 2, memo);
    return memo[n];
}
```

**Problems Covered:**
- Fibonacci, Climbing Stairs, House Robber
- Coin Change, Longest Increasing Subsequence, 0/1 Knapsack

## 🎓 **Educational Features**

### **Comprehensive Learning Materials**
- **Detailed Pseudocode** for every algorithm
- **Performance Analysis** with time/space complexity
- **Multiple Approaches** showing evolution from naive to optimized
- **Step-by-Step Demonstrations** with sample data
- **Real Interview Questions** from major tech companies

### **Interactive Learning**
- Console applications with educational output
- Visual demonstrations of algorithm processes
- Performance comparisons between different approaches
- Detailed explanations of decision-making processes

## 📁 **Project Structure**

```
├── TwoPointersPatternCS.cs          # Two Pointers implementations
├── SlidingWindowPatternCS.cs        # Sliding Window implementations  
├── BinarySearchPatternCS.cs         # Binary Search implementations
├── DFSBFSPatternCS.cs              # DFS/BFS implementations
├── DynamicProgrammingPatternCS.cs   # DP implementations
├── BacktrackingPatternCS.cs         # Backtracking implementations
├── GreedyAlgorithmsPatternCS.cs     # Greedy algorithms implementations
├── CodingPatternsSummary.md         # Comprehensive documentation
├── react-app/                      # Interactive React learning app
└── server/                         # Node.js backend for React app
```

## 🎯 **Interview Preparation Guide**

### **Study Sequence (Recommended)**
1. **Week 1:** Two Pointers + Sliding Window
2. **Week 2:** Binary Search + DFS/BFS  
3. **Week 3:** Dynamic Programming
4. **Week 4:** Backtracking + Greedy Algorithms

### **Practice Strategy**
- Implement each pattern from scratch
- Solve variations of each problem
- Focus on pattern recognition
- Practice explaining your approach
- Time yourself on problem-solving

## 🔧 **Additional Features**

### **CQRS Pattern Implementation**
Complete Command Query Responsibility Segregation pattern with:
- Educational prompts and learning materials
- Step-by-step implementation guide
- Real-world examples and best practices

### **React Learning Application**
Interactive web application featuring:
- Pattern selection and filtering
- MCQ-based learning assessments
- Progress tracking and reporting
- Educational content delivery

## 📊 **Performance Benchmarks**

Each implementation includes performance analysis:
- **Two Pointers:** O(n) vs O(n²) brute force
- **Sliding Window:** O(n) vs O(n²) or O(n³) nested loops
- **Binary Search:** O(log n) vs O(n) linear search
- **Dynamic Programming:** Exponential to polynomial time reduction

## 🤝 **Contributing**

Contributions are welcome! Please feel free to:
- Add new problems to existing patterns
- Implement additional coding patterns
- Improve educational explanations
- Add more test cases and examples

## 📝 **License**

This project is open source and available under the [MIT License](LICENSE).

## 🌟 **Acknowledgments**

- Inspired by common technical interview patterns
- Educational approach based on proven learning methodologies
- Problem selection from LeetCode, HackerRank, and other platforms

---

**Happy Coding! 🚀**

*Master these patterns and ace your next technical interview!*
