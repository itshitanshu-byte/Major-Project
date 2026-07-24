import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Search, Users, GraduationCap, Clock, AlertTriangle, 
  Trash2, Edit, FileText, Plus, RefreshCw, ChevronRight, Eye,
  BookOpen, Calendar, HelpCircle, Sparkles, UserCheck, ShieldAlert
} from 'lucide-react';

export default function Dashboard() {
  const { token, user: loggedInUser } = useAuth();
  const navigate = useNavigate();

  // Teacher State
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [pathwayFilter, setPathwayFilter] = useState('');
  const [lateralFilter, setLateralFilter] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Student State
  const [studentProfile, setStudentProfile] = useState(null);
  const [peerMentors, setPeerMentors] = useState([]);
  const [localCgpa, setLocalCgpa] = useState(8.0);
  const [localHours, setLocalHours] = useState(10);
  const [updatingGoals, setUpdatingGoals] = useState(false);

  // Resource sharing state
  const [resTitle, setResTitle] = useState('');
  const [resLink, setResLink] = useState('');
  const [sharingResource, setSharingResource] = useState(false);

  // General state
  const [loading, setLoading] = useState(true);

  const isTeacher = loggedInUser?.role === 'teacher';

  // Fetch Teacher Admin Data
  const fetchTeacherData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (pathwayFilter) params.append('pathway', pathwayFilter);
      if (lateralFilter) params.append('isLateralEntry', lateralFilter);

      const [resStudents, resStats] = await Promise.all([
        fetch(`/api/students?${params.toString()}`, { headers }),
        fetch('/api/students/stats', { headers })
      ]);

      if (resStudents.ok && resStats.ok) {
        const studentData = await resStudents.json();
        const statData = await resStats.json();
        setStudents(studentData);
        setStats(statData);
      }
    } catch (error) {
      console.error('Error fetching teacher dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Student Profile Data
  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/students/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStudentProfile(data);
        if (data) {
          setLocalCgpa(data.targetCgpa || 8.0);
          setLocalHours(data.weeklyStudyHours || 10);
          
          // Fetch peer mentors matches
          const resMentors = await fetch('/api/students/peer-mentors', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (resMentors.ok) {
            const mentors = await resMentors.json();
            setPeerMentors(mentors);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching student profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update Student Academic Goals
  const handleUpdateGoals = async (newCgpa, newHours) => {
    setUpdatingGoals(true);
    try {
      const res = await fetch('/api/students/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...studentProfile,
          targetCgpa: Number(newCgpa) || 8.0,
          weeklyStudyHours: Number(newHours) || 0
        })
      });
      if (res.ok) {
        const data = await res.json();
        setStudentProfile(data);
        alert('Academic target goals successfully updated!');
      }
    } catch (err) {
      console.error('Update goals error:', err);
    } finally {
      setUpdatingGoals(false);
    }
  };

  // Toggle Bridge Course completion state
  const handleToggleCourse = async (courseName) => {
    if (!studentProfile) return;
    const isCompleted = studentProfile.completedCourses?.includes(courseName);
    const updatedCourses = isCompleted
      ? studentProfile.completedCourses.filter(c => c !== courseName)
      : [...(studentProfile.completedCourses || []), courseName];

    try {
      const res = await fetch('/api/students/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...studentProfile,
          completedCourses: updatedCourses
        })
      });
      if (res.ok) {
        const data = await res.json();
        setStudentProfile(data);
      }
    } catch (err) {
      console.error('Toggle course error:', err);
    }
  };

  const handleBroadcastInvite = async (alertMessage) => {
    let pathway = '';
    if (alertMessage.toLowerCase().includes('diploma')) pathway = 'diploma_btech';
    else if (alertMessage.toLowerCase().includes('12th')) pathway = '12th_btech';
    
    const message = `Advisory: You have been recommended to attend the preparatory Bridge Course session: "${alertMessage}"`;
    
    try {
      const res = await fetch('/api/students/broadcast-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pathway, message })
      });
      if (res.ok) {
        alert('Bridge Course invitation successfully broadcast to matching student pathways!');
      } else {
        alert('Failed to broadcast invitation.');
      }
    } catch (err) {
      console.error('Error broadcasting:', err);
    }
  };

  const handleShareResource = async (e) => {
    e.preventDefault();
    if (!resTitle.trim() || !resLink.trim()) return;
    setSharingResource(true);
    try {
      const res = await fetch('/api/students/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: resTitle, link: resLink })
      });
      if (res.ok) {
        alert('Academic resource link shared with all student portfolios!');
        setResTitle('');
        setResLink('');
        if (isTeacher) {
          fetchTeacherData();
        }
      } else {
        alert('Failed to post resource.');
      }
    } catch (err) {
      console.error('Error posting resource:', err);
    } finally {
      setSharingResource(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    if (isTeacher) {
      fetchTeacherData();
    } else {
      fetchStudentData();
    }
  }, [token, isTeacher, search, pathwayFilter, lateralFilter]);

  // Handle student record deletion (Teacher only)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this student record?')) {
      return;
    }
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        fetchTeacherData();
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // Render SVG Chart for Pre-B.Tech pathways
  const renderPathwayChart = () => {
    if (!stats || stats.totalStudents === 0) return null;
    
    const { '12th_btech': reg, 'diploma_btech': dip, 'iti_diploma_btech': iti } = stats.pathwayCounts;
    const total = reg + dip + iti;
    if (total === 0) return <div style={{ color: 'var(--text-muted)' }}>No distribution data</div>;

    const items = [
      { name: '12th → B.Tech', value: reg, color: 'var(--color-primary)' },
      { name: 'Diploma → B.Tech', value: dip, color: 'var(--color-accent)' },
      { name: 'ITI → Diploma → B.Tech', value: iti, color: 'var(--color-low)' }
    ].filter(i => i.value > 0);

    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {items.map((item, idx) => {
          const percent = Math.round((item.value / total) * 100);
          return (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{item.value} student{item.value !== 1 ? 's' : ''} ({percent}%)</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${percent}%`, background: item.color, borderRadius: '4px', transition: 'width 0.5s ease' }} />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Loading Screen
  if (loading && !students.length && !studentProfile) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>
        <RefreshCw size={36} className="spin" style={{ animation: 'spin 2s linear infinite', marginBottom: '16px', color: 'var(--color-primary)' }} />
        <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading Portal Data...</div>
      </div>
    );
  }

  // ==================== STUDENT HOME VIEW ====================
  if (!isTeacher) {
    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 8px' }}>
        
        {/* Welcome Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome, <span className="text-gradient">{loggedInUser?.username}</span></h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Manage your academic profile and check mentor feedback.</p>
        </div>

        {/* Profile status check */}
        {!studentProfile ? (
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', border: '1px dashed var(--color-accent)' }}>
            <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--color-accent)', marginBottom: '20px' }}>
              <GraduationCap size={48} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Academic Profile Empty</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '550px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
              You have not filled out your profile yet. To help the college analyze your background, subjects studied, and assist in your improvements, please fill out your marksheet details from LKG to B.Tech.
            </p>
            <Link to="/predict" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
              Create My Profile
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
            
            {/* Advisories & Broadcast Notifications */}
            {studentProfile.notifications && studentProfile.notifications.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  📢 Course Instructor Advisories & Alerts
                </h3>
                {studentProfile.notifications.map((note, idx) => (
                  <div key={idx} className="glass-panel" style={{
                    padding: '16px 20px',
                    background: 'var(--color-primary-glow)',
                    borderColor: 'var(--color-primary)',
                    borderLeft: '5px solid var(--color-primary)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <Sparkles style={{ color: 'var(--color-primary)', flexShrink: 0 }} size={20} />
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{note}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '28px', width: '100%', alignItems: 'start' }}>
              
              {/* Left Column: Profile Summary */}
              <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
                
                {/* Short Profile Overview */}
                <div className="glass-panel" style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginBottom: '24px' }}>
                    <div>
                      <span className="badge badge-low" style={{ marginBottom: '10px' }}>
                        {studentProfile.isLateralEntry ? 'Lateral Entry' : 'Regular Entry'}
                      </span>
                      <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{studentProfile.name}</h2>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', gap: '16px' }}>
                        <span><strong>Roll:</strong> {studentProfile.rollNumber}</span>
                        <span><strong>Email:</strong> {studentProfile.email}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <Link to={`/student/${studentProfile._id}`} className="btn btn-secondary" style={{ display: 'flex', gap: '6px' }}>
                        <Eye size={16} /> View Profile
                      </Link>
                      <Link to="/predict" className="btn btn-primary" style={{ display: 'flex', gap: '6px' }}>
                        <Edit size={16} /> Edit Details
                      </Link>
                    </div>
                  </div>

                  <div>
                    <h4 className="form-label" style={{ marginBottom: '8px' }}>About Me</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                      {studentProfile.bio || 'No bio written. Edit your profile to tell the college about yourself.'}
                    </p>
                  </div>
                </div>

                {/* Teacher notes block */}
                <div className="glass-panel" style={{ padding: '32px', borderLeft: '5px solid var(--color-low)' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-low)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    🧠 College Improvement & Mentoring Plan
                  </h3>
                  {studentProfile.improvementNotes ? (
                    <div>
                      <p style={{ color: 'var(--text-primary)', fontSize: '1rem', lineHeight: '1.6', background: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                        "{studentProfile.improvementNotes}"
                      </p>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <UserCheck size={14} />
                        <span>Reviewed by your college course advisors</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '12px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)', padding: '16px', borderRadius: '10px' }}>
                      <ShieldAlert size={20} style={{ color: 'var(--color-medium)', flexShrink: 0 }} />
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        <strong>Pending Review:</strong> Your marksheet has been submitted successfully. College mentors have not written improvement recommendations yet. Please check back later.
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Education summary */}
                <div className="glass-panel" style={{ padding: '32px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Submitted Marksheets Summary</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {studentProfile.educationHistory.map((eh, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{eh.phase}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{eh.institute} ({eh.years})</div>
                        </div>
                        <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1rem' }}>
                          {eh.marks}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Help, Analytics & Peer matching */}
              <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
                
                {/* Goal Tracker Card */}
                <div className="glass-panel" style={{ padding: '28px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🎯 My Study Goals
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group" style={{ marginBottom: '8px' }}>
                      <label className="form-label">Target CGPA</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="10"
                        className="form-input"
                        value={localCgpa}
                        onChange={(e) => setLocalCgpa(parseFloat(e.target.value) || '')}
                        style={{ padding: '10px 14px' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label">Study Target: {localHours} hours/week</label>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        className="slider-input"
                        value={localHours}
                        onChange={(e) => setLocalHours(parseInt(e.target.value) || 0)}
                        style={{ marginTop: '8px' }}
                      />
                    </div>

                    {/* On Track Indicator */}
                    {(() => {
                      const reqHours = localCgpa >= 9.0 ? 15 : localCgpa >= 8.0 ? 10 : 6;
                      let text = 'Behind Target';
                      let badgeClass = 'badge-high';
                      if (localHours >= reqHours) {
                        text = 'On Track 🚀';
                        badgeClass = 'badge-low';
                      } else if (localHours >= reqHours - 3) {
                        text = 'Needs Work ⚠️';
                        badgeClass = 'badge-medium';
                      }
                      return (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status:</span>
                          <span className={`badge ${badgeClass}`}>{text}</span>
                        </div>
                      );
                    })()}

                    <button
                      onClick={() => handleUpdateGoals(localCgpa, localHours)}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '10px 16px', fontSize: '0.9rem', marginTop: '4px' }}
                      disabled={updatingGoals}
                    >
                      {updatingGoals ? 'Saving Targets...' : 'Update Targets'}
                    </button>
                  </div>
                </div>

                {/* Bridge Courses Card */}
                <div className="glass-panel" style={{ padding: '28px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📚 Recommended Bridging Courses
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    Acquire basic skills required to match B.Tech criteria.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {(() => {
                      const courses = studentProfile.pathway === 'diploma_btech' ? [
                        { name: 'Advanced Engineering Calculus Refresher', desc: 'Refresher for integration, derivatives, and linear equations.' },
                        { name: 'Data Structures & OOP in Java', desc: 'Introduces core object design taught in B.Tech Year 1.' }
                      ] : studentProfile.pathway === 'iti_diploma_btech' ? [
                        { name: 'Foundation Mathematics & Vectors', desc: 'Core algebraic skills and calculus prerequisites.' },
                        { name: 'Technical Sketching & Projections', desc: 'ITI mechanical drafting conversion training.' }
                      ] : [
                        { name: 'Introductory Programming in C++', desc: 'Essential logic design and algorithmic logic flow.' },
                        { name: 'Engineering Force Statics', desc: 'Introductory mechanics bridging fundamentals.' }
                      ];

                      return courses.map((course, idx) => {
                        const isDone = studentProfile.completedCourses?.includes(course.name);
                        return (
                          <div
                            key={idx}
                            onClick={() => handleToggleCourse(course.name)}
                            style={{
                              display: 'flex',
                              gap: '12px',
                              padding: '14px',
                              background: isDone ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.01)',
                              border: isDone ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border-color)',
                              borderRadius: '12px',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            className="glass-panel-interactive"
                          >
                            <input
                              type="checkbox"
                              checked={isDone || false}
                              onChange={() => {}}
                              style={{ alignSelf: 'flex-start', marginTop: '3px', accentColor: 'var(--color-low)' }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.9rem', textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--color-low)' : 'var(--text-primary)' }}>
                                {course.name}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                {course.desc}
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Peer Mentorship Matches Card */}
                <div className="glass-panel" style={{ padding: '28px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🤝 Peer Tutoring Matches
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    Students sharing complementary skills and learning requests.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {peerMentors.length === 0 ? (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
                        No direct peer matches found. Update your requested/offered tutor skills in the profile wizard to list matching partners!
                      </div>
                    ) : (
                      peerMentors.map((mentor, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '14px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '12px'
                          }}
                        >
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{mentor.name}</div>
                          <a href={`mailto:${mentor.email}`} style={{ fontSize: '0.75rem', color: 'var(--color-primary)', textDecoration: 'none', display: 'block', marginTop: '2px', wordBreak: 'break-all' }}>
                            {mentor.email}
                          </a>
                          
                          {mentor.offeredMatches.length > 0 && (
                            <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--color-low)' }}>
                              <strong>Can help you:</strong> {mentor.offeredMatches.join(', ')}
                            </div>
                          )}
                          {mentor.requestedMatches.length > 0 && (
                            <div style={{ marginTop: '4px', fontSize: '0.75rem', color: 'var(--color-accent)' }}>
                              <strong>Needs your help:</strong> {mentor.requestedMatches.join(', ')}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Academic Resource Hub Card */}
                <div className="glass-panel" style={{ padding: '28px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📚 Academic Resource Hub
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    Shared study guides, syllabus links, and lecture prep documents.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {!studentProfile.resources || studentProfile.resources.length === 0 ? (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
                        No study resources uploaded by course instructors yet.
                      </div>
                    ) : (
                      studentProfile.resources.map((res, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '12px 14px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div style={{ minWidth: 0, flex: 1, paddingRight: '8px' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={res.title}>
                              {res.title}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              Posted by: {res.postedBy}
                            </div>
                          </div>
                          <a
                            href={res.link.startsWith('http') ? res.link : `https://${res.link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px', whiteSpace: 'nowrap' }}
                          >
                            Open Link 🔗
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== TEACHER ADMIN VIEW ====================
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 8px' }}>
      
      {/* Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Card 1: Total students */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'var(--color-primary-glow)', color: 'var(--color-primary)', padding: '12px', borderRadius: '12px' }}>
            <Users size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Enrolled</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats?.totalStudents || 0}</div>
          </div>
        </div>

        {/* Card 2: Lateral Entry */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(168,85,247,0.15)', color: 'var(--color-accent)', padding: '12px', borderRadius: '12px' }}>
            <GraduationCap size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Lateral Entries</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-accent)' }}>{stats?.lateralEntryCount || 0}</div>
          </div>
        </div>

        {/* Card 3: Regular Entry */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'var(--color-low-glow)', color: 'var(--color-low)', padding: '12px', borderRadius: '12px' }}>
            <BookOpen size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Regular Entries</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats?.regularEntryCount || 0}</div>
          </div>
        </div>

        {/* Card 4: Need Mentorship */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'var(--color-high-glow)', color: 'var(--color-high)', padding: '12px', borderRadius: '12px' }}>
            <AlertTriangle size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Pending Review</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: stats?.pendingMentorshipCount > 0 ? 'var(--color-high)' : 'var(--text-primary)' }}>
              {stats?.pendingMentorshipCount || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Bridge Class Alerts & Insights */}
      {stats?.alerts && stats.alerts.length > 0 && (
        <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {stats.alerts.map((alert, idx) => {
            const alertColors = alert.type === 'warning'
              ? { bg: 'rgba(245, 158, 11, 0.05)', border: 'rgba(245, 158, 11, 0.25)', text: 'var(--color-medium)' }
              : alert.type === 'info'
              ? { bg: 'rgba(99, 102, 241, 0.05)', border: 'rgba(99, 102, 241, 0.25)', text: 'var(--color-primary)' }
              : { bg: 'rgba(16, 185, 129, 0.05)', border: 'rgba(16, 185, 129, 0.25)', text: 'var(--color-low)' };
            return (
              <div key={idx} className="glass-panel" style={{
                padding: '16px 20px',
                background: alertColors.bg,
                borderColor: alertColors.border,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 300px' }}>
                  {alert.type === 'warning' ? <AlertTriangle style={{ color: alertColors.text, flexShrink: 0 }} size={18} /> : <UserCheck style={{ color: alertColors.text, flexShrink: 0 }} size={18} />}
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>{alert.message}</span>
                </div>
                {alert.type !== 'success' && (
                  <button 
                    onClick={() => handleBroadcastInvite(alert.message)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                  >
                    Broadcast Invite 📢
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Visual Analytics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Card 1: Pathway distribution */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} style={{ color: 'var(--color-accent)' }} /> Pathways Distribution
          </h3>
          <div style={{ display: 'flex', minHeight: '130px', alignItems: 'center', justifyContent: 'center' }}>
            {stats?.totalStudents > 0 ? renderPathwayChart() : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No student records registered yet.</div>
            )}
          </div>
        </div>

        {/* Card 2: Feeder institute rankings */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🏫 Feeder Institute Performance Rankings
          </h3>
          {stats?.feederInstitutes && stats.feederInstitutes.length > 0 ? (
            <div style={{ overflowX: 'auto', maxHeight: '180px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '8px 12px', fontWeight: 600 }}>Feeder School / College</th>
                    <th style={{ padding: '8px 12px', fontWeight: 600, textAlign: 'center' }}>Count</th>
                    <th style={{ padding: '8px 12px', fontWeight: 600, textAlign: 'right' }}>Avg B.Tech CGPA</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.feederInstitutes.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.institute}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--text-secondary)' }}>{item.studentCount}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: 'var(--color-primary)' }}>{item.avgCgpa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', padding: '20px 0' }}>No feeder institute statistics available yet.</div>
          )}
        </div>

        {/* Card 3: Publish Resources */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📚 Publish Academic Resources
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Share links to syllabi, textbooks, or tutorials with all students.
          </p>
          <form onSubmit={handleShareResource} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Resource Title (e.g. Calculus Formulas Reference)"
                value={resTitle}
                onChange={(e) => setResTitle(e.target.value)}
                required
                style={{ padding: '10px 14px', fontSize: '0.85rem' }}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Resource URL Link (e.g. drive.google.com/...)"
                value={resLink}
                onChange={(e) => setResLink(e.target.value)}
                required
                style={{ padding: '10px 14px', fontSize: '0.85rem' }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
              disabled={sharingResource}
            >
              {sharingResource ? 'Sharing...' : 'Share Resource Link 🔗'}
            </button>
          </form>
        </div>
      </div>

      {/* Database Cockpit Panel */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        
        {/* Table Header Filter controls */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '24px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px' }}>Student Profile Directory</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Review admissions, marksheets, and write mentoring recommendations.</p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input
              type="text"
              className="form-input"
              placeholder="Search Name, Roll, School..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>

          <select
            className="form-input"
            value={pathwayFilter}
            onChange={(e) => setPathwayFilter(e.target.value)}
          >
            <option value="">All Pre-B.Tech Pathways</option>
            <option value="12th_btech">12th → B.Tech (Regular)</option>
            <option value="diploma_btech">Diploma → B.Tech (Lateral)</option>
            <option value="iti_diploma_btech">ITI → Diploma → B.Tech (Lateral)</option>
          </select>

          <select
            className="form-input"
            value={lateralFilter}
            onChange={(e) => setLateralFilter(e.target.value)}
          >
            <option value="">All Entry Types</option>
            <option value="false">Regular Entry</option>
            <option value="true">Lateral Entry Only</option>
          </select>
        </div>

        {/* Database List / Table */}
        {students.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 0',
            border: '2px dashed var(--border-color)',
            borderRadius: '12px',
            color: 'var(--text-secondary)'
          }}>
            <GraduationCap size={48} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
            <p style={{ fontWeight: 600 }}>No Student Profiles Found</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              No student matching the criteria has registered yet.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', margin: '0 -28px', padding: '0 28px' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left'
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admissions Pathway</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Entry Type</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Marks Summary (B.Tech)</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Mentorship notes</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  // Find current/latest B.Tech marks
                  const btechPhases = student.educationHistory.filter(ph => ph.phase.toLowerCase().includes('b.tech'));
                  const latestBtech = btechPhases.length > 0 ? btechPhases[btechPhases.length - 1] : null;

                  let readinessText = 'Needs Mock Prep';
                  let readinessColor = 'badge-high';
                  if (latestBtech && latestBtech.marks && latestBtech.marks.toLowerCase() !== 'pending') {
                    const cgpaVal = parseFloat(latestBtech.marks);
                    if (!isNaN(cgpaVal)) {
                      if (cgpaVal >= 9.0) {
                        readinessText = '95% (High)';
                        readinessColor = 'badge-low';
                      } else if (cgpaVal >= 8.0) {
                        readinessText = '85% (Good)';
                        readinessColor = 'badge-low';
                      } else if (cgpaVal >= 7.0) {
                        readinessText = '70% (Medium)';
                        readinessColor = 'badge-medium';
                      } else {
                        readinessText = '50% (Low)';
                        readinessColor = 'badge-high';
                      }
                    }
                  }
                  
                  return (
                    <tr 
                      key={student._id} 
                      className="glass-panel-interactive"
                      style={{ 
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'background 0.2s',
                        borderRadius: '0px'
                      }}
                    >
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{student.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Roll: {student.rollNumber}</span>
                          <span className={`badge ${readinessColor}`} style={{ fontSize: '0.65rem', padding: '2px 8px', textTransform: 'none', letterSpacing: 'normal', fontWeight: 600 }}>
                            Ready: {readinessText}
                          </span>
                        </div>
                      </td>
                      
                      <td style={{ padding: '16px', fontSize: '0.88rem' }}>
                        <div style={{ fontWeight: 600 }}>
                          {student.pathway === '12th_btech' ? '12th Standard → B.Tech' : 
                           student.pathway === 'diploma_btech' ? 'Diploma → B.Tech' : 
                           'ITI → Diploma → B.Tech'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Passed from: {student.educationHistory[student.educationHistory.length - 2]?.institute || 'School'}
                        </div>
                      </td>

                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span className={`badge ${student.isLateralEntry ? 'badge-medium' : 'badge-low'}`}>
                          {student.isLateralEntry ? 'Lateral Entry' : 'Regular'}
                        </span>
                      </td>

                      <td style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: 'var(--color-primary)' }}>
                        {latestBtech ? `${latestBtech.phase}: ${latestBtech.marks}` : 'No B.Tech record'}
                      </td>

                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        {student.improvementNotes ? (
                          <span className="badge badge-low" style={{ display: 'inline-flex', gap: '4px' }}>
                            <UserCheck size={12} /> Written
                          </span>
                        ) : (
                          <span className="badge badge-high" style={{ display: 'inline-flex', gap: '4px' }}>
                            <AlertTriangle size={12} /> Pending Review
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <Link 
                            to={`/student/${student._id}`} 
                            className="btn btn-secondary" 
                            style={{ padding: '6px 10px', borderRadius: '6px' }}
                            title="View Student Report"
                          >
                            <Eye size={14} />
                          </Link>
                          
                          <Link 
                            to={`/predict/${student._id}`} 
                            className="btn btn-secondary" 
                            style={{ padding: '6px 10px', borderRadius: '6px' }}
                            title="Edit Record / Add notes"
                          >
                            <Edit size={14} style={{ color: 'var(--color-primary)' }} />
                          </Link>

                          <button 
                            onClick={() => handleDelete(student._id)} 
                            className="btn btn-secondary" 
                            style={{ padding: '6px 10px', borderRadius: '6px' }}
                            disabled={deletingId === student._id}
                            title="Delete Student"
                          >
                            <Trash2 size={14} style={{ color: 'var(--color-high)' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
