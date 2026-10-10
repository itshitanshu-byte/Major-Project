import React, { useState } from "react";
import axios from "axios";

function AdminLogin({ navigateTo, setAdminSession, API_BASE }) {
  const [email, setEmail] = useState("admin@evalx.in");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const res = await axios.post(`${API_BASE}/admin/login`, { email, password });
      if (res.data.success) {
        setAdminSession(true);
        sessionStorage.setItem("evalx_sess_admin", "true");
        navigateTo("#admin-dashboard");
      }
    } catch (error) {
      setErrorMsg("Authentication failed. Invalid credentials.");
    }
  };

  return (
    <main id="page-admin-login" className="page active">
      <div className="fullscreen-split">
        <div className="split-left" style={{ background: "var(--color-yellow)" }}>
          <div>
            <span className="mono-tag">// ADMINISTRATIVE AUTHENTICATION</span>
            <h2 style={{ fontSize: "3rem", lineHeight: 1, marginTop: "1rem", textTransform: "none" }}>System Admin</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-primary)", marginTop: "1rem" }}>
              Authenticate master node access to approve registered teachers and monitor global metrics.
            </p>
          </div>

          {/* C. V. Raman Global University Official Logo */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "2rem 0", textAlign: "center" }}>
            <div style={{
              width: "150px",
              height: "150px",
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
            <p style={{ fontFamily: "var(--font-brutal-display)", fontWeight: "900", fontSize: "1rem", color: "#000" }}>
              C. V. Raman Global University
            </p>
          </div>

          <p style={{ fontSize: "0.75rem", fontWeight: 800 }}>
            evalX SECURITY PROTOCOL // VER 1.0.0
          </p>
        </div>

        <div className="split-right" style={{ justifyContent: "center", background: "var(--bg-brutal)" }}>
          <div style={{ maxWidth: "460px", width: "100%", margin: "0 auto" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "2.5rem", textTransform: "none" }}>Admin Node Login</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="brutal-label">Admin Access Email</label>
                <input
                  type="email"
                  className="brutal-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginTop: "1.5rem" }}>
                <label className="brutal-label">Administrator Password</label>
                <input
                  type="password"
                  className="brutal-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {errorMsg && (
                <div style={{ color: "var(--color-danger)", fontSize: "0.85rem", marginTop: "1.5rem", fontWeight: "700" }}>
                  ❌ {errorMsg}
                </div>
              )}

              <div className="form-navigation">
                <button type="button" className="brutal-btn" onClick={() => navigateTo("#home")} style={{ background: "#fff" }}>
                  Home
                </button>
                <button type="submit" className="brutal-btn brutal-btn-dark">
                  Authenticate
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminLogin;
