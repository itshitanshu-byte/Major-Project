import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, User, Mail, BookOpen, Award, Check, 
  Building, Calendar, Percent, GraduationCap, Info, Sparkles
} from 'lucide-react';

export default function Predictor() {
  const { id } = useParams(); // ID present if teacher is editing a student
  const { token, user: loggedInUser } = useAuth();
  const navigate = useNavigate();

  // Wizard Steps
  const [step, setStep] = useState(1);

  // Form Fields State
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [pathway, setPathway] = useState('12th_btech');
  const [educationHistory, setEducationHistory] = useState([]);
  const [improvementNotes, setImprovementNotes] = useState('');
  const [targetCgpa, setTargetCgpa] = useState(8.0);
  const [weeklyStudyHours, setWeeklyStudyHours] = useState(10);
  const [tutorRequestsRaw, setTutorRequestsRaw] = useState('');
  const [tutorOffersRaw, setTutorOffersRaw] = useState('');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Default phases templates for each pathway
  const getPhasesForPathway = (path) => {
    const schoolPhases = [
      { phase: 'Std 10', institute: '', years: '', marks: '', subjectsStudied: '' }
    ];

    const default12th = [
      { phase: 'Std 11', institute: '', years: '', marks: '', subjectsStudied: '' },
      { phase: 'Std 12', institute: '', years: '', marks: '', subjectsStudied: '' }
    ];

    const defaultITI = {
      phase: 'ITI',
      institute: '',
      years: '',
      marks: '',
      subjectsStudied: ''
    };

    const defaultDiploma = [
      { phase: 'Diploma Year 1', institute: '', years: '', marks: '', subjectsStudied: '' },
      { phase: 'Diploma Year 2', institute: '', years: '', marks: '', subjectsStudied: '' },
      { phase: 'Diploma Year 3', institute: '', years: '', marks: '', subjectsStudied: '' }
    ];

    if (path === '12th_btech') {
      return [
        ...schoolPhases,
        ...default12th,
        { phase: 'B.Tech Year 1', institute: '', years: '', marks: '', subjectsStudied: '' },
        { phase: 'B.Tech Year 2', institute: '', years: '', marks: '', subjectsStudied: '' },
        { phase: 'B.Tech Year 3', institute: '', years: '', marks: '', subjectsStudied: '' },
        { phase: 'B.Tech Year 4', institute: '', years: '', marks: '', subjectsStudied: '' }
      ];
    } else if (path === 'diploma_btech') {
      return [
        ...schoolPhases,
        ...defaultDiploma,
        { phase: 'B.Tech Year 2 (Lateral Entry)', institute: '', years: '', marks: '', subjectsStudied: '' },
        { phase: 'B.Tech Year 3', institute: '', years: '', marks: '', subjectsStudied: '' },
        { phase: 'B.Tech Year 4', institute: '', years: '', marks: '', subjectsStudied: '' }
      ];
    } else if (path === 'iti_diploma_btech') {
      return [
        ...schoolPhases,
        ...default12th,
        defaultITI,
        ...defaultDiploma,
        { phase: 'B.Tech Year 2 (Lateral Entry)', institute: '', years: '', marks: '', subjectsStudied: '' },
        { phase: 'B.Tech Year 3', institute: '', years: '', marks: '', subjectsStudied: '' },
        { phase: 'B.Tech Year 4', institute: '', years: '', marks: '', subjectsStudied: '' }
      ];
    }
    return [];
  };

  // Initialize history when pathway changes, preserving match data where possible
  const handlePathwayChange = (newPathway) => {
    setPathway(newPathway);
    const templates = getPhasesForPathway(newPathway);
    const updatedHistory = templates.map(temp => {
      const existing = educationHistory.find(eh => eh.phase === temp.phase);
      return existing ? { ...temp, ...existing } : temp;
    });
    setEducationHistory(updatedHistory);
  };

  // Load profile details
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        // If edit mode with ID (teacher view or admin update)
        const endpoint = id ? `/api/students/${id}` : '/api/students/profile';
        const res = await fetch(endpoint, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const s = await res.json();
          if (s) {
            setName(s.name || '');
            setRollNumber(s.rollNumber || '');
            setEmail(s.email || '');
            setBio(s.bio || '');
            setPathway(s.pathway || '12th_btech');
            setImprovementNotes(s.improvementNotes || '');
            setTargetCgpa(s.targetCgpa || 8.0);
            setWeeklyStudyHours(s.weeklyStudyHours || 10);
            setTutorRequestsRaw(s.tutorRequests ? s.tutorRequests.join(', ') : '');
            setTutorOffersRaw(s.tutorOffers ? s.tutorOffers.join(', ') : '');
            
            // Handle educationHistory from DB or build new based on pathway
            if (s.educationHistory && s.educationHistory.length > 0) {
              setEducationHistory(s.educationHistory);
            } else {
              setEducationHistory(getPhasesForPathway(s.pathway || '12th_btech'));
            }
          } else {
            // New Profile Init
            setEducationHistory(getPhasesForPathway('12th_btech'));
          }
        } else {
          // If 404/Null (Student hasn't created profile yet)
          setEducationHistory(getPhasesForPathway('12th_btech'));
        }
      } catch (err) {
        console.error('Error fetching student details:', err);
        setError('Error loading student profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, token]);

  // Update a single field in a specific educational phase
  const handlePhaseFieldChange = (index, field, value) => {
    const updated = [...educationHistory];
    updated[index][field] = value;
    setEducationHistory(updated);
  };

  // Helper to fill template for testing
  const handleFillDemoData = () => {
    setName(loggedInUser?.username || 'Arjun Mehta');
    setRollNumber('2024-ME-45');
    setEmail(loggedInUser?.email || 'arjun.mehta@college.edu');
    setBio('Mechanical Engineering student interested in robotics, CAD/CAM design, and industrial automation.');
    setTargetCgpa(8.8);
    setWeeklyStudyHours(15);
    setTutorRequestsRaw('Robotics Design, Fluid Dynamics');
    setTutorOffersRaw('Calculus, Physics, CAD Modeling');
    
    const schoolName = 'Delhi Public School, Delhi';
    const collName = 'Delhi Polytechnic, Delhi';
    const btechName = 'Delhi Technological University';
    
    const templates = getPhasesForPathway(pathway);
    
    const filledHistory = templates.map((temp) => {
      let institute = schoolName;
      let years = '';
      let marks = '90%';
      let subjectsStudied = 'Science, Maths, English';

      if (temp.phase === 'Std 10') {
        years = '2019 - 2020';
        marks = '88%';
        subjectsStudied = 'Mathematics, Science, English, Social Sciences, Computer Applications';
      } else if (temp.phase === 'Std 11') {
        institute = 'DPS Junior College, Delhi';
        years = '2020 - 2021';
        marks = '84%';
        subjectsStudied = 'Physics, Chemistry, Mathematics, Computer Science, English';
      } else if (temp.phase === 'Std 12') {
        institute = 'DPS Junior College, Delhi';
        years = '2021 - 2022';
        marks = '86%';
        subjectsStudied = 'Physics, Chemistry, Mathematics, Computer Science, English Literature';
      } else if (temp.phase === 'ITI') {
        institute = 'Government ITI, Delhi';
        years = '2022 - 2023';
        marks = 'A+ Grade';
        subjectsStudied = 'Machinist trade, lathe operations, mechanical safety, technical blueprint drawing';
      } else if (temp.phase.startsWith('Diploma')) {
        institute = collName;
        const yr = temp.phase.includes('Year 1') ? 1 : temp.phase.includes('Year 2') ? 2 : 3;
        years = `${2021 + (yr - 1)} - ${2022 + (yr - 1)}`;
        marks = `${82 + yr * 3}%`;
        subjectsStudied = 'Polytechnic mechanical - thermodynamics, workshop practices, CAD drafting, machine elements';
      } else if (temp.phase.startsWith('B.Tech')) {
        institute = btechName;
        if (temp.phase.includes('Year 1')) {
          years = '2022 - 2023';
          marks = '8.2 CGPA';
          subjectsStudied = 'Calculus, Engineering Physics, Workshop Practices, Basics of IT';
        } else if (temp.phase.includes('Year 2')) {
          years = '2023 - 2024';
          marks = '8.5 CGPA';
          subjectsStudied = 'Material Science, Strength of Materials, Thermodynamics, Manufacturing Technology';
        } else if (temp.phase.includes('Year 3')) {
          years = '2024 - 2025';
          marks = '8.8 CGPA';
          subjectsStudied = 'Fluid Mechanics, Dynamics of Machinery, Machine Design, Heat Transfer';
        } else {
          years = 'Pending';
          marks = 'Pending';
          subjectsStudied = 'Robotics and automation, Finite Element Analysis, Capstone engineering thesis';
        }
      }

      return {
        ...temp,
        institute,
        years,
        marks,
        subjectsStudied
      };
    });

    setEducationHistory(filledHistory);
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check validation for Personal Info
    if (!name.trim() || !rollNumber.trim() || !email.trim()) {
      setError('Please fill out all personal details (Name, Roll, Email).');
      return;
    }

    // Check validation for Educational History phases (ensure institute and years are not empty)
    for (let i = 0; i < educationHistory.length; i++) {
      const eh = educationHistory[i];
      if (!eh.institute.trim() || !eh.years.trim() || !eh.marks.trim() || !eh.subjectsStudied.trim()) {
        setError(`Please fill in all details for stage: ${eh.phase}`);
        return;
      }
    }

    setSaving(true);
    setError('');

    const payload = {
      name,
      rollNumber,
      email,
      bio,
      pathway,
      educationHistory,
      improvementNotes,
      targetCgpa: parseFloat(targetCgpa) || 8.0,
      weeklyStudyHours: parseInt(weeklyStudyHours) || 0,
      tutorRequests: tutorRequestsRaw ? tutorRequestsRaw.split(',').map(s => s.trim()).filter(s => s !== '') : [],
      tutorOffers: tutorOffersRaw ? tutorOffersRaw.split(',').map(s => s.trim()).filter(s => s !== '') : []
    };

    try {
      const url = id ? `/api/students/${id}` : '/api/students/profile';
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        if (id) {
          navigate(`/student/${id}`);
        } else {
          // If Student user is creating/updating profile, redirect them back to Dashboard/Profile page
          navigate('/');
        }
      } else {
        setError(data.msg || 'Failed to save student profile.');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('An error occurred while connecting to the database server.');
    } finally {
      setSaving(false);
    }
  };

  const isTeacher = loggedInUser?.role === 'teacher';

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" className="btn btn-secondary" style={{ padding: '8px 12px', borderRadius: '8px' }}>
            <ArrowLeft size={16} /> Back
          </Link>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {isTeacher ? `Review Profile: ${name || 'Student'}` : 'My Academic Profile & Marksheets'}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {isTeacher ? 'Review and edit the educational history and marksheet records of the student.' : 'Provide your comprehensive details from LKG to B.Tech to help the college improve your learning.'}
            </p>
          </div>
        </div>

        {/* Demo Helper Button */}
        {!id && (
          <button
            type="button"
            onClick={handleFillDemoData}
            className="btn btn-secondary"
            style={{ borderColor: 'var(--color-accent)', borderStyle: 'dashed', color: 'var(--color-accent)', display: 'flex', gap: '6px' }}
          >
            <Sparkles size={16} />
            Fill Demo Data
          </button>
        )}
      </div>

      {error && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: '10px',
          padding: '12px 16px',
          color: 'var(--color-high)',
          fontSize: '0.88rem',
          marginBottom: '24px'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading profile parameters...
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
          
          {/* Main Form Fields */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            
            {/* Step Indicators */}
            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '32px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: step === 1 ? 'var(--color-primary)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  borderBottom: step === 1 ? '2px solid var(--color-primary)' : 'none',
                  paddingBottom: '8px'
                }}
              >
                1. Personal Details & Pathway
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: step === 2 ? 'var(--color-primary)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  borderBottom: step === 2 ? '2px solid var(--color-primary)' : 'none',
                  paddingBottom: '8px'
                }}
              >
                2. Academic History (LKG - B.Tech)
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: step === 3 ? 'var(--color-primary)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  borderBottom: step === 3 ? '2px solid var(--color-primary)' : 'none',
                  paddingBottom: '8px'
                }}
              >
                3. Goals & Peer Mentorship
              </button>
            </div>

            {/* STEP 1: Personal Details & Pathway */}
            {step === 1 && (
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
                  Personal Information
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ paddingLeft: '38px' }}
                        required
                        disabled={isTeacher}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Roll Number</label>
                    <div style={{ position: 'relative' }}>
                      <GraduationCap style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="2024-ME-42"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        style={{ paddingLeft: '38px' }}
                        required
                        disabled={isTeacher}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                    <input
                      type="email"
                      className="form-input"
                      placeholder="student@college.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ paddingLeft: '38px' }}
                      required
                      disabled={isTeacher}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '32px' }}>
                  <label className="form-label">Bio (Tell college about yourself)</label>
                  <textarea
                    className="form-input"
                    placeholder="Briefly talk about your academic interests, career goals, and what you enjoy studying."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    style={{ resize: 'vertical' }}
                    disabled={isTeacher}
                  />
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                  Select Your Educational Pathway
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Choose the path you followed before and during your B.Tech course. This dynamically shapes your marksheet registry.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Pathway 1 */}
                  <label
                    onClick={() => !isTeacher && handlePathwayChange('12th_btech')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      borderRadius: '12px',
                      border: pathway === '12th_btech' ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                      background: pathway === '12th_btech' ? 'var(--color-primary-glow)' : 'rgba(0,0,0,0.1)',
                      cursor: isTeacher ? 'default' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="radio"
                      name="pathway"
                      checked={pathway === '12th_btech'}
                      onChange={() => {}}
                      style={{ accentColor: 'var(--color-primary)' }}
                      disabled={isTeacher}
                    />
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>10th Standard → 12th Standard → B.Tech</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Regular entry to B.Tech engineering course (4 years program)</div>
                    </div>
                  </label>

                  {/* Pathway 2 */}
                  <label
                    onClick={() => !isTeacher && handlePathwayChange('diploma_btech')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      borderRadius: '12px',
                      border: pathway === 'diploma_btech' ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                      background: pathway === 'diploma_btech' ? 'var(--color-primary-glow)' : 'rgba(0,0,0,0.1)',
                      cursor: isTeacher ? 'default' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="radio"
                      name="pathway"
                      checked={pathway === 'diploma_btech'}
                      onChange={() => {}}
                      style={{ accentColor: 'var(--color-primary)' }}
                      disabled={isTeacher}
                    />
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        10th Standard → Diploma → B.Tech <span className="badge badge-low" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>Lateral Entry</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Skipped 12th; joined B.Tech directly into Year 2 after completing Polytechnic Diploma.</div>
                    </div>
                  </label>

                  {/* Pathway 3 */}
                  <label
                    onClick={() => !isTeacher && handlePathwayChange('iti_diploma_btech')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      borderRadius: '12px',
                      border: pathway === 'iti_diploma_btech' ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                      background: pathway === 'iti_diploma_btech' ? 'var(--color-primary-glow)' : 'rgba(0,0,0,0.1)',
                      cursor: isTeacher ? 'default' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="radio"
                      name="pathway"
                      checked={pathway === 'iti_diploma_btech'}
                      onChange={() => {}}
                      style={{ accentColor: 'var(--color-primary)' }}
                      disabled={isTeacher}
                    />
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        10th Standard → 12th Standard → ITI → Diploma → B.Tech <span className="badge badge-low" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>Lateral Entry</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Completed 12th, followed by ITI, completed Diploma, then joined B.Tech Year 2.</div>
                    </div>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn btn-primary"
                    style={{ padding: '10px 24px' }}
                  >
                    Next Step: Educational Records
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Academic History */}
            {step === 2 && (
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
                  Stage-Wise Marksheets & Subjects
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  Enter details for each step of your pathway. Explain what you have studied so that teachers can advise and help improve your scores.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  {educationHistory.map((item, index) => (
                    <div
                      key={index}
                      className="glass-panel"
                      style={{
                        padding: '24px',
                        background: 'rgba(255,255,255,0.02)',
                        borderLeft: '4px solid var(--color-accent)'
                      }}
                    >
                      <h4 style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-accent)', marginBottom: '16px' }}>
                        {item.phase}
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: '0.78rem' }}>School / College Name</label>
                          <div style={{ position: 'relative' }}>
                            <Building style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={14} />
                            <input
                              type="text"
                              className="form-input"
                              placeholder="e.g. KV School, IIT Bombay"
                              value={item.institute}
                              onChange={(e) => handlePhaseFieldChange(index, 'institute', e.target.value)}
                              style={{ paddingLeft: '34px', paddingTop: '8px', paddingBottom: '8px', fontSize: '0.88rem' }}
                              required
                              disabled={isTeacher}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: '0.78rem' }}>Years (From - To)</label>
                          <div style={{ position: 'relative' }}>
                            <Calendar style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={14} />
                            <input
                              type="text"
                              className="form-input"
                              placeholder="e.g. 2020 - 2021"
                              value={item.years}
                              onChange={(e) => handlePhaseFieldChange(index, 'years', e.target.value)}
                              style={{ paddingLeft: '34px', paddingTop: '8px', paddingBottom: '8px', fontSize: '0.88rem' }}
                              required
                              disabled={isTeacher}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: '0.78rem' }}>Marks Scored</label>
                          <div style={{ position: 'relative' }}>
                            <Percent style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={14} />
                            <input
                              type="text"
                              className="form-input"
                              placeholder="e.g. 88% or 8.5 CGPA"
                              value={item.marks}
                              onChange={(e) => handlePhaseFieldChange(index, 'marks', e.target.value)}
                              style={{ paddingLeft: '34px', paddingTop: '8px', paddingBottom: '8px', fontSize: '0.88rem' }}
                              required
                              disabled={isTeacher}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Subjects Studied & Key Skills Acquired</label>
                        <textarea
                          className="form-input"
                          placeholder="e.g. Mathematics, Physics, English literature, Basic programming fundamentals, etc."
                          value={item.subjectsStudied}
                          onChange={(e) => handlePhaseFieldChange(index, 'subjectsStudied', e.target.value)}
                          rows={2}
                          style={{ resize: 'vertical', fontSize: '0.88rem', padding: '8px 12px' }}
                          required
                          disabled={isTeacher}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn btn-secondary"
                  >
                    Previous: Personal Info
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn btn-primary"
                    style={{ padding: '10px 24px' }}
                  >
                    Next Step: Goals & Mentorship
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Goals & Tutoring */}
            {step === 3 && (
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
                  Academic Goals & Peer Mentorship Setup
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                  <div className="form-group">
                    <label className="form-label">Target B.Tech CGPA</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="10"
                      className="form-input"
                      value={targetCgpa}
                      onChange={(e) => setTargetCgpa(e.target.value)}
                      disabled={isTeacher}
                      required
                    />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Setting a realistic B.Tech outcome score (e.g. 8.5)</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Weekly Self-Study Target (Hours)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        className="slider-input"
                        value={weeklyStudyHours}
                        onChange={(e) => setWeeklyStudyHours(Number(e.target.value))}
                        disabled={isTeacher}
                      />
                      <span className="slider-val">{weeklyStudyHours}h</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Hours per week planned outside lectures.</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginBottom: '20px' }}>
                  <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    🤝 Peer Mentorship Matching Interests
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    Type the specific topics or subjects separated by commas (e.g., Mathematics, Java, CAD).
                  </p>

                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label">Subjects You Need Help With (Tutor Requests)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Formal Languages & Automata, Calculus, Thermodynamics"
                      value={tutorRequestsRaw}
                      onChange={(e) => setTutorRequestsRaw(e.target.value)}
                      disabled={isTeacher}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subjects You Can Help Peers With (Tutor Offers)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. C Programming, CAD Drafting, Basic Physics"
                      value={tutorOffersRaw}
                      onChange={(e) => setTutorOffersRaw(e.target.value)}
                      disabled={isTeacher}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn btn-secondary"
                  >
                    Previous: Academic History
                  </button>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? 'Saving Profile...' : id ? 'Save Student Profile' : 'Submit Profile Data'}
                    </button>
                    <Link to="/" className="btn btn-secondary">
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Guidelines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Info size={16} /> Registry Guide
              </h4>
              
              <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '16px', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><strong>Mandatory Input:</strong> Logged-in students must compile their complete profile. Without submission, the college cannot view details.</li>
                <li><strong>Dynamic Sections:</strong> Changing your selected pathway on Step 1 dynamically creates relevant marksheets on Step 2. Keep shared details intact.</li>
                <li><strong>Lateral Entry:</strong> Selecting "Diploma" or "ITI + Diploma" automatically configures B.Tech Year 1 as skipped, setting you up as a Lateral Entry student.</li>
                <li><strong>Improving Academic Outcomes:</strong> Be descriptive about "subjects studied" so teachers can highlight areas to work on.</li>
              </ul>
            </div>

            {/* Teacher note indicator (read-only for students, editable for teachers if ID is present) */}
            {(improvementNotes || isTeacher) && (
              <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid var(--color-low)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-low)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  🧠 Mentoring Plan
                </h4>
                {isTeacher ? (
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '6px' }}>Improvement & Mentorship Notes</label>
                    <textarea
                      className="form-input"
                      placeholder="Write mentoring actions, academic focuses, or improvement plans for this student..."
                      value={improvementNotes}
                      onChange={(e) => setImprovementNotes(e.target.value)}
                      rows={5}
                      style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                    />
                  </div>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {improvementNotes || 'No recommendations written by teachers yet. Your college advisors will review your marksheet and write actions here.'}
                  </p>
                )}
              </div>
            )}
          </div>

        </form>
      )}

    </div>
  );
}
