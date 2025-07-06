import React, { useState } from 'react';

function CodingPatternsGuide() {
  const [selectedTier, setSelectedTier] = useState('tier1');
  const [completedPatterns, setCompletedPatterns] = useState(new Set());

  const patterns = {
    tier1: {
      title: "🥇 Tier 1: Foundation Patterns (Must Master)",
      subtitle: "80% of interviews - Master these first",
      color: "#27ae60",
      patterns: [
        {
          id: "two-pointers",
          name: "Two Pointers Pattern",
          description: "Efficient technique for array and string problems using two pointers",
          difficulty: "Easy-Medium",
          timeToMaster: "3-5 days",
          problems: 25,
          keyProblems: ["Two Sum", "Three Sum", "Remove Duplicates", "Palindrome Check"],
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)"
        },
        {
          id: "sliding-window",
          name: "Sliding Window Pattern",
          description: "Optimize subarray/substring problems by maintaining a window",
          difficulty: "Easy-Medium",
          timeToMaster: "4-6 days",
          problems: 30,
          keyProblems: ["Max Sum Subarray", "Longest Substring", "Min Window Substring"],
          timeComplexity: "O(n)",
          spaceComplexity: "O(k)"
        },
        {
          id: "binary-search",
          name: "Binary Search Pattern",
          description: "Logarithmic search in sorted arrays and search spaces",
          difficulty: "Medium",
          timeToMaster: "5-7 days",
          problems: 35,
          keyProblems: ["Search Insert Position", "Find Peak Element", "Search in Rotated Array"],
          timeComplexity: "O(log n)",
          spaceComplexity: "O(1)"
        },
        {
          id: "tree-traversal",
          name: "Tree Traversal (DFS/BFS)",
          description: "Navigate tree structures using depth-first and breadth-first approaches",
          difficulty: "Medium",
          timeToMaster: "6-8 days",
          problems: 40,
          keyProblems: ["Binary Tree Paths", "Level Order", "Validate BST", "Max Depth"],
          timeComplexity: "O(n)",
          spaceComplexity: "O(h)"
        },
        {
          id: "dp-1d",
          name: "1D Dynamic Programming",
          description: "Solve optimization problems using memoization and tabulation",
          difficulty: "Medium-Hard",
          timeToMaster: "7-10 days",
          problems: 45,
          keyProblems: ["Fibonacci", "Climbing Stairs", "House Robber", "Coin Change"],
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)"
        }
      ]
    },
    tier2: {
      title: "🥈 Tier 2: Important Patterns",
      subtitle: "60% of interviews - Build on foundation",
      color: "#3498db",
      patterns: [
        {
          id: "fast-slow-pointers",
          name: "Fast & Slow Pointers",
          description: "Detect cycles and find middle elements using Floyd's algorithm",
          difficulty: "Medium",
          timeToMaster: "4-5 days",
          problems: 20,
          keyProblems: ["Detect Cycle", "Find Middle", "Happy Number", "Palindrome Linked List"],
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)"
        },
        {
          id: "graph-algorithms",
          name: "Graph Algorithms",
          description: "Traverse and analyze graph structures using DFS, BFS, and Union-Find",
          difficulty: "Medium-Hard",
          timeToMaster: "8-10 days",
          problems: 50,
          keyProblems: ["Number of Islands", "Course Schedule", "Clone Graph", "Word Ladder"],
          timeComplexity: "O(V + E)",
          spaceComplexity: "O(V)"
        },
        {
          id: "heap-priority-queue",
          name: "Heap/Priority Queue",
          description: "Efficiently find top K elements and merge operations",
          difficulty: "Medium",
          timeToMaster: "5-7 days",
          problems: 25,
          keyProblems: ["Kth Largest", "Merge K Lists", "Top K Frequent", "Find Median"],
          timeComplexity: "O(n log k)",
          spaceComplexity: "O(k)"
        },
        {
          id: "backtracking",
          name: "Backtracking Pattern",
          description: "Generate combinations and solve constraint satisfaction problems",
          difficulty: "Medium-Hard",
          timeToMaster: "6-8 days",
          problems: 35,
          keyProblems: ["N-Queens", "Generate Parentheses", "Permutations", "Sudoku Solver"],
          timeComplexity: "O(2^n)",
          spaceComplexity: "O(n)"
        },
        {
          id: "merge-intervals",
          name: "Merge Intervals",
          description: "Handle overlapping intervals and scheduling problems",
          difficulty: "Medium",
          timeToMaster: "3-4 days",
          problems: 15,
          keyProblems: ["Merge Intervals", "Insert Interval", "Meeting Rooms", "Non-overlapping"],
          timeComplexity: "O(n log n)",
          spaceComplexity: "O(n)"
        }
      ]
    },
    tier3: {
      title: "🥉 Tier 3: Advanced Patterns",
      subtitle: "30% of interviews - For senior roles",
      color: "#e74c3c",
      patterns: [
        {
          id: "dp-2d",
          name: "2D Dynamic Programming",
          description: "Complex optimization problems with 2D state spaces",
          difficulty: "Hard",
          timeToMaster: "10-14 days",
          problems: 40,
          keyProblems: ["Unique Paths", "Edit Distance", "LCS", "Palindrome Partitioning"],
          timeComplexity: "O(m*n)",
          spaceComplexity: "O(m*n)"
        },
        {
          id: "greedy",
          name: "Greedy Algorithms",
          description: "Make locally optimal choices for global optimization",
          difficulty: "Medium-Hard",
          timeToMaster: "5-7 days",
          problems: 30,
          keyProblems: ["Activity Selection", "Gas Station", "Jump Game", "Candy"],
          timeComplexity: "O(n log n)",
          spaceComplexity: "O(1)"
        },
        {
          id: "trie",
          name: "Trie (Prefix Tree)",
          description: "Efficient string search and prefix operations",
          difficulty: "Medium",
          timeToMaster: "4-6 days",
          problems: 20,
          keyProblems: ["Implement Trie", "Word Search II", "Auto-complete", "Longest Word"],
          timeComplexity: "O(m)",
          spaceComplexity: "O(ALPHABET_SIZE * N)"
        },
        {
          id: "union-find",
          name: "Union-Find (Disjoint Set)",
          description: "Efficiently handle connected components and cycle detection",
          difficulty: "Medium-Hard",
          timeToMaster: "5-7 days",
          problems: 25,
          keyProblems: ["Connected Components", "Redundant Connection", "Accounts Merge"],
          timeComplexity: "O(α(n))",
          spaceComplexity: "O(n)"
        },
        {
          id: "modified-binary-search",
          name: "Modified Binary Search",
          description: "Binary search in rotated, mountain, and infinite arrays",
          difficulty: "Hard",
          timeToMaster: "6-8 days",
          problems: 20,
          keyProblems: ["Search Rotated Array", "Find in Mountain", "Search 2D Matrix"],
          timeComplexity: "O(log n)",
          spaceComplexity: "O(1)"
        },
        {
          id: "cyclic-sort",
          name: "Cyclic Sort Pattern",
          description: "Sort arrays with numbers in range [1, n] in-place",
          difficulty: "Medium",
          timeToMaster: "3-4 days",
          problems: 15,
          keyProblems: ["Missing Number", "Find Duplicate", "First Missing Positive"],
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)"
        }
      ]
    }
  };

  const togglePatternCompletion = (patternId) => {
    const newCompleted = new Set(completedPatterns);
    if (newCompleted.has(patternId)) {
      newCompleted.delete(patternId);
    } else {
      newCompleted.add(patternId);
    }
    setCompletedPatterns(newCompleted);
  };

  const getTierProgress = (tierKey) => {
    const tierPatterns = patterns[tierKey].patterns;
    const completed = tierPatterns.filter(p => completedPatterns.has(p.id)).length;
    return Math.round((completed / tierPatterns.length) * 100);
  };

  const getTotalProgress = () => {
    const allPatterns = Object.values(patterns).flatMap(tier => tier.patterns);
    const completed = allPatterns.filter(p => completedPatterns.has(p.id)).length;
    return Math.round((completed / allPatterns.length) * 100);
  };

  return (
    <div className="page-content" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', fontSize: '2.5em', marginBottom: '10px' }}>
          🎯 Complete Coding Patterns Guide
        </h1>
        <p style={{ color: '#7f8c8d', fontSize: '1.2em', maxWidth: '800px', margin: '0 auto' }}>
          Master all 16 essential coding patterns for cracking technical interviews with step-by-step implementations
        </p>
        
        {/* Overall Progress */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          padding: '20px',
          margin: '20px auto',
          maxWidth: '600px',
          border: '2px solid #ecf0f1'
        }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>📊 Overall Progress</h3>
          <div style={{
            backgroundColor: '#ecf0f1',
            borderRadius: '10px',
            height: '20px',
            overflow: 'hidden',
            marginBottom: '10px'
          }}>
            <div style={{
              backgroundColor: '#27ae60',
              height: '100%',
              width: `${getTotalProgress()}%`,
              transition: 'width 0.3s ease',
              borderRadius: '10px'
            }}></div>
          </div>
          <p style={{ margin: 0, color: '#7f8c8d' }}>
            {completedPatterns.size} / 16 patterns completed ({getTotalProgress()}%)
          </p>
        </div>
      </div>

      {/* Tier Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '15px', 
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        {Object.entries(patterns).map(([tierKey, tier]) => (
          <button
            key={tierKey}
            onClick={() => setSelectedTier(tierKey)}
            style={{
              padding: '12px 24px',
              border: selectedTier === tierKey ? `3px solid ${tier.color}` : '2px solid #ddd',
              borderRadius: '8px',
              backgroundColor: selectedTier === tierKey ? tier.color : 'white',
              color: selectedTier === tierKey ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
          >
            {tier.title.split(':')[0]}
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#27ae60',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {getTierProgress(tierKey)}%
            </div>
          </button>
        ))}
      </div>

      {/* Selected Tier Content */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h2 style={{ color: patterns[selectedTier].color, fontSize: '2em', marginBottom: '5px' }}>
            {patterns[selectedTier].title}
          </h2>
          <p style={{ color: '#7f8c8d', fontSize: '1.1em' }}>
            {patterns[selectedTier].subtitle}
          </p>
        </div>

        {/* Patterns Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '25px'
        }}>
          {patterns[selectedTier].patterns.map((pattern) => (
            <div
              key={pattern.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '25px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: `3px solid ${patterns[selectedTier].color}`,
                position: 'relative',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Completion Checkbox */}
              <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                <input
                  type="checkbox"
                  checked={completedPatterns.has(pattern.id)}
                  onChange={() => togglePatternCompletion(pattern.id)}
                  style={{ transform: 'scale(1.5)', cursor: 'pointer' }}
                />
              </div>

              <h3 style={{ 
                color: patterns[selectedTier].color, 
                marginBottom: '10px',
                fontSize: '1.3em',
                paddingRight: '40px'
              }}>
                {pattern.name}
              </h3>
              
              <p style={{ color: '#666', marginBottom: '15px', lineHeight: '1.5' }}>
                {pattern.description}
              </p>

              {/* Pattern Stats */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '10px', 
                marginBottom: '15px',
                fontSize: '13px'
              }}>
                <div>
                  <strong>Difficulty:</strong> {pattern.difficulty}
                </div>
                <div>
                  <strong>Time to Master:</strong> {pattern.timeToMaster}
                </div>
                <div>
                  <strong>Practice Problems:</strong> {pattern.problems}
                </div>
                <div>
                  <strong>Time Complexity:</strong> {pattern.timeComplexity}
                </div>
              </div>

              {/* Key Problems */}
              <div style={{ marginBottom: '15px' }}>
                <h4 style={{ color: '#2c3e50', margin: '0 0 8px 0', fontSize: '14px' }}>
                  🎯 Key Problems:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {pattern.keyProblems.map((problem, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: '#f8f9fa',
                        color: '#495057',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        border: '1px solid #dee2e6'
                      }}
                    >
                      {problem}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                style={{
                  backgroundColor: patterns[selectedTier].color,
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
                onClick={() => {
                  // Navigate to specific pattern implementation
                  const routeMap = {
                    'two-pointers': '/patterns/two-pointers',
                    'sliding-window': '/patterns/sliding-window',
                    'binary-search': '/patterns/binary-search'
                  };

                  if (routeMap[pattern.id]) {
                    window.location.href = routeMap[pattern.id];
                  } else {
                    alert(`${pattern.name} implementation coming soon!`);
                  }
                }}
              >
                📚 Learn {pattern.name} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CodingPatternsGuide;
