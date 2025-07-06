import React, { useState } from 'react';
import questionsData from '../mcqs.json';

function SlidingWindowPattern() {
  const [currentStep, setCurrentStep] = useState(0);
  const [demoArray, setDemoArray] = useState([2, 1, 2, 3, 4, 1, 2, 1]);
  const [windowSize, setWindowSize] = useState(3);
  const [windowStart, setWindowStart] = useState(0);
  const [windowEnd, setWindowEnd] = useState(2);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSum, setCurrentSum] = useState(5);
  const [maxSum, setMaxSum] = useState(5);
  const [currentMCQIndex, setCurrentMCQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showMCQResult, setShowMCQResult] = useState(false);
  const [mcqScore, setMCQScore] = useState(0);
  const [completedMCQs, setCompletedMCQs] = useState(new Set());
  const [followUpAnswers, setFollowUpAnswers] = useState({});

  // Get MCQs for Sliding Window pattern
  const patternMCQs = questionsData["3. Sliding Window"] || [];

  const steps = [
    {
      title: "🪟 Understanding Sliding Window Pattern",
      content: "The Sliding Window technique maintains a subset of data (window) that slides through the array to solve subarray/substring problems efficiently.",
      code: `// Sliding Window Template
function slidingWindow(arr, k) {
    let windowSum = 0;
    let maxSum = 0;

    // Calculate sum of first window
    for (let i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    maxSum = windowSum;

    // Slide the window
    for (let i = k; i < arr.length; i++) {
        windowSum = windowSum - arr[i - k] + arr[i];
        maxSum = Math.max(maxSum, windowSum);
    }

    return maxSum;
}`,
      pseudocode: `ALGORITHM: Sliding Window Template

CONCEPT: Maintain a "window" of elements
that slides through the array

1. INITIALIZE:
   - windowSum = 0
   - maxSum = 0
   - window size = k

2. BUILD first window:
   FOR i = 0 to k-1:
     ADD arr[i] to windowSum
   SET maxSum = windowSum

3. SLIDE the window:
   FOR i = k to array.length-1:
     a. REMOVE leftmost element:
        windowSum -= arr[i-k]

     b. ADD new rightmost element:
        windowSum += arr[i]

     c. UPDATE maximum:
        maxSum = max(maxSum, windowSum)

4. RETURN maxSum

EFFICIENCY: O(n) vs O(n*k) brute force
KEY: Reuse previous calculation!`,
      learningPrompt: "Why is sliding window more efficient than recalculating each subarray?",
      answer: "Instead of recalculating the entire sum (O(k) for each position), we just remove the leftmost element and add the new rightmost element (O(1) per slide)."
    },
    {
      title: "📏 Step 1: Fixed vs Variable Window",
      content: "Identify whether you need a fixed-size window or a variable-size window based on the problem requirements.",
      code: `// Fixed Window (size k)
function maxSumSubarray(arr, k) {
    let windowSum = 0;

    // Initial window
    for (let i = 0; i < k; i++) {
        windowSum += arr[i];
    }

    let maxSum = windowSum;

    // Slide window
    for (let i = k; i < arr.length; i++) {
        windowSum = windowSum - arr[i - k] + arr[i];
        maxSum = Math.max(maxSum, windowSum);
    }

    return maxSum;
}

// Variable Window
function longestSubstringKDistinct(s, k) {
    let left = 0, maxLength = 0;
    let charCount = new Map();

    for (let right = 0; right < s.length; right++) {
        charCount.set(s[right], (charCount.get(s[right]) || 0) + 1);

        while (charCount.size > k) {
            charCount.set(s[left], charCount.get(s[left]) - 1);
            if (charCount.get(s[left]) === 0) {
                charCount.delete(s[left]);
            }
            left++;
        }

        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}`,
      pseudocode: `WINDOW TYPE DECISION TREE

FIXED WINDOW (Constant Size):
┌─ CHARACTERISTICS:
│  ├─ Window size = k (given)
│  ├─ Always same number of elements
│  └─ Slide by exactly 1 position
│
├─ ALGORITHM:
│  1. BUILD initial window of size k
│  2. FOR each slide:
│     a. REMOVE leftmost element
│     b. ADD new rightmost element
│     c. UPDATE result
│
└─ USE CASES:
   ├─ Maximum sum of k elements
   ├─ Average of k elements
   └─ Any fixed-size subarray problem

VARIABLE WINDOW (Dynamic Size):
┌─ CHARACTERISTICS:
│  ├─ Window size changes based on condition
│  ├─ Expand/contract as needed
│  └─ Two pointers: left & right
│
├─ ALGORITHM:
│  1. EXPAND right pointer
│  2. WHILE condition violated:
│     a. CONTRACT from left
│     b. UPDATE window state
│  3. UPDATE result with current window
│
└─ USE CASES:
   ├─ Longest substring with k distinct chars
   ├─ Minimum window substring
   └─ Subarray with target sum`,
      learningPrompt: "When do we use fixed vs variable window size?",
      answer: "Fixed window: when problem specifies exact size (e.g., 'subarray of size k'). Variable window: when we need to find optimal size based on conditions."
    },
    {
      title: "🎯 Step 2: Initialize Window",
      content: "Set up the initial window and calculate the initial state (sum, count, etc.).",
      code: `// Step 2: Window Initialization
function initializeWindow(arr, k) {
    let windowSum = 0;
    let windowStart = 0;
    let windowEnd = k - 1;
    
    // Calculate initial window sum
    for (let i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    
    console.log(\`Initial window: [\${windowStart}, \${windowEnd}]\`);
    console.log(\`Initial sum: \${windowSum}\`);
    
    return { windowSum, windowStart, windowEnd };
}

// For variable window
function initializeVariableWindow() {
    let left = 0;
    let right = 0;
    let windowState = new Map(); // or other data structure
    
    return { left, right, windowState };
}`,
      learningPrompt: "What should we track in the window state?",
      answer: "Depends on problem: sum (for max sum), character counts (for substring), frequency maps, or custom conditions."
    },
    {
      title: "➡️ Step 3: Slide the Window",
      content: "Move the window by removing the leftmost element and adding the new rightmost element.",
      code: `// Step 3: Window Sliding Logic
function slideWindow(arr, k) {
    let windowSum = 0;
    
    // Initialize first window
    for (let i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    
    let maxSum = windowSum;
    
    // Slide the window
    for (let windowEnd = k; windowEnd < arr.length; windowEnd++) {
        // Add new element to window
        windowSum += arr[windowEnd];
        
        // Remove element going out of window
        windowSum -= arr[windowEnd - k];
        
        // Update result
        maxSum = Math.max(maxSum, windowSum);
        
        console.log(\`Window: [\${windowEnd - k + 1}, \${windowEnd}], Sum: \${windowSum}\`);
    }
    
    return maxSum;
}`,
      learningPrompt: "What's the key insight in the sliding operation?",
      answer: "We maintain the window size by simultaneously adding one element and removing another, keeping the operation O(1) per slide."
    },
    {
      title: "🎮 Step 4: Interactive Demo",
      content: "Watch the sliding window algorithm find the maximum sum subarray of size k.",
      code: `// Live Demo: Maximum Sum Subarray
const arr = [2, 1, 2, 3, 4, 1, 2, 1];
const k = 3;

// Current window: [${windowStart}, ${windowEnd}]
// Window elements: [${demoArray.slice(windowStart, windowEnd + 1).join(', ')}]
// Current sum: ${currentSum}
// Maximum sum so far: ${maxSum}`,
      learningPrompt: "How does the window maintain its size while sliding?",
      answer: "By adding the new element at the right and removing the old element at the left simultaneously."
    },
    {
      title: "🔄 Step 5: Variable Window Patterns",
      content: "Learn how to handle variable-size windows that expand and contract based on conditions.",
      code: `// Variable Window: Longest Substring Without Repeating Characters
function lengthOfLongestSubstring(s) {
    let left = 0;
    let maxLength = 0;
    let charSet = new Set();
    
    for (let right = 0; right < s.length; right++) {
        // Expand window
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }
        
        charSet.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// Variable Window: Minimum Window Substring
function minWindow(s, t) {
    let left = 0, minLen = Infinity, minStart = 0;
    let required = new Map();
    let formed = 0;
    
    // Count characters in t
    for (let char of t) {
        required.set(char, (required.get(char) || 0) + 1);
    }
    
    let windowCounts = new Map();
    
    for (let right = 0; right < s.length; right++) {
        // Expand window
        let char = s[right];
        windowCounts.set(char, (windowCounts.get(char) || 0) + 1);
        
        if (required.has(char) && windowCounts.get(char) === required.get(char)) {
            formed++;
        }
        
        // Contract window
        while (left <= right && formed === required.size) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minStart = left;
            }
            
            let leftChar = s[left];
            windowCounts.set(leftChar, windowCounts.get(leftChar) - 1);
            if (required.has(leftChar) && windowCounts.get(leftChar) < required.get(leftChar)) {
                formed--;
            }
            left++;
        }
    }
    
    return minLen === Infinity ? "" : s.substring(minStart, minStart + minLen);
}`,
      learningPrompt: "When do we expand vs contract a variable window?",
      answer: "Expand when we haven't met the condition yet. Contract when we've met the condition and want to find the minimum valid window."
    }
  ];

  const runDemo = async () => {
    setIsRunning(true);
    let start = 0;
    let sum = demoArray.slice(0, windowSize).reduce((a, b) => a + b, 0);
    let max = sum;
    
    setWindowStart(start);
    setWindowEnd(windowSize - 1);
    setCurrentSum(sum);
    setMaxSum(max);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    for (let end = windowSize; end < demoArray.length; end++) {
      // Slide window
      sum = sum - demoArray[start] + demoArray[end];
      start++;
      max = Math.max(max, sum);
      
      setWindowStart(start);
      setWindowEnd(end);
      setCurrentSum(sum);
      setMaxSum(max);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    setIsRunning(false);
  };

  const resetDemo = () => {
    setWindowStart(0);
    setWindowEnd(windowSize - 1);
    setCurrentSum(demoArray.slice(0, windowSize).reduce((a, b) => a + b, 0));
    setMaxSum(demoArray.slice(0, windowSize).reduce((a, b) => a + b, 0));
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

  // Follow-up prompts specific to Sliding Window
  const followUpPrompts = [
    "Explain the difference between fixed-size and variable-size sliding windows.",
    "How would you identify if a problem requires a sliding window approach?",
    "What are the key optimization benefits of using sliding window over brute force?",
    "Describe a scenario where you would use a sliding window with a HashMap.",
    "How do you handle edge cases in sliding window problems (empty arrays, single elements)?"
  ];

  return (
    <div className="page-content" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#3498db', fontSize: '2.5em', marginBottom: '10px' }}>
          🪟 Sliding Window Pattern
        </h1>
        <p style={{ color: '#7f8c8d', fontSize: '1.2em', maxWidth: '800px', margin: '0 auto' }}>
          Master the sliding window technique to optimize subarray and substring problems
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
            backgroundColor: '#3498db',
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
              border: currentStep === index ? '2px solid #3498db' : '1px solid #ddd',
              borderRadius: '20px',
              backgroundColor: currentStep === index ? '#3498db' : 'white',
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
            border: '2px solid #3498db',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#3498db', marginBottom: '15px' }}>🎮 Live Demo: Maximum Sum Subarray</h3>
            
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
                        index >= windowStart && index <= windowEnd ? '#3498db' : '#ecf0f1',
                      color: (index >= windowStart && index <= windowEnd) ? 'white' : '#333',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      border: '2px solid',
                      borderColor: 
                        index >= windowStart && index <= windowEnd ? '#2980b9' : '#bdc3c7',
                      position: 'relative'
                    }}
                  >
                    {num}
                    {index === windowStart && (
                      <div style={{
                        position: 'absolute',
                        top: '-25px',
                        fontSize: '12px',
                        color: '#e74c3c',
                        fontWeight: 'bold'
                      }}>
                        Start
                      </div>
                    )}
                    {index === windowEnd && (
                      <div style={{
                        position: 'absolute',
                        top: '-25px',
                        fontSize: '12px',
                        color: '#e74c3c',
                        fontWeight: 'bold'
                      }}>
                        End
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
                <span>Window Size: {windowSize}</span>
                {' | '}
                <span>Current Sum: {currentSum}</span>
                {' | '}
                <span style={{ color: '#27ae60', fontWeight: 'bold' }}>Max Sum: {maxSum}</span>
              </div>
            </div>

            {/* Controls */}
            <div style={{ textAlign: 'center', gap: '10px', display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={runDemo}
                disabled={isRunning}
                style={{
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  opacity: isRunning ? 0.6 : 1
                }}
              >
                {isRunning ? '🔄 Sliding...' : '▶️ Run Demo'}
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
              backgroundColor: currentStep === steps.length - 1 ? '#bdc3c7' : '#3498db',
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
        border: '2px solid #3498db'
      }}>
        <h3 style={{ color: '#3498db', marginBottom: '20px' }}>
          🎯 Practice Problems
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          {[
            { name: "Maximum Sum Subarray of Size K", difficulty: "Easy", time: "15 min" },
            { name: "Longest Substring Without Repeating", difficulty: "Medium", time: "25 min" },
            { name: "Minimum Window Substring", difficulty: "Hard", time: "40 min" },
            { name: "Permutation in String", difficulty: "Medium", time: "30 min" },
            { name: "Longest Substring with K Distinct", difficulty: "Medium", time: "25 min" },
            { name: "Sliding Window Maximum", difficulty: "Hard", time: "35 min" }
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
            📝 Test Your Knowledge - Sliding Window MCQs
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
              Complete all prompts to master the Sliding Window pattern!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SlidingWindowPattern;
