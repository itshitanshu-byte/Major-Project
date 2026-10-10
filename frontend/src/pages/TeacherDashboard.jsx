import React, { useState, useEffect } from "react";
import axios from "axios";

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

function TeacherDashboard({ teacher, handleLogout, showBrutalAlert, showBrutalConfirm, API_BASE, apiKey }) {
  const [students, setStudents] = useState([]);
  const [targetSize, setTargetSize] = useState(30);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [aiReport, setAiReport] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const groupKey = `${teacher.college}_${teacher.branch}_${teacher.group}`;

  const fetchDashboardData = async () => {
    try {
      const resStudents = await axios.get(`${API_BASE}/students`, {
        params: { college: teacher.college, branch: teacher.branch, group: teacher.group }
      });
      setStudents(resStudents.data);

      const resTarget = await axios.get(`${API_BASE}/teachers/target/${groupKey}`);
      if (resTarget.data && resTarget.data.target) {
        setTargetSize(resTarget.data.target);
      }
    } catch (error) {
      showBrutalAlert("Failed to load dashboard data.");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSaveTarget = async () => {
    const val = parseInt(targetSize);
    if (isNaN(val) || val < 1) {
      showBrutalAlert("Please enter a valid capacity count.");
      return;
    }

    try {
      await axios.post(`${API_BASE}/teachers/target`, { groupKey, target: val });
      showBrutalAlert("Capacity threshold updated in database.");
      fetchDashboardData();
    } catch (error) {
      showBrutalAlert("Failed to save capacity limit.");
    }
  };

  const openStudentDossier = async (student) => {
    setSelectedStudent(student);
    setAiReport("");
    setAiLoading(true);

    if (!apiKey) {
      setTimeout(() => {
        setAiReport(generateLocalRemedialReport(student));
        setAiLoading(false);
      }, 600);
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

      // Robust Multi-tier Nvidia AI Caller (Bypasses Browser CORS)
      let content = "";
      try {
        const res = await axios.post("/api/ai/chat", {
          apiKey,
          model: "meta/llama-3.1-70b-instruct",
          messages: [
            {
              role: "system",
              content: "You are evalX academic cognitive guidance assistant. Analyze student marks and compile a highly structured, encouraging, and detailed academic remediation report. Identify weak subjects specifically. Highlight key topics they should review, advise actionable study actions, and recommend high quality online resources. Output in clean HTML formatting (h4, p, ul, li, strong) suitable for direct div rendering."
            },
            {
              role: "user",
              content: `Student Academic Profile:\nName: ${student.name}\nBranch: ${student.branch}\nCGPA: ${student.cgpa}\nWeak subjects: ${JSON.stringify(student.weakSubjects)}\nMarks:\n${docText}`
            }
          ],
          temperature: 0.2,
          max_tokens: 1200
        });
        content = res.data?.choices?.[0]?.message?.content || "";
      } catch (err1) {
        const res2 = await axios.post("/nvidia-api/v1/chat/completions", {
          model: "meta/llama-3.1-70b-instruct",
          messages: [
            {
              role: "system",
              content: "You are evalX academic cognitive guidance assistant. Analyze student marks and compile a highly structured, encouraging, and detailed academic remediation report. Output in clean HTML formatting."
            },
            {
              role: "user",
              content: `Student Academic Profile:\nName: ${student.name}\nBranch: ${student.branch}\nCGPA: ${student.cgpa}\nWeak subjects: ${JSON.stringify(student.weakSubjects)}\nMarks:\n${docText}`
            }
          ],
          temperature: 0.2,
          max_tokens: 1200
        }, {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        });
        content = res2.data?.choices?.[0]?.message?.content || "";
      }

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
        <p class="mt-2">Excellent performance! This student has logged <strong>${st.cgpa.toFixed(2)} CGPA</strong> across <strong>${st.marks.btech.length} semesters</strong>. No subjects scored below 50%.</p>
      `;
    }

    let guidesHtml = "";
    st.weakSubjects.forEach(weak => {
      const guideObj = REMEDIAL_GUIDES[weak.name] || DEFAULT_GUIDE;
      guidesHtml += `
        <div class="glass-card mb-4" style="border-color: rgba(245, 158, 11, 0.15); background:rgba(0,0,0,0.15); margin-bottom:1rem;">
          <h4 style="color:var(--color-warning);">${weak.name}</h4>
          <p style="font-size:0.85rem; color:#f87171;">Flag: ${weak.reason}</p>
          <div class="mt-3">
            <strong style="font-size:0.85rem; color:var(--text-secondary);">Core Subtopics:</strong>
            <p style="font-size:0.9rem;" class="mt-1">${guideObj.focus}</p>
          </div>
          <div class="mt-2">
            <strong style="font-size:0.85rem; color:var(--text-secondary);">Weekly Action Steps:</strong>
            <p style="font-size:0.9rem;" class="mt-1">${guideObj.guide}</p>
          </div>
          <div class="mt-2">
            <strong style="font-size:0.85rem; color:var(--text-secondary);">Resource Repositories:</strong>
            <p style="font-size:0.85rem; color:var(--color-secondary);" class="mt-1">${guideObj.resources}</p>
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

  const signedUpCount = students.length;
  const remainingCount = Math.max(0, targetSize - signedUpCount);

  return (
    <div className="brutal-grid-layout" style={{ marginTop: "1rem" }}>
      <aside className="brutal-sidebar">
        <div style={{ textAlign: "center", paddingBottom: "2rem", borderBottom: "2px solid var(--border-brutal)", marginBottom: "2rem" }}>
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
          <h3 id="teacher-dash-title">Professor {teacher.name.split(" ").pop()}</h3>
          <p id="teacher-dash-subtitle" style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem", wordBreak: "break-all" }}>
            {teacher.college} | Branch {teacher.branch} | Group {teacher.group}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div className="nav-item active">👥 STUDENT ROSTER</div>
          <div className="nav-item nav-item-danger" onClick={handleLogout} style={{ marginTop: "4rem" }}>🚪 SIGN OUT</div>
        </div>
      </aside>

      <section className="brutal-content-area">
        <div className="dashboard-panel">
          <span className="mono-tag" style={{ background: "var(--color-green)", border: "1px solid #000", padding: "0.1rem 0.4rem", borderRadius: "0.25rem" }}>
            // ASSIGNED COHORT LIMITS
          </span>
          <h2 style={{ fontSize: "2.5rem", marginTop: "0.75rem", marginBottom: "2rem", textTransform: "none" }}>Cohort Capacities</h2>

          <div className="dashboard-card-grid">
            <div className="dashboard-metrics-card accent">
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)" }}>COHORT SIZE LIMIT</p>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5rem" }}>
                <input
                  type="number"
                  className="brutal-input"
                  value={targetSize}
                  onChange={(e) => setTargetSize(e.target.value)}
                  min="1"
                  max="100"
                  style={{ padding: "0.4rem", fontSize: "1.1rem", width: "80px", textAlign: "center", boxShadow: "2px 2px 0 #000" }}
                />
                <button className="brutal-btn brutal-btn-dark" onClick={handleSaveTarget} style={{ padding: "0.5rem 1rem" }}>SAVE</button>
              </div>
            </div>
            <div className="dashboard-metrics-card success" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)" }}>REGISTERED STUDENTS</p>
              <p style={{ fontFamily: "var(--font-brutal-display)", fontSize: "3rem", fontWeight: "900", lineHeight: 1, color: "#000", margin: 0 }}>
                {signedUpCount} / {targetSize}
              </p>
            </div>
            <div className="dashboard-metrics-card secondary" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)" }}>REMAINING SLOTS</p>
              <p style={{ fontFamily: "var(--font-brutal-display)", fontSize: "3rem", fontWeight: "900", lineHeight: 1, color: "#000", margin: 0 }}>
                {remainingCount}
              </p>
            </div>
          </div>
        </div>

        <div className="dashboard-panel">
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", textTransform: "none" }}>Registered Student List</h3>
          <div className="data-table-container">
            {students.length === 0 ? (
              <div id="teacher-empty-state" className="text-center" style={{ padding: "4rem 0", borderRadius: "12px", background: "var(--bg-brutal)", textAlign: "center" }}>
                <div style={{ fontSize: "3rem" }}>📂</div>
                <h4 style={{ marginTop: "1rem", fontSize: "1.25rem", textTransform: "none" }}>Roster Vacant</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                  No students matching your group index have completed signup yet.
                </p>
              </div>
            ) : (
              <table className="data-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "3px solid var(--border-brutal)", fontFamily: "var(--font-brutal-mono)", fontSize: "0.8rem", color: "var(--text-primary)" }}>
                    <th style={{ padding: "1rem" }}>REGISTRATION NO</th>
                    <th style={{ padding: "1rem" }}>STUDENT NAME</th>
                    <th style={{ padding: "1rem" }}>SEMESTERS LOGGED</th>
                    <th style={{ padding: "1rem" }}>CGPA RATING</th>
                    <th style={{ padding: "1rem" }}>WEAK SUBJECT BADGES</th>
                    <th style={{ padding: "1rem" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((stud, idx) => (
                    <tr key={idx}>
                      <td><b style={{ color: "var(--color-secondary)" }}>{stud.regNo}</b></td>
                      <td>{stud.name}</td>
                      <td>{stud.marks.btech.length} Semesters logged</td>
                      <td><b>{stud.cgpa.toFixed(2)}</b></td>
                      <td>
                        <div style={{ maxWidth: "320px", flexWrap: "wrap", display: "flex", gap: "4px" }}>
                          {stud.weakSubjects.length === 0 ? (
                            <span className="badge badge-success">No deficiencies</span>
                          ) : (
                            stud.weakSubjects.map((w, wIdx) => (
                              <span key={wIdx} className="badge badge-warning" style={{ fontSize: "0.7rem" }}>{w.name}</span>
                            ))
                          )}
                        </div>
                      </td>
                      <td>
                        <button className="brutal-btn" onClick={() => openStudentDossier(stud)} style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem", background: "var(--color-yellow)", boxShadow: "none" }}>
                          🔍 View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      {selectedStudent && (
        <div className="brutal-modal active">
          <div className="brutal-modal-backdrop" onClick={() => setSelectedStudent(null)}></div>
          <div className="brutal-modal-window" style={{ maxWidth: "800px" }}>
            <div className="brutal-modal-header">
              <h3 style={{ textTransform: "none" }}>
                Academic Dossier: <span className="primary-gradient-text">{selectedStudent.name}</span>
              </h3>
              <button className="brutal-btn" onClick={() => setSelectedStudent(null)} style={{ padding: "0.2rem 0.5rem", fontSize: "1rem", lineHeight: 1, boxShadow: "none" }}>&times;</button>
            </div>
            <div className="brutal-modal-body">
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
                <div style={{ border: "var(--border-width) solid var(--border-brutal)", borderRadius: "16px", padding: "1.5rem", background: "#fff", boxShadow: "4px 4px 0 #000" }}>
                  <p className="mono-tag" style={{ background: "var(--color-blue)", padding: "0.1rem 0.4rem", border: "1px solid #000", borderRadius: "0.25rem", display: "inline-block" }}>
                    // ENROLLMENT DETAILS
                  </p>
                  <p style={{ fontWeight: 800, fontSize: "1.15rem", color: "#000", marginTop: "0.75rem" }}>{selectedStudent.college}</p>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem", fontWeight: 700 }}>
                    Branch: {selectedStudent.branch} | Group: {selectedStudent.group} | Reg No: {selectedStudent.regNo}
                  </p>
                </div>
                <div style={{ border: "var(--border-width) solid var(--border-brutal)", borderRadius: "16px", padding: "1.5rem", background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", boxShadow: "4px 4px 0 #000" }}>
                  <p className="mono-tag" style={{ fontSize: "0.75rem" }}>B.TECH CGPA</p>
                  <p style={{ fontFamily: "var(--font-brutal-display)", fontSize: "2.8rem", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1, margin: 0 }}>
                    {selectedStudent.cgpa.toFixed(2)}
                  </p>
                </div>
              </div>

              <h4 style={{ fontSize: "1.25rem", marginBottom: "1rem", textTransform: "none" }}>Prior Academic Scores</h4>
              <div style={{ border: "var(--border-width) solid var(--border-brutal)", borderRadius: "12px", background: "#fff", padding: "1.5rem", marginBottom: "2rem", fontSize: "0.9rem", boxShadow: "4px 4px 0 #000" }}>
                <ul style={{ paddingLeft: "1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", listStyleType: "square" }}>
                  <li><b>10th Grade Score:</b> {selectedStudent.marks.tenth?.score}% ({selectedStudent.marks.tenth?.board || "State Board"})</li>
                  {selectedStudent.timeline.twelfth && (
                    <li><b>12th Grade Score:</b> {selectedStudent.marks.twelfth?.score}% ({selectedStudent.marks.twelfth?.board || "State Board"})</li>
                  )}
                  {selectedStudent.timeline.diploma && (
                    <>
                      <li><b>Diploma Stream:</b> {selectedStudent.marks.diploma?.stream} ({selectedStudent.marks.diploma?.score}%)</li>
                      {selectedStudent.marks.diploma?.weak && (
                        <li style={{ gridColumn: "1 / -1" }}><b>Prior Weakness Declared:</b> <span className="badge badge-danger">{selectedStudent.marks.diploma?.weak}</span></li>
                      )}
                    </>
                  )}
                </ul>
              </div>

              <h4 style={{ fontSize: "1.25rem", marginBottom: "1rem", textTransform: "none" }}>Flagged Curricular Deficiencies & Curated YouTube Courses</h4>
              <div className="brutal-subject-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: "2rem" }}>
                {selectedStudent.weakSubjects.length === 0 ? (
                  <div className="glass-card text-center text-success" style={{ gridColumn: "1 / -1", padding: "0.75rem", color: "var(--color-success)" }}>
                    No academic deficiencies flagged for this student.
                  </div>
                ) : (
                  selectedStudent.weakSubjects.map((w, idx) => {
                    const videoObj = REMEDIAL_GUIDES[w.name] || DEFAULT_GUIDE;
                    return (
                      <div key={idx} className="weak-subject-card" style={{ padding: "0.85rem" }}>
                        <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>{w.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#f87171", fontWeight: "bold" }}>{w.reason}</div>
                        <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          <strong>Recommended Course:</strong> {videoObj.focus}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <h4 style={{ fontSize: "1.25rem", marginBottom: "1rem", textTransform: "none" }}>Nvidia AI Generated Guidance Plan</h4>
              <div className="ai-response-box" style={{ border: "var(--border-width) solid var(--border-brutal)", borderRadius: "16px", padding: "1.5rem", background: "#fff", boxShadow: "4px 4px 0 #000", minHeight: "150px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                {aiLoading ? (
                  <div className="text-center" style={{ textAlign: "center" }}>
                    <div className="brutal-spinner" style={{ width: "2rem", height: "2rem", margin: "1rem auto" }}></div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Querying cloud models for study guidance roadmap...</p>
                  </div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: aiReport }} style={{ fontSize: "0.85rem", fontFamily: "var(--font-brutal-mono)", lineHeight: 1.6, color: "var(--text-secondary)" }} />
                )}
              </div>
            </div>
            <div className="brutal-modal-footer">
              <button className="brutal-btn" onClick={() => setSelectedStudent(null)} style={{ background: "#fff" }}>Close Dossier</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;
