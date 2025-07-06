import React, { useState } from 'react';
import './App.css';

const EducationalCoverage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFiles, setExpandedFiles] = useState({});

  const toggleFileExpansion = (fileId) => {
    setExpandedFiles(prev => ({
      ...prev,
      [fileId]: !prev[fileId]
    }));
  };

  const educationalMaterials = {
    cqrsPattern: {
      title: "CQRS Pattern Implementation Suite",
      category: "design-patterns",
      description: "Complete Command Query Responsibility Segregation pattern with event sourcing",
      files: [
        {
          id: "cqrs-pattern",
          name: "CQRSPattern.cs",
          purpose: "Complete CQRS pattern implementation with event sourcing for educational purposes",
          features: ["Command handlers", "Query handlers", "Event store", "Read database", "Comprehensive demonstration"],
          educationalValue: "Demonstrates separation of concerns, event-driven architecture, and enterprise patterns",
          codeSnippet: `public void Handle(CreateProductCommand command)
{
    // Business logic validation
    if (string.IsNullOrEmpty(command.Name))
        throw new ArgumentException("Product name is required");
    
    // Generate and store event
    var productCreatedEvent = new ProductCreatedEvent
    {
        Id = command.Id,
        Name = command.Name,
        Price = command.Price,
        Category = command.Category,
        CreatedAt = DateTime.UtcNow
    };
    
    _eventStore.SaveEvent(productCreatedEvent);
}`,
          concepts: ["Event Sourcing", "Command Pattern", "Domain Events", "Separation of Concerns"]
        },
        {
          id: "cqrs-learning",
          name: "CQRSLearningPrompts.cs",
          purpose: "Interactive MCQ learning session for CQRS concepts",
          features: ["Educational questions", "Explanations", "Comprehensive learning flow"],
          educationalValue: "Reinforces CQRS concepts through interactive questioning",
          codeSnippet: `public void RunLearningSession()
{
    Console.WriteLine("🎓 Welcome to CQRS Pattern Learning Session!");
    Console.WriteLine("Answer the following questions to test your understanding.\\n");
    
    AskQuestion1_CoreConcept();
    AskQuestion2_Benefits();
    AskQuestion3_Components();
}`,
          concepts: ["Interactive Learning", "Knowledge Assessment", "Educational Design"]
        },
        {
          id: "cqrs-demo",
          name: "CQRSComprehensiveDemo.cs",
          purpose: "Combined demonstration showing CQRS implementation, learning prompts, and benefits",
          features: ["Multi-part educational experience", "Live demonstrations", "Integrated learning"],
          educationalValue: "Integrates theory and practice in a single comprehensive demo",
          codeSnippet: `public void RunComprehensiveDemo()
{
    Console.WriteLine("🎯 PART 1: CQRS IMPLEMENTATION IN ACTION");
    RunCQRSImplementation();
    
    Console.WriteLine("🎓 PART 2: LEARNING PROMPTS & EXPLANATIONS");
    RunLearningPrompts();
    
    Console.WriteLine("💡 PART 3: CQRS BENEFITS DEMONSTRATION");
    DemonstrateCQRSBenefits();
}`,
          concepts: ["Comprehensive Learning", "Practical Application", "Educational Integration"]
        }
      ]
    },
    algorithmPerformance: {
      title: "Algorithm Performance Demonstrations",
      category: "algorithms",
      description: "Performance comparisons and optimization techniques",
      files: [
        {
          id: "two-pointers-demo",
          name: "TwoPointersDemo.cs",
          purpose: "Demonstrates the efficiency advantage of Two Pointers technique over brute force",
          features: ["Performance comparison", "Operation counting", "Efficiency analysis"],
          educationalValue: "Shows practical benefits of optimized algorithms",
          codeSnippet: `public static bool FindPairTwoPointers(int[] nums, int target)
{
    int left = 0;
    int right = nums.Length - 1;
    
    while (left < right)
    {
        int currentSum = nums[left] + nums[right];
        if (currentSum == target)
            return true;
        
        if (currentSum < target)
            left++;
        else
            right--;
    }
    return false;
}`,
          concepts: ["Two Pointers", "Algorithm Optimization", "Time Complexity", "Performance Analysis"]
        },
        {
          id: "two-pointers-effectiveness",
          name: "TwoPointersEffectiveness.cs",
          purpose: "Comprehensive demonstration of Two Pointers effectiveness across different data structures",
          features: ["Linked list operations", "Cycle detection", "Middle node finding", "Data structure analysis"],
          educationalValue: "Shows when Two Pointers is most effective and why",
          codeSnippet: `static bool DetectCycle(ListNode head)
{
    ListNode slow = head;
    ListNode fast = head;
    
    while (fast != null && fast.Next != null)
    {
        slow = slow.Next;
        fast = fast.Next.Next;
        
        if (slow == fast)
            return true;
    }
    return false;
}`,
          concepts: ["Floyd's Algorithm", "Cycle Detection", "Fast-Slow Pointers", "Linked Lists"]
        }
      ]
    },
    hashMapImplementations: {
      title: "Hash Map Implementation and Comparisons",
      category: "data-structures",
      description: "Various hash map approaches for pair finding and complement search",
      files: [
        {
          id: "findpair-hashmap",
          name: "findpairwithhashmap.cs",
          purpose: "Comprehensive sorting and hash map examples with algorithm comparisons",
          features: ["Multiple sorting approaches", "Two Pointers vs hash map analysis", "Space complexity demonstrations"],
          educationalValue: "Compares different algorithmic approaches with practical examples",
          codeSnippet: `public static bool FindPairWithHashMap(int[] nums, int target)
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
}`,
          concepts: ["Hash Tables", "Complement Search", "Space-Time Tradeoffs", "Algorithm Comparison"]
        },
        {
          id: "hashmap-basic",
          name: "hashmap.cs, hashmap2.cs, hashmap3.cs",
          purpose: "Simple hash map implementations for pair finding",
          features: ["Basic hash set usage", "Complement finding", "Simple implementations"],
          educationalValue: "Demonstrates fundamental hash map concepts",
          codeSnippet: `HashSet<int> seen = new HashSet<int>();
foreach (int num in nums)
{
    int complement = target - num;
    if (seen.Contains(complement))
        return true;
    seen.Add(num);
}`,
          concepts: ["HashSet", "Basic Data Structures", "Fundamental Algorithms"]
        }
      ]
    },
    advancedStringMatching: {
      title: "Advanced String Matching Algorithms",
      category: "algorithms",
      description: "Complex pattern matching and string processing solutions",
      files: [
        {
          id: "determining-dna-health",
          name: "DeterminingDNAHealth.cs",
          purpose: "Advanced Aho-Corasick algorithm implementation for efficient string matching",
          features: ["Trie construction", "Failure links", "Optimized pattern matching", "Multiple string search"],
          educationalValue: "Demonstrates advanced string algorithms and trie data structures",
          codeSnippet: `private void BuildFailureLinks()
{
    Queue<TrieNode> queue = new Queue<TrieNode>();

    foreach (TrieNode node in _root.Children.Values)
    {
        node.FailureLink = _root;
        queue.Enqueue(node);
    }

    while (queue.Count > 0)
    {
        TrieNode currentNode = queue.Dequeue();
        // Build failure and output links...
    }
}`,
          concepts: ["Aho-Corasick Algorithm", "Trie Data Structure", "Failure Links", "Pattern Matching"]
        },
        {
          id: "dna-health-two-pointers",
          name: "DNAHealthTwoPointers.cs",
          purpose: "HackerRank problem solution using Two Pointers for substring matching",
          features: ["Multiple algorithm approaches", "Basic string matching", "Problem-solving techniques"],
          educationalValue: "Shows progression from basic to optimized solutions",
          codeSnippet: `// Basic substring matching approach
for (int i = 0; i < s.Length; i++)
{
    for (int j = 0; j < genes.Length; j++)
    {
        if (s.Substring(i).StartsWith(genes[j]))
        {
            health += healths[j];
        }
    }
}`,
          concepts: ["Substring Matching", "Brute Force vs Optimization", "Problem Solving"]
        }
      ]
    },
    gridAlgorithms: {
      title: "Grid-Based Algorithm Implementations",
      category: "algorithms",
      description: "Island pattern and connected component analysis",
      files: [
        {
          id: "island-pattern",
          name: "IslandPattern.cs",
          purpose: "Complete island pattern implementation with DFS/BFS approaches and visualization",
          features: ["Multiple traversal algorithms", "Colored visualization", "Algorithm comparison", "ASCII art representation"],
          educationalValue: "Demonstrates graph traversal algorithms with visual learning aids",
          codeSnippet: `private int GetIslandAreaDfs(int[][] grid, int r, int c)
{
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] == 0)
        return 0;

    grid[r][c] = 0; // Mark as visited
    int area = 1;

    area += GetIslandAreaDfs(grid, r + 1, c); // Down
    area += GetIslandAreaDfs(grid, r - 1, c); // Up
    area += GetIslandAreaDfs(grid, r, c + 1); // Right
    area += GetIslandAreaDfs(grid, r, c - 1); // Left

    return area;
}`,
          concepts: ["Depth-First Search", "Breadth-First Search", "Grid Traversal", "Connected Components"]
        }
      ]
    },
    optimizationProblems: {
      title: "Optimization and Mathematical Problems",
      category: "optimization",
      description: "Constraint solving and mathematical optimization techniques",
      files: [
        {
          id: "minimum-time-school",
          name: "MinimumTimeAtSchool.cs",
          purpose: "Optimization problem solution for scheduling constraints",
          features: ["Dynamic programming approach", "Constraint optimization", "Mathematical modeling"],
          educationalValue: "Demonstrates optimization techniques and constraint solving",
          codeSnippet: `// Optimization logic for minimum time calculation
int minTime = int.MaxValue;
for (int i = 0; i < constraints.Length; i++)
{
    int currentTime = CalculateTime(constraints[i]);
    minTime = Math.Min(minTime, currentTime);
}`,
          concepts: ["Dynamic Programming", "Constraint Optimization", "Mathematical Modeling"]
        },
        {
          id: "count-numbers-bits",
          name: "CountNumbersWithSameBits.cs",
          purpose: "Bit manipulation problem solving with set bit counting",
          features: ["Binary operations", "Mathematical optimization", "Bit counting algorithms"],
          educationalValue: "Teaches bit manipulation and binary mathematics",
          codeSnippet: `public static int CountSetBits(int n)
{
    int count = 0;
    while (n > 0)
    {
        count += n & 1;
        n >>= 1;
    }
    return count;
}`,
          concepts: ["Bit Manipulation", "Binary Operations", "Mathematical Optimization"]
        },
        {
          id: "next-all-bits-set",
          name: "NextAllBitsSet.cs",
          purpose: "Binary manipulation utility for finding next number with all bits set",
          features: ["Bit counting", "Manipulation operations", "Binary mathematics"],
          educationalValue: "Advanced bit manipulation techniques",
          codeSnippet: `public static int NextAllBitsSet(int n)
{
    int bitCount = CountSetBits(n);
    return (1 << bitCount) - 1;
}`,
          concepts: ["Bit Counting", "Binary Manipulation", "Mathematical Utilities"]
        }
      ]
    },
    visualizationTools: {
      title: "Visualization and Learning Tools",
      category: "problem-solving",
      description: "Educational visualization and interactive learning components",
      files: [
        {
          id: "cycle-visualization",
          name: "CycleVisualization.cs",
          purpose: "Educational visualization of linked list cycle creation and detection",
          features: ["ASCII art representation", "Step-by-step cycle demonstration", "Visual learning aids"],
          educationalValue: "Makes abstract concepts concrete through visualization",
          codeSnippet: `private void DrawLinkedList()
{
    Console.WriteLine("Linked List Visualization:");
    Console.WriteLine("[1] -> [2] -> [3] -> [4]");
    Console.WriteLine("       ^              |");
    Console.WriteLine("       |______________|");
    Console.WriteLine("         (Cycle detected)");
}`,
          concepts: ["Data Visualization", "Educational Tools", "ASCII Art", "Interactive Learning"]
        }
      ]
    }
  };

  const categories = [
    { id: 'all', name: 'All Categories', icon: '📚' },
    { id: 'design-patterns', name: 'Design Patterns', icon: '🏗️' },
    { id: 'algorithms', name: 'Algorithms', icon: '⚡' },
    { id: 'data-structures', name: 'Data Structures', icon: '🗂️' },
    { id: 'optimization', name: 'Optimization', icon: '🚀' },
    { id: 'problem-solving', name: 'Problem Solving', icon: '🧩' }
  ];

  const filteredMaterials = selectedCategory === 'all' 
    ? Object.values(educationalMaterials)
    : Object.values(educationalMaterials).filter(material => material.category === selectedCategory);

  return (
    <div className="educational-coverage">
      <div className="header-section">
        <h1>🎓 C# Educational Coverage</h1>
        <p className="subtitle">Comprehensive inventory of all C# learning materials in the coding folder</p>
        
        <div className="stats-overview">
          <div className="stat-card">
            <h3>16+</h3>
            <p>C# Learning Files</p>
          </div>
          <div className="stat-card">
            <h3>8</h3>
            <p>Major Categories</p>
          </div>
          <div className="stat-card">
            <h3>25+</h3>
            <p>Key Concepts</p>
          </div>
          <div className="stat-card">
            <h3>100%</h3>
            <p>Coverage</p>
          </div>
        </div>
      </div>

      <div className="category-filter">
        <h3>📂 Filter by Category</h3>
        <div className="category-buttons">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="materials-grid">
        {filteredMaterials.map((material, index) => (
          <div key={index} className="material-section">
            <div className="material-header">
              <h2>{material.title}</h2>
              <p className="material-description">{material.description}</p>
              <span className="file-count">{material.files.length} files</span>
            </div>

            <div className="files-list">
              {material.files.map(file => (
                <div key={file.id} className="file-card">
                  <div className="file-header" onClick={() => toggleFileExpansion(file.id)}>
                    <div className="file-info">
                      <h4>📄 {file.name}</h4>
                      <p className="file-purpose">{file.purpose}</p>
                    </div>
                    <button className="expand-btn">
                      {expandedFiles[file.id] ? '▼' : '▶'}
                    </button>
                  </div>

                  {expandedFiles[file.id] && (
                    <div className="file-details">
                      <div className="features-section">
                        <h5>🔧 Key Features:</h5>
                        <ul>
                          {file.features.map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="educational-value">
                        <h5>🎯 Educational Value:</h5>
                        <p>{file.educationalValue}</p>
                      </div>

                      <div className="concepts-section">
                        <h5>💡 Key Concepts:</h5>
                        <div className="concept-tags">
                          {file.concepts.map((concept, idx) => (
                            <span key={idx} className="concept-tag">{concept}</span>
                          ))}
                        </div>
                      </div>

                      <div className="code-section">
                        <h5>💻 Code Example:</h5>
                        <pre className="code-snippet">
                          <code>{file.codeSnippet}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationalCoverage;
