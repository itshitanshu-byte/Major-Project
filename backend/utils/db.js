import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Student from '../models/Student.js';

let isMockMode = false;

// Mock database storage
const mockUsers = [];
const mockStudents = [];

// Seed Function for Mock Mode
async function seedMockDB() {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password', salt);

    const teacher = {
      _id: 'mock_teacher_albert',
      username: 'Prof. Albert',
      email: 'teacher@college.edu',
      password: passwordHash,
      role: 'teacher',
      createdAt: new Date()
    };

    const student1 = {
      _id: 'mock_user_aarav',
      username: 'Aarav Sharma',
      email: 'student1@college.edu',
      password: passwordHash,
      role: 'student',
      createdAt: new Date()
    };

    const student2 = {
      _id: 'mock_user_nisha',
      username: 'Nisha Patel',
      email: 'student2@college.edu',
      password: passwordHash,
      role: 'student',
      createdAt: new Date()
    };

    mockUsers.push(teacher, student1, student2);

    function generateSchoolSeed(startYear, institute, baseMarks) {
      return [
        {
          phase: 'Std 10',
          institute,
          years: `${startYear} - ${startYear + 1}`,
          marks: `${baseMarks}%`,
          subjectsStudied: 'Mathematics, Science, English, Social Sciences, Computer Applications'
        }
      ];
    }




    mockStudents.push({
      _id: 'mock_student_aarav',
      name: 'Aarav Sharma',
      rollNumber: '2024-CS-02',
      email: 'aarav.sharma@student.edu',
      bio: 'Passionate coder interested in Web Development and Machine Learning. Love building projects and learning new JavaScript frameworks.',
      pathway: 'diploma_btech',
      isLateralEntry: true,
      educationHistory: [
        ...generateSchoolSeed(2020, 'Little Flower High School, Mumbai', 94),
        {
          phase: 'Diploma Year 1',
          institute: 'Government Polytechnic College, Pune',
          years: '2021 - 2022',
          marks: '85%',
          subjectsStudied: 'Engineering Mathematics, Applied Chemistry, Basic Engineering Practices'
        },
        {
          phase: 'Diploma Year 2',
          institute: 'Government Polytechnic College, Pune',
          years: '2022 - 2023',
          marks: '87%',
          subjectsStudied: 'Introduction to Programming, Computer Architecture, Web Design Basics'
        },
        {
          phase: 'Diploma Year 3',
          institute: 'Government Polytechnic College, Pune',
          years: '2023 - 2024',
          marks: '88%',
          subjectsStudied: 'Data Structures, Database Management Systems, Operating Systems, C/C++ Programming, Computer Networks'
        },
        {
          phase: 'B.Tech Year 2 (Lateral Entry)',
          institute: 'KJ Somaiya College of Engineering',
          years: '2024 - 2025',
          marks: '9.1 CGPA',
          subjectsStudied: 'Object Oriented Programming, Computer Architecture, Discrete Mathematics, Software Engineering'
        },
        {
          phase: 'B.Tech Year 3',
          institute: 'KJ Somaiya College of Engineering',
          years: '2025 - 2026',
          marks: '9.4 CGPA',
          subjectsStudied: 'Design and Analysis of Algorithms, Formal Languages & Automata Theory, Web Technologies, Database Systems'
        }
      ],
      targetCgpa: 9.0,
      weeklyStudyHours: 12,
      completedCourses: ['Calculus Bridge Course'],
      tutorRequests: ['Formal Languages & Automata Theory'],
      tutorOffers: ['Data Structures', 'Database Systems'],
      improvementNotes: 'Aarav is doing exceptionally well in practical coding labs. Suggesting he participate in national level hackathons and focus a bit more on theoretical Automata classes.',
      createdBy: 'mock_user_aarav',
      createdAt: new Date(Date.now() - 3600000)
    });

    mockStudents.push({
      _id: 'mock_student_nisha',
      name: 'Nisha Patel',
      rollNumber: '2023-CS-15',
      email: 'nisha.patel@student.edu',
      bio: 'Enthusiastic about data analysis and database administration. Looking forward to landing a job in DBMS.',
      pathway: '12th_btech',
      isLateralEntry: false,
      educationHistory: [
        ...generateSchoolSeed(2020, 'St. Xavier\'s School, Ahmedabad', 91),
        {
          phase: 'Std 11',
          institute: 'St. Xavier\'s Junior College',
          years: '2021 - 2022',
          marks: '83%',
          subjectsStudied: 'Physics, Chemistry, Mathematics, English, Computer Science Basics'
        },
        {
          phase: 'Std 12',
          institute: 'St. Xavier\'s Junior College',
          years: '2022 - 2023',
          marks: '85%',
          subjectsStudied: 'Mathematics, Physics, Chemistry, Computer Science, English Literature'
        },
        {
          phase: 'B.Tech Year 1',
          institute: 'L.D. College of Engineering',
          years: '2023 - 2024',
          marks: '7.8 CGPA',
          subjectsStudied: 'Calculus, Physics, Basic Electrical Engg, Engineering Graphics, Intro to Programming'
        },
        {
          phase: 'B.Tech Year 2',
          institute: 'L.D. College of Engineering',
          years: '2024 - 2025',
          marks: '8.0 CGPA',
          subjectsStudied: 'Data Structures, Digital Logic, OOP in Java, Discrete Structures, Database Systems'
        },
        {
          phase: 'B.Tech Year 3',
          institute: 'L.D. College of Engineering',
          years: '2025 - 2026',
          marks: '8.2 CGPA',
          subjectsStudied: 'Operating Systems, Algorithms, Software Engineering, Microprocessors'
        }
      ],
      targetCgpa: 8.5,
      weeklyStudyHours: 8,
      completedCourses: [],
      tutorRequests: ['Java OOP', 'Operating Systems'],
      tutorOffers: ['Calculus'],
      improvementNotes: 'Nisha has steady growth but could improve in programming labs. Recommend more coding practice on platforms like LeetCode and peer programming.',
      createdBy: 'mock_user_nisha',
      createdAt: new Date()
    });

    console.log('>>> Mock database successfully seeded with students and roles.');
  } catch (err) {
    console.error('Error seeding mock database:', err.message);
  }
}

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student-performance-system';
  
  try {
    // Attempt Mongoose connection with a short timeout to prevent hanging on start
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('>>> Connected to MongoDB database successfully.');
    isMockMode = false;

    // Reset MongoDB collections to clean up legacy LKG/UKG student entries
    try {
      await Student.deleteMany({});
      await User.deleteMany({});

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('password', salt);

      const teacher = await User.create({
        username: 'Prof. Albert',
        email: 'teacher@college.edu',
        password: passwordHash,
        role: 'teacher'
      });

      const student1 = await User.create({
        username: 'Aarav Sharma',
        email: 'student1@college.edu',
        password: passwordHash,
        role: 'student'
      });

      const student2 = await User.create({
        username: 'Nisha Patel',
        email: 'student2@college.edu',
        password: passwordHash,
        role: 'student'
      });

      const generateSchoolSeedInline = (startYear, institute, baseMarks) => {
        return [
          {
            phase: 'Std 10',
            institute,
            years: `${startYear} - ${startYear + 1}`,
            marks: `${baseMarks}%`,
            subjectsStudied: 'Mathematics, Science, English, Social Sciences, Computer Applications'
          }
        ];
      };

      await Student.create({
        name: 'Aarav Sharma',
        rollNumber: '2024-CS-02',
        email: 'aarav.sharma@student.edu',
        bio: 'Passionate coder interested in Web Development and Machine Learning. Love building projects and learning new JavaScript frameworks.',
        pathway: 'diploma_btech',
        isLateralEntry: true,
        educationHistory: [
          ...generateSchoolSeedInline(2020, 'Little Flower High School, Mumbai', 94),
          {
            phase: 'Diploma Year 1',
            institute: 'Government Polytechnic College, Pune',
            years: '2021 - 2022',
            marks: '85%',
            subjectsStudied: 'Engineering Mathematics, Applied Chemistry, Basic Engineering Practices'
          },
          {
            phase: 'Diploma Year 2',
            institute: 'Government Polytechnic College, Pune',
            years: '2022 - 2023',
            marks: '87%',
            subjectsStudied: 'Introduction to Programming, Computer Architecture, Web Design Basics'
          },
          {
            phase: 'Diploma Year 3',
            institute: 'Government Polytechnic College, Pune',
            years: '2023 - 2024',
            marks: '88%',
            subjectsStudied: 'Data Structures, Database Management Systems, Operating Systems, C/C++ Programming, Computer Networks'
          },
          {
            phase: 'B.Tech Year 2 (Lateral Entry)',
            institute: 'KJ Somaiya College of Engineering',
            years: '2024 - 2025',
            marks: '9.1 CGPA',
            subjectsStudied: 'Object Oriented Programming, Computer Architecture, Discrete Mathematics, Software Engineering'
          },
          {
            phase: 'B.Tech Year 3',
            institute: 'KJ Somaiya College of Engineering',
            years: '2025 - 2026',
            marks: '9.4 CGPA',
            subjectsStudied: 'Design and Analysis of Algorithms, Formal Languages & Automata Theory, Web Technologies, Database Systems'
          }
        ],
        targetCgpa: 9.0,
        weeklyStudyHours: 12,
        completedCourses: ['Calculus Bridge Course'],
        tutorRequests: ['Formal Languages & Automata Theory'],
        tutorOffers: ['Data Structures', 'Database Systems'],
        improvementNotes: 'Aarav is doing exceptionally well in practical coding labs. Suggesting he participate in national level hackathons and focus a bit more on theoretical Automata classes.',
        createdBy: student1._id
      });

      await Student.create({
        name: 'Nisha Patel',
        rollNumber: '2023-CS-15',
        email: 'nisha.patel@student.edu',
        bio: 'Enthusiastic about data analysis and database administration. Looking forward to landing a job in DBMS.',
        pathway: '12th_btech',
        isLateralEntry: false,
        educationHistory: [
          ...generateSchoolSeedInline(2020, 'St. Xavier\'s School, Ahmedabad', 91),
          {
            phase: 'Std 11',
            institute: 'St. Xavier\'s Junior College',
            years: '2021 - 2022',
            marks: '83%',
            subjectsStudied: 'Physics, Chemistry, Mathematics, English, Computer Science Basics'
          },
          {
            phase: 'Std 12',
            institute: 'St. Xavier\'s Junior College',
            years: '2022 - 2023',
            marks: '85%',
            subjectsStudied: 'Mathematics, Physics, Chemistry, Computer Science, English Literature'
          },
          {
            phase: 'B.Tech Year 1',
            institute: 'L.D. College of Engineering',
            years: '2023 - 2024',
            marks: '7.8 CGPA',
            subjectsStudied: 'Calculus, Physics, Basic Electrical Engg, Engineering Graphics, Intro to Programming'
          },
          {
            phase: 'B.Tech Year 2',
            institute: 'L.D. College of Engineering',
            years: '2024 - 2025',
            marks: '8.0 CGPA',
            subjectsStudied: 'Data Structures, Digital Logic, OOP in Java, Discrete Structures, Database Systems'
          },
          {
            phase: 'B.Tech Year 3',
            institute: 'L.D. College of Engineering',
            years: '2025 - 2026',
            marks: '8.2 CGPA',
            subjectsStudied: 'Operating Systems, Algorithms, Software Engineering, Microprocessors'
          }
        ],
        targetCgpa: 8.5,
        weeklyStudyHours: 8,
        completedCourses: [],
        tutorRequests: ['Java OOP', 'Operating Systems'],
        tutorOffers: ['Calculus'],
        improvementNotes: 'Nisha has steady growth but could improve in programming labs. Recommend more coding practice on platforms like LeetCode and peer programming.',
        createdBy: student2._id
      });
      console.log('>>> Live MongoDB successfully reset and seeded with simplified school records.');
    } catch (seedErr) {
      console.error('Warning: Seed resetting failed:', seedErr.message);
    }
  } catch (error) {
    if (process.env.ALLOW_MOCK_DB === 'true' || true) {
      console.warn('WARNING: Could not connect to MongoDB database.');
      console.warn('Fallback: Running in-memory Mock Database Mode. Data will be saved in memory and reset on restart.');
      isMockMode = true;
      await seedMockDB();
    } else {
      console.error('Database connection failed:', error.message);
      throw error;
    }
  }
}

export function checkMockMode() {
  return isMockMode;
}

// --- USER OPERATIONS ---

export async function getUserByEmail(email) {
  if (isMockMode) {
    return mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }
  return await User.findOne({ email });
}

export async function getUserById(id) {
  if (isMockMode) {
    return mockUsers.find(u => u._id === id) || null;
  }
  return await User.findById(id).select('-password');
}

export async function createUser({ username, email, password, role }) {
  if (isMockMode) {
    const newUser = {
      _id: 'mock_user_' + Math.random().toString(36).substr(2, 9),
      username,
      email: email.toLowerCase(),
      password, // Note: password should already be hashed
      role: role || 'student',
      createdAt: new Date()
    };
    mockUsers.push(newUser);
    return newUser;
  }
  
  const user = new User({ username, email, password, role });
  await user.save();
  return user;
}

// --- STUDENT OPERATIONS ---

export async function getStudents(userId, filter = {}) {
  const caller = await getUserById(userId);
  const callerRole = caller ? caller.role : 'student';

  if (isMockMode) {
    let list = [...mockStudents];
    // Students can only see their own profile
    if (callerRole === 'student') {
      list = list.filter(s => s.createdBy === userId);
    }
    
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.rollNumber.toLowerCase().includes(q) ||
        (s.educationHistory && s.educationHistory.some(ph => ph.institute.toLowerCase().includes(q)))
      );
    }
    if (filter.pathway) {
      list = list.filter(s => s.pathway === filter.pathway);
    }
    if (filter.isLateralEntry !== undefined) {
      const isLat = filter.isLateralEntry === 'true' || filter.isLateralEntry === true;
      list = list.filter(s => s.isLateralEntry === isLat);
    }
    
    // Sort by createdAt descending
    return list.sort((a, b) => b.createdAt - a.createdAt);
  }

  const query = {};
  if (callerRole === 'student') {
    query.createdBy = userId;
  }
  
  if (filter.search) {
    query.$or = [
      { name: { $regex: filter.search, $options: 'i' } },
      { rollNumber: { $regex: filter.search, $options: 'i' } },
      { "educationHistory.institute": { $regex: filter.search, $options: 'i' } }
    ];
  }
  if (filter.pathway) {
    query.pathway = filter.pathway;
  }
  if (filter.isLateralEntry !== undefined) {
    query.isLateralEntry = filter.isLateralEntry === 'true' || filter.isLateralEntry === true;
  }
  
  return await Student.find(query).sort({ createdAt: -1 });
}

export async function getStudentById(id, userId) {
  const caller = await getUserById(userId);
  const callerRole = caller ? caller.role : 'student';

  if (isMockMode) {
    const student = mockStudents.find(s => s._id === id);
    if (!student) return null;
    if (callerRole === 'student' && student.createdBy !== userId) {
      return null;
    }
    return student;
  }

  const query = { _id: id };
  if (callerRole === 'student') {
    query.createdBy = userId;
  }
  return await Student.findOne(query);
}

export async function getStudentByUserId(studentUserId) {
  if (isMockMode) {
    return mockStudents.find(s => s.createdBy === studentUserId) || null;
  }
  return await Student.findOne({ createdBy: studentUserId });
}

export async function createStudent(data) {
  if (isMockMode) {
    const newStudent = {
      _id: 'mock_student_' + Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date()
    };
    mockStudents.push(newStudent);
    return newStudent;
  }
  
  const student = new Student(data);
  await student.save();
  return student;
}

export async function updateStudent(id, userId, updateData) {
  const caller = await getUserById(userId);
  const callerRole = caller ? caller.role : 'student';

  if (isMockMode) {
    const index = mockStudents.findIndex(s => s._id === id);
    if (index === -1) return null;
    if (callerRole === 'student' && mockStudents[index].createdBy !== userId) {
      return null;
    }
    
    const updated = {
      ...mockStudents[index],
      ...updateData,
      // preserve IDs
      _id: id,
      createdBy: mockStudents[index].createdBy
    };
    mockStudents[index] = updated;
    return updated;
  }
  
  const query = { _id: id };
  if (callerRole === 'student') {
    query.createdBy = userId;
  }

  return await Student.findOneAndUpdate(
    query,
    { $set: updateData },
    { new: true }
  );
}

export async function deleteStudent(id, userId) {
  const caller = await getUserById(userId);
  const callerRole = caller ? caller.role : 'student';

  if (isMockMode) {
    const index = mockStudents.findIndex(s => s._id === id);
    if (index === -1) return false;
    if (callerRole === 'student' && mockStudents[index].createdBy !== userId) {
      return false;
    }
    mockStudents.splice(index, 1);
    return true;
  }
  
  const query = { _id: id };
  if (callerRole === 'student') {
    query.createdBy = userId;
  }
  
  const res = await Student.deleteOne(query);
  return res.deletedCount > 0;
}

// Aggregates statistics
export async function getStudentStats(userId) {
  const caller = await getUserById(userId);
  const callerRole = caller ? caller.role : 'student';

  const studentsList = isMockMode 
    ? [...mockStudents]
    : await Student.find(callerRole === 'student' ? { createdBy: userId } : {});

  if (studentsList.length === 0) {
    return {
      totalStudents: 0,
      lateralEntryCount: 0,
      regularEntryCount: 0,
      pendingMentorshipCount: 0,
      pathwayCounts: { '12th_btech': 0, 'diploma_btech': 0, 'iti_diploma_btech': 0 },
      feederInstitutes: [],
      alerts: []
    };
  }

  let lateralEntryCount = 0;
  let regularEntryCount = 0;
  let pendingMentorshipCount = 0;
  const pathwayCounts = { '12th_btech': 0, 'diploma_btech': 0, 'iti_diploma_btech': 0 };

  // Helper functions for analytics
  function getBtechCgpa(student) {
    const btechPhases = student.educationHistory.filter(ph => ph.phase.toLowerCase().includes('b.tech'));
    if (btechPhases.length === 0) return 0;
    for (let i = btechPhases.length - 1; i >= 0; i--) {
      const markText = btechPhases[i].marks;
      if (markText && markText.toLowerCase() !== 'pending') {
        const val = parseFloat(markText);
        if (!isNaN(val)) return val;
      }
    }
    return 0;
  }

  function getFeederInstitute(student) {
    const history = student.educationHistory;
    if (!history || history.length < 2) return 'Unknown';
    const firstBtechIdx = history.findIndex(ph => ph.phase.toLowerCase().includes('b.tech'));
    if (firstBtechIdx > 0) {
      return history[firstBtechIdx - 1].institute;
    }
    return history[history.length - 2]?.institute || 'Unknown';
  }

  const institutesMap = {};
  let lowDiplomaMathCount = 0;
  let low12thMathCount = 0;

  studentsList.forEach(s => {
    if (s.isLateralEntry) {
      lateralEntryCount++;
    } else {
      regularEntryCount++;
    }
    
    if (!s.improvementNotes || s.improvementNotes.trim() === '') {
      pendingMentorshipCount++;
    }

    if (pathwayCounts[s.pathway] !== undefined) {
      pathwayCounts[s.pathway]++;
    }

    // Feeder institute aggregation
    const inst = getFeederInstitute(s);
    const cgpa = getBtechCgpa(s);
    if (!institutesMap[inst]) {
      institutesMap[inst] = { institute: inst, studentCount: 0, totalCgpa: 0, validCgpaCount: 0 };
    }
    institutesMap[inst].studentCount++;
    if (cgpa > 0) {
      institutesMap[inst].totalCgpa += cgpa;
      institutesMap[inst].validCgpaCount++;
    }

    // Scan for low marks to generate alerts
    s.educationHistory.forEach(eh => {
      const phaseLower = eh.phase.toLowerCase();
      const marksVal = parseFloat(eh.marks);
      if (!isNaN(marksVal) && marksVal < 85) {
        if (phaseLower.includes('diploma')) {
          lowDiplomaMathCount++;
        }
        if (phaseLower.includes('std 12') || phaseLower.includes('std 11') || phaseLower.includes('12th')) {
          low12thMathCount++;
        }
      }
    });
  });

  const feederInstitutes = Object.values(institutesMap).map(item => ({
    institute: item.institute,
    studentCount: item.studentCount,
    avgCgpa: item.validCgpaCount > 0 
      ? Math.round((item.totalCgpa / item.validCgpaCount) * 100) / 100 
      : 'N/A'
  }));

  // Generate alerts
  const alerts = [];
  if (lowDiplomaMathCount >= 1) {
    alerts.push({
      type: 'warning',
      message: `Alert: ${lowDiplomaMathCount} student(s) entering B.Tech via Diploma have average pre-admission marks below 85%. Scheduling an Advanced Engineering Mathematics bridge session is recommended.`
    });
  }
  if (low12thMathCount >= 1) {
    alerts.push({
      type: 'info',
      message: `Insight: ${low12thMathCount} student(s) from 12th Std entry have pre-admission marks below 85%. Consider providing introductory computer programming tutorials.`
    });
  }
  if (alerts.length === 0) {
    alerts.push({
      type: 'success',
      message: 'All incoming students meet the recommended pre-admission marks threshold. No urgent bridge classes required.'
    });
  }

  return {
    totalStudents: studentsList.length,
    lateralEntryCount,
    regularEntryCount,
    pendingMentorshipCount,
    pathwayCounts,
    feederInstitutes,
    alerts
  };
}

export async function getPeerMentors(userId) {
  const caller = await getStudentByUserId(userId);
  if (!caller) return [];

  const allStudents = isMockMode 
    ? [...mockStudents]
    : await Student.find({});

  // Filter out caller
  const others = allStudents.filter(s => {
    const sId = isMockMode ? s.createdBy : s.createdBy.toString();
    const cId = isMockMode ? userId : userId.toString();
    return sId !== cId;
  });

  const matches = others.map(s => {
    const sOffers = s.tutorOffers || [];
    const sRequests = s.tutorRequests || [];
    const cOffers = caller.tutorOffers || [];
    const cRequests = caller.tutorRequests || [];

    const offeredMatches = sOffers.filter(offer => 
      cRequests.some(reqSub => reqSub.toLowerCase() === offer.toLowerCase())
    );
    const requestedMatches = sRequests.filter(reqSub => 
      cOffers.some(offer => offer.toLowerCase() === reqSub.toLowerCase())
    );

    if (offeredMatches.length > 0 || requestedMatches.length > 0) {
      return {
        _id: s._id,
        name: s.name,
        email: s.email,
        tutorOffers: sOffers,
        tutorRequests: sRequests,
        offeredMatches,
        requestedMatches
      };
    }
    return null;
  }).filter(m => m !== null);

  return matches;
}
