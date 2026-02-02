import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const TABLE_NAME = process.env.STATS_TABLE;

export const handler = async (event) => {
  const promises = event.Records.map(async (record) => {
    const data = JSON.parse(record.body);
    console.log('STATS', data.shortcode);

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        shortcode: data.shortcode,
        timestamp: data.timestamp,
        ip: data.ip,
        user_agent: data.user_agent,
        referer: data.referer,
      },
    }));
  });

  await Promise.all(promises);
};