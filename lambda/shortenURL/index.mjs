import Redis from 'ioredis';
import Hashids from 'hashids/esm/hashids';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  password: process.env.REDIS_PASSWORD,
  connectTimeout: 5000,
  maxRetriesPerRequest: 1,
});

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const TABLE_NAME = process.env.DYNAMODB_TABLE;

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const hashids = new Hashids(process.env.HASHIDS_SALT, 0, ALPHABET);

export const handler = async (event) => {
  try {
    const { url } = JSON.parse(event.body);

    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'URL is required' }),
      };
    }

    // Redis only for ID generation
    const id = await redis.incr('url:counter');
    const shortCode = hashids.encode(id);
    console.log('SHORTEN', shortCode, url);

    // Store in DynamoDB
    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        shortcode: shortCode,
        long_url: url,
        created_at: Date.now(),
      },
    }));

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
