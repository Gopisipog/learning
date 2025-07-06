import React, { useState } from 'react';
import questionsData from '../mcqs.json';

function BinarySearchPattern() {
  const [currentStep, setCurrentStep] = useState(0);
  const [demoArray, setDemoArray] = useState([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);
  const [target, setTarget] = useState(11);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(9);
  const [mid, setMid] = useState(4);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [currentMCQIndex, setCurrentMCQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showMCQResult, setShowMCQResult] = useState(false);
  const [mcqScore, setMCQScore] = useState(0);
  const [completedMCQs, setCompletedMCQs] = useState(new Set());
  const [followUpAnswers, setFollowUpAnswers] = useState({});

  // Get MCQs for Binary Search pattern
  const patternMCQs = questionsData["4. Binary Search"] || [];

  const steps = [
    {
      title: "🔍 Understanding Binary Search Pattern",
      content: "Binary Search efficiently finds elements in sorted arrays by repeatedly dividing the search space in half, achieving O(log n) time complexity.",
      code: `// Binary Search Template
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);

        if (arr[mid] === target) {
            return mid;  // Found target
        } else if (arr[mid] < target) {
            left = mid + 1;  // Search right half
        } else {
            right = mid - 1; // Search left half
        }
    }

    return -1;  // Target not found
}`,
      pseudocode: `ALGORITHM: Binary Search Template

PREREQUISITE: Array must be SORTED

1. INITIALIZE search boundaries:
   - left = 0 (start index)
   - right = length - 1 (end index)

2. WHILE search space exists (left ≤ right):

   a. CALCULATE middle point:
      mid = floor((left + right) / 2)

   b. COMPARE arr[mid] with target:

      IF arr[mid] = target:
         RETURN mid (FOUND!)

      ELSE IF arr[mid] < target:
         SET left = mid + 1
         (search RIGHT half)

      ELSE (arr[mid] > target):
         SET right = mid - 1
         (search LEFT half)

3. IF loop ends without finding:
   RETURN -1 (NOT FOUND)

KEY INSIGHT: Each comparison eliminates
HALF of the remaining search space!

TIME: O(log n) - halving each iteration
SPACE: O(1) - constant extra space`,
      learningPrompt: "Why does binary search require a sorted array?",
      answer: "Binary search relies on the property that if the middle element is less than the target, all elements to the left are also less than the target, allowing us to eliminate half the search space."
    },
    {
      title: "📊 Step 1: Identify Binary Search Problems",
      content: "Recognize when to use binary search: sorted arrays, search spaces, finding boundaries, or optimization problems.",
      code: `// Problem Types for Binary Search:

// 1. Direct Search in Sorted Array
function searchInsert(nums, target) {
    let left = 0, right = nums.length - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) return mid;
        else if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }

    return left; // Insert position
}`,
      pseudocode: `BINARY SEARCH PROBLEM IDENTIFICATION

WHEN TO USE BINARY SEARCH:

1. SORTED DATA STRUCTURE:
   ✓ Array is sorted (ascending/descending)
   ✓ Search space has ordering property
   ✓ Can eliminate half based on comparison

2. SEARCH SPACE PROBLEMS:
   ┌─ Find exact element
   ├─ Find insertion position
   ├─ Find first/last occurrence
   └─ Find peak/valley elements

3. OPTIMIZATION PROBLEMS:
   ┌─ Minimize/maximize a value
   ├─ Find threshold/boundary
   ├─ Search in answer space
   └─ "Can we achieve X?" problems

4. PATTERN RECOGNITION:
   ┌─ "Find in O(log n)" hint
   ├─ Large search space (10^9+)
   ├─ Monotonic function property
   └─ Divide and conquer applicable

ALGORITHM ADAPTATION:
- Standard: exact match search
- Modified: boundary finding
- Advanced: search space optimization

COMPLEXITY GUARANTEE: O(log n)`,
      learningPrompt: "How do you identify if a problem needs binary search?",
      answer: "Look for sorted data, O(log n) hints, large search spaces, or optimization problems where you can eliminate half the possibilities."
    },
    {
      title: "🔄 Step 2: Search in Rotated Array",
      content: "Handle more complex binary search scenarios like rotated sorted arrays.",
      code: `// 2. Search in Rotated Array
function searchRotated(nums, target) {
    let left = 0, right = nums.length - 1;
    
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        
        if (nums[mid] === target) return mid;
        
        // Check which half is sorted
        if (nums[left] <= nums[mid]) {
            // Left half is sorted
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            // Right half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    
    return -1;
}

// 3. Find Peak Element
function findPeakElement(nums) {
    let left = 0, right = nums.length - 1;
    
    while (left < right) {
        let mid = Math.floor((left + right) / 2);
        
        if (nums[mid] > nums[mid + 1]) {
            right = mid; // Peak is in left half
        } else {
            left = mid + 1; // Peak is in right half
        }
    }
    
    return left;
}`,
      learningPrompt: "What are the key indicators that a problem can use binary search?",
      answer: "1) Sorted data, 2) Search space that can be divided, 3) Monotonic function (if condition is true at position x, it's true for all positions in one direction), 4) Finding boundaries or optimal values."
    },
    {
      title: "🎯 Step 2: Set Up Search Boundaries",
      content: "Initialize left and right pointers to define the search space correctly.",
      code: `// Step 2: Boundary Setup Patterns

// Pattern 1: Standard Array Search
let left = 0;
let right = arr.length - 1;

// Pattern 2: Search Insert Position
let left = 0;
let right = arr.length; // Note: length, not length-1

// Pattern 3: Search in Range [min, max]
let left = minValue;
let right = maxValue;

// Pattern 4: Search for First/Last Occurrence
function findFirst(arr, target) {
    let left = 0, right = arr.length - 1;
    let result = -1;
    
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            result = mid;
            right = mid - 1; // Continue searching left for first occurrence
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}

function findLast(arr, target) {
    let left = 0, right = arr.length - 1;
    let result = -1;
    
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            result = mid;
            left = mid + 1; // Continue searching right for last occurrence
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}`,
      learningPrompt: "Why might we use different boundary setups?",
      answer: "Different problems require different search spaces: exact search uses [0, n-1], insert position uses [0, n], and range search uses [min, max] values."
    },
    {
      title: "⚡ Step 3: Calculate Mid and Compare",
      content: "Calculate the middle point and make comparisons to decide which half to search next.",
      code: `// Step 3: Mid Calculation and Comparison Logic

function binarySearchWithSteps(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let steps = [];
    
    while (left <= right) {
        // Calculate mid (avoid overflow)
        let mid = Math.floor((left + right) / 2);
        // Alternative: let mid = left + Math.floor((right - left) / 2);
        
        steps.push({
            left: left,
            right: right,
            mid: mid,
            midValue: arr[mid],
            comparison: arr[mid] === target ? 'equal' : 
                       arr[mid] < target ? 'less' : 'greater'
        });
        
        if (arr[mid] === target) {
            return { found: true, index: mid, steps: steps };
        } else if (arr[mid] < target) {
            left = mid + 1;  // Search right half
        } else {
            right = mid - 1; // Search left half
        }
    }
    
    return { found: false, index: -1, steps: steps };
}

// Avoid integer overflow (important in some languages)
function safeMidCalculation(left, right) {
    // Instead of: (left + right) / 2
    // Use: left + (right - left) / 2
    return left + Math.floor((right - left) / 2);
}`,
      learningPrompt: "Why do we use Math.floor for mid calculation?",
      answer: "Math.floor ensures we get an integer index. For arrays with even length, we consistently choose the left-middle element, preventing infinite loops."
    },
    {
      title: "🎮 Step 4: Interactive Demo",
      content: "Watch binary search in action as it efficiently narrows down the search space.",
      code: `// Live Demo: Binary Search
const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
const target = 11;

// Current search space:
// Left: ${left} (value: ${demoArray[left]})
// Right: ${right} (value: ${demoArray[right]})
// Mid: ${mid} (value: ${demoArray[mid]})
// Comparison: ${demoArray[mid]} vs ${target}`,
      learningPrompt: "How many comparisons does binary search need in the worst case?",
      answer: "At most ⌊log₂(n)⌋ + 1 comparisons, where n is the array size. For 1000 elements, that's only about 10 comparisons!"
    },
    {
      title: "🔧 Step 5: Advanced Binary Search Patterns",
      content: "Master advanced patterns like finding boundaries, searching in 2D matrices, and optimization problems.",
      code: `// Advanced Pattern 1: Search in 2D Matrix
function searchMatrix(matrix, target) {
    if (!matrix.length || !matrix[0].length) return false;
    
    let rows = matrix.length;
    let cols = matrix[0].length;
    let left = 0;
    let right = rows * cols - 1;
    
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        let midValue = matrix[Math.floor(mid / cols)][mid % cols];
        
        if (midValue === target) {
            return true;
        } else if (midValue < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return false;
}

// Advanced Pattern 2: Find Minimum in Rotated Array
function findMin(nums) {
    let left = 0, right = nums.length - 1;
    
    while (left < right) {
        let mid = Math.floor((left + right) / 2);
        
        if (nums[mid] > nums[right]) {
            // Minimum is in right half
            left = mid + 1;
        } else {
            // Minimum is in left half (including mid)
            right = mid;
        }
    }
    
    return nums[left];
}

// Advanced Pattern 3: Binary Search on Answer
function minEatingSpeed(piles, h) {
    let left = 1;
    let right = Math.max(...piles);
    
    while (left < right) {
        let mid = Math.floor((left + right) / 2);
        let hours = 0;
        
        for (let pile of piles) {
            hours += Math.ceil(pile / mid);
        }
        
        if (hours <= h) {
            right = mid; // Can eat slower
        } else {
            left = mid + 1; // Need to eat faster
        }
    }
    
    return left;
}`,
      learningPrompt: "What's the key insight in 'binary search on answer' problems?",
      answer: "Instead of searching in an array, we search in the range of possible answers. If a speed/capacity works, all higher values also work (monotonic property)."
    }
  ];

  const runDemo = async () => {
    setIsRunning(true);
    setResult(null);
    setSearchHistory([]);
    
    let l = 0;
    let r = demoArray.length - 1;
    let history = [];
    
    while (l <= r) {
      let m = Math.floor((l + r) / 2);
      setLeft(l);
      setRight(r);
      setMid(m);
      
      const step = {
        left: l,
        right: r,
        mid: m,
        midValue: demoArray[m],
        comparison: demoArray[m] === target ? 'equal' : 
                   demoArray[m] < target ? 'less' : 'greater'
      };
      
      history.push(step);
      setSearchHistory([...history]);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (demoArray[m] === target) {
        setResult(`Found ${target} at index ${m}!`);
        setIsRunning(false);
        return;
      } else if (demoArray[m] < target) {
        l = m + 1;
      } else {
        r = m - 1;
      }
    }
    
    setResult(`${target} not found in array`);
    setIsRunning(false);
  };

  const resetDemo = () => {
    setLeft(0);
    setRight(demoArray.length - 1);
    setMid(Math.floor((demoArray.length - 1) / 2));
    setResult(null);
    setSearchHistory([]);
    setIsRunning(false);
  };

  // MCQ handling functions
  const handleMCQAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowMCQResult(true);

    const currentMCQ = patternMCQs[currentMCQIndex];
    if (answer === currentMCQ.answer) {
      setMCQScore(prev => prev + 1);
    }
    setCompletedMCQs(prev => new Set([...prev, currentMCQIndex]));
  };

  const nextMCQ = () => {
    if (currentMCQIndex < patternMCQs.length - 1) {
      setCurrentMCQIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowMCQResult(false);
    }
  };

  const previousMCQ = () => {
    if (currentMCQIndex > 0) {
      setCurrentMCQIndex(prev => prev - 1);
      setSelectedAnswer('');
      setShowMCQResult(false);
    }
  };

  const handleFollowUpAnswer = (prompt, answer) => {
    setFollowUpAnswers(prev => ({
      ...prev,
      [prompt]: answer
    }));
  };

  // Follow-up prompts specific to Binary Search
  const followUpPrompts = [
    "Explain why binary search only works on sorted arrays and what happens if the array is not sorted.",
    "How would you modify binary search to find the first or last occurrence of a duplicate element?",
    "Describe the difference between iterative and recursive binary search implementations.",
    "What are some real-world applications where binary search is commonly used?",
    "How do you handle edge cases in binary search (empty arrays, single elements, target not found)?"
  ];

  return (
    <div className="page-content" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#9b59b6', fontSize: '2.5em', marginBottom: '10px' }}>
          🔍 Binary Search Pattern
        </h1>
        <p style={{ color: '#7f8c8d', fontSize: '1.2em', maxWidth: '800px', margin: '0 auto' }}>
          Master binary search to achieve O(log n) solutions for search and optimization problems
        </p>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{
          backgroundColor: '#ecf0f1',
          borderRadius: '10px',
          height: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: '#9b59b6',
            height: '100%',
            width: `${((currentStep + 1) / steps.length) * 100}%`,
            transition: 'width 0.3s ease'
          }}></div>
        </div>
        <p style={{ textAlign: 'center', margin: '10px 0', color: '#7f8c8d' }}>
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      {/* Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '10px', 
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            style={{
              padding: '8px 16px',
              border: currentStep === index ? '2px solid #9b59b6' : '1px solid #ddd',
              borderRadius: '20px',
              backgroundColor: currentStep === index ? '#9b59b6' : 'white',
              color: currentStep === index ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Current Step Content */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>
          {steps[currentStep].title}
        </h2>
        
        <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>
          {steps[currentStep].content}
        </p>

        {/* Code Block with Pseudocode */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Code Section */}
          <div>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px', fontSize: '16px' }}>💻 Code Implementation</h4>
            <div style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              padding: '20px',
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: '14px',
              overflow: 'auto',
              height: 'fit-content'
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {steps[currentStep].code}
              </pre>
            </div>
          </div>

          {/* Pseudocode Section */}
          <div>
            <h4 style={{ color: '#8e44ad', marginBottom: '10px', fontSize: '16px' }}>📝 Pseudocode Logic</h4>
            <div style={{
              backgroundColor: '#f4f1f8',
              border: '1px solid #d1c4e9',
              borderRadius: '8px',
              padding: '20px',
              fontFamily: 'Georgia, serif',
              fontSize: '14px',
              overflow: 'auto',
              height: 'fit-content'
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {steps[currentStep].pseudocode}
              </pre>
            </div>
          </div>
        </div>

        {/* Interactive Demo for Step 4 */}
        {currentStep === 4 && (
          <div style={{
            backgroundColor: '#f0f8ff',
            border: '2px solid #9b59b6',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#9b59b6', marginBottom: '15px' }}>🎮 Live Demo: Binary Search</h3>
            
            {/* Array Visualization */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                {demoArray.map((num, index) => (
                  <div
                    key={index}
                    style={{
                      width: '35px',
                      height: '35px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 
                        index === mid ? '#e74c3c' :
                        index === left ? '#27ae60' :
                        index === right ? '#3498db' :
                        index >= left && index <= right ? '#f39c12' : '#ecf0f1',
                      color: (index >= left && index <= right) ? 'white' : '#333',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      border: '2px solid',
                      borderColor: 
                        index === mid ? '#c0392b' :
                        index === left ? '#229954' :
                        index === right ? '#2980b9' :
                        index >= left && index <= right ? '#e67e22' : '#bdc3c7',
                      position: 'relative'
                    }}
                  >
                    {num}
                    {index === left && (
                      <div style={{
                        position: 'absolute',
                        top: '-20px',
                        fontSize: '10px',
                        color: '#27ae60',
                        fontWeight: 'bold'
                      }}>
                        L
                      </div>
                    )}
                    {index === mid && (
                      <div style={{
                        position: 'absolute',
                        top: '-20px',
                        fontSize: '10px',
                        color: '#e74c3c',
                        fontWeight: 'bold'
                      }}>
                        M
                      </div>
                    )}
                    {index === right && (
                      <div style={{
                        position: 'absolute',
                        top: '-20px',
                        fontSize: '10px',
                        color: '#3498db',
                        fontWeight: 'bold'
                      }}>
                        R
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                <span style={{ color: '#27ae60' }}>🟢 Left: {left}</span>
                {' | '}
                <span style={{ color: '#e74c3c' }}>🔴 Mid: {mid} (value: {demoArray[mid]})</span>
                {' | '}
                <span style={{ color: '#3498db' }}>🔵 Right: {right}</span>
                {' | '}
                <span>Target: {target}</span>
              </div>

              {/* Search History */}
              {searchHistory.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ color: '#2c3e50', margin: '0 0 10px 0', fontSize: '14px' }}>
                    🔍 Search History:
                  </h4>
                  <div style={{ maxHeight: '100px', overflowY: 'auto', fontSize: '12px' }}>
                    {searchHistory.map((step, index) => (
                      <div key={index} style={{ 
                        padding: '5px', 
                        backgroundColor: '#f8f9fa', 
                        margin: '2px 0',
                        borderRadius: '4px',
                        border: '1px solid #dee2e6'
                      }}>
                        Step {index + 1}: L={step.left}, M={step.mid}({step.midValue}), R={step.right} → 
                        {step.comparison === 'equal' ? ' Found!' :
                         step.comparison === 'less' ? ' Search right' : ' Search left'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div style={{ textAlign: 'center', gap: '10px', display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={runDemo}
                disabled={isRunning}
                style={{
                  backgroundColor: '#9b59b6',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  opacity: isRunning ? 0.6 : 1
                }}
              >
                {isRunning ? '🔄 Searching...' : '▶️ Run Demo'}
              </button>
              
              <button
                onClick={resetDemo}
                style={{
                  backgroundColor: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                🔄 Reset
              </button>
            </div>

            {result && (
              <div style={{
                marginTop: '15px',
                padding: '10px',
                backgroundColor: result.includes('Found') ? '#d4edda' : '#f8d7da',
                border: `1px solid ${result.includes('Found') ? '#c3e6cb' : '#f5c6cb'}`,
                borderRadius: '6px',
                textAlign: 'center',
                fontWeight: 'bold',
                color: result.includes('Found') ? '#155724' : '#721c24'
              }}>
                {result}
              </div>
            )}
          </div>
        )}

        {/* Learning Prompt */}
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <h4 style={{ color: '#856404', margin: '0 0 10px 0' }}>
            🤔 Learning Prompt:
          </h4>
          <p style={{ color: '#856404', margin: '0 0 10px 0', fontStyle: 'italic' }}>
            {steps[currentStep].learningPrompt}
          </p>
          <details>
            <summary style={{ color: '#856404', cursor: 'pointer', fontWeight: 'bold' }}>
              💡 Click to see answer
            </summary>
            <p style={{ color: '#856404', margin: '10px 0 0 0', paddingLeft: '20px' }}>
              {steps[currentStep].answer}
            </p>
          </details>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            style={{
              backgroundColor: currentStep === 0 ? '#bdc3c7' : '#95a5a6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            ← Previous
          </button>
          
          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            style={{
              backgroundColor: currentStep === steps.length - 1 ? '#bdc3c7' : '#9b59b6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: currentStep === steps.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Practice Problems */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        padding: '25px',
        border: '2px solid #9b59b6'
      }}>
        <h3 style={{ color: '#9b59b6', marginBottom: '20px' }}>
          🎯 Practice Problems
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          {[
            { name: "Binary Search", difficulty: "Easy", time: "10 min" },
            { name: "Search Insert Position", difficulty: "Easy", time: "15 min" },
            { name: "Find First and Last Position", difficulty: "Medium", time: "25 min" },
            { name: "Search in Rotated Array", difficulty: "Medium", time: "30 min" },
            { name: "Find Peak Element", difficulty: "Medium", time: "20 min" },
            { name: "Median of Two Sorted Arrays", difficulty: "Hard", time: "45 min" }
          ].map((problem, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #dee2e6'
              }}
            >
              <h4 style={{ color: '#2c3e50', margin: '0 0 8px 0' }}>{problem.name}</h4>
              <div style={{ fontSize: '14px', color: '#666' }}>
                <span style={{ 
                  color: problem.difficulty === 'Easy' ? '#27ae60' : 
                        problem.difficulty === 'Medium' ? '#f39c12' : '#e74c3c' 
                }}>
                  {problem.difficulty}
                </span>
                {' • '}
                <span>{problem.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MCQ Section */}
      {patternMCQs.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px',
          border: '2px solid #3498db'
        }}>
          <h3 style={{ color: '#3498db', marginBottom: '20px', textAlign: 'center' }}>
            📝 Test Your Knowledge - Binary Search MCQs
          </h3>

          {/* MCQ Progress */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>
              Question {currentMCQIndex + 1} of {patternMCQs.length} |
              Score: {mcqScore}/{completedMCQs.size} |
              Accuracy: {completedMCQs.size > 0 ? Math.round((mcqScore / completedMCQs.size) * 100) : 0}%
            </span>
          </div>

          {/* Current MCQ */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>
              {patternMCQs[currentMCQIndex]?.question}
            </h4>

            <div style={{ display: 'grid', gap: '10px' }}>
              {patternMCQs[currentMCQIndex]?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showMCQResult && handleMCQAnswer(option)}
                  disabled={showMCQResult}
                  style={{
                    padding: '12px 16px',
                    border: '2px solid',
                    borderColor: showMCQResult
                      ? (option === patternMCQs[currentMCQIndex].answer ? '#27ae60'
                         : option === selectedAnswer ? '#e74c3c' : '#ddd')
                      : (selectedAnswer === option ? '#3498db' : '#ddd'),
                    borderRadius: '8px',
                    backgroundColor: showMCQResult
                      ? (option === patternMCQs[currentMCQIndex].answer ? '#d5f4e6'
                         : option === selectedAnswer ? '#fadbd8' : 'white')
                      : (selectedAnswer === option ? '#ebf3fd' : 'white'),
                    color: '#2c3e50',
                    cursor: showMCQResult ? 'default' : 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {String.fromCharCode(65 + index)}. {option}
                  {showMCQResult && option === patternMCQs[currentMCQIndex].answer && ' ✅'}
                  {showMCQResult && option === selectedAnswer && option !== patternMCQs[currentMCQIndex].answer && ' ❌'}
                </button>
              ))}
            </div>

            {showMCQResult && (
              <div style={{
                marginTop: '15px',
                padding: '15px',
                backgroundColor: selectedAnswer === patternMCQs[currentMCQIndex].answer ? '#d5f4e6' : '#fadbd8',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: selectedAnswer === patternMCQs[currentMCQIndex].answer ? '#27ae60' : '#e74c3c'
              }}>
                <strong style={{
                  color: selectedAnswer === patternMCQs[currentMCQIndex].answer ? '#27ae60' : '#e74c3c'
                }}>
                  {selectedAnswer === patternMCQs[currentMCQIndex].answer ? '🎉 Correct!' : '❌ Incorrect'}
                </strong>
                <p style={{ margin: '5px 0 0 0', color: '#2c3e50' }}>
                  <strong>Correct Answer:</strong> {patternMCQs[currentMCQIndex].answer}
                </p>
              </div>
            )}
          </div>

          {/* MCQ Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={previousMCQ}
              disabled={currentMCQIndex === 0}
              style={{
                backgroundColor: currentMCQIndex === 0 ? '#bdc3c7' : '#95a5a6',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: currentMCQIndex === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              ← Previous MCQ
            </button>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'flex',
                gap: '5px',
                justifyContent: 'center'
              }}>
                {patternMCQs.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor:
                        index === currentMCQIndex ? '#3498db' :
                        completedMCQs.has(index) ? '#27ae60' : '#ddd'
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={nextMCQ}
              disabled={currentMCQIndex === patternMCQs.length - 1}
              style={{
                backgroundColor: currentMCQIndex === patternMCQs.length - 1 ? '#bdc3c7' : '#3498db',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: currentMCQIndex === patternMCQs.length - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Next MCQ →
            </button>
          </div>
        </div>
      )}

      {/* Follow-up Prompts Section */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '2px solid #f39c12'
      }}>
        <h3 style={{ color: '#f39c12', marginBottom: '20px', textAlign: 'center' }}>
          💭 Follow-up Learning Prompts
        </h3>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: '25px' }}>
          Deepen your understanding by answering these thought-provoking questions
        </p>

        <div style={{ display: 'grid', gap: '20px' }}>
          {followUpPrompts.map((prompt, index) => (
            <div key={index} style={{
              backgroundColor: '#fef9e7',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #f1c40f'
            }}>
              <h4 style={{ color: '#f39c12', marginBottom: '10px' }}>
                {index + 1}. {prompt}
              </h4>
              <textarea
                value={followUpAnswers[prompt] || ''}
                onChange={(e) => handleFollowUpAnswer(prompt, e.target.value)}
                placeholder="Type your answer here..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <div style={{
            backgroundColor: '#e8f5e8',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #27ae60'
          }}>
            <strong style={{ color: '#27ae60' }}>
              📊 Progress: {Object.keys(followUpAnswers).length}/{followUpPrompts.length} prompts answered
            </strong>
            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
              Complete all prompts to master the Binary Search pattern!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BinarySearchPattern;
