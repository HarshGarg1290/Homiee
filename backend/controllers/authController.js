import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};
// Register new user
export const register = async (req, res) => {
  try {
    const { email, password, name, profile } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);    const userData = {
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
    };
    // Add profile data if provided
    if (profile) {
      Object.assign(userData, profile);
    }    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        age: true,
        gender: true,
        city: true,
        locality: true,
        budget: true,
        createdAt: true
      }
    });    const token = generateToken(user.id);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      details: error.message
    });
  }
};
// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        firstName: true,
        lastName: true,
        age: true,
        gender: true,
        city: true,
        locality: true,
        budget: true,
        createdAt: true
      }
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }    const { password: _, ...userWithoutPassword } = user;    const token = generateToken(user.id);
    console.log('✅ User logged in successfully:', user.email);
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      details: error.message
    });
  }
};export const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    console.log('👤 Getting profile for user:', userId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        age: true,
        gender: true,
        profession: true,
        bio: true,
        phone: true,
        city: true,
        locality: true,
        budget: true,
        moveInDate: true,
        sleepPattern: true,
        dietaryPrefs: true,
        cleanliness: true,
        smokingHabits: true,
        drinkingHabits: true,
        personalityType: true,
        socialStyle: true,
        hostingStyle: true,
        weekendStyle: true,
        hobbies: true,
        interests: true,
        musicGenres: true,
        sportsActivities: true,
        languagesSpoken: true,
        petOwnership: true,
        petPreference: true,
        createdAt: true,
        updatedAt: true
      }
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      details: error.message
    });
  }
};
// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;    const profileData = req.body;
    console.log('📝 Updating profile for user:', userId);
    const { password, email, id, createdAt, updatedAt, ...updateData } = profileData;
    // Convert data types to match Prisma schema
    if (updateData.age) {
      updateData.age = parseInt(updateData.age);
    }
    if (updateData.cleanliness) {
      updateData.cleanliness = parseInt(updateData.cleanliness);
    }
    // Handle moveInDate conversion and validation
    if (updateData.moveInDate !== undefined) {
      // If it's an empty string, null, or undefined, set to null
      if (!updateData.moveInDate || updateData.moveInDate === '' || updateData.moveInDate === null) {
        updateData.moveInDate = null;
      } else {
        // Handle date string (YYYY-MM-DD format from HTML date input)
        if (typeof updateData.moveInDate === 'string') {
          // Check if it's a valid date string
          if (/^\d{4}-\d{2}-\d{2}$/.test(updateData.moveInDate)) {
            // Convert to proper DateTime with UTC timezone
            const parsedDate = new Date(updateData.moveInDate + 'T00:00:00.000Z');
            if (!isNaN(parsedDate.getTime())) {
              updateData.moveInDate = parsedDate;
            } else {
              updateData.moveInDate = null;
            }
          } else {
            // Try to parse other date formats
            const parsedDate = new Date(updateData.moveInDate);
            if (!isNaN(parsedDate.getTime())) {
              updateData.moveInDate = parsedDate;
            } else {
              updateData.moveInDate = null;
            }
          }
        } else if (updateData.moveInDate instanceof Date) {
          // Already a Date object
          if (!isNaN(updateData.moveInDate.getTime())) {
            // Valid date, keep as is
          } else {
            updateData.moveInDate = null;
          }
        } else {
          // Unknown format, set to null
          updateData.moveInDate = null;
        }
      }
    }
    
    console.log('🔄 Processed update data:', { 
      ...updateData, 
      moveInDate: updateData.moveInDate ? 'DATE_OBJECT' : updateData.moveInDate 
    });
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        age: true,
        gender: true,
        profession: true,
        bio: true,
        phone: true,
        city: true,
        locality: true,
        budget: true,
        moveInDate: true,
        sleepPattern: true,
        dietaryPrefs: true,
        cleanliness: true,
        smokingHabits: true,
        drinkingHabits: true,
        personalityType: true,
        socialStyle: true,
        hostingStyle: true,
        weekendStyle: true,
        hobbies: true,
        interests: true,
        musicGenres: true,
        sportsActivities: true,
        languagesSpoken: true,
        petOwnership: true,
        petPreference: true,
        createdAt: true,
        updatedAt: true
      }
    });
    console.log('✅ Profile updated successfully for:', updatedUser.email);
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      details: error.message
    });
  }
};