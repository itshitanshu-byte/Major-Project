// Curated Engineering Topic Quiz Question Bank and AI Generator for evalX

export const SUBJECT_TOPIC_QUIZZES = {
  "Data Structures": {
    "Arrays & Linked Lists": [
      {
        question: "What is the time complexity of deleting a node in a Singly Linked List given a direct pointer to that node?",
        options: ["O(1) by copying next node value", "O(n) because previous node traversal is required", "O(log n)", "O(n^2)"],
        correct: 0,
        explanation: "If you are given a direct pointer to the target node (not the last node), you can copy the data of the next node into the current node and delete the next node in O(1) time."
      },
      {
        question: "In a circular doubly linked list, how do you verify if the list is empty?",
        options: ["head == NULL", "head->next == head", "head->prev == NULL", "head->next == NULL"],
        correct: 0,
        explanation: "An empty circular doubly linked list is represented when the head pointer points to NULL."
      },
      {
        question: "Which of the following data structures is most optimal for implementing a browser's Back and Forward navigation history?",
        options: ["Two Stacks (Back stack & Forward stack)", "Single Queue", "Binary Search Tree", "Hash Map"],
        correct: 0,
        explanation: "Two stacks allow LIFO backtracking: pressing Back pops the current page onto the Forward stack, and Forward pops it back."
      }
    ],
    "Trees & Binary Search Trees": [
      {
        question: "What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST)?",
        options: ["O(log n)", "O(n)", "O(1)", "O(n log n)"],
        correct: 1,
        explanation: "When elements are inserted in sorted order, an unbalanced BST degenerates into a linear skewed linked list, resulting in O(n) search time."
      },
      {
        question: "Which tree traversal yields elements of a Binary Search Tree in sorted ascending order?",
        options: ["Preorder", "Inorder (Left, Root, Right)", "Postorder", "Level-order"],
        correct: 1,
        explanation: "Inorder traversal visits Left Subtree -> Root -> Right Subtree, which strictly produces keys in ascending sorted order for any valid BST."
      },
      {
        question: "What is the maximum number of nodes in a binary tree of depth/height h (root at level 1)?",
        options: ["2^h - 1", "2^(h-1)", "2^(h+1) - 1", "h^2"],
        correct: 0,
        explanation: "A full binary tree of height h contains 2^0 + 2^1 + ... + 2^(h-1) = 2^h - 1 total nodes."
      }
    ],
    "Graphs & BFS/DFS": [
      {
        question: "Which data structure is primarily used to implement Breadth-First Search (BFS) in a graph?",
        options: ["Queue (FIFO)", "Stack (LIFO)", "Priority Queue", "Binary Heap"],
        correct: 0,
        explanation: "BFS explores vertices level-by-level using a standard FIFO Queue to track visited frontier nodes."
      },
      {
        question: "What is the time complexity of Depth-First Search (DFS) on a graph with V vertices and E edges represented as an Adjacency List?",
        options: ["O(V + E)", "O(V * E)", "O(V^2)", "O(E log V)"],
        correct: 0,
        explanation: "Using an adjacency list, DFS visits every vertex once (O(V)) and iterates over all adjacency lists which sum to O(E), yielding O(V + E)."
      }
    ]
  },

  "Design & Analysis of Algorithms": {
    "Master Theorem & Recurrences": [
      {
        question: "Using Master's Theorem, what is the asymptotic time complexity of T(n) = 2T(n/2) + O(n)?",
        options: ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"],
        correct: 0,
        explanation: "Here a=2, b=2, log_b(a) = log_2(2) = 1. Since f(n) = O(n^1), this is Case 2 of Master Theorem where f(n) = Theta(n^(log_b a)), so T(n) = Theta(n log n) (Merge Sort)."
      },
      {
        question: "What is the solution to the recurrence relation T(n) = T(n-1) + O(1) with T(1) = 1?",
        options: ["O(n)", "O(log n)", "O(n^2)", "O(2^n)"],
        correct: 0,
        explanation: "Unrolling the recurrence: T(n) = 1 + 1 + ... + 1 (n times) = O(n)."
      }
    ],
    "Dynamic Programming": [
      {
        question: "What is the time complexity of solving the 0/1 Knapsack Problem with N items and capacity W using 2D Dynamic Programming?",
        options: ["O(N * W)", "O(2^N)", "O(N log W)", "O(N + W)"],
        correct: 0,
        explanation: "The standard DP table has dimensions (N+1) x (W+1), requiring O(N * W) pseudo-polynomial time to compute subproblem states."
      },
      {
        question: "What two essential properties must a problem have for Dynamic Programming to be applicable?",
        options: ["Optimal Substructure & Overlapping Subproblems", "Greedy Choice & Divide-and-Conquer", "Linearity & Independent Variables", "Associativity & Commutativity"],
        correct: 0,
        explanation: "Dynamic programming requires overlapping subproblems (recomputing same subproblems) and optimal substructure (optimal solution composed of optimal subproblem solutions)."
      }
    ],
    "Greedy Algorithms & Graphs": [
      {
        question: "Which algorithm finds the Single-Source Shortest Path in a graph with non-negative edge weights?",
        options: ["Dijkstra's Algorithm", "Kruskal's Algorithm", "Floyd-Warshall Algorithm", "Prim's Algorithm"],
        correct: 0,
        explanation: "Dijkstra's algorithm uses a greedy priority queue approach to find shortest paths from a single source in non-negative weighted graphs."
      }
    ]
  },

  "Operating Systems": {
    "CPU Scheduling": [
      {
        question: "Which CPU scheduling algorithm can potentially lead to the 'Convoy Effect'?",
        options: ["First-Come, First-Served (FCFS)", "Round Robin (RR)", "Shortest Job First (SJF)", "Priority Preemptive"],
        correct: 0,
        explanation: "In FCFS, if a long CPU-burst process arrives first, all subsequent short I/O-bound processes get stuck behind it, causing the convoy effect."
      },
      {
        question: "What happens in Round Robin CPU scheduling if the Time Quantum (q) is extremely large (approaching infinity)?",
        options: ["It degenerates into FCFS scheduling", "It becomes Shortest Remaining Time First", "Context switches increase exponentially", "Throughput reaches theoretical maximum"],
        correct: 0,
        explanation: "If the time slice is larger than the longest process burst time, each process runs to completion on arrival, behaving identically to FCFS."
      }
    ],
    "Deadlocks & Synchronization": [
      {
        question: "Which of the following is NOT one of the 4 Coffman conditions required for a Deadlock to occur?",
        options: ["Preemption Allowed", "Mutual Exclusion", "Hold and Wait", "Circular Wait"],
        correct: 0,
        explanation: "The 4 Coffman conditions are Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait. If preemption is allowed, deadlocks cannot persist."
      },
      {
        question: "What algorithm is used in Operating Systems to avoid deadlocks by verifying if a system state remains 'Safe'?",
        options: ["Banker's Algorithm", "Peterson's Algorithm", "Bakery Algorithm", "Dekker's Algorithm"],
        correct: 0,
        explanation: "Dijkstra's Banker's Algorithm simulates resource allocation for maximum possible claims to ensure the system never enters an unsafe deadlock state."
      }
    ],
    "Virtual Memory & Paging": [
      {
        question: "What is Belady's Anomaly in page replacement algorithms?",
        options: ["Allocating more page frames results in more page faults", "Allocating more page frames decreases CPU utilization", "Page table size grows larger than RAM", "Cache hit ratio drops to zero"],
        correct: 0,
        explanation: "Belady's Anomaly (seen in FIFO page replacement) occurs when increasing the number of physical frame slots counterintuitively increases total page faults."
      }
    ]
  },

  "Database Management Systems": {
    "Normalization & Schema Design": [
      {
        question: "A relational table is in Boyce-Codd Normal Form (BCNF) if and only if for every non-trivial functional dependency X -> Y:",
        options: ["X is a Superkey", "Y is a Prime Attribute", "X is a Primary Key candidate only", "Y contains no transitive dependencies"],
        correct: 0,
        explanation: "BCNF is a stricter version of 3NF requiring that for every functional dependency X -> Y, the determinant X must strictly be a Superkey."
      },
      {
        question: "Which Normal Form strictly eliminates Partial Functional Dependencies (where non-prime attributes depend on a proper subset of a candidate key)?",
        options: ["Second Normal Form (2NF)", "First Normal Form (1NF)", "Third Normal Form (3NF)", "Fourth Normal Form (4NF)"],
        correct: 0,
        explanation: "2NF requires the relation to be in 1NF and guarantees that no non-prime attribute is partially dependent on any candidate key."
      }
    ],
    "SQL & Transactions": [
      {
        question: "What does the 'I' in the ACID transaction properties stand for?",
        options: ["Isolation", "Integrity", "Immutability", "Indexing"],
        correct: 0,
        explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability. Isolation ensures concurrent transactions execute without interfering with each other."
      },
      {
        question: "Which SQL JOIN returns all rows from the left table and matched rows from the right table, filling NULLs for non-matches?",
        options: ["LEFT OUTER JOIN", "INNER JOIN", "CROSS JOIN", "NATURAL JOIN"],
        correct: 0,
        explanation: "LEFT OUTER JOIN preserves all records from the left relation, substituting NULL for missing right relation matches."
      }
    ]
  },

  "Mathematics - I": {
    "Matrices & Eigenvalues": [
      {
        question: "What is the sum of the Eigenvalues of any square matrix A equal to?",
        options: ["The Trace of Matrix A (sum of diagonal elements)", "The Determinant of Matrix A", "The Rank of Matrix A", "Zero"],
        correct: 0,
        explanation: "A fundamental linear algebra theorem states that the sum of all eigenvalues of matrix A equals the trace (sum of main diagonal elements) of A."
      },
      {
        question: "What is the product of the Eigenvalues of matrix A equal to?",
        options: ["The Determinant of Matrix A (det(A))", "The Trace of A", "The Inverse of A", "Rank of A"],
        correct: 0,
        explanation: "The product of all eigenvalues of a matrix is strictly equal to the determinant det(A)."
      }
    ],
    "Calculus & Differentiation": [
      {
        question: "What is the derivative of f(x) = ln(sin(x)) with respect to x?",
        options: ["cot(x)", "tan(x)", "sec(x)", "-csc(x)"],
        correct: 0,
        explanation: "By chain rule: d/dx[ln(sin(x))] = (1 / sin(x)) * cos(x) = cot(x)."
      }
    ]
  },

  "Basic Electronics Engineering": {
    "Diodes & Rectifiers": [
      {
        question: "What is the approximate barrier potential (cut-in voltage) for a standard Silicon P-N junction diode at room temperature?",
        options: ["0.7 V", "0.3 V", "1.2 V", "0.1 V"],
        correct: 0,
        explanation: "Silicon diodes have a typical barrier potential of ~0.7 V, whereas Germanium diodes have ~0.3 V."
      },
      {
        question: "What is the maximum theoretical efficiency of a Full-Wave Bridge Rectifier without a filter?",
        options: ["81.2%", "40.6%", "95.0%", "50.0%"],
        correct: 0,
        explanation: "A full-wave rectifier has a theoretical maximum rectification efficiency of 81.2% (2 * 40.6%)."
      }
    ],
    "Transistors & Op-Amps": [
      {
        question: "What is the voltage gain of an Ideal Operational Amplifier (Op-Amp) in open-loop configuration?",
        options: ["Infinity (Infinite Gain)", "1.0", "Zero", "100"],
        correct: 0,
        explanation: "An ideal Op-Amp has infinite open-loop voltage gain, infinite input impedance, and zero output impedance."
      }
    ]
  }
};

export const DEFAULT_TOPIC_QUIZ = [
  {
    question: "Which of the following best defines the primary objective of curricular remediation?",
    options: ["Bridging foundational conceptual gaps through active practice", "Memorizing past exam answers", "Skipping complex modules", "Postponing assessment evaluations"],
    correct: 0,
    explanation: "Curricular remediation systematically isolates specific learning deficiencies and reinforces core principles through active diagnostic problem-solving."
  },
  {
    question: "When approaching a multi-step engineering problem, what is the recommended initial strategy?",
    options: ["Identify given constraints and state variables systematically", "Directly guess intermediate constants", "Apply random formulas", "Skip diagrammatic models"],
    correct: 0,
    explanation: "Structuring the problem by defining knowns, unknowns, and underlying governing equations is essential for rigorous engineering analysis."
  }
];

export function getTopicsForSubject(subjectName) {
  if (!subjectName) return ["General Fundamentals", "Problem Solving"];
  const normalized = subjectName.trim();
  if (SUBJECT_TOPIC_QUIZZES[normalized]) {
    return Object.keys(SUBJECT_TOPIC_QUIZZES[normalized]);
  }
  const lower = normalized.toLowerCase();
  for (const [key, val] of Object.entries(SUBJECT_TOPIC_QUIZZES)) {
    if (key.toLowerCase().includes(lower) || lower.includes(key.toLowerCase())) {
      return Object.keys(val);
    }
  }
  return ["Core Principles & Definitions", "Analytical Formulations", "Solved Applications"];
}

export function getOfflineQuizQuestions(subjectName, topicName) {
  const normalizedSub = subjectName ? subjectName.trim() : "";
  let subjectData = SUBJECT_TOPIC_QUIZZES[normalizedSub];
  if (!subjectData) {
    const lower = normalizedSub.toLowerCase();
    for (const [k, v] of Object.entries(SUBJECT_TOPIC_QUIZZES)) {
      if (k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase())) {
        subjectData = v;
        break;
      }
    }
  }

  if (subjectData) {
    if (topicName && subjectData[topicName]) {
      return subjectData[topicName];
    }
    const allQs = Object.values(subjectData).flat();
    if (allQs.length > 0) return allQs.slice(0, 4);
  }

  return DEFAULT_TOPIC_QUIZ;
}
