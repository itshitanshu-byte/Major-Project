import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail, createUser, getUserById, checkMockMode } from '../utils/db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  const selectedRole = role === 'teacher' ? 'teacher' : 'student';

  try {
    // Check for existing user
    let user = await getUserByEmail(email);
    if (user) {
      return res.status(400).json({ msg: 'User already exists with this email' });
    }

    // Salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await createUser({
      username,
      email,
      password: hashedPassword,
      role: selectedRole
    });

    // Sign JWT
    const payload = {
      user: {
        id: newUser._id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'super_secret_token_123_antigravity_prediction_system',
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            isMockDB: checkMockMode()
          }
        });
      }
    );
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // Check for existing user
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Sign JWT
    const payload = {
      user: {
        id: user._id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'super_secret_token_123_antigravity_prediction_system',
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            isMockDB: checkMockMode()
          }
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/auth/me
// @desc    Get user data
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Convert to JSON and remove password if it's not a lean document
    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;
    
    res.json({
      ...userObj,
      isMockDB: checkMockMode()
    });
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).send('Server error');
  }
});

export default router;
