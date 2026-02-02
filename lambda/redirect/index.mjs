import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const TABLE_NAME = process.env.DYNAMODB_TABLE;

export const handler = async (event) => {
  const code = event.pathParameters.code;

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

  return {
    statusCode: 302,
    headers: { Location: result.Item.long_url },
  };
};