import React, { useState } from 'react';
import questionsData from '../mcqs.json';

function TwoPointersPattern() {
  const [currentStep, setCurrentStep] = useState(0);
  const [demoArray, setDemoArray] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [target, setTarget] = useState(10);
  const [leftPointer, setLeftPointer] = useState(0);
  const [rightPointer, setRightPointer] = useState(8);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [currentMCQIndex, setCurrentMCQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showMCQResult, setShowMCQResult] = useState(false);
  const [mcqScore, setMCQScore] = useState(0);
  const [completedMCQs, setCompletedMCQs] = useState(new Set());
  const [followUpAnswers, setFollowUpAnswers] = useState({});

  // Get MCQs for Two Pointers pattern
  const patternMCQs = questionsData["1. Two Pointers"] || [];

  const steps = [
    {
      title: "🎯 Understanding Two Pointers Pattern",
      content: "The Two Pointers technique uses two pointers to traverse data structures, typically arrays or strings, to solve problems efficiently.",
      code: `// Two Pointers Template
function twoPointers(arr) {
    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
        // Process current pair
        if (condition) {
            // Found solution
            return [left, right];
        } else if (needToMoveLeft) {
            left++;
        } else {
            right--;
        }
    }
    return null;
}`,
      pseudocode: `ALGORITHM: Two Pointers Template

1. INITIALIZE:
   - left pointer = start of array (0)
   - right pointer = end of array (length-1)

2. WHILE left < right:
   a. EXAMINE current pair (arr[left], arr[right])

   b. IF condition is met:
      - RETURN solution (indices or values)

   c. ELSE IF need larger value:
      - MOVE left pointer forward (left++)

   d. ELSE:
      - MOVE right pointer backward (right--)

3. IF no solution found:
   - RETURN null or appropriate default

TIME: O(n) - single pass
SPACE: O(1) - constant extra space`,
      learningPrompt: "Why use two pointers instead of nested loops?",
      answer: "Two pointers reduce time complexity from O(n²) to O(n) by eliminating the need for nested iterations."
    },
    {
      title: "📋 Step 1: Problem Analysis",
      content: "Identify if the problem can use two pointers: sorted array, finding pairs, palindrome check, or removing duplicates.",
      code: `// Two Sum in Sorted Array
function twoSum(numbers, target) {
    let left = 0;
    let right = numbers.length - 1;

    while (left < right) {
        const sum = numbers[left] + numbers[right];

        if (sum === target) {
            return [left, right];
        } else if (sum < target) {
            left++;  // Need larger sum
        } else {
            right--; // Need smaller sum
        }
    }
    return [];
}`,
      pseudocode: `ALGORITHM: Two Sum Problem Analysis

PROBLEM: Find two numbers that sum to target

1. IDENTIFY pattern indicators:
   ✓ Array is sorted
   ✓ Looking for pair of elements
   ✓ Need to avoid O(n²) nested loops

2. CHOOSE pointer strategy:
   - Start from opposite ends
   - Move based on sum comparison

3. DECISION LOGIC:
   IF sum = target → Found solution
   IF sum < target → Need larger value
                   → Move left pointer →
   IF sum > target → Need smaller value
                   → Move right pointer ←

4. TERMINATION:
   - Pointers meet (left ≥ right)
   - Solution found

COMPLEXITY: O(n) time, O(1) space`,
      learningPrompt: "When should we move the left pointer vs right pointer?",
      answer: "Move left when we need a larger value, move right when we need a smaller value (in sorted arrays)."
    },
    {
      title: "🔧 Step 2: Initialize Pointers",
      content: "Set up pointers at appropriate positions - usually start and end for opposite direction movement.",
      code: `// Initialization patterns
// Pattern 1: Opposite ends
let left = 0, right = arr.length - 1;

// Pattern 2: Same start (fast/slow)
let slow = 0, fast = 0;

// Pattern 3: Sliding window
let left = 0, right = 0;`,
      pseudocode: `POINTER INITIALIZATION STRATEGIES

1. OPPOSITE ENDS PATTERN:
   - left = 0 (start)
   - right = length - 1 (end)
   - USE FOR: Two sum, palindrome check
   - MOVEMENT: Converge toward center

2. FAST/SLOW PATTERN:
   - slow = 0
   - fast = 0 (or 1)
   - USE FOR: Cycle detection, middle element
   - MOVEMENT: Different speeds

3. SLIDING WINDOW PATTERN:
   - left = 0
   - right = 0
   - USE FOR: Subarray problems
   - MOVEMENT: Expand/contract window

CHOOSE BASED ON:
- Problem type
- Data structure
- Required traversal pattern`,
      learningPrompt: "What are the different ways to initialize two pointers?",
      answer: "1) Opposite ends (left=0, right=n-1), 2) Same start (slow=0, fast=0), 3) Sliding window (both start at 0)"
    },
    {
      title: "⚡ Step 3: Movement Logic",
      content: "Define the conditions for moving each pointer based on the problem requirements.",
      code: `// Movement strategies
while (left < right) {
    if (condition_met) {
        return result;
    }

    // Strategy 1: Based on comparison
    if (sum < target) left++;
    else right--;

    // Strategy 2: Always move one
    if (arr[left] === arr[right]) {
        left++; right--;
    }

    // Strategy 3: Conditional movement
    if (isValid(left, right)) {
        process(left, right);
    }
    movePointers();
}`,
      pseudocode: `MOVEMENT DECISION LOGIC

WHILE pointers haven't crossed:

1. CHECK termination condition:
   IF solution found → RETURN result

2. CHOOSE movement strategy:

   STRATEGY A - Comparison Based:
   ├─ IF current_value < target
   │  └─ MOVE left pointer → (increase)
   └─ ELSE
      └─ MOVE right pointer ← (decrease)

   STRATEGY B - Symmetric Movement:
   ├─ IF elements are equal
   │  └─ MOVE both pointers
   └─ ELSE handle asymmetrically

   STRATEGY C - Conditional:
   ├─ IF condition is valid
   │  ├─ PROCESS current pair
   │  └─ MOVE appropriate pointer
   └─ ELSE skip/adjust

3. UPDATE pointers based on strategy

KEY: Movement logic depends on:
- Problem constraints
- Current state evaluation
- Optimization goals`,
      learningPrompt: "How do we decide which pointer to move?",
      answer: "Base the decision on problem logic: comparison results, validity checks, or alternating movement patterns."
    },
    {
      title: "🎮 Step 4: Interactive Demo",
      content: "Watch the two pointers algorithm in action with a live demonstration.",
      code: `// Live Demo: Two Sum
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const target = 10;

// Current state:
// Left pointer: ${leftPointer} (value: ${demoArray[leftPointer]})
// Right pointer: ${rightPointer} (value: ${demoArray[rightPointer]})
// Sum: ${demoArray[leftPointer] + demoArray[rightPointer]}`,
      pseudocode: `INTERACTIVE DEMO WALKTHROUGH

ARRAY: [1, 2, 3, 4, 5, 6, 7, 8, 9]
TARGET: 10

STEP-BY-STEP EXECUTION:

1. INITIALIZE:
   left = 0 (value: 1)
   right = 8 (value: 9)

2. ITERATION LOOP:
   ┌─ CALCULATE sum = arr[left] + arr[right]
   ├─ COMPARE sum with target
   ├─ DECIDE which pointer to move
   └─ UPDATE pointer position

3. VISUAL TRACKING:
   [1, 2, 3, 4, 5, 6, 7, 8, 9]
    ↑                       ↑
   left                   right

4. TERMINATION CONDITIONS:
   ✓ sum = target (SUCCESS)
   ✗ left ≥ right (NO SOLUTION)

Watch how pointers converge!`,
      learningPrompt: "What happens when sum equals target?",
      answer: "We found our answer! Return the indices or values of the two pointers."
    },
    {
      title: "🏆 Step 5: Common Variations",
      content: "Master different two-pointer patterns for various problem types.",
      code: `// Variation 1: Remove Duplicates
function removeDuplicates(arr) {
    let writeIndex = 1;
    for (let readIndex = 1; readIndex < arr.length; readIndex++) {
        if (arr[readIndex] !== arr[readIndex - 1]) {
            arr[writeIndex] = arr[readIndex];
            writeIndex++;
        }
    }
    return writeIndex;
}

// Variation 2: Palindrome Check
function isPalindrome(s) {
    let left = 0, right = s.length - 1;
    while (left < right) {
        if (s[left] !== s[right]) return false;
        left++; right--;
    }
    return true;
}`,
      pseudocode: `COMMON TWO-POINTER VARIATIONS

VARIATION 1: Remove Duplicates (Same Direction)
┌─ SETUP: write=1, read=1
├─ SCAN: read pointer advances each step
├─ COMPARE: current vs previous element
├─ WRITE: only when different
└─ RESULT: new length without duplicates

VARIATION 2: Palindrome Check (Opposite Direction)
┌─ SETUP: left=0, right=end
├─ COMPARE: characters at both ends
├─ MOVE: both pointers toward center
└─ RESULT: true if all pairs match

VARIATION 3: Fast/Slow (Different Speeds)
┌─ SETUP: slow=0, fast=0
├─ MOVE: slow+1, fast+2 each iteration
├─ USE: cycle detection, middle finding
└─ MEET: when cycle exists

PATTERN SELECTION:
- Sorted array → Opposite ends
- Duplicates → Same direction
- Cycles → Fast/slow speeds`,
      learningPrompt: "What are the main variations of two pointers?",
      answer: "1) Opposite direction (palindrome), 2) Same direction (remove duplicates), 3) Fast/slow (cycle detection)"
    }
  ];

  const runDemo = async () => {
    setIsRunning(true);
    setResult(null);
    let left = 0;
    let right = demoArray.length - 1;

    while (left < right) {
      setLeftPointer(left);
      setRightPointer(right);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sum = demoArray[left] + demoArray[right];
      
      if (sum === target) {
        setResult(`Found! ${demoArray[left]} + ${demoArray[right]} = ${target}`);
        setIsRunning(false);
        return;
      } else if (sum < target) {
        left++;
      } else {
        right--;
      }
    }
    
    setResult("No solution found");
    setIsRunning(false);
  };

  const resetDemo = () => {
    setLeftPointer(0);
    setRightPointer(demoArray.length - 1);
    setResult(null);
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

  // Follow-up prompts specific to Two Pointers
  const followUpPrompts = [
    "Describe a real-world scenario where you would use the two pointers technique.",
    "What are the key indicators that a problem can be solved using two pointers?",
    "How would you modify the two pointers approach for a 3Sum problem?",
    "Explain the difference between fast/slow pointers and opposite-direction pointers.",
    "What are the common pitfalls when implementing two pointers algorithms?"
  ];

  return (
    <div className="page-content" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#27ae60', fontSize: '2.5em', marginBottom: '10px' }}>
          🎯 Two Pointers Pattern
        </h1>
        <p style={{ color: '#7f8c8d', fontSize: '1.2em', maxWidth: '800px', margin: '0 auto' }}>
          Master the two pointers technique to solve array and string problems efficiently
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
            backgroundColor: '#27ae60',
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
              border: currentStep === index ? '2px solid #27ae60' : '1px solid #ddd',
              borderRadius: '20px',
              backgroundColor: currentStep === index ? '#27ae60' : 'white',
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
            border: '2px solid #27ae60',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#27ae60', marginBottom: '15px' }}>🎮 Live Demo</h3>
            
            {/* Array Visualization */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginBottom: '10px' }}>
                {demoArray.map((num, index) => (
                  <div
                    key={index}
                    style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 
                        index === leftPointer ? '#e74c3c' :
                        index === rightPointer ? '#3498db' : '#ecf0f1',
                      color: (index === leftPointer || index === rightPointer) ? 'white' : '#333',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      border: '2px solid',
                      borderColor: 
                        index === leftPointer ? '#c0392b' :
                        index === rightPointer ? '#2980b9' : '#bdc3c7'
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
              
              <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
                <span style={{ color: '#e74c3c' }}>🔴 Left: {leftPointer}</span>
                {' | '}
                <span style={{ color: '#3498db' }}>🔵 Right: {rightPointer}</span>
                {' | '}
                <span>Target: {target}</span>
                {' | '}
                <span>Sum: {demoArray[leftPointer] + demoArray[rightPointer]}</span>
              </div>
            </div>

            {/* Controls */}
            <div style={{ textAlign: 'center', gap: '10px', display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={runDemo}
                disabled={isRunning}
                style={{
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  opacity: isRunning ? 0.6 : 1
                }}
              >
                {isRunning ? '🔄 Running...' : '▶️ Run Demo'}
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
              backgroundColor: currentStep === steps.length - 1 ? '#bdc3c7' : '#27ae60',
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
        border: '2px solid #27ae60'
      }}>
        <h3 style={{ color: '#27ae60', marginBottom: '20px' }}>
          🎯 Practice Problems
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          {[
            { name: "Two Sum", difficulty: "Easy", time: "15 min" },
            { name: "Three Sum", difficulty: "Medium", time: "25 min" },
            { name: "Remove Duplicates", difficulty: "Easy", time: "10 min" },
            { name: "Container With Most Water", difficulty: "Medium", time: "20 min" },
            { name: "Valid Palindrome", difficulty: "Easy", time: "15 min" },
            { name: "Trapping Rain Water", difficulty: "Hard", time: "35 min" }
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
            📝 Test Your Knowledge - Two Pointers MCQs
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
              Complete all prompts to master the Two Pointers pattern!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TwoPointersPattern;
