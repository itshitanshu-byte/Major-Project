import React, { useState } from "react";
import axios from "axios";
import { getVideoRecommendation } from "../data/videoRecommendations";
import { getTopicsForSubject, getOfflineQuizQuestions } from "../data/quizBank";

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

function StudentDashboard({ student, handleLogout, handleOpenSettings, apiKey, showBrutalAlert }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [aiReport, setAiReport] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const initialSubject = student.weakSubjects && student.weakSubjects.length > 0 ? student.weakSubjects[0].name : "Operating Systems";
  const [selectedVideoSubject, setSelectedVideoSubject] = useState(initialSubject);
  const [activeEmbedSubject, setActiveEmbedSubject] = useState(null);

  // AI Quiz States
  const [quizSubject, setQuizSubject] = useState(initialSubject);
  const [quizTopic, setQuizTopic] = useState("");
  const [customTopicInput, setCustomTopicInput] = useState("");
  const [quizDifficulty, setQuizDifficulty] = useState("Standard");
  const [quizState, setQuizState] = useState("config"); // "config" | "playing" | "results"
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizCurrentIndex, setQuizCurrentIndex] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState(null);
  const [quizIsAnswered, setQuizIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAiLoading, setQuizAiLoading] = useState(false);
  const [aiDoubtResponse, setAiDoubtResponse] = useState("");
  const [aiDoubtLoading, setAiDoubtLoading] = useState(false);

  const btechBlocks = student.marks.btech || [];
  const totalSubjects = btechBlocks.reduce((acc, sem) => acc + sem.subjects.length, 0);

  const sortedSemesters = [...btechBlocks].sort((a, b) => a.sem - b.sem);
  const dataset = sortedSemesters.map(block => {
    const sum = block.subjects.reduce((s, sub) => s + sub.score, 0);
    const sgpa = (sum / block.subjects.length) / 10;
    return {
      label: `Sem ${block.sem}`,
      val: Math.round(sgpa * 100) / 100
    };
  });

  const currentSelectedVideo = getVideoRecommendation(selectedVideoSubject);

  const handleOpenVideoTab = (subjectName) => {
    setSelectedVideoSubject(subjectName);
    setActiveTab("videos");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenQuizTab = (subjectName, topic = "") => {
    setQuizSubject(subjectName);
    setQuizTopic(topic);
    setQuizState("config");
    setActiveTab("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Robust Multi-tier Nvidia AI Caller (Bypasses Browser CORS)
  const callNvidiaAI = async ({ apiKey, messages, model, temperature, max_tokens }) => {
    // 1. Try local server-side proxy (/api/ai/chat)
    try {
      const res = await axios.post("/api/ai/chat", {
        apiKey,
        model: model || "meta/llama-3.1-70b-instruct",
        messages,
        temperature,
        max_tokens
      });
      if (res.data && res.data.choices && res.data.choices[0]) {
        return res.data.choices[0].message.content;
      }
    } catch (err1) {
      console.warn("Backend /api/ai/chat proxy notice:", err1.message);
    }

    // 2. Try Vite /nvidia-api dev proxy
    try {
      const res = await axios.post("/nvidia-api/v1/chat/completions", {
        model: model || "meta/llama-3.1-70b-instruct",
        messages,
        temperature,
        max_tokens
      }, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });
      if (res.data && res.data.choices && res.data.choices[0]) {
        return res.data.choices[0].message.content;
      }
    } catch (err2) {
      console.warn("Vite /nvidia-api proxy notice:", err2.message);
    }

    // 3. Fallback direct call
    const res = await axios.post("https://integrate.api.nvidia.com/v1/chat/completions", {
      model: model || "meta/llama-3.1-70b-instruct",
      messages,
      temperature,
      max_tokens
    }, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });
    return res.data.choices[0].message.content;
  };

  // Start AI Quiz
  const handleStartQuiz = async () => {
    const activeTopic = customTopicInput.trim() || quizTopic || "Core Concepts";
    setQuizAiLoading(true);

    if (!apiKey) {
      setTimeout(() => {
        const fallbackQs = getOfflineQuizQuestions(quizSubject, activeTopic);
        setQuizQuestions(fallbackQs);
        setQuizCurrentIndex(0);
        setQuizScore(0);
        setQuizSelectedOption(null);
        setQuizIsAnswered(false);
        setQuizState("playing");
        setQuizAiLoading(false);
      }, 500);
      return;
    }

    try {
      const content = await callNvidiaAI({
        apiKey,
        model: "meta/llama-3.1-70b-instruct",
        messages: [
          {
            role: "system",
            content: `You are evalX academic diagnostic quiz master. Generate a high-yield, 3-question conceptual diagnostic quiz on the specified subject and topic. Output strictly JSON without markdown code blocks, with this exact schema:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Detailed conceptual explanation why Option A is correct."
  }
]`
          },
          {
            role: "user",
            content: `Subject: ${quizSubject}\nSpecific Subtopic: ${activeTopic}\nDifficulty: ${quizDifficulty}`
          }
        ],
        temperature: 0.2,
        max_tokens: 1000
      });

      let rawContent = content.trim();
      rawContent = rawContent.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(rawContent);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setQuizQuestions(parsed);
      } else {
        throw new Error("Invalid format received");
      }
    } catch (err) {
      console.warn("AI Quiz generation fallback:", err.message);
      const fallbackQs = getOfflineQuizQuestions(quizSubject, activeTopic);
      setQuizQuestions(fallbackQs);
    } finally {
      setQuizCurrentIndex(0);
      setQuizScore(0);
      setQuizSelectedOption(null);
      setQuizIsAnswered(false);
      setQuizState("playing");
      setQuizAiLoading(false);
    }
  };

  const handleSelectOption = (idx) => {
    if (quizIsAnswered) return;
    setQuizSelectedOption(idx);
    setQuizIsAnswered(true);
    const currentQ = quizQuestions[quizCurrentIndex];
    if (idx === currentQ.correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizCurrentIndex + 1 < quizQuestions.length) {
      setQuizCurrentIndex(prev => prev + 1);
      setQuizSelectedOption(null);
      setQuizIsAnswered(false);
    } else {
      setQuizState("results");
    }
  };

  const handleTriggerAI = async () => {
    setAiLoading(true);
    if (!apiKey) {
      setTimeout(() => {
        setAiReport(generateLocalRemedialReport(student));
        setAiLoading(false);
      }, 800);
      return;
    }

    try {
      let docText = `Tenth Grade: ${student.marks.tenth.score}% (${student.marks.tenth.board})\n`;
      if (student.timeline.twelfth) {
        docText += `Twelfth Grade: ${student.marks.twelfth.score}% (${student.marks.twelfth.board})\n`;
      }
      if (student.timeline.diploma) {
        docText += `Diploma: ${student.marks.diploma.score}% in ${student.marks.diploma.stream}. Declared weakness: ${student.marks.diploma.weak}\n`;
      }
      docText += `B.Tech Semester Records:\n`;
      student.marks.btech.forEach(s => {
        docText += `- Sem ${s.sem}:\n`;
        s.subjects.forEach(sub => {
          docText += `  * ${sub.name}: ${sub.score}/100\n`;
        });
      });

      const content = await callNvidiaAI({
        apiKey,
        model: "meta/llama-3.1-70b-instruct",
        messages: [
          {
            role: "system",
            content: "You are evalX academic cognitive guidance assistant. Analyze student marks and compile a highly structured, encouraging, and detailed academic remediation report. Identify weak subjects specifically. Highlight key topics they should review, advise actionable study actions, and recommend high quality online resources and YouTube lecture channels. Output in clean HTML formatting (h4, p, ul, li, strong) suitable for direct div rendering."
          },
          {
            role: "user",
            content: `Student Academic Profile:\nName: ${student.name}\nBranch: ${student.branch}\nCGPA: ${student.cgpa}\nWeak subjects: ${JSON.stringify(student.weakSubjects)}\nMarks:\n${docText}`
          }
        ],
        temperature: 0.2,
        max_tokens: 1200
      });

      let html = content.replace(/```html/g, "").replace(/```/g, "").trim();
      setAiReport(`
        <div style="border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.75rem; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center;">
          <span class="badge badge-success">✨ Verified Nvidia AI Inference</span>
          <span style="font-size:0.75rem; color:var(--text-muted);">Model: Llama 3.1 70B</span>
        </div>
        <div class="ai-report-body">${html}</div>
      `);
    } catch (error) {
      setAiReport(`
        <div class="glass-card" style="border-color:rgba(239,68,68,0.3); background:rgba(239,68,68,0.05); margin-bottom:1rem;">
          <h4 style="color:var(--color-danger)">⚠️ Nvidia API connection failed</h4>
          <p class="text-secondary mt-1" style="font-size:0.85rem;">
            Failed to connect to Nvidia NIM servers: "${error.message}". Falling back to local engine:
          </p>
        </div>
        ${generateLocalRemedialReport(student)}
      `);
    } finally {
      setAiLoading(false);
    }
  };

  const generateLocalRemedialReport = (st) => {
    if (st.weakSubjects.length === 0) {
      return `
        <div style="border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.75rem; margin-bottom:1rem;">
          <span class="badge badge-secondary">🧠 evalX Local Cognitive Module</span>
        </div>
        <h4>Academic Standing Briefing</h4>
        <p class="mt-2">Excellent performance! You have logged <strong>${st.cgpa.toFixed(2)} CGPA</strong> across <strong>${st.marks.btech.length} semesters</strong>. No subjects scored below 50%.</p>
        <h4 class="mt-4">Recommendations:</h4>
        <ul>
          <li>Maintain study pacing. Solve textbook reference problems.</li>
          <li>Participate in technical hackathons or coding cohorts.</li>
          <li>Outline final year project ideas early.</li>
        </ul>
      `;
    }

    let guidesHtml = "";
    st.weakSubjects.forEach(weak => {
      const guideObj = REMEDIAL_GUIDES[weak.name] || DEFAULT_GUIDE;
      const videoObj = getVideoRecommendation(weak.name);
      guidesHtml += `
        <div class="glass-card mb-4" style="border-color: rgba(245, 158, 11, 0.15); background:rgba(0,0,0,0.15); margin-bottom:1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h4 style="color:var(--color-warning);">${weak.name}</h4>
            <span class="badge badge-danger">📺 YouTube Lecture: ${videoObj.channel}</span>
          </div>
          <p style="font-size:0.85rem; color:#f87171;" class="mt-1">Flag: ${weak.reason}</p>
          <div class="mt-3">
            <strong style="font-size:0.85rem; color:var(--text-secondary);">Core Subtopics:</strong>
            <p style="font-size:0.9rem;" class="mt-1">${guideObj.focus}</p>
          </div>
          <div class="mt-2">
            <strong style="font-size:0.85rem; color:var(--text-secondary);">Weekly Action Steps:</strong>
            <p style="font-size:0.9rem;" class="mt-1">${guideObj.guide}</p>
          </div>
          <div class="mt-2">
            <strong style="font-size:0.85rem; color:var(--text-secondary);">Recommended Video Tutorial:</strong>
            <p style="font-size:0.85rem; color:var(--color-secondary);" class="mt-1">▶️ <strong>${videoObj.title}</strong> by ${videoObj.channel}</p>
          </div>
        </div>
      `;
    });

    return `
      <div style="border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.75rem; margin-bottom:1.5rem; display:flex; justify-content:space-between; align-items:center;">
        <span class="badge badge-secondary">🧠 evalX Local Cognitive Module</span>
        <span style="font-size:0.75rem; color:var(--text-muted);">Simulated Nvidia Advisor</span>
      </div>
      <h4>Remedial Study Roadmap for ${st.name}</h4>
      <p class="mb-4">The academic analysis engine identified <strong>${st.weakSubjects.length} focus targets</strong> requiring curriculum alignment:</p>
      <div class="remedial-guides-container">${guidesHtml}</div>
    `;
  };

  const width = 700;
  const height = 220;
  const paddingX = 50;
  const paddingY = 30;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const yLines = [2, 4, 6, 8, 10];
  const points = dataset.map((d, index) => {
    const xRatio = dataset.length > 1 ? index / (dataset.length - 1) : 0.5;
    const xCoord = paddingX + (xRatio * chartW);
    const yRatio = d.val / 10;
    const yCoord = height - paddingY - (yRatio * chartH);
    return { x: xCoord, y: yCoord, raw: d };
  });

  let pathD = "";
  let areaD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    areaD = `M ${points[0].x} ${height - paddingY} L ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cp1x = prev.x + (curr.x - prev.x) / 3;
      const cp2x = prev.x + 2 * (curr.x - prev.x) / 3;
      pathD += ` C ${cp1x} ${prev.y}, ${cp2x} ${curr.y}, ${curr.x} ${curr.y}`;
      areaD += ` C ${cp1x} ${prev.y}, ${cp2x} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    areaD += ` L ${points[points.length - 1].x} ${height - paddingY} Z`;
  }

  const currentTopicList = getTopicsForSubject(quizSubject);

  return (
    <div className="brutal-grid-layout" style={{ marginTop: "1rem" }}>
      <div className="brutal-sidebar">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "88px",
            height: "88px",
            borderRadius: "50%",
            background: "#ffffff",
            border: "3px solid #000000",
            boxShadow: "4px 4px 0 #000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
            padding: "5px"
          }}>
            <img
              src="/cgu_logo.png"
              alt="C. V. Raman Global University"
              style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%" }}
            />
          </div>
          <h3 id="dash-student-name" style={{ fontSize: "1.3rem", textTransform: "none", marginBottom: "0.25rem" }}>{student.name}</h3>
          <p id="dash-student-reg" style={{ fontSize: "0.75rem", fontFamily: "var(--font-brutal-mono)", color: "var(--text-muted)" }}>REG: {student.regNo}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button className={`nav-item ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
            📊 Overview
          </button>
          <button className={`nav-item ${activeTab === "videos" ? "active" : ""}`} onClick={() => setActiveTab("videos")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>🎬 Video Lectures</span>
            {student.weakSubjects && student.weakSubjects.length > 0 && (
              <span style={{ background: "#ff0000", color: "#fff", border: "1.5px solid #000", borderRadius: "999px", padding: "0.1rem 0.5rem", fontSize: "0.7rem", fontWeight: "bold" }}>
                {student.weakSubjects.length}
              </span>
            )}
          </button>
          <button className={`nav-item ${activeTab === "quiz" ? "active" : ""}`} onClick={() => setActiveTab("quiz")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>🎯 AI Topic Quiz</span>
            <span style={{ background: "var(--color-yellow)", color: "#000", border: "1.5px solid #000", borderRadius: "4px", padding: "0.1rem 0.4rem", fontSize: "0.65rem", fontWeight: "900" }}>
              NEW
            </span>
          </button>
          <button className={`nav-item ${activeTab === "focus" ? "active" : ""}`} onClick={() => setActiveTab("focus")}>
            🧠 Focus Areas
          </button>
          <button className={`nav-item ${activeTab === "ai" ? "active" : ""}`} onClick={() => setActiveTab("ai")}>
            🤖 AI NIM Coach
          </button>
          <button className="nav-item nav-item-danger" onClick={handleLogout} style={{ marginTop: "1.5rem" }}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="brutal-content-area">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="dashboard-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
                <div style={{ width: "65px", height: "65px", borderRadius: "50%", background: "#fff", border: "2.5px solid #000", boxShadow: "3px 3px 0 #000", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src="/cgu_logo.png" alt="University Logo" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%" }} />
                </div>
                <div>
                  <span className="badge badge-primary" id="dash-student-badge">{student.branch} - Group {student.group}</span>
                  <h2 id="dash-college-name" style={{ fontSize: "2.2rem", marginTop: "0.35rem", textTransform: "none" }}>{student.college}</h2>
                </div>
              </div>
            </div>

            <div className="dashboard-card-grid" style={{ marginBottom: "2.5rem" }}>
              <div className="dashboard-metrics-card success" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: "700" }}>B.TECH CGPA</p>
                <p id="dash-cgpa" style={{ fontFamily: "var(--font-brutal-display)", fontSize: "3.2rem", fontWeight: "900", margin: 0 }}>{student.cgpa.toFixed(2)}</p>
              </div>

              <div className="dashboard-metrics-card secondary" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: "700" }}>COURSES EVALUATED</p>
                <p id="dash-total-subjects" style={{ fontFamily: "var(--font-brutal-display)", fontSize: "3.2rem", fontWeight: "900", margin: 0 }}>{totalSubjects}</p>
              </div>

              <div className="dashboard-metrics-card accent" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: "700" }}>NVIDIA AI STATUS</p>
                <p style={{ fontFamily: "var(--font-brutal-display)", fontSize: "2.4rem", fontWeight: "900", margin: "0.5rem 0 0 0", textAlign: "center", lineHeight: 1.1 }}>
                  {apiKey ? "ACTIVE" : "OFFLINE"}
                </p>
              </div>
            </div>

            <div className="brutal-alert-strip" id="dashboard-weakness-banner" style={{ marginBottom: "2.5rem", background: student.weakSubjects.length === 0 ? "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)" : "linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(239, 68, 68, 0.05) 100%)", borderColor: student.weakSubjects.length === 0 ? "rgba(16, 185, 129, 0.25)" : "rgba(245, 158, 11, 0.2)" }}>
              <div className="brutal-alert-strip-left">{student.weakSubjects.length === 0 ? "🏆" : "⚠️"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                  <h4 className="weakness-title" style={{ color: student.weakSubjects.length === 0 ? "var(--color-success)" : "var(--color-warning)", textTransform: "none", margin: 0 }}>
                    {student.weakSubjects.length === 0 ? "Excellent Academic Standing!" : `Focus Target Fields (${student.weakSubjects.length} Weak Subject${student.weakSubjects.length > 1 ? "s" : ""} Identified)`}
                  </h4>
                  {student.weakSubjects.length > 0 && (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        className="brutal-btn"
                        onClick={() => handleOpenVideoTab(student.weakSubjects[0].name)}
                        style={{ background: "#ff0000", color: "#fff", fontSize: "0.75rem", padding: "0.35rem 0.8rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                      >
                        ▶️ Video Hub
                      </button>
                      <button
                        className="brutal-btn"
                        onClick={() => handleOpenQuizTab(student.weakSubjects[0].name)}
                        style={{ background: "var(--color-yellow)", color: "#000", fontSize: "0.75rem", padding: "0.35rem 0.8rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                      >
                        🎯 Take AI Quiz
                      </button>
                    </div>
                  )}
                </div>
                <p id="weakness-summary-text" style={{ fontSize: "0.85rem", marginTop: "0.35rem", color: "var(--text-secondary)" }}>
                  {student.weakSubjects.length === 0
                    ? "All core subjects average above safety threshold. No immediate structural deficiencies found."
                    : "Specific subject fields scored below the 50% safety index. Verified top-tier YouTube tutorial courses & interactive AI topic quizzes have been prepared below."}
                </p>
              </div>
            </div>

            <div className="brutal-subject-grid" id="dash-weak-subjects-container" style={{ marginBottom: "2.5rem" }}>
              {student.weakSubjects.length === 0 ? (
                <div className="glass-card text-center" style={{ gridColumn: "1 / -1", padding: "1.5rem" }}>
                  <span>🏆</span>
                  <p style={{ fontSize: "0.95rem", fontWeight: 600, marginTop: "0.5rem" }}>Keep up the exceptional work!</p>
                </div>
              ) : (
                student.weakSubjects.map((w, idx) => {
                  const guideObj = REMEDIAL_GUIDES[w.name] || DEFAULT_GUIDE;
                  const videoObj = getVideoRecommendation(w.name);
                  return (
                    <div key={idx} className="weak-subject-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                          <div className="weak-subject-name">{w.name}</div>
                          <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-brutal-mono)", background: "#ffe600", border: "1.5px solid #000", padding: "0.15rem 0.4rem", borderRadius: "4px", fontWeight: "bold" }}>
                            {w.score ? `${w.score}/100` : "Flagged"}
                          </span>
                        </div>
                        <div className="weak-subject-score" style={{ marginTop: "0.3rem" }}>{w.reason}</div>
                        <div className="weak-subject-guide" style={{ marginTop: "0.6rem", fontSize: "0.8rem" }}>
                          <strong>Remedial Target:</strong> {guideObj.focus}
                        </div>
                      </div>

                      <div style={{ marginTop: "1rem", paddingTop: "0.8rem", borderTop: "1.5px dashed rgba(0,0,0,0.15)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                          <span style={{ color: "#ff0000", fontSize: "1rem" }}>📺</span>
                          <span style={{ fontSize: "0.75rem", fontWeight: "bold", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {videoObj.channel} · {videoObj.title}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            className="btn-study-embed"
                            onClick={() => handleOpenVideoTab(w.name)}
                            style={{ flex: 1, justifyContent: "center", fontSize: "0.75rem", padding: "0.35rem 0.6rem" }}
                          >
                            ▶️ Video
                          </button>
                          <button
                            className="brutal-btn"
                            onClick={() => handleOpenQuizTab(w.name)}
                            style={{ background: "#ffffff", fontSize: "0.75rem", padding: "0.35rem 0.6rem" }}
                            title="Take Topic Quiz"
                          >
                            🎯 AI Quiz
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", textTransform: "none" }}>Semester SGPA Progression</h3>
              <div className="chart-container" style={{ background: "#111", padding: "1.5rem", borderRadius: "12px", border: "var(--border-width) solid var(--border-brutal)" }}>
                {dataset.length < 2 ? (
                  <div id="sgpa-chart-placeholder" style={{ height: "220px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "var(--text-muted)" }}>
                    <span style={{ fontSize: "1.5rem" }}>📈</span>
                    <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>Log at least 2 semesters of grades to render historical trend timelines.</p>
                  </div>
                ) : (
                  <svg id="sgpa-trend-svg" viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "220px", display: "block", overflow: "visible" }}>
                    <g id="chart-grid">
                      {yLines.map((yVal, i) => {
                        const yRatio = yVal / 10;
                        const yCoord = height - paddingY - (yRatio * chartH);
                        return (
                          <g key={i}>
                            <line x1={paddingX} y1={yCoord} x2={width - paddingX} y2={yCoord} className="chart-grid-line" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                            <text x={paddingX - 12} y={yCoord + 4} textAnchor="end" className="chart-axis-text" fill="rgba(255,255,255,0.4)" fontSize="0.75rem" fontWeight="700">
                              {yVal.toFixed(1)}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                    <path id="chart-area-path" d={areaD} fill="var(--color-blue)" opacity="0.15" />
                    <path id="chart-line-path" d={pathD} fill="none" stroke="var(--color-yellow)" strokeWidth="4" />
                    <g id="chart-dots">
                      {points.map((pt, i) => (
                        <circle key={i} cx={pt.x} cy={pt.y} r="6" className="chart-dot" fill="var(--color-yellow)" stroke="#000" strokeWidth="2.5" onClick={() => showBrutalAlert(`${pt.raw.label} SGPA: ${pt.raw.val}`)} style={{ cursor: "pointer" }} />
                      ))}
                    </g>
                    <g id="chart-labels">
                      {points.map((pt, i) => (
                        <g key={i}>
                          <text x={pt.x} y={height - 10} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="0.75rem" fontWeight="700">
                            {pt.raw.label}
                          </text>
                          <text x={pt.x} y={pt.y - 12} textAnchor="middle" fill="#fff" fontSize="0.75rem" fontWeight="600">
                            {pt.raw.val.toFixed(2)}
                          </text>
                        </g>
                      ))}
                    </g>
                  </svg>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AI TOPIC QUIZ TAB */}
        {activeTab === "quiz" && (
          <div className="dashboard-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span className="mono-tag" style={{ color: "#000", background: "var(--color-yellow)", padding: "0.15rem 0.5rem", border: "1.5px solid #000", borderRadius: "4px" }}>
                  // AI COGNITIVE TEST ENGINE
                </span>
                <h3 style={{ fontSize: "1.85rem", textTransform: "none", marginTop: "0.35rem", margin: 0 }}>
                  Adaptive Topic Diagnostic Quiz
                </h3>
              </div>
              <span className="badge badge-primary">
                {apiKey ? "✨ Meta Llama 70B Live" : "🧠 evalX Local Question Bank"}
              </span>
            </div>

            {/* CONFIG STATE */}
            {quizState === "config" && (
              <div className="quiz-arena-container">
                <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.5 }}>
                  Select the exact subject and specific subtopic you just reviewed in your lecture. The AI will formulate targeted conceptual questions with detailed reasoning feedback.
                </p>

                {/* SUBJECT SELECTOR */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label className="brutal-label">Target Subject *</label>
                  <select
                    className="brutal-select"
                    value={quizSubject}
                    onChange={(e) => {
                      setQuizSubject(e.target.value);
                      setQuizTopic("");
                      setCustomTopicInput("");
                    }}
                  >
                    {student.weakSubjects.map((w, i) => (
                      <option key={i} value={w.name}>⚠️ {w.name} (Weak Area: {w.score ? `${w.score}%` : "Flagged"})</option>
                    ))}
                    <option value="Data Structures">Data Structures</option>
                    <option value="Design & Analysis of Algorithms">Design & Analysis of Algorithms</option>
                    <option value="Operating Systems">Operating Systems</option>
                    <option value="Database Management Systems">Database Management Systems</option>
                    <option value="Mathematics - I">Mathematics - I</option>
                    <option value="Basic Electronics Engineering">Basic Electronics Engineering</option>
                  </select>
                </div>

                {/* SUBTOPIC SELECTION */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label className="brutal-label">Select Subtopic to Test *</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "0.5rem" }}>
                    {currentTopicList.map((t, idx) => {
                      const isSelected = (quizTopic === t && !customTopicInput);
                      return (
                        <button
                          key={idx}
                          type="button"
                          className={`topic-badge-btn ${isSelected ? "active" : ""}`}
                          onClick={() => {
                            setQuizTopic(t);
                            setCustomTopicInput("");
                          }}
                        >
                          📌 {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CUSTOM TOPIC INPUT */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label className="brutal-label">Or Specify Custom Concept / Question Focus</label>
                  <input
                    type="text"
                    className="brutal-input"
                    value={customTopicInput}
                    onChange={(e) => {
                      setCustomTopicInput(e.target.value);
                      setQuizTopic("");
                    }}
                    placeholder="e.g. Master Theorem Case 2, Page Replacement LRU, Deadlock Recovery..."
                  />
                </div>

                {/* DIFFICULTY SELECTOR */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
                  <div>
                    <label className="brutal-label">Assessment Level</label>
                    <select className="brutal-select" value={quizDifficulty} onChange={(e) => setQuizDifficulty(e.target.value)}>
                      <option value="Beginner">Level 1: Core Fundamentals</option>
                      <option value="Standard">Level 2: University Exam Standard</option>
                      <option value="Advanced">Level 3: GATE & Competitive Rigor</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end" }}>
                    <button
                      className="brutal-btn brutal-btn-dark"
                      onClick={handleStartQuiz}
                      disabled={quizAiLoading}
                      style={{ width: "100%", padding: "0.85rem", fontSize: "1rem" }}
                    >
                      {quizAiLoading ? "⚡ Generating Questions..." : "🚀 Launch Topic Quiz →"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PLAYING STATE */}
            {quizState === "playing" && quizQuestions.length > 0 && (
              <div className="quiz-arena-container">
                {/* PROGRESS BAR & HEADER */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span className="mono-tag" style={{ fontSize: "0.8rem", fontWeight: "800" }}>
                    QUESTION {quizCurrentIndex + 1} OF {quizQuestions.length}
                  </span>
                  <span style={{ fontSize: "0.85rem", fontFamily: "var(--font-brutal-mono)", fontWeight: "bold" }}>
                    Score: {quizScore} / {quizCurrentIndex + (quizIsAnswered ? 1 : 0)}
                  </span>
                </div>
                <div className="quiz-progress-bar">
                  <div
                    className="quiz-progress-fill"
                    style={{ width: `${((quizCurrentIndex + 1) / quizQuestions.length) * 100}%` }}
                  ></div>
                </div>

                {/* QUESTION CARD */}
                <div className="quiz-question-box">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-brutal-mono)", background: "#000", color: "#fff", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: "bold" }}>
                      {quizSubject} · {customTopicInput || quizTopic || "Diagnostics"}
                    </span>
                  </div>
                  <p className="quiz-question-text">
                    {quizQuestions[quizCurrentIndex].question}
                  </p>
                </div>

                {/* OPTIONS */}
                <div className="quiz-options-list">
                  {quizQuestions[quizCurrentIndex].options.map((opt, oIdx) => {
                    const isSelected = quizSelectedOption === oIdx;
                    const isCorrect = quizIsAnswered && oIdx === quizQuestions[quizCurrentIndex].correct;
                    const isWrong = quizIsAnswered && isSelected && !isCorrect;

                    let btnClass = "quiz-option-btn";
                    if (isCorrect) btnClass += " correct";
                    else if (isWrong) btnClass += " wrong";
                    else if (isSelected) btnClass += " selected";

                    return (
                      <button
                        key={oIdx}
                        className={btnClass}
                        onClick={() => handleSelectOption(oIdx)}
                        disabled={quizIsAnswered}
                      >
                        <span className="quiz-option-index">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span style={{ flex: 1 }}>{opt}</span>
                        {isCorrect && <span>✅</span>}
                        {isWrong && <span>❌</span>}
                      </button>
                    );
                  })}
                </div>

                {/* AI DETAILED EXPLANATION & LIVE NVIDIA TUTOR */}
                {quizIsAnswered && (
                  <div className="quiz-ai-explanation">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.4rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "1.2rem" }}>🧠</span>
                        <strong style={{ fontSize: "0.95rem" }}>
                          {quizSelectedOption === quizQuestions[quizCurrentIndex].correct
                            ? "Excellent! Correct Answer"
                            : "Incorrect — Concept Review"}
                        </strong>
                      </div>
                      <span className="badge badge-primary" style={{ fontSize: "0.7rem" }}>
                        {apiKey ? "✨ Nvidia Llama 3.1 70B Active" : "🧠 Local Reasoner"}
                      </span>
                    </div>

                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5, marginTop: "0.3rem" }}>
                      {quizQuestions[quizCurrentIndex].explanation}
                    </p>

                    {/* LIVE NVIDIA DEEP-DIVE TUTOR */}
                    {aiDoubtResponse && (
                      <div style={{ background: "#ffffff", border: "2px solid #000", borderRadius: "8px", padding: "1rem", marginTop: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                          <span style={{ fontSize: "1rem" }}>🤖</span>
                          <strong style={{ fontSize: "0.85rem", color: "#000" }}>Nvidia AI Deep-Dive Explanation:</strong>
                        </div>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                          {aiDoubtResponse}
                        </p>
                      </div>
                    )}

                    <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                      {!aiDoubtResponse && (
                        <button
                          type="button"
                          className="brutal-btn"
                          onClick={async () => {
                            setAiDoubtLoading(true);
                            const q = quizQuestions[quizCurrentIndex];
                            try {
                              const deepExplanation = await callNvidiaAI({
                                apiKey,
                                model: "meta/llama-3.1-70b-instruct",
                                messages: [
                                  {
                                    role: "system",
                                    content: "You are a world-class engineering professor. Explain why the correct option is true and how to approach this problem on university exams. Keep it concise, intuitive, and under 120 words."
                                  },
                                  {
                                    role: "user",
                                    content: `Question: ${q.question}\nOptions: ${JSON.stringify(q.options)}\nCorrect Answer: ${q.options[q.correct]}\nStudent chose: ${q.options[quizSelectedOption]}`
                                  }
                                ],
                                temperature: 0.3,
                                max_tokens: 350
                              });
                              setAiDoubtResponse(deepExplanation);
                            } catch (e) {
                              setAiDoubtResponse(`Concept takeaway: ${q.explanation}`);
                            } finally {
                              setAiDoubtLoading(false);
                            }
                          }}
                          disabled={aiDoubtLoading}
                          style={{ background: "var(--color-yellow)", fontSize: "0.8rem", padding: "0.45rem 0.9rem" }}
                        >
                          {aiDoubtLoading ? "🤖 Asking Nvidia AI..." : "🤖 Ask Nvidia AI to Explain Deeper"}
                        </button>
                      )}

                      <div style={{ marginLeft: "auto" }}>
                        <button
                          className="brutal-btn brutal-btn-dark"
                          onClick={() => {
                            setAiDoubtResponse("");
                            handleNextQuizQuestion();
                          }}
                          style={{ fontSize: "0.85rem", padding: "0.5rem 1.25rem" }}
                        >
                          {quizCurrentIndex + 1 < quizQuestions.length ? "Next Question →" : "View Final Report 🏆"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* RESULTS STATE */}
            {quizState === "results" && (
              <div className="quiz-arena-container text-center quiz-score-card">
                <div style={{ width: "90px", height: "90px", borderRadius: "50%", background: quizScore >= (quizQuestions.length * 0.7) ? "var(--color-green)" : "var(--color-yellow)", border: "3px solid #000", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "2.5rem" }}>
                  {quizScore >= (quizQuestions.length * 0.7) ? "🏆" : "⚡"}
                </div>
                <h3 style={{ fontSize: "2rem", textTransform: "none", marginBottom: "0.5rem" }}>
                  {quizScore === quizQuestions.length ? "Outstanding Mastery!" : quizScore >= (quizQuestions.length * 0.7) ? "Proficiency Verified!" : "Remediation Reinforcement Needed"}
                </h3>
                <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                  You scored <strong>{quizScore} out of {quizQuestions.length}</strong> ({Math.round((quizScore / quizQuestions.length) * 100)}%) on <strong>{customTopicInput || quizTopic || quizSubject}</strong>.
                </p>

                <div style={{ border: "2px solid #000", background: "var(--bg-brutal)", borderRadius: "12px", padding: "1.5rem", maxWidth: "500px", margin: "0 auto 2rem", textAlign: "left" }}>
                  <p style={{ fontWeight: "800", fontSize: "0.9rem", marginBottom: "0.5rem" }}>🎯 AI Diagnostic Assessment:</p>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {quizScore === quizQuestions.length
                      ? "Flawless concept execution. You have successfully resolved foundational weaknesses in this domain."
                      : "Good attempt! Review the recommended YouTube lecture video and re-test this subtopic to lock in 100% mastery."}
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <button className="brutal-btn" onClick={() => handleStartQuiz()} style={{ background: "#fff" }}>
                    🔄 Retake This Topic
                  </button>
                  <button className="brutal-btn" onClick={() => setQuizState("config")} style={{ background: "var(--color-yellow)" }}>
                    📑 Practice Another Topic
                  </button>
                  <button className="brutal-btn" onClick={() => handleOpenVideoTab(quizSubject)} style={{ background: "#ff0000", color: "#fff" }}>
                    ▶️ Watch Video Lecture
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* REMEDIAL VIDEO HUB TAB */}
        {activeTab === "videos" && (
          <div className="dashboard-panel">
            <div className="video-section-header">
              <div>
                <span className="mono-tag" style={{ color: "#ff0000" }}>// ACADEMIC REMEDIATION NETWORK</span>
                <h3 style={{ fontSize: "1.85rem", textTransform: "none", marginTop: "0.25rem", margin: 0 }}>
                  Curated YouTube Video Lectures
                </h3>
              </div>
              <span className="badge badge-secondary" style={{ fontSize: "0.8rem" }}>
                📺 High-Yield Video Lessons
              </span>
            </div>

            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Based on your submitted semester report, evalX has matched accredited video courses from world-class educators (Gate Smashers, Abdul Bari, Neso Academy, freeCodeCamp, 3Blue1Brown) so you can directly learn and master your weak areas.
            </p>

            {student.weakSubjects.length > 0 ? (
              <div>
                {/* SUBJECT SELECTOR CHIPS */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "1.5rem" }}>
                  {student.weakSubjects.map((w, idx) => {
                    const isSelected = selectedVideoSubject === w.name;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedVideoSubject(w.name)}
                        style={{
                          background: isSelected ? "var(--color-yellow)" : "#ffffff",
                          color: "#000000",
                          border: "2.5px solid #000000",
                          borderRadius: "8px",
                          padding: "0.5rem 1rem",
                          fontFamily: "var(--font-brutal-display)",
                          fontWeight: "800",
                          fontSize: "0.85rem",
                          boxShadow: isSelected ? "4px 4px 0 #000" : "2px 2px 0 #000",
                          transform: isSelected ? "translate(-1px, -1px)" : "none",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem"
                        }}
                      >
                        <span>{isSelected ? "▶️" : "🎯"}</span>
                        <span>{w.name}</span>
                        <span style={{ fontSize: "0.7rem", opacity: 0.75 }}>({w.score ? `${w.score}%` : "Flagged"})</span>
                      </button>
                    );
                  })}
                </div>

                {/* ACTIVE STUDY VIDEO PLAYER CONSOLE */}
                <div style={{ border: "var(--border-width) solid var(--border-brutal)", borderRadius: "16px", background: "#ffffff", padding: "1.5rem", boxShadow: "6px 6px 0 #000", marginBottom: "2.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.2rem" }}>
                    <div>
                      <span className="video-subject-tag">🎯 Active Focus: {selectedVideoSubject}</span>
                      <h3 style={{ fontSize: "1.35rem", marginTop: "0.5rem", textTransform: "none", marginBottom: "0.2rem" }}>
                        {currentSelectedVideo.title}
                      </h3>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600" }}>
                        Lecturer / Channel: <strong>{currentSelectedVideo.channel}</strong> · Course Format: {currentSelectedVideo.duration}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "0.6rem" }}>
                      <button
                        className="brutal-btn"
                        onClick={() => handleOpenQuizTab(selectedVideoSubject)}
                        style={{ background: "var(--color-yellow)", fontSize: "0.8rem", padding: "0.45rem 0.9rem" }}
                      >
                        🎯 Test Knowledge (AI Quiz)
                      </button>
                      <a
                        href={currentSelectedVideo.playlistUrl || `https://www.youtube.com/watch?v=${currentSelectedVideo.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-yt-watch"
                      >
                        Watch on YouTube ↗
                      </a>
                    </div>
                  </div>

                  {/* EMBEDDED YOUTUBE VIDEO */}
                  <div className="video-embed-container" style={{ borderRadius: "12px", overflow: "hidden", border: "3px solid #000", marginBottom: "1.25rem" }}>
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${currentSelectedVideo.videoId}?rel=0&autoplay=0`}
                      title={currentSelectedVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>

                  {/* VIDEO STUDY DETAILS & TOPICS */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                    <div style={{ background: "var(--bg-brutal)", padding: "1rem", borderRadius: "10px", border: "2px solid #000" }}>
                      <p style={{ fontSize: "0.8rem", fontWeight: "800", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                        💡 Why This Video is Recommended
                      </p>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                        {currentSelectedVideo.summary}
                      </p>
                      <div style={{ marginTop: "0.75rem" }}>
                        <p style={{ fontSize: "0.8rem", fontWeight: "800", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                          📌 Key Syllabus Topics Covered:
                        </p>
                        <div className="video-topic-pills" style={{ margin: 0 }}>
                          {currentSelectedVideo.keyTopics.map((topic, i) => (
                            <span key={i} className="video-topic-pill" style={{ background: "#fff", border: "1.5px solid #000", fontWeight: "600" }}>
                              ✓ {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ background: "var(--bg-brutal)", padding: "1rem", borderRadius: "10px", border: "2px solid #000" }}>
                      <p style={{ fontSize: "0.8rem", fontWeight: "800", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                        📝 Recommended Study Roadmap
                      </p>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                        {currentSelectedVideo.guide}
                      </p>
                      <div style={{ marginTop: "0.75rem", borderTop: "1px dashed rgba(0,0,0,0.2)", paddingTop: "0.6rem" }}>
                        <p style={{ fontSize: "0.8rem", fontWeight: "800", color: "var(--text-muted)" }}>
                          🎯 Core Focus Areas:
                        </p>
                        <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#000", marginTop: "0.2rem" }}>
                          {currentSelectedVideo.focus}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ALL WEAK SUBJECT VIDEO DIRECTORY */}
                <h4 style={{ fontSize: "1.2rem", marginBottom: "1rem", textTransform: "none" }}>
                  All Curated Courses For Your Weak Areas ({student.weakSubjects.length})
                </h4>
                <div className="video-lecture-grid">
                  {student.weakSubjects.map((w, idx) => {
                    const videoObj = getVideoRecommendation(w.name);
                    const isPlaying = activeEmbedSubject === w.name;
                    return (
                      <div key={idx} className="video-lecture-card">
                        <div className="video-card-header">
                          <div>
                            <span className="video-subject-tag">{w.name}</span>
                            <p style={{ fontSize: "0.75rem", color: "var(--color-danger)", fontWeight: "bold", marginTop: "0.3rem" }}>
                              {w.reason}
                            </p>
                          </div>
                          <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-brutal-mono)", color: "var(--text-muted)" }}>
                            {videoObj.duration}
                          </span>
                        </div>

                        {isPlaying ? (
                          <div className="video-embed-container">
                            <iframe
                              src={`https://www.youtube-nocookie.com/embed/${videoObj.videoId}?autoplay=1&rel=0`}
                              title={videoObj.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        ) : (
                          <div className="video-thumbnail-wrapper" onClick={() => setSelectedVideoSubject(w.name)}>
                            <img
                              src={`https://img.youtube.com/vi/${videoObj.videoId}/hqdefault.jpg`}
                              alt={videoObj.title}
                              className="video-thumbnail-img"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80";
                              }}
                            />
                            <div className="video-play-overlay">▶</div>
                            <span className="video-duration-badge">{videoObj.channel}</span>
                          </div>
                        )}

                        <div className="video-card-body">
                          <div>
                            <h4 className="video-title">{videoObj.title}</h4>
                            <p className="video-channel">
                              <span>👨‍🏫</span>
                              <span>{videoObj.channel}</span>
                            </p>
                            <div className="video-topic-pills">
                              {videoObj.keyTopics.slice(0, 3).map((topic, i) => (
                                <span key={i} className="video-topic-pill">
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="video-action-bar">
                            <button
                              className="btn-study-embed"
                              onClick={() => {
                                setSelectedVideoSubject(w.name);
                                window.scrollTo({ top: 120, behavior: "smooth" });
                              }}
                              style={{ flex: 1, justifyContent: "center" }}
                            >
                              ▶️ Study Video
                            </button>
                            <button
                              className="brutal-btn"
                              onClick={() => handleOpenQuizTab(w.name)}
                              style={{ background: "var(--color-yellow)", fontSize: "0.8rem", padding: "0.45rem 0.8rem" }}
                            >
                              🎯 Quiz
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="glass-card text-center" style={{ padding: "3rem 1.5rem" }}>
                <span style={{ fontSize: "3rem" }}>🏆</span>
                <h3 style={{ marginTop: "1rem" }}>Zero Weakness Flags Recorded</h3>
                <p className="text-secondary mt-2" style={{ maxWidth: "500px", margin: "0.5rem auto 1.5rem" }}>
                  All your course scores meet or exceed safety standards! You can explore general advanced engineering video courses below.
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <a href="https://www.youtube.com/@freecodecamp" target="_blank" rel="noopener noreferrer" className="btn-yt-watch">
                    freeCodeCamp ↗
                  </a>
                  <a href="https://www.youtube.com/@GateSmashers" target="_blank" rel="noopener noreferrer" className="btn-yt-watch">
                    Gate Smashers ↗
                  </a>
                  <a href="https://www.youtube.com/@nesoacademy" target="_blank" rel="noopener noreferrer" className="btn-yt-watch">
                    Neso Academy ↗
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FOCUS AREAS TAB */}
        {activeTab === "focus" && (
          <div className="dashboard-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <h3 style={{ fontSize: "1.75rem", margin: 0, textTransform: "none" }}>Curricular Weaknesses & Study Manuals</h3>
              {student.weakSubjects.length > 0 && (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className="brutal-btn"
                    onClick={() => handleOpenVideoTab(student.weakSubjects[0].name)}
                    style={{ background: "#ff0000", color: "#fff", fontSize: "0.8rem", padding: "0.4rem 0.9rem" }}
                  >
                    ▶️ Video Hub
                  </button>
                  <button
                    className="brutal-btn"
                    onClick={() => handleOpenQuizTab(student.weakSubjects[0].name)}
                    style={{ background: "var(--color-yellow)", fontSize: "0.8rem", padding: "0.4rem 0.9rem" }}
                  >
                    🎯 AI Topic Quiz
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} id="full-weak-list">
              {student.weakSubjects.length === 0 ? (
                <div className="glass-card text-center" style={{ padding: "3rem 1rem" }}>
                  <h3>Zero Course Deficiencies Found</h3>
                  <p className="text-secondary mt-2">All registered subjects meet or exceed the performance targets.</p>
                </div>
              ) : (
                student.weakSubjects.map((weak, idx) => {
                  const guideObj = REMEDIAL_GUIDES[weak.name] || DEFAULT_GUIDE;
                  const videoObj = getVideoRecommendation(weak.name);
                  return (
                    <div key={idx} className="glass-card" style={{ borderLeft: "5px solid var(--color-warning)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <h4 style={{ margin: 0 }}>{weak.name}</h4>
                          <span className="badge badge-warning">{weak.reason}</span>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            className="btn-study-embed"
                            onClick={() => handleOpenVideoTab(weak.name)}
                            style={{ fontSize: "0.75rem", padding: "0.3rem 0.7rem" }}
                          >
                            ▶️ Watch {videoObj.channel}
                          </button>
                          <button
                            className="brutal-btn"
                            onClick={() => handleOpenQuizTab(weak.name)}
                            style={{ fontSize: "0.75rem", padding: "0.3rem 0.7rem", background: "#fff" }}
                          >
                            🎯 Quiz
                          </button>
                        </div>
                      </div>

                      <div style={{ marginBottom: "1rem" }}>
                        <p style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-secondary)" }}>Focus Subtopics:</p>
                        <p style={{ fontSize: "0.95rem", color: "#000", marginTop: "0.2rem" }}>{guideObj.focus}</p>
                      </div>

                      <div style={{ marginBottom: "1rem" }}>
                        <p style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-secondary)" }}>Study Strategy:</p>
                        <p style={{ fontSize: "0.95rem", color: "#000", marginTop: "0.2rem" }}>{guideObj.guide}</p>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", background: "var(--bg-brutal)", padding: "1rem", borderRadius: "8px", border: "2px solid #000", marginTop: "1rem" }}>
                        <div>
                          <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-secondary)" }}>Recommended Video Lecture:</p>
                          <p style={{ fontSize: "0.85rem", color: "#ff0000", fontWeight: "bold", marginTop: "0.2rem" }}>
                            📺 {videoObj.title} ({videoObj.channel})
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-secondary)" }}>Reference Textbooks:</p>
                          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>📚 {guideObj.resources}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* AI COACH TAB */}
        {activeTab === "ai" && (
          <div className="dashboard-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.75rem", textTransform: "none", margin: 0 }}>Nvidia Llama AI Guidance Coach</h3>
              <button className="brutal-btn brutal-btn-accent" onClick={handleOpenSettings} style={{ fontSize: "0.75rem", padding: "0.5rem 1rem" }}>Config NIM API Key</button>
            </div>

            <div className="ai-response-box" style={{ border: "var(--border-width) solid var(--border-brutal)", borderRadius: "16px", padding: "2rem", background: "#fff", boxShadow: "4px 4px 0 #000", minHeight: "260px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {!aiReport && !aiLoading && (
                <div className="text-center" id="ai-prompt-box" style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "3rem" }}>🤖</span>
                  <h4 style={{ margin: "1rem 0 0.5rem", fontSize: "1.2rem", textTransform: "none" }}>Query Nvidia NIM Cloud Inference</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "420px", margin: "0 auto 1.5rem" }}>
                    Feed your scholastic profile ledger through a 70B parameter Meta Llama model to compile customized study questions and resource playlists.
                  </p>
                  <button className="brutal-btn brutal-btn-dark" onClick={handleTriggerAI}>Generate Cognitive Guidance Plan</button>
                </div>
              )}

              {aiLoading && (
                <div className="text-center" id="ai-loading" style={{ textAlign: "center" }}>
                  <div className="brutal-spinner"></div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "1rem" }}>Querying cloud model API for scholastic guidance...</p>
                </div>
              )}

              {aiReport && !aiLoading && (
                <div id="ai-result-content" dangerouslySetInnerHTML={{ __html: aiReport }} style={{ fontSize: "0.9rem", lineHeight: 1.6 }} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
