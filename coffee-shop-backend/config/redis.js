const Redis = require('ioredis');
require('dotenv').config();

const redisClient = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  tls: process.env.REDIS_URL?.startsWith('rediss://') ? {} : undefined,
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err.message);
});

async function connectRedis() {
  return redisClient;
}

module.exports = { redisClient, connectRedis };