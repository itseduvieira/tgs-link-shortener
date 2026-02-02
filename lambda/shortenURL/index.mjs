import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  password: process.env.REDIS_PASSWORD,
  connectTimeout: 5000,
  maxRetriesPerRequest: 1,
});

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function toBase62(num) {
  if (num === 0) return CHARS[0];
  let result = '';
  while (num > 0) {
    result = CHARS[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

export const handler = async (event) => {
  try {
    const { url } = JSON.parse(event.body);
    
    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'URL is required' }),
      };
    }

    const id = await redis.incr('url:counter');
    const shortCode = toBase62(id);

    await redis.set(`url:${shortCode}`, url);

    return {
      statusCode: 201,
      body: JSON.stringify({
        shortUrl: `https://tgs.lol/${shortCode}`,
        code: shortCode,
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
