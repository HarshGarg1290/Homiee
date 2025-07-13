import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register User
export const register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, name, profile } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Prepare user data
    const userData = {
      email,
      password: hashedPassword,
      name
    };

    // Add profile data if provided
    if (profile) {
      // Basic Information
      if (profile.firstName) userData.firstName = profile.firstName;
      if (profile.lastName) userData.lastName = profile.lastName;
      if (profile.phone) userData.phone = profile.phone;
      if (profile.age) userData.age = parseInt(profile.age);
      if (profile.gender) userData.gender = profile.gender;
      if (profile.profession) userData.profession = profile.profession;
      if (profile.bio) userData.bio = profile.bio;
      
      // Location & Budget (optimized - removed duplicates)
      if (profile.city) userData.city = profile.city;
      if (profile.locality) userData.locality = profile.locality;
      if (profile.budget) userData.budget = profile.budget;
      if (profile.moveInDate) {
        // Convert string to DateTime if needed
        userData.moveInDate = typeof profile.moveInDate === 'string' 
          ? new Date(profile.moveInDate) 
          : profile.moveInDate;
      }
      
      // Lifestyle Preferences (optimized)
      if (profile.sleepPattern) userData.sleepPattern = profile.sleepPattern;
      if (profile.dietaryPrefs) userData.dietaryPrefs = profile.dietaryPrefs;
      if (profile.cleanliness && typeof profile.cleanliness === 'number') userData.cleanliness = profile.cleanliness;
      
      // Substance Use (consolidated)
      if (profile.smokingHabits) userData.smokingHabits = profile.smokingHabits;
      if (profile.drinkingHabits) userData.drinkingHabits = profile.drinkingHabits;
      
      // Social & Personality (optimized)
      if (profile.personalityType) userData.personalityType = profile.personalityType;
      if (profile.socialStyle) userData.socialStyle = profile.socialStyle;
      if (profile.hostingStyle) userData.hostingStyle = profile.hostingStyle;
      if (profile.weekendStyle) userData.weekendStyle = profile.weekendStyle;
      
      // Interests & Hobbies
      if (profile.hobbies && Array.isArray(profile.hobbies)) userData.hobbies = profile.hobbies;
      if (profile.interests && Array.isArray(profile.interests)) userData.interests = profile.interests;
      if (profile.musicGenres && Array.isArray(profile.musicGenres)) userData.musicGenres = profile.musicGenres;
      if (profile.sportsActivities && Array.isArray(profile.sportsActivities)) userData.sportsActivities = profile.sportsActivities;
      if (profile.languagesSpoken && Array.isArray(profile.languagesSpoken)) userData.languagesSpoken = profile.languagesSpoken;
      
      // Pet Preferences (consolidated)
      if (profile.petOwnership) userData.petOwnership = profile.petOwnership;
      if (profile.petPreference) userData.petPreference = profile.petPreference;
    }

    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        phone: true,
        age: true,
        gender: true,
        profession: true,
        bio: true,
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
        createdAt: true
      }
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get User Profile
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        phone: true,
        age: true,
        gender: true,
        profession: true,
        bio: true,
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
      data: { user }
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const profileData = req.body;
    const updateData = {};

    // Basic Information
    if (profileData.firstName) updateData.firstName = profileData.firstName;
    if (profileData.lastName) updateData.lastName = profileData.lastName;
    if (profileData.phone) updateData.phone = profileData.phone;
    if (profileData.age) updateData.age = parseInt(profileData.age);
    if (profileData.gender) updateData.gender = profileData.gender;
    if (profileData.profession) updateData.profession = profileData.profession;
    if (profileData.bio) updateData.bio = profileData.bio;
    
    // Location & Budget (optimized - removed duplicates)
    if (profileData.city) updateData.city = profileData.city;
    if (profileData.locality) updateData.locality = profileData.locality;
    if (profileData.budget) updateData.budget = profileData.budget;
    if (profileData.moveInDate) {
      // Convert string to DateTime if needed
      updateData.moveInDate = typeof profileData.moveInDate === 'string' 
        ? new Date(profileData.moveInDate) 
        : profileData.moveInDate;
    }
    
    // Lifestyle Preferences (optimized)
    if (profileData.sleepPattern) updateData.sleepPattern = profileData.sleepPattern;
    if (profileData.dietaryPrefs) updateData.dietaryPrefs = profileData.dietaryPrefs;
    if (profileData.cleanliness && typeof profileData.cleanliness === 'number') updateData.cleanliness = profileData.cleanliness;
    
    // Substance Use (consolidated)
    if (profileData.smokingHabits) updateData.smokingHabits = profileData.smokingHabits;
    if (profileData.drinkingHabits) updateData.drinkingHabits = profileData.drinkingHabits;
    
    // Social & Personality (optimized)
    if (profileData.personalityType) updateData.personalityType = profileData.personalityType;
    if (profileData.socialStyle) updateData.socialStyle = profileData.socialStyle;
    if (profileData.hostingStyle) updateData.hostingStyle = profileData.hostingStyle;
    if (profileData.weekendStyle) updateData.weekendStyle = profileData.weekendStyle;
    
    // Interests & Hobbies
    if (profileData.hobbies && Array.isArray(profileData.hobbies)) updateData.hobbies = profileData.hobbies;
    if (profileData.interests && Array.isArray(profileData.interests)) updateData.interests = profileData.interests;
    if (profileData.musicGenres && Array.isArray(profileData.musicGenres)) updateData.musicGenres = profileData.musicGenres;
    if (profileData.sportsActivities && Array.isArray(profileData.sportsActivities)) updateData.sportsActivities = profileData.sportsActivities;
    if (profileData.languagesSpoken && Array.isArray(profileData.languagesSpoken)) updateData.languagesSpoken = profileData.languagesSpoken;
    
    // Pet Preferences (consolidated)
    if (profileData.petOwnership) updateData.petOwnership = profileData.petOwnership;
    if (profileData.petPreference) updateData.petPreference = profileData.petPreference;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        phone: true,
        age: true,
        gender: true,
        profession: true,
        bio: true,
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
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
