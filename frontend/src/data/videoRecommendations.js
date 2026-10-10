// Comprehensive Curated YouTube Remedial Lecture Database for evalX

export const SUBJECT_VIDEOS = {
  "Mathematics - I": {
    videoId: "7K1sB05pE0A",
    title: "Calculus 1 - Full College Course",
    channel: "Professor Leonard",
    duration: "Full Comprehensive Series",
    playlistUrl: "https://www.youtube.com/playlist?list=PLF797E961509B4EB5",
    focus: "Differential & Integral Calculus, Matrices, Eigenvalues",
    keyTopics: ["Limits & Continuity", "Derivatives & Chain Rule", "Integration by Parts", "Matrix Eigenvalues & Eigenvectors"],
    summary: "Renowned for crystal-clear conceptual explanations of college-level calculus and linear algebra matrices.",
    guide: "Spend 20 mins daily on matrices operations. Review the foundation of limits and differentiation. Focus on the physical applications of double integrals."
  },
  "Mathematics - II": {
    videoId: "p_di4Zn4wz4",
    title: "Differential Equations & Essence of Calculus",
    channel: "3Blue1Brown",
    duration: "Visual Masterclass",
    playlistUrl: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNPOjrT6KVlfJuKtYTftqRh",
    focus: "Vector Calculus, Ordinary Differential Equations, Laplace Transforms",
    keyTopics: ["First & Second Order ODEs", "Laplace Transform Derivations", "Vector Line & Surface Integrals", "Green's & Stokes' Theorem"],
    summary: "Intuitive geometric and dynamic visual animations explaining vector calculus and differential equations.",
    guide: "Learn Laplace transforms by plotting them dynamically. Break down vector integration using line and surface integrals."
  },
  "Basic Electronics Engineering": {
    videoId: "7ukDKVHnac4",
    title: "Basic Electronics - Semiconductor Diodes & Transistors",
    channel: "Neso Academy",
    duration: "Full Playlist Course",
    playlistUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRiw-GZRqfnlVIBz9dxrqHJS",
    focus: "PN Junction Diodes, BJT Configuration, Operational Amplifiers (Op-Amps)",
    keyTopics: ["P-N Junction & Biasing", "BJT Common Emitter / Common Base", "Op-Amp Inverting & Non-Inverting", "Rectifiers & Filters"],
    summary: "Clear, step-by-step circuit analysis and electronic device physics with solved university problems.",
    guide: "Simulate circuits using LTspice (free). Draw diode characteristics curves and practice operational amplifier calculations (gain, invert/non-invert)."
  },
  "Basic Electronics": {
    videoId: "7ukDKVHnac4",
    title: "Basic Electronics - Semiconductor Diodes & Transistors",
    channel: "Neso Academy",
    duration: "Full Playlist Course",
    playlistUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRiw-GZRqfnlVIBz9dxrqHJS",
    focus: "PN Junction Diodes, BJT Configuration, Operational Amplifiers",
    keyTopics: ["P-N Junction & Biasing", "BJT Transistors", "Op-Amps", "Rectifiers"],
    summary: "Clear, step-by-step circuit analysis and electronic device physics.",
    guide: "Simulate circuits using LTspice. Draw diode characteristics curves and practice operational amplifier calculations."
  },
  "Basic Electrical Engineering": {
    videoId: "2a9m25hA3tE",
    title: "Basic Electrical Engineering - DC & AC Network Analysis",
    channel: "Neso Academy",
    duration: "Complete Subject Series",
    playlistUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRhqJPDXcvYlLNPXKGn5np7T",
    focus: "KCL, KVL, Thevenin's & Norton's Theorems, AC Phasors, Transformers",
    keyTopics: ["Kirchhoff's Laws", "Mesh & Nodal Analysis", "Superposition & Thevenin Theorem", "Single-Phase AC Circuits"],
    summary: "Industry-standard lectures covering electrical engineering circuit fundamentals and electromagnetic machines.",
    guide: "Solve at least 5 nodal and mesh analysis problems daily. Practice drawing AC phasor diagrams."
  },
  "Basic Electrical": {
    videoId: "2a9m25hA3tE",
    title: "Basic Electrical Engineering - DC & AC Network Analysis",
    channel: "Neso Academy",
    duration: "Complete Subject Series",
    playlistUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRhqJPDXcvYlLNPXKGn5np7T",
    focus: "KCL, KVL, Network Theorems, Transformers",
    keyTopics: ["Kirchhoff's Laws", "Network Theorems", "Single-Phase AC"],
    summary: "Clear step-by-step circuit theory lectures.",
    guide: "Solve at least 5 nodal and mesh analysis problems daily."
  },
  "Engineering Physics": {
    videoId: "v_ZzBqqx7m0",
    title: "Engineering Physics - Quantum Mechanics, Optics & Lasers",
    channel: "Last moment tuitions",
    duration: "Comprehensive Playlist",
    playlistUrl: "https://www.youtube.com/results?search_query=engineering+physics+playlist",
    focus: "Wave Optics, Quantum Mechanics (Schrodinger Eq), Lasers & Fiber Optics",
    keyTopics: ["Interference & Diffraction", "Schrodinger Wave Equation", "Heisenberg Uncertainty Principle", "Optical Fibers"],
    summary: "Exam-oriented breakdown of high-weightage physics modules and derivations.",
    guide: "Derive the 1D Schrodinger equation on paper. Practice numericals on diffraction gratings and numerical aperture."
  },
  "Engineering Chemistry": {
    videoId: "bka20Q9SX6s",
    title: "Engineering Chemistry - Water Treatment & Electrochemistry",
    channel: "Gate Smashers / NPTEL",
    duration: "Complete Crash Course",
    playlistUrl: "https://www.youtube.com/results?search_query=engineering+chemistry+lectures",
    focus: "Water Hardness, Polymers, Electrochemistry & Corrosion, Lubricants",
    keyTopics: ["EDTA Method Hardness", "Nernst Equation", "Corrosion Prevention (Cathodic Protection)", "Phase Rule"],
    summary: "High-yield engineering chemistry lectures focusing on industrial applications and exam essentials.",
    guide: "Memorize reaction mechanisms for corrosion and polymer synthesis. Practice EDTA numerical problems."
  },
  "Engineering Graphics": {
    videoId: "7t6Jz_G0u_U",
    title: "Engineering Graphics & Drawing Full Course",
    channel: "Tikle's Academy / Manas Patnaik",
    duration: "Step-by-step Drawing Series",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDN15nk5uLiA2Sg8dY4K94SwhG3wHdr0Q",
    focus: "Orthographic Projections, Isometric Views, Projection of Solids & Planes",
    keyTopics: ["Projection of Points & Lines", "Auxiliary Planes", "Sections of Solids", "Isometric to Orthographic Conversion"],
    summary: "Visual drafting guides showing exact pencil angles, projection lines, and 3D to 2D transformations.",
    guide: "Draw on engineering sheets using mini-drafter. Practice 3 orthographic conversion questions weekly."
  },
  "Programming in C": {
    videoId: "KJgsSFOSQv0",
    title: "C Programming Tutorial for Beginners - Full Course",
    channel: "freeCodeCamp.org",
    duration: "3.5 Hours Full Course",
    playlistUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRhX6r2uhhlubuF5QextCCSM",
    focus: "Pointers, Dynamic Memory (malloc/free), Arrays, Structures, File I/O",
    keyTopics: ["Pointer Arithmetic", "Pass by Reference", "Dynamic Memory Allocation", "Structs & Unions"],
    summary: "The definitive beginner-to-advanced C programming course with hands-on live code demos.",
    guide: "Write pointer and memory allocation codes directly on GCC/Clang. Trace stack and heap memory diagrams."
  },
  "Data Structures": {
    videoId: "0IAPZzGSbME",
    title: "Data Structures and Algorithms Masterclass",
    channel: "Abdul Bari",
    duration: "Legendary Algorithm Series",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O",
    focus: "Pointers, LinkedList traversal, Stack/Queue implementations, Tree Traversals",
    keyTopics: ["Single & Doubly Linked Lists", "Binary Search Trees (BST)", "AVL Trees & Rotations", "Graph BFS / DFS"],
    summary: "Universally acclaimed visual lectures on data structures, pointer memory, and asymptotic complexity.",
    guide: "Practice code implementations on paper before writing in IDE. Walk through tree traversals (inorder, preorder, postorder) node-by-node."
  },
  "Data Structures & Alg": {
    videoId: "0IAPZzGSbME",
    title: "Data Structures & Algorithms Course",
    channel: "Abdul Bari",
    duration: "Complete Masterclass",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O",
    focus: "Pointers, LinkedList traversal, Stack/Queue implementations, Tree Traversals",
    keyTopics: ["Arrays & Linked Lists", "Stacks & Queues", "Trees & Graphs", "Sorting & Searching"],
    summary: "Deep conceptual coverage of DSA fundamentals with blackboard visual diagrams.",
    guide: "Solve 2 DSA questions on LeetCode/GeeksforGeeks daily. Implement data structures from scratch."
  },
  "Design & Analysis of Algorithms": {
    videoId: "2CeLoc746BY",
    title: "Algorithms Design - Master's Theorem & Dynamic Programming",
    channel: "Abdul Bari",
    duration: "Full Comprehensive Series",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O",
    focus: "Asymptotic Notation, Divide & Conquer, Dynamic Programming, Greedy Algorithms",
    keyTopics: ["Master's Theorem Recurrences", "0/1 Knapsack & Fractional Knapsack", "Longest Common Subsequence (LCS)", "Dijkstra & Bellman-Ford"],
    summary: "World-class algorithmic explanations breaking down asymptotic bounds, divide-and-conquer, and DP matrices.",
    guide: "Focus on Master's Theorem for recurrence relations. Build recursion trees. Solve classic DP problems (0/1 Knapsack, LCS) step-by-step."
  },
  "Design & Algorithms": {
    videoId: "2CeLoc746BY",
    title: "Design & Analysis of Algorithms",
    channel: "Abdul Bari",
    duration: "Full Comprehensive Series",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O",
    focus: "Asymptotic Notation, Divide & Conquer, Dynamic Programming, Greedy Algorithms",
    keyTopics: ["Recurrences", "Dynamic Programming", "Greedy Techniques", "Graph Algorithms"],
    summary: "In-depth algorithm analysis lectures.",
    guide: "Build recursion trees and trace DP memoization tables on paper."
  },
  "Digital Logic Design": {
    videoId: "M0mx8S05v60",
    title: "Digital Logic Design & Boolean Algebra",
    channel: "Neso Academy",
    duration: "Complete Playlist",
    playlistUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRjMH3kWf6z644AULFifxLWB",
    focus: "K-Map minimization, Multiplexers, Counters, Flip-Flops",
    keyTopics: ["Karnaugh Maps (K-Maps)", "JK, T, and D Flip-Flops", "Synchronous & Ripple Counters", "Decoders & Encoders"],
    summary: "High quality animations and problem-solving for combinational and sequential circuit design.",
    guide: "Solve K-Maps daily. Draw state diagrams for sequential flip-flops (T, D, JK) and understand synchronous vs asynchronous clock cycles."
  },
  "Digital Logic": {
    videoId: "M0mx8S05v60",
    title: "Digital Logic Design",
    channel: "Neso Academy",
    duration: "Complete Course",
    playlistUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRjMH3kWf6z644AULFifxLWB",
    focus: "K-Maps, Flip-Flops, Combinational Circuits",
    keyTopics: ["Logic Gates", "K-Map Optimization", "Sequential Circuits"],
    summary: "Complete digital electronics theory and solved questions.",
    guide: "Practice 4-variable K-map simplifications and state table state transition design."
  },
  "Discrete Mathematics": {
    videoId: "tyDKR4FG3Yw",
    title: "Discrete Mathematics Full Course for Computer Science",
    channel: "TrevTutor / Gate Smashers",
    duration: "Complete Course",
    playlistUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRhqJPDXcvYlLNPXKGn5np7T",
    focus: "Set Theory, Graph Theory, Propositional Logic, Combinatorics",
    keyTopics: ["Predicate & Propositional Logic", "Relations & Equivalence Classes", "Graph Planarity & Coloring", "Recurrence Relations & Generating Functions"],
    summary: "Mathematical foundations of computer science explained with formal rigor and clear examples.",
    guide: "Understand truth tables and practice boolean logic proofs. Focus on graph properties (Eulerian paths, trees) which are critical for computer science."
  },
  "Discrete Math": {
    videoId: "tyDKR4FG3Yw",
    title: "Discrete Mathematics Full Course",
    channel: "TrevTutor / Gate Smashers",
    duration: "Complete Course",
    playlistUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRhqJPDXcvYlLNPXKGn5np7T",
    focus: "Logic, Sets, Relations, Graph Theory",
    keyTopics: ["Propositional Logic", "Set Relations", "Graph Theory"],
    summary: "Formal logic and discrete structure walkthroughs.",
    guide: "Work through mathematical induction proofs and relation properties."
  },
  "Operating Systems": {
    videoId: "bkSWJJZNgf8",
    title: "Operating Systems (OS) Full Course",
    channel: "Gate Smashers",
    duration: "Comprehensive Lecture Series",
    playlistUrl: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p",
    focus: "CPU Scheduling, Semaphores & Deadlock, Virtual Memory page replacement",
    keyTopics: ["Process Synchronization (Peterson, Semaphores)", "Deadlock Banker's Algorithm", "Paging, Segmentation & TLB", "Page Replacement (LRU, FIFO, Optimal)"],
    summary: "The most popular, exam-proven operating systems lectures covering every core concept in depth.",
    guide: "Simulate scheduling (Round Robin, SRTF) using timeline diagrams. Study Bankers Algorithm for deadlock avoidance."
  },
  "Computer Org & Architecture": {
    videoId: "L9X7XXfHYdU",
    title: "Computer Organization & Architecture (COA)",
    channel: "Neso Academy",
    duration: "Full Semester Course",
    playlistUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRgLLlzdgiTUKULKJPYc0A4q",
    focus: "Cache Mapping, Pipelining, Instruction Cycles, Memory Hierarchy",
    keyTopics: ["Direct / Associative Cache Mapping", "Pipeline Hazards & Speedup", "Addressing Modes", "Booth's Multiplication Algorithm"],
    summary: "Detailed architecture walkthroughs with hardware diagrams, micro-operations, and performance arithmetic.",
    guide: "Practice cache hit/miss ratio calculation and pipeline speedup formulas. Visualize instruction execution inside ALU."
  },
  "Computer Architecture": {
    videoId: "L9X7XXfHYdU",
    title: "Computer Architecture Course",
    channel: "Neso Academy",
    duration: "Full Semester Course",
    playlistUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRgLLlzdgiTUKULKJPYc0A4q",
    focus: "Cache Mapping, Pipelining, Instruction Cycles",
    keyTopics: ["Cache Memory", "Instruction Pipeline", "ALU Design"],
    summary: "Complete COA course series.",
    guide: "Practice cache mapping problem sets and pipeline cycle calculations."
  },
  "Database Management Systems": {
    videoId: "kBdlM6hNDAE",
    title: "Database Management Systems (DBMS) Course",
    channel: "Gate Smashers",
    duration: "Full Playlist",
    playlistUrl: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8C9XdK_kVCAfq74wv",
    focus: "Normal Forms (1NF, 2NF, 3NF, BCNF), SQL Joins, Transaction ACID isolation",
    keyTopics: ["ER Diagrams & Relational Mapping", "Normalization (1NF to BCNF)", "SQL Nested Queries & Joins", "Concurrency Control & Serializability"],
    summary: "Superb coverage of relational schema design, decomposition, and transactional ACID integrity.",
    guide: "Practice normalization problems to resolve redundancy. Write nested SQL subqueries on live terminal. Memorize ACID principles."
  },
  "DBMS": {
    videoId: "kBdlM6hNDAE",
    title: "DBMS Complete Lectures",
    channel: "Gate Smashers",
    duration: "Full Course",
    playlistUrl: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8C9XdK_kVCAfq74wv",
    focus: "Normalization, SQL, Transactions, Indexing",
    keyTopics: ["Normalization (1NF to BCNF)", "SQL Joins", "ACID Properties & Transactions"],
    summary: "Concise yet deep DBMS lectures.",
    guide: "Practice functional dependency decomposition into BCNF/3NF and write relational algebra queries."
  },
  "Database Systems": {
    videoId: "kBdlM6hNDAE",
    title: "Database Management Systems",
    channel: "Gate Smashers",
    duration: "Full Course",
    playlistUrl: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8C9XdK_kVCAfq74wv",
    focus: "Normalization, SQL Queries, Transactions",
    keyTopics: ["Relational Algebra", "Normalization", "SQL Joins"],
    summary: "Complete DBMS video guide.",
    guide: "Practice SQL queries on PostgreSQL or MySQL."
  },
  "Compiler Design": {
    videoId: "Qkwj65l_96I",
    title: "Compiler Design Full Course",
    channel: "Gate Smashers",
    duration: "Full Course Playlist",
    playlistUrl: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiEKtKSIHYusizkESC42diyc",
    focus: "LL(1) & LR(1) Parsers, Lexical Analysis, Intermediate Code Gen",
    keyTopics: ["Lexical Tokenization (DFA)", "FIRST & FOLLOW Sets Calculation", "LL(1), SLR(1), CLR(1), LALR(1) Parsing Tables", "Three Address Code (3AC) Generation"],
    summary: "Clear computational walkthroughs for grammar construction, parsing tables, and syntax-directed translation.",
    guide: "Calculate FIRST & FOLLOW sets for grammars. Construct parsing tables. Study DFA state transitions in lexers."
  },
  "Computer Networks": {
    videoId: "VwN91x5i25g",
    title: "Computer Networks Full Course",
    channel: "Gate Smashers",
    duration: "Complete Network Series",
    playlistUrl: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_",
    focus: "OSI & TCP/IP Stack, Subnetting, Routing Protocols (OSPF/BGP), Congestion Control",
    keyTopics: ["IPv4 / IPv6 Subnetting & CIDR", "TCP Handshake & Sliding Window (Go-Back-N, SR)", "Dijkstra & Distance Vector Routing", "DNS, HTTP, SSL/TLS Handshake"],
    summary: "Top-rated computer networks tutorials covering packet transmission, IP subnet math, and protocols.",
    guide: "Practice classless CIDR IP subnetting calculations. Trace TCP flow control sliding window packet diagrams."
  },
  "Software Engineering": {
    videoId: "4b33NTAuF6I",
    title: "Software Engineering & Agile Frameworks",
    channel: "Gate Smashers / Simplilearn",
    duration: "Full Playlist",
    playlistUrl: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiEed7SKZBnC6ypFDWYLRvB2",
    focus: "SDLC Models (Agile, Waterfall, Spiral), COCOMO Model, Software Testing (Black/White Box)",
    keyTopics: ["Agile & Scrum Sprints", "COCOMO Effort Estimation", "Cyclomatic Complexity & Basis Path Testing", "UML Class & Sequence Diagrams"],
    summary: "Professional software lifecycle engineering and project management methodologies.",
    guide: "Calculate Cyclomatic complexity for control flow graphs. Learn difference between unit, integration, and regression testing."
  },
  "OOP using Java": {
    videoId: "grEKMHGYyns",
    title: "Java OOP (Object Oriented Programming) Full Course",
    channel: "freeCodeCamp.org",
    duration: "Complete 4-Hour Course",
    playlistUrl: "https://www.youtube.com/playlist?list=PL9DFB7B7EB07B7F81",
    focus: "Inheritance, Polymorphism, Interfaces, Abstract Classes, Exception Handling, Generics",
    keyTopics: ["Encapsulation & Access Modifiers", "Method Overloading vs Overriding", "Interfaces & Abstract Classes", "Collections Framework (ArrayList, HashMap)"],
    summary: "Hands-on object-oriented architecture in Java with design patterns and real-world projects.",
    guide: "Implement inheritance and interface hierarchies in Java. Build a mini CLI bank management project."
  },
  "Object Oriented Programming": {
    videoId: "grEKMHGYyns",
    title: "Object Oriented Programming Full Course",
    channel: "freeCodeCamp.org",
    duration: "Complete Course",
    playlistUrl: "https://www.youtube.com/playlist?list=PL9DFB7B7EB07B7F81",
    focus: "Classes, Objects, Inheritance, Polymorphism, Design Patterns",
    keyTopics: ["4 OOP Pillars", "Polymorphism", "Abstraction & Interfaces"],
    summary: "Solid OOP fundamentals and best practices.",
    guide: "Build modular classes and refactor monolithic code into decoupled objects."
  },
  "Machine Learning": {
    videoId: "i_LwzRVP7bg",
    title: "Machine Learning Course for Beginners",
    channel: "freeCodeCamp.org / Andrew Ng",
    duration: "Full Bootcamp",
    playlistUrl: "https://www.youtube.com/playlist?list=PLblh5Jgk4G0zc5u5E_nN6I8cM09fJ4KqL",
    focus: "Supervised & Unsupervised Learning, Regression, Classification, Scikit-Learn",
    keyTopics: ["Linear & Logistic Regression", "Decision Trees & Random Forests", "Support Vector Machines (SVM)", "K-Means Clustering & PCA"],
    summary: "World-class machine learning tutorials explaining math intuitions and Python Scikit-Learn implementations.",
    guide: "Understand gradient descent loss convergence math. Train classification models on Kaggle datasets."
  },
  "Machine Learning Basics": {
    videoId: "i_LwzRVP7bg",
    title: "Machine Learning Basics Full Course",
    channel: "freeCodeCamp.org",
    duration: "Complete Course",
    playlistUrl: "https://www.youtube.com/playlist?list=PLblh5Jgk4G0zc5u5E_nN6I8cM09fJ4KqL",
    focus: "Supervised vs Unsupervised, Regression, Model Evaluation",
    keyTopics: ["Regression", "Classification", "Confusion Matrix & F1-Score"],
    summary: "Beginner-friendly machine learning tutorials.",
    guide: "Practice building scikit-learn pipelines with cross-validation."
  },
  "Artificial Intelligence": {
    videoId: "JMUxmLyrhSk",
    title: "Artificial Intelligence Full Course",
    channel: "Edureka / Stanford CS221",
    duration: "Full AI Masterclass",
    playlistUrl: "https://www.youtube.com/results?search_query=artificial+intelligence+full+course",
    focus: "Search Algorithms (A*, Minimax, Alpha-Beta), Knowledge Representation, Expert Systems",
    keyTopics: ["Heuristic Search (A*, Greedy Best First)", "Minimax Game Playing & Alpha-Beta Pruning", "First-Order Logic & Inference", "Bayesian Networks"],
    summary: "Comprehensive AI survey covering search strategies, reasoning under uncertainty, and intelligent agents.",
    guide: "Trace A* algorithm cost matrices f(n) = g(n) + h(n). Implement Minimax algorithm for Tic-Tac-Toe."
  },
  "Introduction to AI": {
    videoId: "JMUxmLyrhSk",
    title: "Artificial Intelligence Fundamentals",
    channel: "Edureka",
    duration: "Full Course",
    playlistUrl: "https://www.youtube.com/results?search_query=artificial+intelligence+full+course",
    focus: "Search Algorithms, Logic Reasoning, Heuristics",
    keyTopics: ["State Space Search", "Heuristics", "Game Trees"],
    summary: "Foundational AI algorithms and problem-solving.",
    guide: "Implement basic pathfinding search algorithms in Python."
  },
  "Cloud Computing": {
    videoId: "2LaAJq1lB1Q",
    title: "Cloud Computing Tutorial for Beginners",
    channel: "Simplilearn / freeCodeCamp",
    duration: "Comprehensive Overview",
    playlistUrl: "https://www.youtube.com/results?search_query=cloud+computing+full+course",
    focus: "IaaS, PaaS, SaaS, Virtualization, Containers (Docker/K8s), AWS Architecture",
    keyTopics: ["Cloud Deployment Models", "Hypervisors & Virtual Machines", "AWS EC2, S3, RDS, Lambda", "Serverless & Microservices"],
    summary: "Modern cloud infrastructure paradigms with hands-on AWS console demonstrations.",
    guide: "Deploy a containerized application to AWS EC2. Practice configuring VPC subnets and security groups."
  },
  "Cryptography & Security": {
    videoId: "jhXCTbFnK8o",
    title: "Cryptography and Network Security",
    channel: "Computerphile / Gate Smashers",
    duration: "Full Playlist",
    playlistUrl: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p",
    focus: "Symmetric (AES/DES), Asymmetric (RSA/ECC), Hashing (SHA-256), Digital Signatures",
    keyTopics: ["RSA Key Generation & Math", "Diffie-Hellman Key Exchange", "Hash Functions & Message Authentication (MAC)", "Public Key Infrastructure (PKI)"],
    summary: "Mathematical foundations and protocol security architectures for modern encryption standards.",
    guide: "Work through small-number RSA prime calculations p, q, n, phi(n), e, d. Understand digital signature verification."
  },
  "Web Technologies": {
    videoId: "nu_pCVPKzTk",
    title: "Full Stack Web Development - HTML, CSS, JavaScript & Node",
    channel: "freeCodeCamp.org",
    duration: "Complete Bootcamp",
    playlistUrl: "https://www.youtube.com/results?search_query=full+stack+web+development+course",
    focus: "HTML5, CSS3, Modern ES6+ JavaScript, REST APIs, Node.js",
    keyTopics: ["DOM Manipulation", "Async/Await & Fetch API", "RESTful API Design", "State Management & React Components"],
    summary: "Modern full-stack web engineering from basic DOM scripting to full client-server integrations.",
    guide: "Build 3 functional frontend apps with live API consumption. Practice writing Node/Express endpoints."
  },
  "Web Technology": {
    videoId: "nu_pCVPKzTk",
    title: "Web Technologies Full Course",
    channel: "freeCodeCamp.org",
    duration: "Complete Course",
    playlistUrl: "https://www.youtube.com/results?search_query=web+development+full+course",
    focus: "HTML, CSS, JS, Client-Server Architecture",
    keyTopics: ["HTML/CSS Responsive Design", "JavaScript ES6", "Web APIs"],
    summary: "Complete web technology course.",
    guide: "Build responsive websites with vanilla JS and CSS grid/flexbox."
  },
  "Formal Languages & Automata": {
    videoId: "58N2N7zJGrQ",
    title: "Theory of Computation & Automata (TOC)",
    channel: "Gate Smashers / Neso Academy",
    duration: "Complete Subject Course",
    playlistUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRgp46KUv4ZY69yXmpwKOBlv",
    focus: "DFA, NFA, Regular Expressions, Context-Free Grammars (CFG), Pushdown Automata, Turing Machines",
    keyTopics: ["DFA & NFA Construction & Equivalence", "Pumping Lemma for Regular Languages", "Chomsky Hierarchy", "Turing Machine Computability & Halting Problem"],
    summary: "Top-tier theoretical computer science lectures explaining language classes and automata transitions.",
    guide: "Construct DFA state transition tables for complex regex patterns. Master Pumping Lemma proof templates."
  },
  "Microprocessors & Microcontrollers": {
    videoId: "8F8v42cZ1r4",
    title: "8085 & 8086 Microprocessors Architecture & Assembly",
    channel: "Bharat Acharya / Neso Academy",
    duration: "Full Playlist",
    playlistUrl: "https://www.youtube.com/results?search_query=8085+microprocessor+bharat+acharya",
    focus: "8085/8086 Architecture, Instruction Set, Memory Interfacing, Interrupts",
    keyTopics: ["Registers & Pin Diagram", "Assembly Language Programming (ALP)", "Memory & I/O Interfacing", "Interrupt Handling (TRAP, RST, INTR)"],
    summary: "Visual step-by-step breakdown of microprocessor internal buses, timing diagrams, and register operations.",
    guide: "Write 8085 assembly programs for data transfer and arithmetic. Draw opcode fetch timing diagrams."
  },
  "Python for AI": {
    videoId: "_uQrJ0TkZlc",
    title: "Python Programming & Data Science Libraries",
    channel: "Programming with Mosh / freeCodeCamp",
    duration: "Full Course",
    playlistUrl: "https://www.youtube.com/results?search_query=python+for+artificial+intelligence",
    focus: "Python Syntax, NumPy, Pandas, Matplotlib, OOP in Python",
    keyTopics: ["NumPy Array Operations", "Pandas DataFrames", "Data Wrangling & Cleaning", "Matplotlib & Seaborn Visualization"],
    summary: "Fast-paced, rigorous Python course focused on AI and scientific computation.",
    guide: "Practice vector operations with NumPy. Build data processing scripts with Pandas."
  },
  "Deep Learning": {
    videoId: "aircAruvnKk",
    title: "Neural Networks & Deep Learning",
    channel: "3Blue1Brown",
    duration: "Visual Masterclass",
    playlistUrl: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi",
    focus: "Forward/Backpropagation, Activation Functions, CNNs, RNNs/Transformers",
    keyTopics: ["Backpropagation Calculus", "Loss Functions & Optimizers (Adam, SGD)", "Convolutional Neural Networks (CNNs)", "Attention & Transformers"],
    summary: "Visualizing high-dimensional optimization, gradient descent, and neural network activations.",
    guide: "Derive backpropagation gradient equations for a 2-layer network. Train a PyTorch classifier on MNIST."
  },
  "Probability & Statistics": {
    videoId: "Vfo5le26VU4",
    title: "Probability and Statistics for Computer Science & Engineering",
    channel: "Khan Academy / StatQuest",
    duration: "Full Series",
    playlistUrl: "https://www.youtube.com/results?search_query=probability+and+statistics+engineering+playlist",
    focus: "Bayes Theorem, Probability Distributions (Normal, Poisson, Binomial), Hypothesis Testing",
    keyTopics: ["Conditional Probability & Bayes Theorem", "Random Variables & Expectation", "Normal & Poisson Distributions", "Z-Test, T-Test & Confidence Intervals"],
    summary: "Intuitive breakdowns of probability density functions, statistical inference, and hypothesis testing.",
    guide: "Practice Bayes' Theorem calculation problems. Understand central limit theorem through simulation."
  },
  "Linear Algebra": {
    videoId: "fNk_zzaMoSs",
    title: "Essence of Linear Algebra",
    channel: "3Blue1Brown",
    duration: "Visual Masterclass",
    playlistUrl: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
    focus: "Vector Spaces, Linear Transformations, Determinants, Matrix Inverses, Eigenvalues",
    keyTopics: ["Vector Dot & Cross Products", "Matrix Transformations as Space Morphisms", "Determinant Geometric Meaning", "Eigenvectors & Change of Basis"],
    summary: "The highest rated visual linear algebra series ever created, giving deep intuition for vector operations.",
    guide: "Visualize matrices as transformations of coordinate space. Practice computing eigenvalues of 3x3 matrices."
  },
  "Applied Linear Algebra": {
    videoId: "fNk_zzaMoSs",
    title: "Essence of Linear Algebra",
    channel: "3Blue1Brown",
    duration: "Complete Course",
    playlistUrl: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
    focus: "Linear Transformations, Matrix Decompositions (SVD, PCA)",
    keyTopics: ["Matrix Operations", "Vector Spaces", "SVD & Eigenvectors"],
    summary: "Geometric intuition for matrix computation in data science.",
    guide: "Practice vector space transformations and matrix orthogonalization."
  }
};

export const DEFAULT_VIDEO_RECOMMENDATION = {
  videoId: "dQw4w9WgXcQ", // fallback educational query
  title: "Comprehensive University Subject Lecture Series",
  channel: "evalX Academic Video Network",
  duration: "Curated Playlist",
  playlistUrl: "https://www.youtube.com/results?search_query=engineering+lecture+course",
  focus: "Core principles, conceptual foundations, problem-solving techniques",
  keyTopics: ["Fundamental Definitions", "Worked Examples & Proofs", "Past Examination Questions", "Practical Applications"],
  summary: "Comprehensive academic lectures covering core syllabus modules and exam problem sets.",
  guide: "Analyze past exam papers. Discuss doubts with course instructor weekly. Dedicate 2 hours of self-study specifically to practice problem sets."
};

export function getVideoRecommendation(subjectName) {
  if (!subjectName) return DEFAULT_VIDEO_RECOMMENDATION;

  const normalized = subjectName.trim();

  // 1. Direct match
  if (SUBJECT_VIDEOS[normalized]) {
    return SUBJECT_VIDEOS[normalized];
  }

  // 2. Case-insensitive / partial match
  const lower = normalized.toLowerCase();
  for (const [key, val] of Object.entries(SUBJECT_VIDEOS)) {
    if (key.toLowerCase() === lower || lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return val;
    }
  }

  // 3. Keyword matching for common abbreviations or domains
  if (lower.includes("math") || lower.includes("calculus") || lower.includes("algebra")) {
    return SUBJECT_VIDEOS["Mathematics - I"];
  }
  if (lower.includes("circuit") || lower.includes("electronic") || lower.includes("analog") || lower.includes("diode")) {
    return SUBJECT_VIDEOS["Basic Electronics Engineering"];
  }
  if (lower.includes("electrical") || lower.includes("power") || lower.includes("kcl")) {
    return SUBJECT_VIDEOS["Basic Electrical Engineering"];
  }
  if (lower.includes("algo") || lower.includes("daa")) {
    return SUBJECT_VIDEOS["Design & Analysis of Algorithms"];
  }
  if (lower.includes("data struct") || lower.includes("dsa") || lower.includes("tree") || lower.includes("graph")) {
    return SUBJECT_VIDEOS["Data Structures"];
  }
  if (lower.includes("database") || lower.includes("dbms") || lower.includes("sql")) {
    return SUBJECT_VIDEOS["Database Management Systems"];
  }
  if (lower.includes("os") || lower.includes("operating system")) {
    return SUBJECT_VIDEOS["Operating Systems"];
  }
  if (lower.includes("network") || lower.includes("cn")) {
    return SUBJECT_VIDEOS["Computer Networks"];
  }
  if (lower.includes("compiler") || lower.includes("parser")) {
    return SUBJECT_VIDEOS["Compiler Design"];
  }
  if (lower.includes("digital") || lower.includes("k-map") || lower.includes("logic")) {
    return SUBJECT_VIDEOS["Digital Logic Design"];
  }
  if (lower.includes("discrete") || lower.includes("set theory")) {
    return SUBJECT_VIDEOS["Discrete Mathematics"];
  }
  if (lower.includes("java") || lower.includes("oop") || lower.includes("object")) {
    return SUBJECT_VIDEOS["OOP using Java"];
  }
  if (lower.includes("c prog") || lower.includes("programming in c")) {
    return SUBJECT_VIDEOS["Programming in C"];
  }
  if (lower.includes("ai") || lower.includes("intelligence")) {
    return SUBJECT_VIDEOS["Artificial Intelligence"];
  }
  if (lower.includes("machine learning") || lower.includes("ml")) {
    return SUBJECT_VIDEOS["Machine Learning"];
  }
  if (lower.includes("deep learning") || lower.includes("neural")) {
    return SUBJECT_VIDEOS["Deep Learning"];
  }
  if (lower.includes("web") || lower.includes("html") || lower.includes("css") || lower.includes("javascript")) {
    return SUBJECT_VIDEOS["Web Technologies"];
  }
  if (lower.includes("cloud") || lower.includes("aws") || lower.includes("devops")) {
    return SUBJECT_VIDEOS["Cloud Computing"];
  }
  if (lower.includes("security") || lower.includes("crypto")) {
    return SUBJECT_VIDEOS["Cryptography & Security"];
  }
  if (lower.includes("stat") || lower.includes("probab")) {
    return SUBJECT_VIDEOS["Probability & Statistics"];
  }
  if (lower.includes("physic")) {
    return SUBJECT_VIDEOS["Engineering Physics"];
  }
  if (lower.includes("chem")) {
    return SUBJECT_VIDEOS["Engineering Chemistry"];
  }

  // 4. Dynamic custom subject YouTube fallback
  const encodedQuery = encodeURIComponent(`${normalized} engineering lecture playlist tutorial`);
  return {
    videoId: "KJgsSFOSQv0", // Safe educational placeholder
    title: `${normalized} - Curated Engineering Lectures`,
    channel: "Academic Video Network",
    duration: "Full Video Guide",
    playlistUrl: `https://www.youtube.com/results?search_query=${encodedQuery}`,
    focus: `Core concepts and syllabus modules of ${normalized}`,
    keyTopics: ["Foundations & Definitions", "Worked Numerical Problems", "Exam-Oriented Review"],
    summary: `Curated video tutorials and problem-solving sessions specially tailored for ${normalized}.`,
    guide: "Review the recommended video lectures daily, practice past exam papers, and consult your subject professor for doubts."
  };
}
