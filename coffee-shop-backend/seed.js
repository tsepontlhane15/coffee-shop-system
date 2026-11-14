require('dotenv').config();
const { connectRedis, redisClient } = require('./config/redis');
const { generateId } = require('./utils/generateId');

const sampleMenu = [
  {
    name: 'Espresso',
    description: 'Strong and rich single shot of espresso',
    price: 25.00,
    category: 'coffee',
    available: true,
  },
  {
    name: 'Americano',
    description: 'Espresso diluted with hot water',
    price: 30.00,
    category: 'coffee',
    available: true,
  },
  {
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and thick foam',
    price: 40.00,
    category: 'coffee',
    available: true,
  },
  {
    name: 'Cafe Latte',
    description: 'Espresso with steamed milk and light foam',
    price: 42.00,
    category: 'coffee',
    available: true,
  },
  {
    name: 'Mocha',
    description: 'Espresso with chocolate and steamed milk',
    price: 45.00,
    category: 'coffee',
    available: true,
  },
  {
    name: 'Green Tea',
    description: 'Refreshing traditional green tea',
    price: 28.00,
    category: 'tea',
    available: true,
  },
  {
    name: 'Chai Latte',
    description: 'Spiced tea with steamed milk',
    price: 38.00,
    category: 'tea',
    available: true,
  },
  {
    name: 'Croissant',
    description: 'Buttery and flaky French pastry',
    price: 25.00,
    category: 'pastry',
    available: true,
  },
  {
    name: 'Chocolate Muffin',
    description: 'Rich chocolate muffin with chocolate chips',
    price: 30.00,
    category: 'pastry',
    available: true,
  },
  {
    name: 'Blueberry Scone',
    description: 'Freshly baked scone with blueberries',
    price: 28.00,
    category: 'pastry',
    available: true,
  },
];

async function seed() {
  try {
    await connectRedis();
    console.log('Connected to Redis');

    // Clear existing menu items (optional)
    const existingKeys = await redisClient.keys('menu:*');
    if (existingKeys.length > 0) {
      await redisClient.del(existingKeys);
      console.log(`Deleted ${existingKeys.length} existing menu items`);
    }

    // Add sample items
    for (const item of sampleMenu) {
      const id = generateId('menu');
      const menuItem = {
        id,
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await redisClient.set(`menu:${id}`, JSON.stringify(menuItem));
      console.log(`Added: ${menuItem.name} (${id})`);
    }

    console.log('\nSeeding completed successfully!');
    console.log(`Total items added: ${sampleMenu.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();