import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const sqsClient = new SQSClient({});

const TABLE_NAME = process.env.DYNAMODB_TABLE;
const QUEUE_URL = process.env.SQS_QUEUE_URL;

export const handler = async (event) => {
  const code = event.pathParameters.code;
  console.log('REDIRECT', code);

  const result = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { shortcode: code },
  }));

  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'URL not found' }),
    };
  }

  // Async: send stats to SQS (fire and forget)
  sqsClient.send(new SendMessageCommand({
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify({
      shortcode: code,
      timestamp: Date.now(),
      ip: event.requestContext?.http?.sourceIp || null,
      user_agent: event.headers?.['user-agent'] || null,
      referer: event.headers?.referer || null,
    }),
  })).catch(() => {}); // Ignore errors, don't block redirect

  return {
    statusCode: 302,
    headers: { Location: result.Item.long_url },
  };
};