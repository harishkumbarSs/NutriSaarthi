/**
 * Food Database Service
 * =====================
 * Integrates with USDA FoodData Central API and local food database.
 * 
 * Features:
 * - Search foods by name
 * - Get nutrition info by food ID
 * - Cache common foods in local database
 * - Fallback to local data if API is unavailable
 */

const axios = require('axios');

// USDA FoodData Central API
const USDA_API_BASE = 'https://api.nal.usda.gov/fdc/v1';
const USDA_API_KEY = process.env.USDA_API_KEY || 'DEMO_KEY';

// Common Indian foods database (fallback/supplement)
const COMMON_FOODS = [
  {
    id: 'local_1',
    name: 'Roti (Chapati)',
    brand: 'Homemade',
    servingSize: 1,
    servingUnit: 'piece',
    servingWeight: 40,
    calories: 104,
    protein: 3,
    carbs: 18,
    fat: 2.5,
    fiber: 2,
    sodium: 120,
    category: 'grains',
  },
  {
    id: 'local_2',
    name: 'Dal (Lentil Curry)',
    brand: 'Homemade',
    servingSize: 1,
    servingUnit: 'cup',
    servingWeight: 200,
    calories: 198,
    protein: 12,
    carbs: 30,
    fat: 4,
    fiber: 8,
    sodium: 450,
    category: 'legumes',
  },
  {
    id: 'local_3',
    name: 'Basmati Rice (Cooked)',
    brand: 'Generic',
    servingSize: 1,
    servingUnit: 'cup',
    servingWeight: 185,
    calories: 210,
    protein: 4.5,
    carbs: 45,
    fat: 0.5,
    fiber: 0.6,
    sodium: 2,
    category: 'grains',
  },
  {
    id: 'local_4',
    name: 'Paneer (Cottage Cheese)',
    brand: 'Amul',
    servingSize: 100,
    servingUnit: 'g',
    servingWeight: 100,
    calories: 265,
    protein: 18,
    carbs: 3.5,
    fat: 20,
    fiber: 0,
    sodium: 25,
    category: 'dairy',
  },
  {
    id: 'local_5',
    name: 'Samosa',
    brand: 'Street Food',
    servingSize: 1,
    servingUnit: 'piece',
    servingWeight: 80,
    calories: 262,
    protein: 4,
    carbs: 28,
    fat: 15,
    fiber: 2,
    sodium: 320,
    category: 'snacks',
  },
  {
    id: 'local_6',
    name: 'Chicken Biryani',
    brand: 'Restaurant',
    servingSize: 1,
    servingUnit: 'plate',
    servingWeight: 350,
    calories: 490,
    protein: 28,
    carbs: 55,
    fat: 18,
    fiber: 2,
    sodium: 890,
    category: 'mixed-dish',
  },
  {
    id: 'local_7',
    name: 'Masala Chai',
    brand: 'Homemade',
    servingSize: 1,
    servingUnit: 'cup',
    servingWeight: 200,
    calories: 110,
    protein: 3,
    carbs: 15,
    fat: 4,
    fiber: 0,
    sodium: 45,
    category: 'beverages',
  },
  {
    id: 'local_8',
    name: 'Idli',
    brand: 'Homemade',
    servingSize: 2,
    servingUnit: 'pieces',
    servingWeight: 80,
    calories: 78,
    protein: 2,
    carbs: 16,
    fat: 0.2,
    fiber: 0.6,
    sodium: 180,
    category: 'grains',
  },
  {
    id: 'local_9',
    name: 'Dosa',
    brand: 'Homemade',
    servingSize: 1,
    servingUnit: 'piece',
    servingWeight: 100,
    calories: 168,
    protein: 4,
    carbs: 27,
    fat: 5,
    fiber: 1,
    sodium: 280,
    category: 'grains',
  },
  {
    id: 'local_10',
    name: 'Butter Chicken',
    brand: 'Restaurant',
    servingSize: 1,
    servingUnit: 'serving',
    servingWeight: 250,
    calories: 438,
    protein: 32,
    carbs: 12,
    fat: 30,
    fiber: 2,
    sodium: 820,
    category: 'protein',
  },
  {
    id: 'local_11',
    name: 'Banana',
    brand: 'Fresh',
    servingSize: 1,
    servingUnit: 'medium',
    servingWeight: 118,
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    fiber: 3.1,
    sodium: 1,
    category: 'fruits',
  },
  {
    id: 'local_12',
    name: 'Apple',
    brand: 'Fresh',
    servingSize: 1,
    servingUnit: 'medium',
    servingWeight: 182,
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    fiber: 4.4,
    sodium: 2,
    category: 'fruits',
  },
  {
    id: 'local_13',
    name: 'Egg (Boiled)',
    brand: 'Fresh',
    servingSize: 1,
    servingUnit: 'large',
    servingWeight: 50,
    calories: 78,
    protein: 6,
    carbs: 0.6,
    fat: 5,
    fiber: 0,
    sodium: 62,
    category: 'protein',
  },
  {
    id: 'local_14',
    name: 'Milk (Full Cream)',
    brand: 'Amul',
    servingSize: 1,
    servingUnit: 'glass',
    servingWeight: 244,
    calories: 146,
    protein: 8,
    carbs: 11,
    fat: 8,
    fiber: 0,
    sodium: 98,
    category: 'dairy',
  },
  {
    id: 'local_15',
    name: 'Curd/Yogurt',
    brand: 'Homemade',
    servingSize: 1,
    servingUnit: 'cup',
    servingWeight: 150,
    calories: 98,
    protein: 8,
    carbs: 11,
    fat: 2,
    fiber: 0,
    sodium: 113,
    category: 'dairy',
  },
];

/**
 * Transform USDA food data to our format
 */
const transformUSDAFood = (food) => {
  const nutrients = food.foodNutrients || [];
  
  const getNutrient = (name) => {
    const nutrient = nutrients.find(n => 
      n.nutrientName?.toLowerCase().includes(name.toLowerCase())
    );
    return nutrient?.value || 0;
  };

  return {
    id: `usda_${food.fdcId}`,
    name: food.description,
    brand: food.brandOwner || food.brandName || 'Generic',
    servingSize: food.servingSize || 100,
    servingUnit: food.servingSizeUnit || 'g',
    servingWeight: food.servingSize || 100,
    calories: Math.round(getNutrient('energy')),
    protein: Math.round(getNutrient('protein') * 10) / 10,
    carbs: Math.round(getNutrient('carbohydrate') * 10) / 10,
    fat: Math.round(getNutrient('total lipid') * 10) / 10,
    fiber: Math.round(getNutrient('fiber') * 10) / 10,
    sodium: Math.round(getNutrient('sodium')),
    category: food.foodCategory || 'other',
    source: 'usda',
  };
};

/**
 * Search foods in USDA database
 */
const searchUSDA = async (query, limit = 25) => {
  try {
    const response = await axios.post(
      `${USDA_API_BASE}/foods/search?api_key=${USDA_API_KEY}`,
      {
        query,
        pageSize: limit,
        dataType: ['Foundation', 'Survey (FNDDS)', 'Branded'],
      },
      { timeout: 5000 }
    );

    return response.data.foods?.map(transformUSDAFood) || [];
  } catch (error) {
    console.error('USDA API Error:', error.message);
    return [];
  }
};

/**
 * Get food details by ID from USDA
 */
const getUSDAFood = async (fdcId) => {
  try {
    const response = await axios.get(
      `${USDA_API_BASE}/food/${fdcId}?api_key=${USDA_API_KEY}`,
      { timeout: 5000 }
    );

    return transformUSDAFood(response.data);
  } catch (error) {
    console.error('USDA API Error:', error.message);
    return null;
  }
};

/**
 * Search local foods database
 */
const searchLocal = (query, limit = 25) => {
  const lowerQuery = query.toLowerCase();
  
  return COMMON_FOODS
    .filter(food => 
      food.name.toLowerCase().includes(lowerQuery) ||
      food.category.toLowerCase().includes(lowerQuery)
    )
    .slice(0, limit)
    .map(food => ({ ...food, source: 'local' }));
};

/**
 * Combined search - local first, then USDA
 */
const searchFoods = async (query, options = {}) => {
  const { limit = 25, includeUSDA = true } = options;
  
  // Search local database first (faster, more relevant for Indian foods)
  const localResults = searchLocal(query, limit);
  
  // If we have enough local results or USDA is disabled, return local only
  if (localResults.length >= limit || !includeUSDA) {
    return {
      foods: localResults,
      totalResults: localResults.length,
      sources: ['local'],
    };
  }
  
  // Search USDA for remaining slots
  const remaining = limit - localResults.length;
  const usdaResults = await searchUSDA(query, remaining);
  
  // Combine and dedupe by name
  const combined = [...localResults];
  const localNames = new Set(localResults.map(f => f.name.toLowerCase()));
  
  for (const food of usdaResults) {
    if (!localNames.has(food.name.toLowerCase())) {
      combined.push(food);
    }
  }
  
  return {
    foods: combined.slice(0, limit),
    totalResults: combined.length,
    sources: usdaResults.length > 0 ? ['local', 'usda'] : ['local'],
  };
};

/**
 * Get food by ID (local or USDA)
 */
const getFoodById = async (id) => {
  // Check if it's a local food
  if (id.startsWith('local_')) {
    const food = COMMON_FOODS.find(f => f.id === id);
    return food ? { ...food, source: 'local' } : null;
  }
  
  // Check if it's a USDA food
  if (id.startsWith('usda_')) {
    const fdcId = id.replace('usda_', '');
    return await getUSDAFood(fdcId);
  }
  
  return null;
};

/**
 * Get food categories
 */
const getCategories = () => {
  const categories = new Set(COMMON_FOODS.map(f => f.category));
  return Array.from(categories).sort();
};

/**
 * Get foods by category
 */
const getFoodsByCategory = (category) => {
  return COMMON_FOODS
    .filter(f => f.category.toLowerCase() === category.toLowerCase())
    .map(food => ({ ...food, source: 'local' }));
};

module.exports = {
  searchFoods,
  getFoodById,
  getCategories,
  getFoodsByCategory,
  COMMON_FOODS,
};

