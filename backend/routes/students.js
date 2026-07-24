import express from 'express';
import auth from '../middleware/auth.js';
import { 
  getStudents, 
  getStudentById, 
  getStudentByUserId,
  createStudent, 
  updateStudent, 
  deleteStudent, 
  getStudentStats,
  getUserById,
  getPeerMentors,
  broadcastBridgeInvite,
  postAcademicResource
} from '../utils/db.js';

const router = express.Router();

// @route   GET api/students/stats
// @desc    Get aggregated stats for dashboard
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await getStudentStats(req.user.id);
    res.json(stats);
  } catch (err) {
    console.error('Get stats error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/students/peer-mentors
// @desc    Get matching peer mentors for student
// @access  Private
router.get('/peer-mentors', auth, async (req, res) => {
  try {
    const mentors = await getPeerMentors(req.user.id);
    res.json(mentors);
  } catch (err) {
    console.error('Get peer mentors error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/students/broadcast-invite
// @desc    Broadcast bridge class invitation alert
// @access  Private (Teacher only)
router.post('/broadcast-invite', auth, async (req, res) => {
  const { pathway, message } = req.body;
  try {
    const caller = await getUserById(req.user.id);
    if (!caller || caller.role !== 'teacher') {
      return res.status(403).json({ msg: 'Access denied: Teacher role required.' });
    }
    await broadcastBridgeInvite(pathway, message);
    res.json({ msg: 'Broadcast invitation posted successfully.' });
  } catch (err) {
    console.error('Broadcast invite error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/students/resources
// @desc    Upload resource link to Resource Hub
// @access  Private (Teacher only)
router.post('/resources', auth, async (req, res) => {
  const { title, link } = req.body;
  try {
    const caller = await getUserById(req.user.id);
    if (!caller || caller.role !== 'teacher') {
      return res.status(403).json({ msg: 'Access denied: Teacher role required.' });
    }
    await postAcademicResource(title, link, caller.username);
    res.json({ msg: 'Academic resource shared successfully.' });
  } catch (err) {
    console.error('Post resource error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/students/profile
// @desc    Get current student's own profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const student = await getStudentByUserId(req.user.id);
    res.json(student); // returns null if no profile has been filled out yet
  } catch (err) {
    console.error('Get profile error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/students/profile
// @desc    Create or update current student's own profile
// @access  Private
router.post('/profile', auth, async (req, res) => {
  const { 
    name, rollNumber, email, bio, pathway, educationHistory,
    targetCgpa, weeklyStudyHours, completedCourses, tutorRequests, tutorOffers
  } = req.body;

  if (!name || !rollNumber || !email || !pathway || !educationHistory) {
    return res.status(400).json({ msg: 'Please provide all required fields' });
  }

  const isLateralEntry = pathway === 'diploma_btech' || pathway === 'iti_diploma_btech';

  try {
    let student = await getStudentByUserId(req.user.id);
    
    if (student) {
      // Update existing profile
      const updated = await updateStudent(student._id, req.user.id, {
        name,
        rollNumber,
        email,
        bio,
        pathway,
        isLateralEntry,
        educationHistory,
        targetCgpa: Number(targetCgpa) || 8.0,
        weeklyStudyHours: Number(weeklyStudyHours) || 0,
        completedCourses: completedCourses || [],
        tutorRequests: tutorRequests || [],
        tutorOffers: tutorOffers || []
      });
      return res.json(updated);
    }

    // Create new profile
    const newStudent = await createStudent({
      name,
      rollNumber,
      email,
      bio,
      pathway,
      isLateralEntry,
      educationHistory,
      targetCgpa: Number(targetCgpa) || 8.0,
      weeklyStudyHours: Number(weeklyStudyHours) || 0,
      completedCourses: completedCourses || [],
      tutorRequests: tutorRequests || [],
      tutorOffers: tutorOffers || [],
      createdBy: req.user.id
    });
    
    res.json(newStudent);
  } catch (err) {
    console.error('Create student profile error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/students
// @desc    Get all students (for teachers) or own student profile
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { search, pathway, isLateralEntry } = req.query;
    const filter = { search, pathway, isLateralEntry };
    const students = await getStudents(req.user.id, filter);
    res.json(students);
  } catch (err) {
    console.error('Get students error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/students/:id
// @desc    Get single student details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await getStudentById(req.params.id, req.user.id);
    if (!student) {
      return res.status(404).json({ msg: 'Student record not found' });
    }
    res.json(student);
  } catch (err) {
    console.error('Get student details error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/students/:id
// @desc    Update student details / add improvement notes
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { 
    name, rollNumber, email, bio, pathway, educationHistory, improvementNotes,
    targetCgpa, weeklyStudyHours, completedCourses, tutorRequests, tutorOffers
  } = req.body;

  try {
    const student = await getStudentById(req.params.id, req.user.id);
    if (!student) {
      return res.status(404).json({ msg: 'Student record not found or unauthorized' });
    }

    const caller = await getUserById(req.user.id);
    
    let updateData = {};
    if (caller && caller.role === 'teacher') {
      // Teachers can update notes and profile details
      updateData = {
        name,
        rollNumber,
        email,
        bio,
        pathway,
        educationHistory,
        improvementNotes,
        targetCgpa: Number(targetCgpa) || 8.0,
        weeklyStudyHours: Number(weeklyStudyHours) || 0,
        completedCourses: completedCourses || [],
        tutorRequests: tutorRequests || [],
        tutorOffers: tutorOffers || [],
        isLateralEntry: pathway === 'diploma_btech' || pathway === 'iti_diploma_btech'
      };
    } else {
      // Students can update their profile but NOT teacher notes
      updateData = {
        name,
        rollNumber,
        email,
        bio,
        pathway,
        educationHistory,
        targetCgpa: Number(targetCgpa) || 8.0,
        weeklyStudyHours: Number(weeklyStudyHours) || 0,
        completedCourses: completedCourses || [],
        tutorRequests: tutorRequests || [],
        tutorOffers: tutorOffers || [],
        isLateralEntry: pathway === 'diploma_btech' || pathway === 'iti_diploma_btech'
      };
    }

    const updatedStudent = await updateStudent(req.params.id, req.user.id, updateData);
    res.json(updatedStudent);
  } catch (err) {
    console.error('Update student error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/students/:id
// @desc    Delete a student record
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const success = await deleteStudent(req.params.id, req.user.id);
    if (!success) {
      return res.status(404).json({ msg: 'Student record not found or unauthorized' });
    }
    res.json({ msg: 'Student record deleted successfully' });
  } catch (err) {
    console.error('Delete student error:', err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
