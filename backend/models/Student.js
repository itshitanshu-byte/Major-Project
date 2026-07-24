import mongoose from 'mongoose';

const EducationPhaseSchema = new mongoose.Schema({
  phase: { 
    type: String, 
    required: true 
  }, // e.g. "Primary School (LKG - 10th)", "12th Standard", "ITI", "Diploma", "B.Tech Year 1", etc.
  institute: { 
    type: String, 
    required: true,
    trim: true
  }, // school/college name
  years: { 
    type: String, 
    required: true,
    trim: true
  }, // e.g. "2012 - 2022" or "2023 - 2024"
  marks: { 
    type: String, 
    required: true,
    trim: true
  }, // marks scored (percentage, CGPA, etc.)
  subjectsStudied: { 
    type: String, 
    required: true,
    trim: true
  } // what they studied
});

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  rollNumber: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    default: '',
    trim: true
  },
  pathway: {
    type: String,
    enum: ['12th_btech', 'diploma_btech', 'iti_diploma_btech'],
    required: true
  },
  isLateralEntry: {
    type: Boolean,
    default: false
  },
  educationHistory: [EducationPhaseSchema],
  targetCgpa: {
    type: Number,
    default: 8.0
  },
  weeklyStudyHours: {
    type: Number,
    default: 0
  },
  completedCourses: {
    type: [String],
    default: []
  },
  tutorRequests: {
    type: [String],
    default: []
  },
  tutorOffers: {
    type: [String],
    default: []
  },
  improvementNotes: {
    type: String,
    default: ''
  },
  predictedCgpa: {
    type: Number,
    default: 7.5
  },
  confidence: {
    type: Number,
    default: 80
  },
  notifications: {
    type: [String],
    default: []
  },
  resources: {
    type: [{
      title: { type: String, required: true },
      link: { type: String, required: true },
      postedBy: { type: String, default: 'Professor' },
      date: { type: Date, default: Date.now }
    }],
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
