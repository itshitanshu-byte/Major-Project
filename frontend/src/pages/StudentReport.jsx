import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, Printer, Award, Calendar, BookOpen, 
  Sparkles, AlertTriangle, ShieldCheck, CheckCircle2,
  Building, Percent, FileText, UserCheck, MessageSquarePlus
} from 'lucide-react';

export default function StudentReport() {
  const { id } = useParams();
  const { token, user: loggedInUser } = useAuth();
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mentorship plan state
  const [improvementNotes, setImprovementNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesFeedback, setNotesFeedback] = useState('');
  const [cvLayout, setCvLayout] = useState(false);

  const isTeacher = loggedInUser?.role === 'teacher';

  const fetchStudent = async () => {
    setLoading(true);
    try {
      // If student id is not provided in URL but user is student, we fetch their own profile.
      // Wait, standard route is `/student/:id`. If it's loaded, we call GET `/api/students/${id}`.
      const endpoint = `/api/students/${id}`;
      const res = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStudent(data);
        setImprovementNotes(data.improvementNotes || '');
      } else {
        setError('Failed to load student report details.');
      }
    } catch (err) {
      console.error('Error fetching student report:', err);
      setError('Database connection error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && token) {
      fetchStudent();
    }
  }, [id, token]);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    setNotesFeedback('');
    try {
      const res = await fetch(`/api/students/${student._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...student,
          improvementNotes
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setStudent(updated);
        setNotesFeedback('Mentorship notes saved successfully!');
        setTimeout(() => setNotesFeedback(''), 4000);
      } else {
        const data = await res.json();
        setError(data.msg || 'Failed to save improvement notes.');
      }
    } catch (err) {
      console.error('Save notes error:', err);
      setError('Connection failure updating database.');
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '800px', margin: '40px auto' }}>
        Compiling academic report details...
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="glass-panel" style={{ padding: '45px', textAlign: 'center', color: 'var(--color-high)', maxWidth: '800px', margin: '40px auto' }}>
        {error || 'Student profile not found.'}
        <div style={{ marginTop: '20px' }}>
          <Link to="/" className="btn btn-secondary">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '0 8px' }}>
      
      {/* Action Header bar */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Link to="/" className="btn btn-secondary" style={{ padding: '8px 12px', borderRadius: '8px' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setCvLayout(!cvLayout)} 
            className={`btn ${cvLayout ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ padding: '8px 16px', borderRadius: '8px' }}
          >
            {cvLayout ? 'Show Standard Profile' : 'Format as CV / Resume 📄'}
          </button>
          <button onClick={handlePrint} className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: '8px' }}>
            <Printer size={16} /> Print Profile Report
          </button>
        </div>
      </div>

      {/* Main Report Card */}
      <div className="glass-panel" style={{ padding: '40px', position: 'relative' }}>
        
        {/* Pathway Badge Tag */}
        <div style={{
          position: 'absolute',
          top: '0',
          right: '40px',
          background: student.isLateralEntry ? 'var(--color-medium-glow)' : 'var(--color-low-glow)',
          color: student.isLateralEntry ? 'var(--color-medium)' : 'var(--color-low)',
          padding: '8px 16px',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: 800,
          border: `1px solid ${student.isLateralEntry ? 'var(--color-medium)' : 'var(--color-low)'}22`,
          borderTop: 'none',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {student.isLateralEntry ? 'Lateral Entry' : 'Regular Admission'}
        </div>

        {/* Student Header */}
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '28px', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>{student.name}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <div><strong style={{ color: 'var(--text-primary)' }}>Roll Number:</strong> {student.rollNumber}</div>
            <div><strong style={{ color: 'var(--text-primary)' }}>Contact Email:</strong> {student.email}</div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Pathway: </strong>
              {student.pathway === '12th_btech' ? '12th Standard to B.Tech' : 
               student.pathway === 'diploma_btech' ? 'Polytechnic Diploma to B.Tech' : 
               'ITI to Diploma to B.Tech'}
            </div>
          </div>

          {student.bio && (
            <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>About Yourselves</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{student.bio}</p>
            </div>
          )}
        </div>

        {/* Goals & Placement Readiness Metrics Dashboard */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {/* Gauge 1: Placement Readiness */}
          {(() => {
            const btechPhases = student.educationHistory.filter(ph => ph.phase.toLowerCase().includes('b.tech'));
            const latestBtech = btechPhases.length > 0 ? btechPhases[btechPhases.length - 1] : null;

            let score = 50;
            let label = 'Low Readiness';
            let color = 'var(--color-high)';
            let glow = 'var(--color-high-glow)';
            
            if (latestBtech && latestBtech.marks && latestBtech.marks.toLowerCase() !== 'pending') {
              const cgpaVal = parseFloat(latestBtech.marks);
              if (!isNaN(cgpaVal)) {
                if (cgpaVal >= 9.0) {
                  score = 95;
                  label = '95% (High)';
                  color = 'var(--color-low)';
                  glow = 'var(--color-low-glow)';
                } else if (cgpaVal >= 8.0) {
                  score = 85;
                  label = '85% (Good)';
                  color = 'var(--color-low)';
                  glow = 'var(--color-low-glow)';
                } else if (cgpaVal >= 7.0) {
                  score = 70;
                  label = '70% (Medium)';
                  color = 'var(--color-medium)';
                  glow = 'var(--color-medium-glow)';
                }
              }
            }
            
            return (
              <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Placement Readiness
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: `4px solid ${color}`,
                    boxShadow: `0 0 10px ${glow}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    color: color
                  }}>
                    {score}%
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Based on GPA</div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Card 2: Goal target */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Academic Target Goals
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                <span>Target CGPA:</span>
                <strong style={{ color: 'var(--color-primary)' }}>{student.targetCgpa || 8.0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>Self-Study:</span>
                <strong>{student.weeklyStudyHours || 0}h/wk</strong>
              </div>
            </div>
          </div>

          {/* Card 3: Peer tutoring settings */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Peer Tutoring Profile
            </div>
            <div style={{ fontSize: '0.85rem' }}>
              {student.tutorOffers && student.tutorOffers.length > 0 ? (
                <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  <span style={{ color: 'var(--color-low)', fontWeight: 600 }}>Tutors:</span> {student.tutorOffers.join(', ')}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>No offers listed</div>
              )}
              {student.tutorRequests && student.tutorRequests.length > 0 ? (
                <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginTop: '4px' }}>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Needs:</span> {student.tutorRequests.join(', ')}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>No requests listed</div>
              )}
            </div>
          </div>

          {/* Card 4: AI Prediction */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              AI B.Tech Projection
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: '4px solid var(--color-accent)',
                boxShadow: '0 0 10px var(--color-accent-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9rem',
                color: 'var(--color-accent)'
              }}>
                {student.predictedCgpa || '7.5'}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Projected CGPA</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Confidence: {student.confidence || 85}%</div>
              </div>
            </div>
          </div>
        </div>

        {cvLayout ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '32px', borderTop: '1px solid var(--border-color)', paddingTop: '32px' }}>
            {/* CV Left Sidebar */}
            <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Contact & Personal</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '4px' }}><strong>Email:</strong> {student.email}</p>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}><strong>Roll No:</strong> {student.rollNumber}</p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Career Bio</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{student.bio || 'No bio listed.'}</p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Academic Targets</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}><strong>Target CGPA:</strong> {student.targetCgpa || '8.0'}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><strong>Self-Study:</strong> {student.weeklyStudyHours || '0'} hrs/week</p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Tutoring Skills</h4>
                <div style={{ fontSize: '0.85rem' }}>
                  <strong style={{ color: 'var(--color-low)' }}>Offers:</strong> {student.tutorOffers?.join(', ') || 'None'}
                </div>
                <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                  <strong style={{ color: 'var(--color-accent)' }}>Requests:</strong> {student.tutorRequests?.join(', ') || 'None'}
                </div>
              </div>
            </div>

            {/* CV Main Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                  Education History
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {student.educationHistory.map((item, idx) => (
                    <div key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem' }}>
                        <span>{item.phase}</span>
                        <span style={{ color: 'var(--color-primary)' }}>{item.marks}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {item.institute} | {item.years}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <strong>Curriculum:</strong> {item.subjectsStudied}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {student.improvementNotes && (
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-low)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                    Mentorship recommendations
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6', background: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    "{student.improvementNotes}"
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* Vertical Timeline of Academic History */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎓 Academic Marksheet History (Std 10 to B.Tech)
              </h3>

              <div style={{ position: 'relative', paddingLeft: '32px', borderLeft: '2px solid var(--border-color)' }}>
                {student.educationHistory.map((item, idx) => {
                  const getNodeStyle = (phaseName) => {
                    const name = phaseName.toLowerCase();
                    if (name.includes('std 10') || name.includes('std 11') || name.includes('std 12')) {
                      return { color: '#818cf8', glow: 'rgba(129, 140, 248, 0.2)' }; // School
                    }
                    if (name.includes('iti') || name.includes('diploma')) {
                      return { color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.2)' }; // Technical/Diploma
                    }
                    return { color: '#f472b6', glow: 'rgba(244, 114, 182, 0.2)' }; // B.Tech
                  };

                  const nodeStyle = getNodeStyle(item.phase);

                  return (
                    <div key={idx} style={{ position: 'relative', marginBottom: '32px' }}>
                      
                      {/* Timeline node */}
                      <div style={{
                        position: 'absolute',
                        left: '-41px',
                        top: '2px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: nodeStyle.color,
                        border: '4px solid var(--bg-dark)',
                        boxShadow: `0 0 0 3px ${nodeStyle.glow}`
                      }} />

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                          <h4 style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{item.phase}</h4>
                          <span className="badge badge-low" style={{ fontSize: '0.8rem', background: 'var(--color-primary-glow)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
                            Marks: {item.marks}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Building size={14} /> {item.institute}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} /> {item.years}
                          </span>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Subjects Studied & Learned</div>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{item.subjectsStudied}</p>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mentorship / Improvement Corner */}
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border-color)', marginTop: '40px' }} className="no-print">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-low)' }}>
                🧠 Mentoring Plan & Improvement recommendations
              </h3>

              {isTeacher ? (
                <div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Write customized advice or improvement metrics based on this student's educational history, B.Tech marks, or previous schools.
                  </p>
                  
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <textarea
                      className="form-input"
                      rows={4}
                      placeholder="Provide recommendations (e.g. Focus on database normalization, attend peer programming workshops, etc.)"
                      value={improvementNotes}
                      onChange={(e) => setImprovementNotes(e.target.value)}
                      style={{ fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>

                  {notesFeedback && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-low)', fontSize: '0.88rem', marginBottom: '12px' }}>
                      <CheckCircle2 size={16} />
                      <span>{notesFeedback}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="btn btn-primary"
                    style={{ padding: '8px 20px', fontSize: '0.9rem' }}
                    disabled={savingNotes}
                  >
                    {savingNotes ? 'Saving Notes...' : 'Save Mentoring Notes'}
                  </button>
                </div>
              ) : (
                <div>
                  {student.improvementNotes ? (
                    <div style={{ display: 'flex', gap: '12px', background: 'var(--color-low-glow)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px', borderRadius: '10px' }}>
                      <UserCheck size={20} style={{ color: 'var(--color-low)', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '4px' }}>Advice from College Mentors:</div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                          "{student.improvementNotes}"
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '12px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '16px', borderRadius: '10px' }}>
                      <AlertTriangle size={20} style={{ color: 'var(--color-medium)', flexShrink: 0 }} />
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        <strong>No advice submitted yet:</strong> Your marksheet timeline has been registered. Course mentors have not provided mentoring advice for your profile yet.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer print block */}
        <div style={{
          marginTop: '60px',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: '#666',
          display: 'none'
        }} className="print-only-block">
          <p>CONFIDENTIAL ACADEMIC SUMMARY • COLLEGE OF ENGINEERING</p>
          <p style={{ marginTop: '4px' }}>This record represents the student's marks and subject history from LKG to B.Tech.</p>
        </div>

      </div>

      <style>{`
        @media print {
          body {
            background: #fff !important;
            color: #000 !important;
          }
          .glass-panel {
            background: #fff !important;
            border: 1px solid #ccc !important;
            box-shadow: none !important;
            color: #000 !important;
          }
          .btn, .no-print, nav {
            display: none !important;
          }
          .print-only-block {
            display: block !important;
          }
        }
      `}</style>

    </div>
  );
}
