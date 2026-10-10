import React, { useState, useEffect } from "react";
import axios from "axios";
import { EXCEL_STUDENTS } from "../data/StudentRecords";

const BRANCH_SUBJECTS = {
  CSE: {
    1: ["Mathematics - I", "Engineering Physics", "Basic Electrical Engineering", "Engineering Graphics"],
    2: ["Mathematics - II", "Engineering Chemistry", "Basic Electronics Engineering", "Programming in C"],
    3: ["Data Structures", "Discrete Mathematics", "Digital Logic Design", "OOP using Java"],
    4: ["Database Management Systems", "Computer Org & Architecture", "Design & Analysis of Algorithms", "Formal Languages & Automata"],
    5: ["Operating Systems", "Computer Networks", "Software Engineering", "Microprocessors & Microcontrollers"],
    6: ["Compiler Design", "Artificial Intelligence", "Web Technologies", "Cryptography & Security"],
    7: ["Cloud Computing", "Machine Learning", "Enterprise Systems", "Open Elective - I"],
    8: ["Major Project & Seminar", "Industrial Internship", "Professional Elective - III", "Open Elective - II"]
  },
  CSIT: {
    1: ["Mathematics - I", "Engineering Physics", "Basic Electrical", "Engineering Graphics"],
    2: ["Mathematics - II", "Engineering Chemistry", "Basic Electronics", "Programming in C"],
    3: ["Data Structures", "Object Oriented Programming", "Digital Logic", "Discrete Math"],
    4: ["DBMS", "Computer Architecture", "Design & Algorithms", "Information Theory"],
    5: ["Operating Systems", "Computer Networks", "Software Engineering", "Web Technology"],
    6: ["Compiler Design", "Cloud Computing", "Cryptography", "Distributed Systems"]
  },
  AIML: {
    1: ["Mathematics - I", "Engineering Physics", "Basic Electrical", "Engineering Graphics"],
    2: ["Mathematics - II", "Engineering Chemistry", "Basic Electronics", "Python for AI"],
    3: ["Data Structures & Alg", "Discrete Mathematics", "Probability & Statistics", "Introduction to AI"],
    4: ["DBMS", "Linear Algebra", "Machine Learning Basics", "AI Search Algorithms"],
    5: ["Operating Systems", "Neural Networks", "Design & Analysis of Algorithms", "Computer Vision"],
    6: ["Natural Language Processing", "Reinforcement Learning", "Deep Learning", "AI Ethics"]
  },
  "AI&DS": {
    1: ["Mathematics - I", "Engineering Physics", "Basic Electrical", "Engineering Graphics"],
    2: ["Mathematics - II", "Engineering Chemistry", "Basic Electronics", "Programming in Python"],
    3: ["Data Structures & Alg", "Probability & Statistics", "Data Science Foundations", "Digital Logic"],
    4: ["DBMS", "Linear Algebra", "Machine Learning Basics", "Data Warehousing & Mining"],
    5: ["Operating Systems", "Computer Networks", "Big Data Analytics", "Deep Learning Techniques"],
    6: ["Statistical Modelling", "Data Visualization", "AI Applications", "Security in Data Science"]
  },
  SE: {
    1: ["Mathematics - I", "Engineering Physics", "Basic Electrical", "Engineering Graphics"],
    2: ["Mathematics - II", "Engineering Chemistry", "Basic Electronics", "Programming in C"],
    3: ["Data Structures", "Discrete Math", "Software Requirements", "OOP using Java"],
    4: ["DBMS", "Software Architecture", "Design & Algorithms", "Software Testing"],
    5: ["Operating Systems", "Computer Networks", "Software Project Management", "Agile Methodologies"],
    6: ["Web Application Engineering", "Design Patterns", "System Security", "DevOps Engineering"]
  },
  DS: {
    1: ["Mathematics - I", "Engineering Physics", "Basic Electrical", "Engineering Graphics"],
    2: ["Mathematics - II", "Engineering Chemistry", "Basic Electronics", "Python Programming"],
    3: ["Data Structures", "Statistics & Probability", "Data Warehousing", "R Programming"],
    4: ["DBMS", "Applied Linear Algebra", "Data Mining", "Machine Learning"],
    5: ["Operating Systems", "Big Data Architecture", "Regression Analysis", "Optimization Techniques"],
    6: ["Business Analytics", "Time Series Analysis", "Deep Learning", "Data Visualization"]
  },
  WD: {
    1: ["Mathematics - I", "Engineering Physics", "Basic Electrical", "Engineering Graphics"],
    2: ["Mathematics - II", "Engineering Chemistry", "Basic Electronics", "Web Fundamentals (HTML/CSS)"],
    3: ["Data Structures", "JavaScript & DOM Programming", "UI/UX Design Concepts", "Database Systems"],
    4: ["Web Frameworks (React/Vue)", "Backend Dev (Node/Express)", "Design & Algorithms", "NoSQL Databases"],
    5: ["Operating Systems", "Computer Networks", "Web Security & Authentication", "API Design & Microservices"],
    6: ["Mobile Web Development", "Cloud Architecture & Hosting", "Performance Optimization", "Full Stack Project"]
  },
  CE: {
    1: ["Mathematics - I", "Engineering Physics", "Basic Electrical", "Engineering Graphics"],
    2: ["Mathematics - II", "Engineering Chemistry", "Basic Electronics", "Mechanics of Solids"],
    3: ["Fluid Mechanics", "Surveying - I", "Building Materials", "Engineering Geology"],
    4: ["Structural Analysis - I", "Surveying - II", "Concrete Technology", "Water Resource Engineering"],
    5: ["Design of Steel Structures", "Geotechnical Engineering - I", "Environmental Engineering - I", "Transportation Engineering - I"],
    6: ["Design of Concrete Structures", "Geotechnical Engineering - II", "Environmental Engineering - II", "Transportation Engineering - II"]
  }
};

const REMEDIAL_GUIDES = {
  "Mathematics - I": {
    focus: "Differential & Integral Calculus, Matrices, Eigenvalues",
    guide: "Spend 20 mins daily on matrices operations. Review the foundation of limits and differentiation. Focus on the physical applications of double integrals.",
    resources: "Khan Academy (Linear Algebra), Professor Leonard (Calculus I & II), MIT OpenCourseWare (18.01)."
  },
  "Mathematics - II": {
    focus: "Vector Calculus, Ordinary Differential Equations, Laplace Transforms",
    guide: "Learn Laplace transforms by plotting them dynamically. Break down vector integration using line and surface integrals.",
    resources: "3Blue1Brown (Essence of Calculus), NPTEL Lectures by Prof. J. Kumar."
  },
  "Basic Electronics Engineering": {
    focus: "PN Junction Diodes, BJT Configuration, Operational Amplifiers (Op-Amps)",
    guide: "Simulate circuits using LTspice (free). Draw diode characteristics curves and practice operational amplifier calculations (gain, invert/non-invert).",
    resources: "Neso Academy (Electronics Series), All About Circuits textbook guides."
  },
  "Data Structures": {
    focus: "Pointers, LinkedList traversal, Stack/Queue implementations, Tree Traversals",
    guide: "Practice code implementations on paper before writing in IDE. Walk through tree traversals (inorder, preorder, postorder) node-by-node.",
    resources: "GeeksforGeeks (Data Structures), Abdul Bari's Algorithms & Data Structures YouTube playlist."
  },
  "Design & Analysis of Algorithms": {
    focus: "Asymptotic Notation, Divide & Conquer, Dynamic Programming, Greedy Algorithms",
    guide: "Focus on Master's Theorem for recurrence relations. Build recursion trees. Solve classic DP problems (0/1 Knapsack, LCS) step-by-step.",
    resources: "MIT 6.006 Introduction to Algorithms (YouTube), LeetCode (tags: recursion, dynamic-programming)."
  },
  "Digital Logic Design": {
    focus: "K-Map minimization, Multiplexers, Counters, Flip-Flops",
    guide: "Solve K-Maps daily. Draw state diagrams for sequential flip-flops (T, D, JK) and understand synchronous vs asynchronous clock cycles.",
    resources: "Neso Academy (Digital Electronics playlist), CircuitVerse simulator."
  },
  "Discrete Mathematics": {
    focus: "Set Theory, Graph Theory, Propositional Logic, Combinatorics",
    guide: "Understand truth tables and practice boolean logic proofs. Focus on graph properties (Eulerian paths, trees) which are critical for computer science.",
    resources: "TrevTutor (Discrete Math playlist), MIT 6.042J Mathematics for Computer Science."
  },
  "Operating Systems": {
    focus: "CPU Scheduling, Semaphores & Deadlock, Virtual Memory page replacement",
    guide: "Simulate scheduling (Round Robin, SRTF) using timeline diagrams. Study Bankers Algorithm for deadlock avoidance.",
    resources: "Galvin Textbook (Operating System Concepts), NPTEL OS Course by Prof. Santanu Chattopadhyay."
  },
  "Computer Org & Architecture": {
    focus: "Cache Mapping, Pipelining, Instruction Cycles, Memory Hierarchy",
    guide: "Practice cache hit/miss ratio calculation and pipeline speedup formulas. Visualize instruction execution inside ALU.",
    resources: "Computer System Architecture by M. Morris Mano, Neso Academy."
  },
  "Database Management Systems": {
    focus: "Normal Forms (1NF, 2NF, 3NF, BCNF), SQL Joins, Transaction ACID isolation",
    guide: "Practice normalization problems to resolve redundancy. Write nested SQL subqueries on live terminal. Memorize ACID principles.",
    resources: "W3Schools SQL, database-system-concepts (Silberschatz) book resources."
  },
  "Compiler Design": {
    focus: "LL(1) & LR(1) Parsers, Lexical Analysis, Intermediate Code Gen",
    guide: "Calculate FIRST & FOLLOW sets for grammars. Construct parsing tables. Study DFA state transitions in lexers.",
    resources: "Stanford CS143 Compilers, Gate Smashers lectures."
  }
};

const DEFAULT_GUIDE = {
  focus: "Core concepts, problem-solving methodologies, assignments",
  guide: "Analyze past exam papers. Discuss doubts with course instructor weekly. Dedicate 2 hours of self-study specifically to practice problem sets.",
  resources: "NPTEL Courses, GeeksforGeeks, textbooks recommended in your syllabus."
};

function StudentForm({ navigateTo, setStudentSession, showBrutalAlert, showBrutalConfirm, API_BASE }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [college, setCollege] = useState("C. V. Raman Global University");
  const [branch, setBranch] = useState("CSE");
  const [group, setGroup] = useState("4");

  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [regSuggestions, setRegSuggestions] = useState([]);

  const [chk10th, setChk10th] = useState(true);
  const [chk12th, setChk12th] = useState(false);
  const [chkIti, setChkIti] = useState(false);
  const [chkDiploma, setChkDiploma] = useState(false);
  const [chkBtech, setChkBtech] = useState(false);

  const [btechSem, setBtechSem] = useState(6);
  const [btechCompleted, setBtechCompleted] = useState(false);

  const [board10th, setBoard10th] = useState("CBSE");
  const [score10th, setScore10th] = useState("88.5");
  const [board12th, setBoard12th] = useState("CBSE");
  const [score12th, setScore12th] = useState("82.0");
  const [tradeIti, setTradeIti] = useState("Electrician");
  const [scoreIti, setScoreIti] = useState("85.0");
  const [streamDiploma, setStreamDiploma] = useState("Computer Engineering");
  const [scoreDiploma, setScoreDiploma] = useState("79.2");
  const [weakDiploma, setWeakDiploma] = useState("Applied Mathematics, Analog Electronics");

  const [semesterData, setSemesterData] = useState({});
  const [activeSemTab, setActiveSemTab] = useState(null);

  const startSem = (chkDiploma || chkIti) ? 3 : 1;
  const targetSemMax = btechCompleted ? Number(btechSem) : Number(btechSem) - 1;

  useEffect(() => {
    if (step === 4 && chkBtech) {
      const initial = {};
      const branchData = BRANCH_SUBJECTS[branch] || BRANCH_SUBJECTS["CSE"];
      for (let s = startSem; s <= targetSemMax; s++) {
        const defaultSubjects = branchData[s] || [];
        initial[s] = defaultSubjects.map(subName => ({ name: subName, score: "", isDefault: true }));
      }
      setSemesterData(initial);
      setActiveSemTab(startSem);
    }
  }, [step]);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (val.trim().length < 2) {
      setNameSuggestions([]);
      return;
    }
    const matches = EXCEL_STUDENTS.filter(s => s.name.toLowerCase().includes(val.toLowerCase())).slice(0, 10);
    setNameSuggestions(matches);
  };

  const handleRegChange = (e) => {
    const val = e.target.value;
    setRegNo(val);
    if (val.trim().length < 2) {
      setRegSuggestions([]);
      return;
    }
    const matches = EXCEL_STUDENTS.filter(s => s.regNo.toLowerCase().includes(val.toLowerCase())).slice(0, 10);
    setRegSuggestions(matches);
  };

  const handleSelectStudent = (student) => {
    setName(student.name);
    setRegNo(student.regNo);
    setBranch(student.branch);
    setGroup(student.group);
    setNameSuggestions([]);
    setRegSuggestions([]);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim() || !regNo.trim()) {
        showBrutalAlert("Please fill in your Name and Registration Number.");
        return;
      }
    }
    if (step === 3) {
      if (chk10th) {
        const val = parseFloat(score10th);
        if (isNaN(val) || val < 0 || val > 100) {
          showBrutalAlert("Please enter a valid 10th Score between 0 and 100.");
          return;
        }
      }
      if (chk12th) {
        const val = parseFloat(score12th);
        if (isNaN(val) || val < 0 || val > 100) {
          showBrutalAlert("Please enter a valid 12th Score between 0 and 100.");
          return;
        }
      }
      if (chkIti) {
        const val = parseFloat(scoreIti);
        if (isNaN(val) || val < 0 || val > 100) {
          showBrutalAlert("Please enter a valid ITI Score between 0 and 100.");
          return;
        }
      }
      if (chkDiploma) {
        const val = parseFloat(scoreDiploma);
        if (isNaN(val) || val < 0 || val > 100) {
          showBrutalAlert("Please enter a valid Diploma Score between 0 and 100.");
          return;
        }
      }
    }
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleAddSubject = (sem) => {
    setSemesterData({
      ...semesterData,
      [sem]: [...(semesterData[sem] || []), { name: "", score: "", isDefault: false }]
    });
  };

  const handleRemoveSubject = (sem, index) => {
    const list = [...(semesterData[sem] || [])];
    list.splice(index, 1);
    setSemesterData({
      ...semesterData,
      [sem]: list
    });
  };

  const handleSubjectChange = (sem, index, field, value) => {
    const list = [...(semesterData[sem] || [])];
    list[index][field] = value;
    setSemesterData({
      ...semesterData,
      [sem]: list
    });
  };

  const handleQuickFillBasic = () => {
    setName("Priyadarshi Nayak");
    setRegNo("230120104");
    setCollege("C. V. Raman Global University");
    setBranch("CSE");
    setGroup("4");
  };

  const handleQuickFillTimeline = () => {
    setChk10th(true);
    setChk12th(true);
    setChkDiploma(false);
    setChkIti(false);
    setChkBtech(true);
    setBtechSem(6);
    setBtechCompleted(false);
  };

  const handleQuickFillPrior = () => {
    setBoard10th("CBSE");
    setScore10th("88.5");
    setBoard12th("CBSE");
    setScore12th("82.0");
    setTradeIti("Electrician");
    setScoreIti("85.0");
    setStreamDiploma("Computer Engineering");
    setScoreDiploma("79.2");
    setWeakDiploma("Applied Mathematics, Analog Electronics");
  };

  const handleQuickFill = () => {
    const updated = {};
    const branchData = BRANCH_SUBJECTS[branch] || BRANCH_SUBJECTS["CSE"];
    for (let s = startSem; s <= targetSemMax; s++) {
      const defaults = branchData[s] || [];
      updated[s] = defaults.map(subName => {
        let score = 72 + Math.floor(Math.random() * 20);
        if (subName === "Basic Electronics Engineering" || subName === "Basic Electronics") {
          score = 42;
        } else if (subName === "Design & Analysis of Algorithms" || subName === "Design & Algorithms") {
          score = 46;
        }
        return { name: subName, score: String(score), isDefault: true };
      });
    }
    setSemesterData(updated);
  };

  const handleSubmit = async () => {
    const btechMarks = [];
    let errorFound = false;

    if (chkBtech && targetSemMax >= startSem) {
      for (let s = startSem; s <= targetSemMax; s++) {
        const subjects = semesterData[s] || [];
        if (subjects.length === 0) {
          showBrutalAlert(`Please add at least one course for Semester ${s}.`);
          setActiveSemTab(s);
          errorFound = true;
          break;
        }

        const compiledSubjects = [];
        for (let idx = 0; idx < subjects.length; idx++) {
          const sub = subjects[idx];
          const scoreVal = parseFloat(sub.score);
          if (!sub.name.trim() || isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) {
            showBrutalAlert("Please fill all subject names and valid scores (0-100).");
            setActiveSemTab(s);
            errorFound = true;
            break;
          }
          compiledSubjects.push({ name: sub.name, score: scoreVal });
        }
        if (errorFound) break;
        btechMarks.push({ sem: s, subjects: compiledSubjects });
      }
    }

    if (errorFound) return;

    const weakSubjects = [];
    if (chkDiploma && weakDiploma.trim()) {
      const rawWeaks = weakDiploma.split(",");
      rawWeaks.forEach(w => {
        const trimmed = w.trim();
        if (trimmed) {
          weakSubjects.push({ name: trimmed, score: 50, reason: "Flagged in Diploma Records" });
        }
      });
    }

    let totalScoreSum = 0;
    let totalSubjectsCount = 0;

    btechMarks.forEach(semBlock => {
      semBlock.subjects.forEach(sub => {
        totalScoreSum += sub.score;
        totalSubjectsCount++;
        if (sub.score < 50) {
          weakSubjects.push({
            name: sub.name,
            score: sub.score,
            reason: `B.Tech Sem ${semBlock.sem} (Score: ${sub.score}/100)`
          });
        }
      });
    });

    let cgpaValue = 0;
    if (totalSubjectsCount > 0) {
      cgpaValue = Math.round((totalScoreSum / totalSubjectsCount / 10) * 100) / 100;
    } else {
      let sum = parseFloat(score10th) || 0;
      let count = 1;
      if (chk12th) { sum += parseFloat(score12th) || 0; count++; }
      if (chkDiploma) { sum += parseFloat(scoreDiploma) || 0; count++; }
      cgpaValue = Math.round((sum / count / 10) * 100) / 100;
    }

    const payload = {
      name,
      regNo,
      college,
      branch,
      group,
      timeline: { tenth: chk10th, twelfth: chk12th, diploma: chkDiploma, btech: chkBtech },
      marks: {
        tenth: chk10th ? { board: board10th, score: parseFloat(score10th) } : null,
        twelfth: chk12th ? { board: board12th, score: parseFloat(score12th) } : null,
        diploma: chkDiploma ? { stream: streamDiploma, score: parseFloat(scoreDiploma), weak: weakDiploma } : null,
        btech: btechMarks
      },
      cgpa: cgpaValue,
      weakSubjects
    };

    try {
      const res = await axios.post(`${API_BASE}/students`, payload);
      const studentData = res.data || payload;
      sessionStorage.setItem("evalx_sess_student", JSON.stringify(studentData));
      setStudentSession(studentData);
      navigateTo("#student-dashboard");
    } catch (error) {
      console.warn("Backend notice, proceeding with client session:", error);
      sessionStorage.setItem("evalx_sess_student", JSON.stringify(payload));
      setStudentSession(payload);
      navigateTo("#student-dashboard");
    }
  };

  return (
    <main id="page-student-form" className="page active">
      <div className="fullscreen-split">
        <div className="split-left">
          <div>
            <span className="mono-tag">// ENROLMENT INITIALIZATION</span>
            <h2 style={{ fontSize: "3rem", lineHeight: 1, marginTop: "1rem", textTransform: "none" }}>Student Profile</h2>
            <p className="text-secondary mt-2" style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Fill in details to compute your academic index and map curricular deficiencies.
            </p>
          </div>

          {/* C. V. Raman Global University Official Logo */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "2.5rem 0", textAlign: "center" }}>
            <div style={{
              width: "165px",
              height: "165px",
              background: "#ffffff",
              border: "3px solid #000000",
              borderRadius: "50%",
              boxShadow: "5px 5px 0 #000000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
              marginBottom: "1rem"
            }}>
              <img
                src="/cgu_logo.png"
                alt="C. V. Raman Global University Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%" }}
              />
            </div>
            <p style={{ fontFamily: "var(--font-brutal-display)", fontWeight: "900", fontSize: "1.05rem", color: "#000", letterSpacing: "-0.02em" }}>
              C. V. Raman Global University
            </p>
            <p style={{ fontFamily: "var(--font-brutal-mono)", fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.2rem", fontWeight: "700" }}>
              Bhubaneswar, Odisha · Estd. 2020
            </p>
          </div>

          <div>
            <div className="step-bar-wrap">
              <div className={`step-bar ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`} onClick={() => step > 1 && setStep(1)}></div>
              <div className={`step-bar ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`} onClick={() => step > 2 && setStep(2)}></div>
              <div className={`step-bar ${step >= 3 ? "active" : ""} ${step > 3 ? "completed" : ""}`} onClick={() => step > 3 && setStep(3)}></div>
              <div className={`step-bar ${step >= 4 ? "active" : ""} ${step > 4 ? "completed" : ""}`} onClick={() => step > 4 && setStep(4)}></div>
            </div>
            <p style={{ fontSize: "0.75rem", fontWeight: 800 }}>
              {step === 1 && "STEP 1 OF 4: BASIC DETAILS"}
              {step === 2 && "STEP 2 OF 4: EDUCATION TIMELINE"}
              {step === 3 && "STEP 3 OF 4: MARKS DOCUMENTATION"}
              {step === 4 && "STEP 4 OF 4: SEMESTER GRADES"}
            </p>
          </div>
        </div>

        <div className="split-right">
          {step === 1 && (
            <div className="form-step active" style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                <h2 style={{ fontSize: "2rem", textTransform: "none", margin: 0 }}>Basic Particulars</h2>
                <button
                  type="button"
                  className="brutal-btn brutal-btn-accent"
                  onClick={handleQuickFillBasic}
                  style={{ fontSize: "0.85rem", padding: "0.6rem 1.2rem" }}
                >
                  ⚡ Fill Demo Profile
                </button>
              </div>

              <div className="form-group" style={{ marginBottom: "1.5rem", position: "relative" }}>
                <label className="brutal-label">Full Student Name *</label>
                <input
                  type="text"
                  className="brutal-input"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. Priyadarshi Nayak"
                  autoComplete="off"
                />
                {nameSuggestions.length > 0 && (
                  <div className="autocomplete-dropdown" style={{ display: "block" }}>
                    {nameSuggestions.map((s, i) => (
                      <div key={i} className="autocomplete-item" onClick={() => handleSelectStudent(s)}>
                        <strong>{s.name}</strong>
                        <span>REG: {s.regNo} ({s.branch} G{s.group})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: "1.5rem", position: "relative" }}>
                <label className="brutal-label">Registration Number *</label>
                <input
                  type="text"
                  className="brutal-input"
                  value={regNo}
                  onChange={handleRegChange}
                  placeholder="e.g. 230120104"
                  autoComplete="off"
                />
                {regSuggestions.length > 0 && (
                  <div className="autocomplete-dropdown" style={{ display: "block" }}>
                    {regSuggestions.map((s, i) => (
                      <div key={i} className="autocomplete-item" onClick={() => handleSelectStudent(s)}>
                        <strong>{s.name}</strong>
                        <span>REG: {s.regNo} ({s.branch} G{s.group})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label className="brutal-label">College Institution *</label>
                <select className="brutal-select" value={college} onChange={(e) => setCollege(e.target.value)}>
                  <option>C. V. Raman Global University</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label className="brutal-label">Academic Branch *</label>
                <select className="brutal-select" value={branch} onChange={(e) => setBranch(e.target.value)}>
                  <option value="CSE">Computer Science & Engineering (CSE)</option>
                  <option value="CSIT">Information Technology (CSIT)</option>
                  <option value="AIML">Artificial Intelligence & Machine Learning (AIML)</option>
                  <option value="AI&DS">Artificial Intelligence & Data Science (AI&DS)</option>
                  <option value="SE">Software Engineering (SE)</option>
                  <option value="DS">Data Science (DS)</option>
                  <option value="WD">Web Development (WD)</option>
                  <option value="CE">Civil Engineering (CE)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label className="brutal-label">Student Group Lead *</label>
                <select className="brutal-select" value={group} onChange={(e) => setGroup(e.target.value)}>
                  <option value="1">Group 1</option>
                  <option value="2">Group 2</option>
                  <option value="3">Group 3</option>
                  <option value="4">Group 4</option>
                  <option value="5">Group 5</option>
                </select>
              </div>

              <div className="form-navigation">
                <button className="brutal-btn" onClick={() => navigateTo("#home")} style={{ background: "#fff" }}>Cancel</button>
                <button className="brutal-btn brutal-btn-dark" onClick={handleNext}>Continue →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step active" style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h2 style={{ fontSize: "2rem", textTransform: "none", margin: 0 }}>Qualifications Timeline</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    Select completed milestones.
                  </p>
                </div>
                <button
                  type="button"
                  className="brutal-btn brutal-btn-accent"
                  onClick={handleQuickFillTimeline}
                  style={{ fontSize: "0.85rem", padding: "0.6rem 1.2rem" }}
                >
                  ⚡ Quick Select B.Tech Flow
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div className={`glass-card selected`} style={{ cursor: "not-allowed" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "1.2rem", textTransform: "none" }}>10th Standard</h3>
                    <input type="checkbox" checked={chk10th} disabled style={{ scale: "1.5" }} />
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>Always required</p>
                </div>

                <div className={`glass-card ${chk12th ? "selected" : ""}`} onClick={() => setChk12th(!chk12th)} style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "1.2rem", textTransform: "none" }}>12th Standard</h3>
                    <input type="checkbox" checked={chk12th} readOnly style={{ scale: "1.5" }} />
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>Intermediate boards</p>
                </div>

                <div className={`glass-card ${chkIti ? "selected" : ""}`} onClick={() => setChkIti(!chkIti)} style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "1.2rem", textTransform: "none" }}>ITI Scholar</h3>
                    <input type="checkbox" checked={chkIti} readOnly style={{ scale: "1.5" }} />
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>Vocational trade certificates</p>
                </div>

                <div className={`glass-card ${chkDiploma ? "selected" : ""}`} onClick={() => setChkDiploma(!chkDiploma)} style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "1.2rem", textTransform: "none" }}>Diploma Course</h3>
                    <input type="checkbox" checked={chkDiploma} readOnly style={{ scale: "1.5" }} />
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>Polytechnic stream</p>
                </div>

                <div className={`glass-card ${chkBtech ? "selected" : ""}`} onClick={() => setChkBtech(!chkBtech)} style={{ cursor: "pointer", gridColumn: "1 / -1" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "1.2rem", textTransform: "none" }}>B.Tech Engineering</h3>
                    <input type="checkbox" checked={chkBtech} readOnly style={{ scale: "1.5" }} />
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>Active undergraduate cohort</p>
                </div>
              </div>

              {chkBtech && (
                <div style={{ border: "var(--border-width) solid var(--border-brutal)", borderRadius: "16px", padding: "2rem", marginTop: "2.5rem", background: "#fff", boxShadow: "4px 4px 0 #000" }}>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", textTransform: "none" }}>B.Tech Enrollment Status</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "center" }}>
                    <div>
                      <label className="brutal-label">Current Active Semester</label>
                      <select className="brutal-select" value={btechSem} onChange={(e) => setBtechSem(e.target.value)}>
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                        <option value="5">Semester 5</option>
                        <option value="6">Semester 6</option>
                        <option value="7">Semester 7</option>
                        <option value="8">Semester 8</option>
                      </select>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1.5rem" }}>
                      <input type="checkbox" id="student-btech-completed" checked={btechCompleted} onChange={(e) => setBtechCompleted(e.target.checked)} style={{ scale: "1.6" }} />
                      <label className="brutal-label" htmlFor="student-btech-completed" style={{ margin: 0, cursor: "pointer" }}>Grades Fully Published</label>
                    </div>
                  </div>
                  <div style={{ border: "2px dashed var(--border-brutal)", background: "var(--bg-brutal)", padding: "1rem", borderRadius: "10px", marginTop: "1.5rem", fontSize: "0.85rem" }}>
                    {targetSemMax < 1 ? (
                      <p>⚠️ <strong>Notice:</strong> You are in Semester 1 (incomplete). No prior engineering semesters to log. You will jump directly to submission.</p>
                    ) : (
                      <p>🎓 <strong>Requirement:</strong> Since you are in Semester {btechSem} ({btechCompleted ? "completed" : "incomplete"}), you will fill in subjects and marks up to <strong>Semester {targetSemMax}</strong>.</p>
                    )}
                  </div>
                </div>
              )}

              <div className="form-navigation">
                <button className="brutal-btn" onClick={handlePrev} style={{ background: "#fff" }}>Back</button>
                <button className="brutal-btn brutal-btn-dark" onClick={handleNext}>Continue →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step active" style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                <h2 style={{ fontSize: "2rem", textTransform: "none", margin: 0 }}>Prior Qualifications Scores</h2>
                <button
                  type="button"
                  className="brutal-btn brutal-btn-accent"
                  onClick={handleQuickFillPrior}
                  style={{ fontSize: "0.85rem", padding: "0.6rem 1.2rem" }}
                >
                  ⚡ Quick Fill Demo Scores
                </button>
              </div>

              {chk10th && (
                <div style={{ marginBottom: "2rem", borderBottom: "2px solid #000", paddingBottom: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", textTransform: "none" }}>10th Standard Academic Board</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
                    <div>
                      <label className="brutal-label">Board / Body Name</label>
                      <input type="text" className="brutal-input" value={board10th} onChange={(e) => setBoard10th(e.target.value)} placeholder="e.g. CBSE / BSE Odisha" />
                    </div>
                    <div>
                      <label className="brutal-label">Final Marks (%) *</label>
                      <input type="text" className="brutal-input" value={score10th} onChange={(e) => setScore10th(e.target.value)} placeholder="e.g. 91.5" />
                    </div>
                  </div>
                </div>
              )}

              {chk12th && (
                <div style={{ marginBottom: "2rem", borderBottom: "2px solid #000", paddingBottom: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", textTransform: "none" }}>12th Standard Intermediate Board</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
                    <div>
                      <label className="brutal-label">Board / Council Name</label>
                      <input type="text" className="brutal-input" value={board12th} onChange={(e) => setBoard12th(e.target.value)} placeholder="e.g. CHSE Odisha" />
                    </div>
                    <div>
                      <label className="brutal-label">Final Marks (%) *</label>
                      <input type="text" className="brutal-input" value={score12th} onChange={(e) => setScore12th(e.target.value)} placeholder="e.g. 84.2" />
                    </div>
                  </div>
                </div>
              )}

              {chkIti && (
                <div style={{ marginBottom: "2rem", borderBottom: "2px solid #000", paddingBottom: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", textTransform: "none" }}>ITI Vocational Record</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
                    <div>
                      <label className="brutal-label">Vocational Trade Stream</label>
                      <input type="text" className="brutal-input" value={tradeIti} onChange={(e) => setTradeIti(e.target.value)} placeholder="e.g. Electrician / Fitter" />
                    </div>
                    <div>
                      <label className="brutal-label">Final Grade (%) *</label>
                      <input type="text" className="brutal-input" value={scoreIti} onChange={(e) => setScoreIti(e.target.value)} placeholder="e.g. 85.0" />
                    </div>
                  </div>
                </div>
              )}

              {chkDiploma && (
                <div style={{ marginBottom: "2rem", borderBottom: "2px solid #000", paddingBottom: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", textTransform: "none" }}>Diploma Polytechnic Record</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
                    <div>
                      <label className="brutal-label">Polytechnic Branch Stream</label>
                      <input type="text" className="brutal-input" value={streamDiploma} onChange={(e) => setStreamDiploma(e.target.value)} placeholder="e.g. Computer Science" />
                    </div>
                    <div>
                      <label className="brutal-label">Final Score (%) *</label>
                      <input type="text" className="brutal-input" value={scoreDiploma} onChange={(e) => setScoreDiploma(e.target.value)} placeholder="e.g. 81.2" />
                    </div>
                    <div style={{ gridColumn: "1 / -1", marginTop: "1rem" }}>
                      <label className="brutal-label">Declared Weak Subjects (Separated by commas)</label>
                      <input type="text" className="brutal-input" value={weakDiploma} onChange={(e) => setWeakDiploma(e.target.value)} placeholder="e.g. Applied Mathematics, Analog Electronics" />
                    </div>
                  </div>
                </div>
              )}

              <div className="form-navigation">
                <button className="brutal-btn" onClick={handlePrev} style={{ background: "#fff" }}>Back</button>
                <button className="brutal-btn brutal-btn-dark" onClick={handleNext}>Continue →</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="form-step active" style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "2rem", textTransform: "none", margin: 0 }}>Curricular Subject Grades</h2>
                {chkBtech && targetSemMax >= startSem && (
                  <button className="brutal-btn brutal-btn-accent" onClick={handleQuickFill} style={{ fontSize: "0.85rem", padding: "0.6rem 1.2rem" }}>Quick Fill Mock Grades</button>
                )}
              </div>

              {(!chkBtech || targetSemMax < startSem) ? (
                <div className="glass-card text-center" style={{ padding: "2.5rem" }}>
                  <span style={{ fontSize: "2rem" }}>📝</span>
                  <p className="mt-2" style={{ fontWeight: 700 }}>No preceding B.Tech semesters to configure.</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>Click submit below to complete your setup.</p>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "2rem" }}>
                    {Object.keys(semesterData).map(sem => (
                      <button
                        key={sem}
                        type="button"
                        className={`sem-tab-btn ${activeSemTab === Number(sem) ? "active" : ""}`}
                        onClick={() => setActiveSemTab(Number(sem))}
                      >
                        Sem {sem}
                      </button>
                    ))}
                  </div>

                  {Object.keys(semesterData).map(semKey => {
                    const sem = Number(semKey);
                    if (activeSemTab !== sem) return null;
                    return (
                      <div key={sem} style={{ display: "block" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                          <h3 style={{ fontSize: "1.2rem", textTransform: "none" }}>Semester {sem} Grades</h3>
                          <button type="button" className="brutal-btn" onClick={() => handleAddSubject(sem)} style={{ padding: "0.4rem 0.9rem", fontSize: "0.75rem", background: "#fff" }}>+ Add Elective</button>
                        </div>

                        <div className="subjects-grid">
                          {(semesterData[sem] || []).map((sub, idx) => (
                            <div key={idx} className="subject-row">
                              <div>
                                {sub.isDefault ? (
                                  <span className="subject-row-label">{sub.name}</span>
                                ) : (
                                  <input
                                    type="text"
                                    className="brutal-input"
                                    value={sub.name}
                                    onChange={(e) => handleSubjectChange(sem, idx, "name", e.target.value)}
                                    placeholder="Elective Course Name"
                                  />
                                )}
                              </div>
                              <div>
                                <input
                                  type="text"
                                  className="brutal-input"
                                  value={sub.score}
                                  onChange={(e) => handleSubjectChange(sem, idx, "score", e.target.value)}
                                  placeholder="Score"
                                  style={{ textAlign: "center" }}
                                />
                              </div>
                              <div>
                                {sub.isDefault ? (
                                  <span style={{ fontSize: "1.1rem", color: "var(--text-muted)", cursor: "not-allowed" }} title="Core subject cannot be deleted">🔒</span>
                                ) : (
                                  <button type="button" className="btn-remove-subject" onClick={() => handleRemoveSubject(sem, idx)} title="Delete Elective">&times;</button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="form-navigation">
                <button className="brutal-btn" onClick={handlePrev} style={{ background: "#fff" }}>Back</button>
                <button className="brutal-btn brutal-btn-dark" onClick={handleSubmit}>Complete Setup</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default StudentForm;
