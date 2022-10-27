const tableName = process.env.SAMPLE_TABLE;
const dynamodb = require('aws-sdk/clients/dynamodb');
// const docClient = new dynamodb.DocumentClient();
const docClient = process.env.AWS_SAM_LOCAL ? new dynamodb.DocumentClient({
    endpoint: "http://host.docker.internal:8000"
  }) : new dynamodb.DocumentClient()

exports.searchTodoHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`search only accept GET method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', JSON.stringify(event));

    const title = event.queryStringParameters.title;
  
    const params = {
      FilterExpression: 'contains (title, :title)',
      ExpressionAttributeValues: {
        ':title': title,
      },
      TableName: tableName,
    };

    const data = await docClient.scan(params).promise();
    const items = data.Items;

    const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, GET"
      },
        body: JSON.stringify(items)
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    
    return response;
}
