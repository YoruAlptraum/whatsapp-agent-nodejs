const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

const initializeRedis = async () => {
  try {
    await redisClient.connect(); // Connect to Redis
    console.log('Connected to Redis');

    // test configs
    // let userState = {
    //   respond: 'true',
    //   lastAPIMessage: '64844as8f4',
    // };

    // await redisClient.hSet('myhash', userState);
    // const res = await redisClient.hGet('myhash', 'lastAPIMessage');
    // console.log('res', res);

    // const all = await redisClient.hGetAll('myhash');
    // for (const key in all) {
    //   console.log(key, all[key]);
    // }

    // await redisClient.flushDb(); // Clear the database
    // redisClient.quit(); // Close the connection

  } catch (err) {
    console.error('Error initializing Redis:', err);
  }
};

// Call async function to initialize Redis
initializeRedis();

module.exports = redisClient;
