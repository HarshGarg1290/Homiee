import prisma from '../lib/prisma.js';

// Generate a unique flat ID based on flat details
function generateFlatId(flatData) {
  const { City, 'Sub region': subregion, BHK, Budget, Gender } = flatData;
  return `${City}-${subregion}-${BHK}-${Budget}-${Gender}`.replace(/\s+/g, '-').toLowerCase();
}

// Save a flat for a user
export async function saveFlat(req, res) {
  try {
    const { userId, flatData } = req.body;

    if (!userId || !flatData) {
      return res.status(400).json({
        success: false,
        error: 'User ID and flat data are required'
      });
    }

    // Generate unique flat ID
    const flatId = generateFlatId(flatData);

    // Check if flat is already saved
    const existingSave = await prisma.savedFlat.findUnique({
      where: {
        userId_flatId: {
          userId,
          flatId
        }
      }
    });

    if (existingSave) {
      return res.status(409).json({
        success: false,
        error: 'Flat is already saved',
        isSaved: true
      });
    }

    // Save the flat
    const savedFlat = await prisma.savedFlat.create({
      data: {
        userId,
        flatId,
        city: flatData.City || '',
        subregion: flatData['Sub region'] || '',
        bhk: flatData.BHK || '',
        budget: flatData.Budget || '',
        gender: flatData.Gender || '',
        flatmateReq: flatData['Flatmate Req'] || '',
        message: flatData.Message || '',
        sourceId: flatData.id || null
      }
    });

    res.json({
      success: true,
      savedFlat,
      message: 'Flat saved successfully!'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to save flat',
      details: error.message
    });
  }
}

// Remove a saved flat
export async function unsaveFlat(req, res) {
  try {
    const { userId, flatId } = req.body;

    if (!userId || !flatId) {
      return res.status(400).json({
        success: false,
        error: 'User ID and flat ID are required'
      });
    }

    // Delete the saved flat
    const deletedFlat = await prisma.savedFlat.delete({
      where: {
        userId_flatId: {
          userId,
          flatId
        }
      }
    });

    res.json({
      success: true,
      deletedFlat,
      message: 'Flat removed from saved list!'
    });

  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Saved flat not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to remove saved flat',
      details: error.message
    });
  }
}

// Get all saved flats for a user
export async function getSavedFlats(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const savedFlats = await prisma.savedFlat.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      savedFlats,
      total: savedFlats.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve saved flats',
      details: error.message
    });
  }
}

// Check if a flat is saved by user
export async function checkFlatSaved(req, res) {
  try {
    const { userId, flatId } = req.query;

    if (!userId || !flatId) {
      return res.status(400).json({
        success: false,
        error: 'User ID and flat ID are required'
      });
    }

    const savedFlat = await prisma.savedFlat.findUnique({
      where: {
        userId_flatId: {
          userId,
          flatId
        }
      }
    });

    res.json({
      success: true,
      isSaved: !!savedFlat
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to check if flat is saved',
      details: error.message
    });
  }
}
