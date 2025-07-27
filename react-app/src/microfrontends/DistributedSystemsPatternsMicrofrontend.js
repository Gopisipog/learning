import React, { useState, useEffect } from 'react';
import './DistributedSystemsPatterns.css';

const DistributedSystemsPatternsMicrofrontend = () => {
  const [selectedCategory, setSelectedCategory] = useState('communication');
  const [studyMode, setStudyMode] = useState('overview'); // overview, flashcards, quiz, printable
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyProgress, setStudyProgress] = useState({});
  const [selectedPatterns, setSelectedPatterns] = useState([]);

  // Distributed Systems Patterns organized by category
  const patterns = {
    communication: {
      title: "🔗 Communication Patterns",
      description: "Patterns for reliable communication between distributed nodes",
      patterns: [
        {
          id: 'single-socket-channel',
          name: 'Single Socket Channel',
          problem: 'How to maintain order of requests sent to a server while keeping connection costs low?',
          solution: 'Use a single TCP connection between follower and leader to ensure message ordering with built-in retry mechanism.',
          keyPoints: [
            'Maintains message order using TCP guarantees',
            'Reduces connection overhead',
            'Built-in retry mechanism for lost messages',
            'Serializes updates using Singular Update Queue'
          ],
          useCases: ['Leader-Follower communication', 'Database replication', 'Message ordering'],
          implementation: `// Single Socket Channel Implementation
class SingleSocketChannel {
  constructor(serverAddress) {
    this.socket = new Socket(serverAddress);
    this.messageQueue = new Queue();
    this.isConnected = false;
  }
  
  async connect() {
    try {
      await this.socket.connect();
      this.isConnected = true;
      this.startMessageProcessor();
    } catch (error) {
      console.error('Connection failed:', error);
      setTimeout(() => this.connect(), 1000); // Retry
    }
  }
  
  sendMessage(message) {
    if (this.isConnected) {
      this.socket.send(message);
    } else {
      this.messageQueue.enqueue(message);
    }
  }
  
  startMessageProcessor() {
    // Process queued messages in order
    while (!this.messageQueue.isEmpty()) {
      const message = this.messageQueue.dequeue();
      this.socket.send(message);
    }
  }
}`,
          relatedPatterns: ['Singular Update Queue', 'Leader Follower', 'Heartbeat'],
          difficulty: 'Beginner',
          category: 'Communication'
        },
        {
          id: 'singular-update-queue',
          name: 'Singular Update Queue',
          problem: 'How to handle concurrent state updates safely without blocking all threads?',
          solution: 'Use a single thread with a work queue to process state changes one-at-a-time while allowing concurrent submissions.',
          keyPoints: [
            'Single thread processes updates sequentially',
            'Multiple clients can submit concurrently',
            'Non-blocking for submitting clients',
            'Maintains consistency without locks'
          ],
          useCases: ['Write-Ahead Log processing', 'State machine updates', 'Event processing'],
          implementation: `// Singular Update Queue Implementation
class SingularUpdateQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }
  
  async submitUpdate(updateFunction) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        update: updateFunction,
        resolve,
        reject
      });
      
      if (!this.processing) {
        this.processQueue();
      }
    });
  }
  
  async processQueue() {
    this.processing = true;
    
    while (this.queue.length > 0) {
      const { update, resolve, reject } = this.queue.shift();
      
      try {
        const result = await update();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }
    
    this.processing = false;
  }
}`,
          relatedPatterns: ['Single Socket Channel', 'Write-Ahead Log', 'Request Pipeline'],
          difficulty: 'Intermediate',
          category: 'Communication'
        },
        {
          id: 'request-pipeline',
          name: 'Request Pipeline',
          problem: 'How to improve throughput when processing multiple requests that have dependencies?',
          solution: 'Pipeline requests to allow multiple requests to be processed concurrently while maintaining order.',
          keyPoints: [
            'Overlaps request processing stages',
            'Maintains request ordering',
            'Improves overall throughput',
            'Handles backpressure gracefully'
          ],
          useCases: ['Database query processing', 'Network request handling', 'Batch processing'],
          implementation: `// Request Pipeline Implementation
class RequestPipeline {
  constructor(stages) {
    this.stages = stages;
    this.queues = stages.map(() => []);
    this.processing = stages.map(() => false);
  }
  
  async processRequest(request) {
    // Add to first stage
    this.queues[0].push(request);
    this.processStage(0);
    
    return request.promise;
  }
  
  async processStage(stageIndex) {
    if (this.processing[stageIndex] || this.queues[stageIndex].length === 0) {
      return;
    }
    
    this.processing[stageIndex] = true;
    
    while (this.queues[stageIndex].length > 0) {
      const request = this.queues[stageIndex].shift();
      
      try {
        const result = await this.stages[stageIndex](request);
        
        if (stageIndex < this.stages.length - 1) {
          // Move to next stage
          this.queues[stageIndex + 1].push({ ...request, result });
          this.processStage(stageIndex + 1);
        } else {
          // Final stage - resolve
          request.resolve(result);
        }
      } catch (error) {
        request.reject(error);
      }
    }
    
    this.processing[stageIndex] = false;
  }
}`,
          relatedPatterns: ['Request Batch', 'Request Waiting List', 'Singular Update Queue'],
          difficulty: 'Advanced',
          category: 'Communication'
        }
      ]
    },
    timing: {
      title: "⏰ Timing & Synchronization",
      description: "Patterns for handling time and synchronization in distributed systems",
      patterns: [
        {
          id: 'clock-bound-wait',
          name: 'Clock-Bound Wait',
          problem: 'How to handle clock uncertainty when reading/writing timestamped values across cluster nodes?',
          solution: 'Wait until clock values on all nodes are guaranteed to be above the timestamp before proceeding.',
          keyPoints: [
            'Accounts for maximum clock offset',
            'Ensures external consistency',
            'Prevents reading stale data',
            'Adds controlled latency for correctness'
          ],
          useCases: ['Distributed databases', 'Timestamp-based versioning', 'Global consistency'],
          implementation: `// Clock-Bound Wait Implementation
class ClockBoundWait {
  constructor(maxClockOffset = 10) { // 10ms default
    this.maxClockOffset = maxClockOffset;
  }
  
  async writeWithTimestamp(key, value, timestamp) {
    // Wait for clock uncertainty
    const waitUntil = timestamp + this.maxClockOffset;
    const currentTime = Date.now();
    
    if (currentTime < waitUntil) {
      await this.sleep(waitUntil - currentTime);
    }
    
    // Now safe to write
    return this.store.write(key, value, timestamp);
  }
  
  async readWithTimestamp(timestamp) {
    // Ensure we don't read before timestamp is safe
    const waitUntil = timestamp + this.maxClockOffset;
    const currentTime = Date.now();
    
    if (currentTime < waitUntil) {
      await this.sleep(waitUntil - currentTime);
    }
    
    return this.store.read(timestamp);
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}`,
          relatedPatterns: ['Hybrid Clock', 'Lamport Clock', 'Versioned Value'],
          difficulty: 'Advanced',
          category: 'Timing'
        },
        {
          id: 'lamport-clock',
          name: 'Lamport Clock',
          problem: 'How to order events in a distributed system without synchronized physical clocks?',
          solution: 'Use logical timestamps that increment with each event and update based on message exchanges.',
          keyPoints: [
            'Logical time ordering',
            'Happens-before relationship',
            'No need for synchronized clocks',
            'Partial ordering of events'
          ],
          useCases: ['Event ordering', 'Causal consistency', 'Distributed debugging'],
          implementation: `// Lamport Clock Implementation
class LamportClock {
  constructor(nodeId) {
    this.nodeId = nodeId;
    this.time = 0;
  }
  
  tick() {
    this.time += 1;
    return this.time;
  }
  
  sendMessage(message) {
    const timestamp = this.tick();
    return {
      ...message,
      timestamp,
      nodeId: this.nodeId
    };
  }
  
  receiveMessage(message) {
    // Update clock based on received message
    this.time = Math.max(this.time, message.timestamp) + 1;
    
    return {
      ...message,
      receivedAt: this.time
    };
  }
  
  compare(event1, event2) {
    if (event1.timestamp < event2.timestamp) return -1;
    if (event1.timestamp > event2.timestamp) return 1;
    
    // If timestamps equal, use node ID for total ordering
    if (event1.nodeId < event2.nodeId) return -1;
    if (event1.nodeId > event2.nodeId) return 1;
    
    return 0;
  }
}`,
          relatedPatterns: ['Hybrid Clock', 'Vector Clock', 'Happened-Before'],
          difficulty: 'Intermediate',
          category: 'Timing'
        },
        {
          id: 'hybrid-clock',
          name: 'Hybrid Clock',
          problem: 'How to combine benefits of physical and logical clocks for better event ordering?',
          solution: 'Combine physical timestamps with logical counters to get both wall-clock time and causal ordering.',
          keyPoints: [
            'Combines physical and logical time',
            'Preserves wall-clock ordering when possible',
            'Handles clock skew gracefully',
            'Better than pure logical clocks for debugging'
          ],
          useCases: ['Distributed databases', 'Event sourcing', 'Conflict resolution'],
          implementation: `// Hybrid Clock Implementation
class HybridClock {
  constructor(nodeId) {
    this.nodeId = nodeId;
    this.logicalTime = 0;
    this.lastPhysicalTime = 0;
  }
  
  now() {
    const physicalTime = Date.now();
    
    if (physicalTime > this.lastPhysicalTime) {
      this.lastPhysicalTime = physicalTime;
      this.logicalTime = 0;
    } else {
      this.logicalTime += 1;
    }
    
    return {
      physical: this.lastPhysicalTime,
      logical: this.logicalTime,
      nodeId: this.nodeId
    };
  }
  
  update(remoteTimestamp) {
    const physicalTime = Date.now();
    const maxPhysical = Math.max(physicalTime, remoteTimestamp.physical);
    
    if (maxPhysical === this.lastPhysicalTime) {
      this.logicalTime = Math.max(this.logicalTime, remoteTimestamp.logical) + 1;
    } else if (maxPhysical === physicalTime) {
      this.lastPhysicalTime = physicalTime;
      this.logicalTime = Math.max(0, remoteTimestamp.logical + 1);
    } else {
      this.lastPhysicalTime = remoteTimestamp.physical;
      this.logicalTime = remoteTimestamp.logical + 1;
    }
    
    return this.now();
  }
  
  compare(ts1, ts2) {
    if (ts1.physical !== ts2.physical) {
      return ts1.physical - ts2.physical;
    }
    if (ts1.logical !== ts2.logical) {
      return ts1.logical - ts2.logical;
    }
    return ts1.nodeId.localeCompare(ts2.nodeId);
  }
}`,
          relatedPatterns: ['Lamport Clock', 'Clock-Bound Wait', 'Versioned Value'],
          difficulty: 'Advanced',
          category: 'Timing'
        }
      ]
    },
    consensus: {
      title: "🤝 Consensus & Leadership",
      description: "Patterns for achieving agreement and leadership in distributed systems",
      patterns: [
        {
          id: 'leader-follower',
          name: 'Leader Follower',
          problem: 'How to coordinate updates across multiple nodes while maintaining consistency?',
          solution: 'Designate one node as leader to handle all writes, with followers replicating the changes.',
          keyPoints: [
            'Single point of coordination',
            'Leader handles all writes',
            'Followers replicate changes',
            'Provides strong consistency'
          ],
          useCases: ['Database replication', 'Distributed consensus', 'State machine replication'],
          implementation: `// Leader Follower Implementation
class LeaderFollower {
  constructor(nodeId, nodes) {
    this.nodeId = nodeId;
    this.nodes = nodes;
    this.isLeader = false;
    this.currentTerm = 0;
    this.log = [];
    this.followers = new Set();
  }

  async becomeLeader() {
    this.isLeader = true;
    this.currentTerm += 1;

    // Send heartbeats to establish leadership
    for (const node of this.nodes) {
      if (node !== this.nodeId) {
        await this.sendHeartbeat(node);
      }
    }
  }

  async appendEntry(entry) {
    if (!this.isLeader) {
      throw new Error('Only leader can append entries');
    }

    const logEntry = {
      term: this.currentTerm,
      index: this.log.length,
      data: entry,
      timestamp: Date.now()
    };

    this.log.push(logEntry);

    // Replicate to followers
    const promises = Array.from(this.followers).map(follower =>
      this.replicateToFollower(follower, logEntry)
    );

    // Wait for majority acknowledgment
    const responses = await Promise.allSettled(promises);
    const successCount = responses.filter(r => r.status === 'fulfilled').length;

    if (successCount >= Math.floor(this.followers.size / 2)) {
      return { success: true, index: logEntry.index };
    } else {
      throw new Error('Failed to achieve majority consensus');
    }
  }

  async replicateToFollower(follower, entry) {
    // Send entry to follower and wait for acknowledgment
    return this.sendMessage(follower, {
      type: 'APPEND_ENTRY',
      entry,
      term: this.currentTerm,
      leaderId: this.nodeId
    });
  }
}`,
          relatedPatterns: ['Emergent Leader', 'Majority Quorum', 'Heartbeat'],
          difficulty: 'Intermediate',
          category: 'Consensus'
        },
        {
          id: 'emergent-leader',
          name: 'Emergent Leader',
          problem: 'How to elect a leader when the current leader fails or when starting a new cluster?',
          solution: 'Use an election algorithm where nodes vote for themselves or others to emerge as the new leader.',
          keyPoints: [
            'Democratic leader election',
            'Handles leader failures',
            'Prevents split-brain scenarios',
            'Uses voting mechanisms'
          ],
          useCases: ['Leader election', 'Fault tolerance', 'Cluster coordination'],
          implementation: `// Emergent Leader Implementation (Raft-style)
class EmergentLeader {
  constructor(nodeId, nodes) {
    this.nodeId = nodeId;
    this.nodes = nodes;
    this.state = 'FOLLOWER'; // FOLLOWER, CANDIDATE, LEADER
    this.currentTerm = 0;
    this.votedFor = null;
    this.votes = new Set();
    this.electionTimeout = null;
  }

  startElection() {
    this.state = 'CANDIDATE';
    this.currentTerm += 1;
    this.votedFor = this.nodeId;
    this.votes.clear();
    this.votes.add(this.nodeId);

    // Request votes from other nodes
    for (const node of this.nodes) {
      if (node !== this.nodeId) {
        this.requestVote(node);
      }
    }

    // Set election timeout
    this.resetElectionTimeout();
  }

  async requestVote(nodeId) {
    const response = await this.sendMessage(nodeId, {
      type: 'VOTE_REQUEST',
      term: this.currentTerm,
      candidateId: this.nodeId,
      lastLogIndex: this.log.length - 1,
      lastLogTerm: this.getLastLogTerm()
    });

    if (response.voteGranted) {
      this.votes.add(nodeId);

      // Check if we have majority
      if (this.votes.size > Math.floor(this.nodes.length / 2)) {
        this.becomeLeader();
      }
    }
  }

  handleVoteRequest(request) {
    if (request.term > this.currentTerm) {
      this.currentTerm = request.term;
      this.votedFor = null;
      this.state = 'FOLLOWER';
    }

    const voteGranted = (
      request.term >= this.currentTerm &&
      (this.votedFor === null || this.votedFor === request.candidateId) &&
      this.isLogUpToDate(request.lastLogIndex, request.lastLogTerm)
    );

    if (voteGranted) {
      this.votedFor = request.candidateId;
      this.resetElectionTimeout();
    }

    return { voteGranted, term: this.currentTerm };
  }

  becomeLeader() {
    this.state = 'LEADER';
    this.clearElectionTimeout();

    // Send heartbeats to maintain leadership
    this.startHeartbeats();
  }

  resetElectionTimeout() {
    this.clearElectionTimeout();
    const timeout = 150 + Math.random() * 150; // 150-300ms
    this.electionTimeout = setTimeout(() => {
      if (this.state !== 'LEADER') {
        this.startElection();
      }
    }, timeout);
  }
}`,
          relatedPatterns: ['Leader Follower', 'Majority Quorum', 'Generation Clock'],
          difficulty: 'Advanced',
          category: 'Consensus'
        },
        {
          id: 'majority-quorum',
          name: 'Majority Quorum',
          problem: 'How to ensure consistency when some nodes might be unavailable or partitioned?',
          solution: 'Require majority of nodes to agree before committing any operation to ensure consistency.',
          keyPoints: [
            'Requires majority agreement',
            'Tolerates minority failures',
            'Prevents split-brain',
            'Ensures strong consistency'
          ],
          useCases: ['Distributed consensus', 'Configuration management', 'Leader election'],
          implementation: `// Majority Quorum Implementation
class MajorityQuorum {
  constructor(nodeId, nodes) {
    this.nodeId = nodeId;
    this.nodes = nodes;
    this.quorumSize = Math.floor(nodes.length / 2) + 1;
    this.pendingOperations = new Map();
  }

  async executeOperation(operation) {
    const operationId = this.generateOperationId();
    const proposal = {
      id: operationId,
      operation,
      timestamp: Date.now(),
      proposer: this.nodeId
    };

    // Store pending operation
    this.pendingOperations.set(operationId, {
      proposal,
      votes: new Set([this.nodeId]),
      responses: new Map()
    });

    // Send proposal to all nodes
    const promises = this.nodes
      .filter(node => node !== this.nodeId)
      .map(node => this.sendProposal(node, proposal));

    try {
      const responses = await Promise.allSettled(promises);
      return this.processResponses(operationId, responses);
    } catch (error) {
      this.pendingOperations.delete(operationId);
      throw error;
    }
  }

  async sendProposal(nodeId, proposal) {
    const response = await this.sendMessage(nodeId, {
      type: 'PROPOSAL',
      proposal
    });

    return { nodeId, response };
  }

  processResponses(operationId, responses) {
    const pending = this.pendingOperations.get(operationId);
    if (!pending) return null;

    // Count successful responses
    responses.forEach(result => {
      if (result.status === 'fulfilled' && result.value.response.accepted) {
        pending.votes.add(result.value.nodeId);
        pending.responses.set(result.value.nodeId, result.value.response);
      }
    });

    // Check if we have quorum
    if (pending.votes.size >= this.quorumSize) {
      // Execute operation
      const result = this.applyOperation(pending.proposal.operation);

      // Notify all nodes of commitment
      this.broadcastCommit(operationId, result);

      this.pendingOperations.delete(operationId);
      return result;
    } else {
      this.pendingOperations.delete(operationId);
      throw new Error('Failed to achieve quorum');
    }
  }

  handleProposal(proposal) {
    // Validate proposal
    if (this.isValidProposal(proposal)) {
      return { accepted: true, nodeId: this.nodeId };
    } else {
      return { accepted: false, reason: 'Invalid proposal' };
    }
  }

  isValidProposal(proposal) {
    // Add validation logic here
    return proposal && proposal.operation && proposal.proposer;
  }

  applyOperation(operation) {
    // Apply the operation to local state
    return this.executeLocalOperation(operation);
  }
}`,
          relatedPatterns: ['Leader Follower', 'Paxos', 'Consistent Core'],
          difficulty: 'Advanced',
          category: 'Consensus'
        }
      ]
    },
    storage: {
      title: "💾 Storage & Persistence",
      description: "Patterns for reliable data storage and persistence in distributed systems",
      patterns: [
        {
          id: 'replicated-log',
          name: 'Replicated Log',
          problem: 'How to maintain consistent ordering of operations across multiple nodes?',
          solution: 'Maintain an ordered log of operations that is replicated across all nodes in the same order.',
          keyPoints: [
            'Ordered sequence of operations',
            'Replicated across all nodes',
            'Ensures consistent state',
            'Supports replay and recovery'
          ],
          useCases: ['State machine replication', 'Event sourcing', 'Database replication'],
          implementation: `// Replicated Log Implementation
class ReplicatedLog {
  constructor(nodeId) {
    this.nodeId = nodeId;
    this.log = [];
    this.commitIndex = -1;
    this.lastApplied = -1;
    this.nextIndex = new Map();
    this.matchIndex = new Map();
  }

  async appendEntry(entry) {
    const logEntry = {
      term: this.currentTerm,
      index: this.log.length,
      data: entry,
      timestamp: Date.now()
    };

    this.log.push(logEntry);

    // Replicate to followers
    if (this.isLeader) {
      await this.replicateToFollowers(logEntry);
    }

    return logEntry.index;
  }

  async replicateToFollowers(entry) {
    const promises = this.followers.map(async (follower) => {
      const nextIndex = this.nextIndex.get(follower) || 0;
      const prevLogIndex = nextIndex - 1;
      const prevLogTerm = prevLogIndex >= 0 ? this.log[prevLogIndex].term : 0;

      const request = {
        term: this.currentTerm,
        leaderId: this.nodeId,
        prevLogIndex,
        prevLogTerm,
        entries: this.log.slice(nextIndex),
        leaderCommit: this.commitIndex
      };

      try {
        const response = await this.sendAppendEntries(follower, request);

        if (response.success) {
          this.nextIndex.set(follower, this.log.length);
          this.matchIndex.set(follower, this.log.length - 1);
        } else {
          // Decrement nextIndex and retry
          const currentNext = this.nextIndex.get(follower) || 0;
          this.nextIndex.set(follower, Math.max(0, currentNext - 1));
        }

        return response;
      } catch (error) {
        console.error(\`Failed to replicate to \${follower}:\`, error);
        return { success: false, error };
      }
    });

    const responses = await Promise.allSettled(promises);

    // Update commit index if majority succeeded
    this.updateCommitIndex();

    return responses;
  }

  handleAppendEntries(request) {
    // Reset election timeout
    this.resetElectionTimeout();

    // Check term
    if (request.term < this.currentTerm) {
      return { success: false, term: this.currentTerm };
    }

    // Check log consistency
    if (request.prevLogIndex >= 0) {
      if (this.log.length <= request.prevLogIndex ||
          this.log[request.prevLogIndex].term !== request.prevLogTerm) {
        return { success: false, term: this.currentTerm };
      }
    }

    // Append new entries
    if (request.entries.length > 0) {
      // Remove conflicting entries
      this.log = this.log.slice(0, request.prevLogIndex + 1);

      // Append new entries
      this.log.push(...request.entries);
    }

    // Update commit index
    if (request.leaderCommit > this.commitIndex) {
      this.commitIndex = Math.min(request.leaderCommit, this.log.length - 1);
      this.applyCommittedEntries();
    }

    return { success: true, term: this.currentTerm };
  }

  updateCommitIndex() {
    // Find highest index replicated on majority
    for (let i = this.log.length - 1; i > this.commitIndex; i--) {
      if (this.log[i].term === this.currentTerm) {
        let replicationCount = 1; // Count self

        for (const matchIndex of this.matchIndex.values()) {
          if (matchIndex >= i) {
            replicationCount++;
          }
        }

        if (replicationCount > Math.floor(this.followers.length / 2)) {
          this.commitIndex = i;
          this.applyCommittedEntries();
          break;
        }
      }
    }
  }

  applyCommittedEntries() {
    while (this.lastApplied < this.commitIndex) {
      this.lastApplied++;
      const entry = this.log[this.lastApplied];
      this.applyToStateMachine(entry.data);
    }
  }
}`,
          relatedPatterns: ['Leader Follower', 'Segmented Log', 'Write-Ahead Log'],
          difficulty: 'Advanced',
          category: 'Storage'
        }
      ]
    }
  };

  // Get all patterns for flashcards
  const getAllPatterns = () => {
    return Object.values(patterns).flatMap(category => category.patterns);
  };

  // Initialize study progress
  useEffect(() => {
    const allPatterns = getAllPatterns();
    const initialProgress = {};
    allPatterns.forEach(pattern => {
      initialProgress[pattern.id] = {
        studied: false,
        confidence: 0,
        lastReviewed: null
      };
    });
    setStudyProgress(initialProgress);
  }, []);

  const handlePatternSelect = (patternId) => {
    setSelectedPatterns(prev => 
      prev.includes(patternId) 
        ? prev.filter(id => id !== patternId)
        : [...prev, patternId]
    );
  };

  const markAsStudied = (patternId) => {
    setStudyProgress(prev => ({
      ...prev,
      [patternId]: {
        ...prev[patternId],
        studied: true,
        lastReviewed: new Date().toISOString()
      }
    }));
  };

  const updateConfidence = (patternId, confidence) => {
    setStudyProgress(prev => ({
      ...prev,
      [patternId]: {
        ...prev[patternId],
        confidence
      }
    }));
  };

  // Flashcard Mode Component
  const FlashcardMode = ({ patterns, selectedPatterns, studyProgress, updateConfidence, markAsStudied }) => {
    const studyPatterns = selectedPatterns.length > 0
      ? patterns.filter(p => selectedPatterns.includes(p.id))
      : patterns;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    const currentPattern = studyPatterns[currentIndex];

    const nextCard = () => {
      setShowAnswer(false);
      setCurrentIndex((prev) => (prev + 1) % studyPatterns.length);
    };

    const prevCard = () => {
      setShowAnswer(false);
      setCurrentIndex((prev) => (prev - 1 + studyPatterns.length) % studyPatterns.length);
    };

    const handleConfidence = (level) => {
      updateConfidence(currentPattern.id, level);
      markAsStudied(currentPattern.id);
      setTimeout(nextCard, 500);
    };

    if (studyPatterns.length === 0) {
      return (
        <div className="no-patterns">
          <h3>📚 No Patterns Selected</h3>
          <p>Please select some patterns from the Overview mode to study with flashcards.</p>
        </div>
      );
    }

    return (
      <div className="flashcard-mode">
        <div className="flashcard-header">
          <h3>🃏 Flashcard Study Mode</h3>
          <div className="progress-info">
            <span>Card {currentIndex + 1} of {studyPatterns.length}</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((currentIndex + 1) / studyPatterns.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flashcard-container">
          <div className={`flashcard ${showAnswer ? 'flipped' : ''}`}>
            <div className="flashcard-front">
              <div className="card-header">
                <h2>{currentPattern.name}</h2>
                <span className={`difficulty ${currentPattern.difficulty.toLowerCase()}`}>
                  {currentPattern.difficulty}
                </span>
              </div>
              <div className="card-content">
                <h3>❓ Problem</h3>
                <p>{currentPattern.problem}</p>
              </div>
              <button
                className="flip-btn"
                onClick={() => setShowAnswer(true)}
              >
                🔄 Show Solution
              </button>
            </div>

            <div className="flashcard-back">
              <div className="card-header">
                <h2>{currentPattern.name}</h2>
                <span className={`difficulty ${currentPattern.difficulty.toLowerCase()}`}>
                  {currentPattern.difficulty}
                </span>
              </div>
              <div className="card-content">
                <div className="solution-section">
                  <h3>✅ Solution</h3>
                  <p>{currentPattern.solution}</p>
                </div>

                <div className="key-points-section">
                  <h3>🔑 Key Points</h3>
                  <ul>
                    {currentPattern.keyPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="use-cases-section">
                  <h3>🎯 Use Cases</h3>
                  <div className="use-cases">
                    {currentPattern.useCases.map((useCase, index) => (
                      <span key={index} className="use-case-tag">{useCase}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="confidence-buttons">
                <h4>How confident are you with this pattern?</h4>
                <div className="confidence-options">
                  <button
                    className="confidence-btn low"
                    onClick={() => handleConfidence(1)}
                  >
                    😕 Need More Practice
                  </button>
                  <button
                    className="confidence-btn medium"
                    onClick={() => handleConfidence(2)}
                  >
                    😐 Getting There
                  </button>
                  <button
                    className="confidence-btn high"
                    onClick={() => handleConfidence(3)}
                  >
                    😊 Confident
                  </button>
                  <button
                    className="confidence-btn expert"
                    onClick={() => handleConfidence(4)}
                  >
                    🤓 Expert Level
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flashcard-controls">
          <button className="nav-btn" onClick={prevCard}>
            ⬅️ Previous
          </button>
          <button
            className="flip-btn-alt"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? '🔄 Show Problem' : '🔄 Show Solution'}
          </button>
          <button className="nav-btn" onClick={nextCard}>
            Next ➡️
          </button>
        </div>
      </div>
    );
  };

  // Quiz Mode Component
  const QuizMode = ({ patterns, selectedPatterns, studyProgress, updateConfidence }) => {
    const studyPatterns = selectedPatterns.length > 0
      ? patterns.filter(p => selectedPatterns.includes(p.id))
      : patterns;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [quizQuestions, setQuizQuestions] = useState([]);

    useEffect(() => {
      generateQuizQuestions();
    }, [studyPatterns]);

    const generateQuizQuestions = () => {
      const questions = studyPatterns.map(pattern => {
        const otherPatterns = studyPatterns.filter(p => p.id !== pattern.id);
        const wrongAnswers = otherPatterns
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(p => p.solution);

        const allAnswers = [pattern.solution, ...wrongAnswers]
          .sort(() => Math.random() - 0.5);

        return {
          id: pattern.id,
          question: `What is the solution for: ${pattern.problem}`,
          answers: allAnswers,
          correctAnswer: pattern.solution,
          pattern: pattern
        };
      });

      setQuizQuestions(questions.sort(() => Math.random() - 0.5));
    };

    const handleAnswerSelect = (answer) => {
      setSelectedAnswer(answer);
    };

    const submitAnswer = () => {
      const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correctAnswer;
      if (isCorrect) {
        setScore(prev => prev + 1);
        updateConfidence(quizQuestions[currentQuestion].id, 3);
      } else {
        updateConfidence(quizQuestions[currentQuestion].id, 1);
      }
      setShowResult(true);
    };

    const nextQuestion = () => {
      setSelectedAnswer(null);
      setShowResult(false);
      setCurrentQuestion(prev => prev + 1);
    };

    const restartQuiz = () => {
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setScore(0);
      generateQuizQuestions();
    };

    if (studyPatterns.length === 0) {
      return (
        <div className="no-patterns">
          <h3>🎯 No Patterns Selected</h3>
          <p>Please select some patterns from the Overview mode to take the quiz.</p>
        </div>
      );
    }

    if (currentQuestion >= quizQuestions.length) {
      return (
        <div className="quiz-complete">
          <h2>🎉 Quiz Complete!</h2>
          <div className="final-score">
            <span className="score">{score}</span>
            <span className="total">/ {quizQuestions.length}</span>
          </div>
          <div className="score-percentage">
            {Math.round((score / quizQuestions.length) * 100)}%
          </div>
          <button className="restart-btn" onClick={restartQuiz}>
            🔄 Restart Quiz
          </button>
        </div>
      );
    }

    const question = quizQuestions[currentQuestion];

    return (
      <div className="quiz-mode">
        <div className="quiz-header">
          <h3>🎯 Quiz Mode</h3>
          <div className="quiz-progress">
            <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span>Score: {score}/{currentQuestion}</span>
          </div>
        </div>

        <div className="quiz-question">
          <h2>{question.pattern.name}</h2>
          <p className="question-text">{question.question}</p>

          <div className="answer-options">
            {question.answers.map((answer, index) => (
              <button
                key={index}
                className={`answer-option ${selectedAnswer === answer ? 'selected' : ''} ${
                  showResult ? (answer === question.correctAnswer ? 'correct' :
                               answer === selectedAnswer ? 'incorrect' : '') : ''
                }`}
                onClick={() => !showResult && handleAnswerSelect(answer)}
                disabled={showResult}
              >
                {answer}
              </button>
            ))}
          </div>

          {!showResult && selectedAnswer && (
            <button className="submit-btn" onClick={submitAnswer}>
              Submit Answer
            </button>
          )}

          {showResult && (
            <div className="result-section">
              <div className={`result ${selectedAnswer === question.correctAnswer ? 'correct' : 'incorrect'}`}>
                {selectedAnswer === question.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
              </div>
              <div className="explanation">
                <h4>💡 Explanation</h4>
                <p>{question.pattern.solution}</p>
              </div>
              {currentQuestion < quizQuestions.length - 1 && (
                <button className="next-btn" onClick={nextQuestion}>
                  Next Question ➡️
                </button>
              )}
              {currentQuestion === quizQuestions.length - 1 && (
                <button className="finish-btn" onClick={nextQuestion}>
                  Finish Quiz 🏁
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Printable Mode Component
  const PrintableMode = ({ patterns, selectedPatterns }) => {
    const studyPatterns = selectedPatterns.length > 0
      ? patterns.filter(p => selectedPatterns.includes(p.id))
      : patterns;

    const printFlashcards = () => {
      window.print();
    };

    return (
      <div className="printable-mode">
        <div className="print-header no-print">
          <h3>🖨️ Printable Flashcards</h3>
          <p>Generate printable flashcards for offline study</p>
          <div className="print-controls">
            <button className="print-btn" onClick={printFlashcards}>
              🖨️ Print Flashcards
            </button>
            <span className="pattern-count">
              {studyPatterns.length} patterns selected
            </span>
          </div>
        </div>

        <div className="printable-cards">
          {studyPatterns.map((pattern, index) => (
            <div key={pattern.id} className="printable-card">
              <div className="card-front">
                <div className="card-number">#{index + 1}</div>
                <h2>{pattern.name}</h2>
                <div className="difficulty-badge">{pattern.difficulty}</div>
                <div className="problem-section">
                  <h3>Problem</h3>
                  <p>{pattern.problem}</p>
                </div>
                <div className="cut-line">✂️ Cut along this line ✂️</div>
              </div>

              <div className="card-back">
                <div className="card-number">#{index + 1} - Answer</div>
                <h2>{pattern.name}</h2>
                <div className="solution-section">
                  <h3>Solution</h3>
                  <p>{pattern.solution}</p>
                </div>
                <div className="key-points">
                  <h4>Key Points:</h4>
                  <ul>
                    {pattern.keyPoints.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div className="use-cases">
                  <h4>Use Cases:</h4>
                  <p>{pattern.useCases.join(', ')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="microfrontend-container" data-microfrontend="distributed-systems-patterns">
      <div className="microfrontend-header">
        <span className="microfrontend-badge">🏗️ Microfrontend</span>
        <h2>Distributed Systems Patterns Learning Hub</h2>
        <p className="subtitle">Master 25 essential patterns with interactive flashcards and comprehensive examples</p>
      </div>

      {/* Study Mode Selector */}
      <div className="study-mode-selector">
        <button 
          className={`mode-btn ${studyMode === 'overview' ? 'active' : ''}`}
          onClick={() => setStudyMode('overview')}
        >
          📚 Overview
        </button>
        <button 
          className={`mode-btn ${studyMode === 'flashcards' ? 'active' : ''}`}
          onClick={() => setStudyMode('flashcards')}
        >
          🃏 Flashcards
        </button>
        <button 
          className={`mode-btn ${studyMode === 'quiz' ? 'active' : ''}`}
          onClick={() => setStudyMode('quiz')}
        >
          🎯 Quiz
        </button>
        <button 
          className={`mode-btn ${studyMode === 'printable' ? 'active' : ''}`}
          onClick={() => setStudyMode('printable')}
        >
          🖨️ Printable
        </button>
      </div>

      {studyMode === 'overview' && (
        <div className="overview-mode">
          {/* Category Tabs */}
          <div className="category-tabs">
            {Object.keys(patterns).map(category => (
              <button
                key={category}
                className={`tab-button ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {patterns[category].title}
              </button>
            ))}
          </div>

          {/* Category Content */}
          <div className="category-content">
            <div className="category-header">
              <h2>{patterns[selectedCategory].title}</h2>
              <p className="category-description">{patterns[selectedCategory].description}</p>
            </div>

            <div className="patterns-grid">
              {patterns[selectedCategory].patterns.map(pattern => (
                <div key={pattern.id} className="pattern-card">
                  <div className="pattern-header">
                    <h3>{pattern.name}</h3>
                    <div className="pattern-meta">
                      <span className={`difficulty ${pattern.difficulty.toLowerCase()}`}>
                        {pattern.difficulty}
                      </span>
                      <label className="pattern-select">
                        <input
                          type="checkbox"
                          checked={selectedPatterns.includes(pattern.id)}
                          onChange={() => handlePatternSelect(pattern.id)}
                        />
                        Study
                      </label>
                    </div>
                  </div>

                  <div className="pattern-content">
                    <div className="problem-section">
                      <h4>❓ Problem</h4>
                      <p>{pattern.problem}</p>
                    </div>

                    <div className="solution-section">
                      <h4>✅ Solution</h4>
                      <p>{pattern.solution}</p>
                    </div>

                    <div className="key-points-section">
                      <h4>🔑 Key Points</h4>
                      <ul>
                        {pattern.keyPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pattern-footer">
                    <button
                      className="study-btn"
                      onClick={() => markAsStudied(pattern.id)}
                    >
                      {studyProgress[pattern.id]?.studied ? '✅ Studied' : '📖 Mark as Studied'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {studyMode === 'flashcards' && (
        <FlashcardMode
          patterns={getAllPatterns()}
          selectedPatterns={selectedPatterns}
          studyProgress={studyProgress}
          updateConfidence={updateConfidence}
          markAsStudied={markAsStudied}
        />
      )}

      {studyMode === 'quiz' && (
        <QuizMode
          patterns={getAllPatterns()}
          selectedPatterns={selectedPatterns}
          studyProgress={studyProgress}
          updateConfidence={updateConfidence}
        />
      )}

      {studyMode === 'printable' && (
        <PrintableMode
          patterns={getAllPatterns()}
          selectedPatterns={selectedPatterns}
        />
      )}
    </div>
  );
};

// Export metadata for the microfrontend
export const metadata = {
  name: 'distributed-systems-patterns',
  version: '1.0.0',
  description: 'Comprehensive learning hub for distributed systems patterns with flashcards and interactive features',
  author: 'Learning Platform',
  dependencies: ['react', 'react-dom'],
  routes: ['/distributed-patterns'],
  capabilities: [
    'pattern-learning',
    'flashcard-system',
    'printable-cards',
    'progress-tracking',
    'interactive-examples',
    'code-implementations'
  ],
  tags: ['distributed-systems', 'patterns', 'architecture', 'flashcards', 'learning']
};

export default DistributedSystemsPatternsMicrofrontend;
