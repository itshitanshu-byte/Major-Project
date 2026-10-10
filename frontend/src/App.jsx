import React, { useState, useEffect } from "react";
import axios from "axios";
import Home from "./pages/Home";
import StudentForm from "./pages/StudentForm";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherSignup from "./pages/TeacherSignup";
import TeacherPending from "./pages/TeacherPending";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const API_BASE = import.meta.env.VITE_API_BASE || (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") ? "/api" : "https://project1-1backend.onrender.com/api");

function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash || "#home");
  const [studentSession, setStudentSession] = useState(null);
  const [teacherSession, setTeacherSession] = useState(null);
  const [adminSession, setAdminSession] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem("evalx_api_key") || "");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [modalInputKey, setModalInputKey] = useState("");
  const [dialog, setDialog] = useState(null);
  const [backendReady, setBackendReady] = useState(false);
  const [backendWaking, setBackendWaking] = useState(true);

  // Wake up backend on page load
  useEffect(() => {
    const wakeBackend = async () => {
      try {
        const healthUrl = API_BASE === "/api" ? "/health" : `${API_BASE.replace('/api', '')}/health`;
        await axios.get(healthUrl, { timeout: 8000 });
        setBackendReady(true);
      } catch {
        setBackendReady(true); // proceed anyway
      } finally {
        setBackendWaking(false);
      }
    };
    wakeBackend();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || "#home");
    };
    window.addEventListener("hashchange", handleHashChange);

    const savedStudent = sessionStorage.getItem("evalx_sess_student");
    const savedTeacher = sessionStorage.getItem("evalx_sess_teacher");
    const savedAdmin = sessionStorage.getItem("evalx_sess_admin");

    if (savedStudent) {
      setStudentSession(JSON.parse(savedStudent));
    }
    if (savedTeacher) {
      const parsedTeacher = JSON.parse(savedTeacher);
      setTeacherSession(parsedTeacher);
      axios.get(`${API_BASE}/teachers/status/${parsedTeacher.email}`)
        .then((res) => {
          const fresh = res.data.teacher;
          setTeacherSession(fresh);
          sessionStorage.setItem("evalx_sess_teacher", JSON.stringify(fresh));
        })
        .catch(() => {});
    }
    if (savedAdmin) {
      setAdminSession(true);
    }

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (hash) => {
    window.location.hash = hash;
    setCurrentHash(hash);
  };

  const showBrutalAlert = (message, onOk = null) => {
    setDialog({
      type: "alert",
      message,
      onConfirm: () => {
        setDialog(null);
        if (onOk) onOk();
      }
    });
  };

  const showBrutalConfirm = (message, onConfirm) => {
    setDialog({
      type: "confirm",
      message,
      onConfirm: () => {
        setDialog(null);
        onConfirm();
      },
      onCancel: () => setDialog(null)
    });
  };

  const handleOpenSettings = () => {
    setModalInputKey(apiKey);
    setShowSettingsModal(true);
  };

  const handleSaveApiKey = () => {
    if (modalInputKey.trim()) {
      localStorage.setItem("evalx_api_key", modalInputKey.trim());
      setApiKey(modalInputKey.trim());
      showBrutalAlert("Nvidia API key saved successfully.");
    } else {
      localStorage.removeItem("evalx_api_key");
      setApiKey("");
      showBrutalAlert("Nvidia API key removed.");
    }
    setShowSettingsModal(false);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem("evalx_api_key");
    setApiKey("");
    setModalInputKey("");
    showBrutalAlert("Nvidia API configuration cleared.");
    setShowSettingsModal(false);
  };

  const handleLogout = (role) => {
    if (role === "student") {
      sessionStorage.removeItem("evalx_sess_student");
      setStudentSession(null);
    } else if (role === "teacher") {
      sessionStorage.removeItem("evalx_sess_teacher");
      setTeacherSession(null);
    } else if (role === "admin") {
      sessionStorage.removeItem("evalx_sess_admin");
      setAdminSession(false);
    }
    navigateTo("#home");
  };

  const handleFooterReset = () => {
    showBrutalConfirm("This will clear all registered students, teachers, configurations and reset the database. Proceed?", async () => {
      try {
        await axios.post(`${API_BASE}/seed`);
        sessionStorage.clear();
        localStorage.removeItem("evalx_api_key");
        setStudentSession(null);
        setTeacherSession(null);
        setAdminSession(false);
        setApiKey("");
        showBrutalAlert("Database reset and seeded successfully.", () => {
          window.location.reload();
        });
      } catch (error) {
        showBrutalAlert("Failed to reset database.");
      }
    });
  };

  const renderActivePage = () => {
    switch (currentHash) {
      case "#home":
        return <Home navigateTo={navigateTo} handleOpenSettings={handleOpenSettings} apiKey={apiKey} />;
      case "#student-form":
        return (
          <StudentForm
            navigateTo={navigateTo}
            setStudentSession={setStudentSession}
            showBrutalAlert={showBrutalAlert}
            showBrutalConfirm={showBrutalConfirm}
            API_BASE={API_BASE}
          />
        );
      case "#student-dashboard":
        return studentSession ? (
          <StudentDashboard
            student={studentSession}
            handleLogout={() => handleLogout("student")}
            handleOpenSettings={handleOpenSettings}
            apiKey={apiKey}
            showBrutalAlert={showBrutalAlert}
          />
        ) : (
          <Home navigateTo={navigateTo} handleOpenSettings={handleOpenSettings} apiKey={apiKey} />
        );
      case "#teacher-signup":
        return (
          <TeacherSignup
            navigateTo={navigateTo}
            setTeacherSession={setTeacherSession}
            showBrutalAlert={showBrutalAlert}
            API_BASE={API_BASE}
          />
        );
      case "#teacher-pending":
        return teacherSession ? (
          <TeacherPending
            teacher={teacherSession}
            setTeacherSession={setTeacherSession}
            handleLogout={() => handleLogout("teacher")}
            navigateTo={navigateTo}
            showBrutalAlert={showBrutalAlert}
            API_BASE={API_BASE}
          />
        ) : (
          <Home navigateTo={navigateTo} handleOpenSettings={handleOpenSettings} apiKey={apiKey} />
        );
      case "#teacher-dashboard":
        return teacherSession && teacherSession.status === "approved" ? (
          <TeacherDashboard
            teacher={teacherSession}
            handleLogout={() => handleLogout("teacher")}
            showBrutalAlert={showBrutalAlert}
            showBrutalConfirm={showBrutalConfirm}
            API_BASE={API_BASE}
            apiKey={apiKey}
          />
        ) : (
          <Home navigateTo={navigateTo} handleOpenSettings={handleOpenSettings} apiKey={apiKey} />
        );
      case "#admin-login":
        return (
          <AdminLogin
            navigateTo={navigateTo}
            setAdminSession={setAdminSession}
            API_BASE={API_BASE}
          />
        );
      case "#admin-dashboard":
        return adminSession ? (
          <AdminDashboard
            handleLogout={() => handleLogout("admin")}
            showBrutalAlert={showBrutalAlert}
            showBrutalConfirm={showBrutalConfirm}
            API_BASE={API_BASE}
          />
        ) : (
          <AdminLogin navigateTo={navigateTo} setAdminSession={setAdminSession} API_BASE={API_BASE} />
        );
      default:
        return <Home navigateTo={navigateTo} handleOpenSettings={handleOpenSettings} apiKey={apiKey} />;
    }
  };

  return (
    <div>
      {backendWaking && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
          background: "#1a1a1a", color: "#f5c518", padding: "10px 20px",
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "10px", fontSize: "0.85rem", fontWeight: "700",
          fontFamily: "monospace", borderBottom: "2px solid #f5c518"
        }}>
          <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⚙️</span>
          SERVER STARTING UP — please wait a few seconds...
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      <nav className="pill-nav">
        <a
          href="#home"
          className="logo-container"
          onClick={(e) => {
            e.preventDefault();
            navigateTo("#home");
          }}
          style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.6rem" }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ flexShrink: 0 }}>
            <path
              d="M14 2 L15.2 10.8 L23 7 L17.8 14 L23 21 L15.2 17.2 L14 26 L12.8 17.2 L5 21 L10.2 14 L5 7 L12.8 10.8 Z"
              fill="black"
            />
          </svg>
          <span style={{ fontFamily: "var(--font-brutal-display)", fontWeight: 900, fontSize: "1.4rem", letterSpacing: "-0.04em", color: "var(--text-primary)" }}>
            eval<span style={{ color: "var(--color-danger)" }}>X</span>
          </span>
        </a>

        <div className="nav-links" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "2rem" }}>
          <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo("#home"); }} className={`nav-link-item ${currentHash === "#home" ? "active" : ""}`}>Overview</a>
          <a href="#student-form" onClick={(e) => { e.preventDefault(); navigateTo("#student-form"); }} className={`nav-link-item ${currentHash === "#student-form" ? "active" : ""}`}>Diagnostics</a>
          <a href="#teacher-signup" onClick={(e) => { e.preventDefault(); navigateTo("#teacher-signup"); }} className={`nav-link-item ${currentHash === "#teacher-signup" ? "active" : ""}`}>Faculty</a>
          <a href="#admin-login" onClick={(e) => { e.preventDefault(); navigateTo("#admin-login"); }} className={`nav-link-item ${currentHash === "#admin-login" ? "active" : ""}`}>Admin</a>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }} onClick={handleOpenSettings}>
            <span className={`api-key-indicator ${apiKey ? "configured" : "not-configured"}`}></span>
            <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-brutal-mono)", fontWeight: "bold" }}>
              {apiKey ? "Nvidia NIM Active" : "Local Engine"}
            </span>
          </div>
          <a
            href="#student-form"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("#student-form");
            }}
            className="brutal-btn brutal-btn-accent"
            style={{ fontSize: "0.85rem", textTransform: "uppercase", padding: "0.65rem 1.5rem", borderRadius: "9999px", letterSpacing: "0.03em" }}
          >
            CONTACT
          </a>
        </div>
      </nav>

      <div id="app">
        {renderActivePage()}
      </div>

      <footer className="brutal-footer">
        <div className="footer-top">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
                <path d="M14 2 L15.2 10.8 L23 7 L17.8 14 L23 21 L15.2 17.2 L14 26 L12.8 17.2 L5 21 L10.2 14 L5 7 L12.8 10.8 Z" fill="black" />
              </svg>
              <h2 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.05em" }}>evalX</h2>
            </div>
            <p style={{ maxWidth: "340px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
              Cognitive Academic Runtime & Performance Diagnostic Infrastructure.
            </p>
          </div>
          <div style={{ display: "flex", gap: "4rem" }}>
            <div>
              <p className="mono-tag" style={{ marginBottom: "1.2rem", fontSize: "0.7rem", color: "var(--text-muted)" }}>// PORTALS</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <li><a href="#student-form" onClick={(e) => { e.preventDefault(); navigateTo("#student-form"); }} style={{ textDecoration: "none", color: "#000", fontWeight: 700, fontSize: "0.9rem" }}>Student Portal</a></li>
                <li><a href="#teacher-signup" onClick={(e) => { e.preventDefault(); navigateTo("#teacher-signup"); }} style={{ textDecoration: "none", color: "#000", fontWeight: 700, fontSize: "0.9rem" }}>Faculty Portal</a></li>
                <li><a href="#admin-login" onClick={(e) => { e.preventDefault(); navigateTo("#admin-login"); }} style={{ textDecoration: "none", color: "#000", fontWeight: 700, fontSize: "0.9rem" }}>System Admin</a></li>
              </ul>
            </div>
            <div>
              <p className="mono-tag" style={{ marginBottom: "1.2rem", fontSize: "0.7rem", color: "var(--text-muted)" }}>// SYSTEM</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleOpenSettings(); }} style={{ textDecoration: "none", color: "#000", fontWeight: 700, fontSize: "0.9rem" }}>Nvidia NIM Config</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleFooterReset(); }} style={{ textDecoration: "none", color: "#ff4747", fontWeight: 700, fontSize: "0.9rem" }}>Reset Environment</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 evalX Runtime System. All rights reserved.</p>
          <p>Built for CV Raman Global University · Department of CSE</p>
        </div>
      </footer>

      {showSettingsModal && (
        <div className="brutal-modal active">
          <div className="brutal-modal-backdrop" onClick={() => setShowSettingsModal(false)}></div>
          <div className="brutal-modal-window">
            <div className="brutal-modal-header">
              <h3 style={{ fontSize: "1.25rem" }}>Nvidia NIM Token Settings</h3>
              <button className="brutal-btn" onClick={() => setShowSettingsModal(false)} style={{ padding: "0.2rem 0.5rem", fontSize: "1rem", boxShadow: "none" }}>&times;</button>
            </div>
            <div className="brutal-modal-body">
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                Provide your Nvidia Developer NIM token key to activate deep scholastic Llama-3 parsing computations.
              </p>
              <div style={{ marginBottom: "1.5rem" }}>
                <label className="brutal-label" htmlFor="input-api-key">Nvidia NIM Token</label>
                <input
                  type="password"
                  id="input-api-key"
                  className="brutal-input"
                  value={modalInputKey}
                  onChange={(e) => setModalInputKey(e.target.value)}
                  placeholder="nvapi-................................"
                />
              </div>
              <div style={{ border: "var(--border-width) solid var(--border-brutal)", background: "var(--bg-brutal)", padding: "1.25rem", fontSize: "0.85rem", borderRadius: "12px", boxShadow: "4px 4px 0 #000" }}>
                <p style={{ fontWeight: 700, color: "#000" }}>How to obtain a free key:</p>
                <ol style={{ paddingLeft: "1.25rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
                  <li>Visit the <a href="https://build.nvidia.com/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-primary)", textDecoration: "underline", fontWeight: 700 }}>Nvidia Developer NIM console</a>.</li>
                  <li>Claim free compute credits.</li>
                  <li>Copy and paste your generated token key above.</li>
                </ol>
              </div>
            </div>
            <div className="brutal-modal-footer">
              <button className="brutal-btn" onClick={handleClearApiKey} style={{ background: "#fff" }}>Clear Key</button>
              <button className="brutal-btn brutal-btn-dark" onClick={handleSaveApiKey}>Confirm Key</button>
            </div>
          </div>
        </div>
      )}

      {dialog && (
        <div className="brutal-modal active">
          <div className="brutal-modal-backdrop"></div>
          <div className="brutal-modal-window" style={{ maxWidth: "480px" }}>
            <div className="brutal-modal-header" style={{ background: "var(--color-yellow)" }}>
              <h3 style={{ fontSize: "1.1rem" }}>{dialog.type === "confirm" ? "❓ SYSTEM PROMPT" : "⚡ SYSTEM NOTICE"}</h3>
            </div>
            <div className="brutal-modal-body" style={{ padding: "1.5rem 2rem" }}>
              <p style={{ fontFamily: "var(--font-brutal-mono)", fontSize: "0.85rem", color: "var(--text-primary)", lineHeight: 1.6 }}>
                {dialog.message}
              </p>
            </div>
            <div className="brutal-modal-footer" style={{ padding: "1rem 2rem" }}>
              {dialog.type === "confirm" && (
                <button className="brutal-btn" onClick={dialog.onCancel} style={{ background: "#fff", fontSize: "0.8rem", padding: "0.4rem 1rem" }}>Cancel</button>
              )}
              <button className="brutal-btn brutal-btn-dark" onClick={dialog.onConfirm} style={{ fontSize: "0.8rem", padding: "0.4rem 1rem" }}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
