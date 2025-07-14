import prisma from '../lib/prisma.js';

export async function getPersonalizedRecommendations(req, res) {
  try {
    const userId = req.userId;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        city: true,
        locality: true,
        interests: true,
        hobbies: true,
        sportsActivities: true,
        musicGenres: true,
        personalityType: true,
        socialStyle: true,
        weekendStyle: true,
        age: true
      }
    });

    if (!user || !user.city) {
      return res.status(400).json({
        success: false,
        message: 'User profile incomplete. Please update your city information.'
      });
    }

    const places = await getPersonalizedPlaces(user);
    const events = await getPersonalizedEvents(user);
    const activities = await getPersonalizedActivities(user);

    const allRecommendations = [
      ...places.slice(0, 6).map(place => ({ ...place, type: 'places' })),
      ...events.slice(0, 6).map(event => ({ ...event, type: 'events' })),
      ...activities.slice(0, 6).map(activity => ({ ...activity, type: 'activities' }))
    ];

    res.json({
      success: true,
      data: allRecommendations
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations'
    });
  }
}

export async function searchNeighborhood(req, res) {
  try {
    const userId = req.userId;
    const { q: query, type, city, locality, category } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    let searchCity = city;
    if (!searchCity) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { city: true, locality: true }
      });
      searchCity = user?.city;
    }

    const results = {
      places: [],
      events: [],
      activities: []
    };

    const searchQuery = query.toLowerCase().trim();

    if (!type || type === 'places') {
      results.places = await prisma.place.findMany({
        where: {
          AND: [
            searchCity ? { city: searchCity } : {},
            locality ? { locality: locality } : {},
            category ? { category: category } : {},
            {
              OR: [
                { name: { contains: searchQuery, mode: 'insensitive' } },
                { type: { contains: searchQuery, mode: 'insensitive' } },
                { category: { contains: searchQuery, mode: 'insensitive' } },
                { description: { contains: searchQuery, mode: 'insensitive' } },
                { tags: { hasSome: [searchQuery] } }
              ]
            }
          ]
        },
        orderBy: [
          { rating: 'desc' },
          { isVerified: 'desc' },
          { createdAt: 'desc' }
        ],
        take: 20
      });
    }

    if (!type || type === 'events') {
      results.events = await prisma.event.findMany({
        where: {
          AND: [
            { isActive: true },
            { startDate: { gte: new Date() } },
            searchCity ? { city: searchCity } : {},
            locality ? { locality: locality } : {},
            category ? { category: category } : {},
            {
              OR: [
                { title: { contains: searchQuery, mode: 'insensitive' } },
                { type: { contains: searchQuery, mode: 'insensitive' } },
                { category: { contains: searchQuery, mode: 'insensitive' } },
                { description: { contains: searchQuery, mode: 'insensitive' } },
                { tags: { hasSome: [searchQuery] } },
                { venue: { contains: searchQuery, mode: 'insensitive' } }
              ]
            }
          ]
        },
        orderBy: [
          { startDate: 'asc' },
          { createdAt: 'desc' }
        ],
        take: 20
      });
    }

    if (!type || type === 'activities') {
      results.activities = await prisma.activity.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { type: { contains: searchQuery, mode: 'insensitive' } },
            { category: { contains: searchQuery, mode: 'insensitive' } },
            { description: { contains: searchQuery, mode: 'insensitive' } },
            { tags: { hasSome: [searchQuery] } },
            { relatedInterests: { hasSome: [searchQuery] } }
          ]
        },
        orderBy: [
          { isPopular: 'desc' },
          { createdAt: 'desc' }
        ],
        take: 20
      });
    }

    res.json({
      success: true,
      data: {
        query: query,
        results,
        total: results.places.length + results.events.length + results.activities.length
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
}

export async function getPlacesByCategory(req, res) {
  try {
    const userId = req.userId;
    const { category, city, locality } = req.query;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }

    let searchCity = city;
    if (!searchCity) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { city: true }
      });
      searchCity = user?.city;
    }

    const places = await prisma.place.findMany({
      where: {
        AND: [
          { category: category },
          searchCity ? { city: searchCity } : {},
          locality ? { locality: locality } : {}
        ]
      },
      orderBy: [
        { rating: 'desc' },
        { isVerified: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({
      success: true,
      data: {
        category,
        places,
        total: places.length
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get places'
    });
  }
}

export async function getFilteredContent(req, res) {
  try {
    const userId = req.userId;
    const { type, city, locality, category } = req.query;

    if (!type || !['places', 'events', 'activities'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Valid type is required (places, events, or activities)'
      });
    }

    let searchCity = city;
    if (!searchCity) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { city: true, locality: true }
      });
      searchCity = user?.city;
    }

    const results = {
      places: [],
      events: [],
      activities: []
    };

    if (type === 'places') {
      results.places = await prisma.place.findMany({
        where: {
          AND: [
            searchCity ? { city: searchCity } : {},
            locality ? { locality: locality } : {},
            category ? { category: category } : {}
          ]
        },
        orderBy: [
          { rating: 'desc' },
          { isVerified: 'desc' },
          { createdAt: 'desc' }
        ],
        take: 50
      });
    } else if (type === 'events') {
      results.events = await prisma.event.findMany({
        where: {
          AND: [
            { isActive: true },
            { startDate: { gte: new Date() } },
            searchCity ? { city: searchCity } : {},
            locality ? { locality: locality } : {},
            category ? { category: category } : {}
          ]
        },
        orderBy: [
          { startDate: 'asc' },
          { createdAt: 'desc' }
        ],
        take: 50
      });
    } else if (type === 'activities') {
      results.activities = await prisma.activity.findMany({
        where: {
          AND: [
            category ? { category: category } : {}
          ]
        },
        orderBy: [
          { isPopular: 'desc' },
          { createdAt: 'desc' }
        ],
        take: 50
      });
    }

    const allResults = [
      ...results.places.map(place => ({ ...place, type: 'places' })),
      ...results.events.map(event => ({ ...event, type: 'events' })),
      ...results.activities.map(activity => ({ ...activity, type: 'activities' }))
    ];

    res.json({
      success: true,
      data: {
        type,
        results: allResults,
        total: allResults.length,
        filters: {
          city: searchCity,
          locality,
          category
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get filtered content'
    });
  }
}

export async function getAllContent(req, res) {
  try {
    const userId = req.userId;
    const { city, locality } = req.query;

    let searchCity = city;
    if (!searchCity) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { city: true, locality: true }
      });
      searchCity = user?.city;
    }

    if (!searchCity) {
      return res.status(400).json({
        success: false,
        message: 'City information is required. Please update your profile.'
      });
    }

    const places = await prisma.place.findMany({
      where: {
        AND: [
          { city: searchCity },
          locality ? { locality: locality } : {}
        ]
      },
      orderBy: [
        { rating: 'desc' },
        { isVerified: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 20
    });

    const events = await prisma.event.findMany({
      where: {
        AND: [
          { isActive: true },
          { startDate: { gte: new Date() } },
          { city: searchCity },
          locality ? { locality: locality } : {}
        ]
      },
      orderBy: [
        { startDate: 'asc' },
        { createdAt: 'desc' }
      ],
      take: 20
    });

    const activities = await prisma.activity.findMany({
      orderBy: [
        { isPopular: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 20
    });

    const allResults = [
      ...places.map(place => ({ ...place, type: 'places' })),
      ...events.map(event => ({ ...event, type: 'events' })),
      ...activities.map(activity => ({ ...activity, type: 'activities' }))
    ];

    res.json({
      success: true,
      data: {
        results: allResults,
        total: allResults.length,
        city: searchCity,
        locality
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get all content'
    });
  }
}

async function getPersonalizedPlaces(user) {
  const conditions = [];
  
  if (user.city) {
    conditions.push({ city: user.city });
  }
  
  const userTags = [
    ...user.interests || [],
    ...user.hobbies || [],
    ...user.sportsActivities || []
  ].map(tag => tag.toLowerCase());

  if (userTags.length > 0) {
    conditions.push({
      OR: [
        { tags: { hasSome: userTags } },
        { category: { in: userTags } }
      ]
    });
  }

  const places = await prisma.place.findMany({
    where: conditions.length > 0 ? { AND: conditions } : {},
    orderBy: [
      { rating: 'desc' },
      { isVerified: 'desc' },
      { createdAt: 'desc' }
    ],
    take: 10
  });

  return places;
}

async function getPersonalizedEvents(user) {
  const conditions = [
    { isActive: true },
    { startDate: { gte: new Date() } }
  ];
  
  if (user.city) {
    conditions.push({ city: user.city });
  }

  const userTags = [
    ...user.interests || [],
    ...user.musicGenres || [],
    ...user.hobbies || []
  ].map(tag => tag.toLowerCase());

  if (userTags.length > 0) {
    conditions.push({
      OR: [
        { tags: { hasSome: userTags } },
        { category: { in: userTags } },
        { type: { in: userTags } }
      ]
    });
  }

  const events = await prisma.event.findMany({
    where: { AND: conditions },
    orderBy: [
      { startDate: 'asc' },
      { createdAt: 'desc' }
    ],
    take: 10
  });

  return events;
}

async function getPersonalizedActivities(user) {
  const conditions = [];

  const userInterests = [
    ...user.interests || [],
    ...user.hobbies || [],
    ...user.sportsActivities || []
  ].map(interest => interest.toLowerCase());

  if (userInterests.length > 0) {
    conditions.push({
      OR: [
        { relatedInterests: { hasSome: userInterests } },
        { tags: { hasSome: userInterests } },
        { category: { in: userInterests } }
      ]
    });
  }

  const activities = await prisma.activity.findMany({
    where: conditions.length > 0 ? { AND: conditions } : {},
    orderBy: [
      { isPopular: 'desc' },
      { createdAt: 'desc' }
    ],
    take: 10
  });

  return activities;
}
