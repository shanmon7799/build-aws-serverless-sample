const tableName = process.env.SAMPLE_TABLE;
const dynamodb = require('aws-sdk/clients/dynamodb');
// const docClient = new dynamodb.DocumentClient();
const docClient = process.env.AWS_SAM_LOCAL ? new dynamodb.DocumentClient({
    endpoint: "http://host.docker.internal:8000"
  }) : new dynamodb.DocumentClient()

exports.deleteHandler = async (event) => {
    if (event.httpMethod !== 'DELETE') {
        throw new Error(`delete todo only accept DELETE method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);
    
    const id = event.pathParameters.id;
    var params = {
      TableName : tableName,
      Key: { id: id },
    };
    const result = await docClient.delete(params).promise();

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, DELETE"
        },
        body: JSON.stringify(params.Key)
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    
    return response;
}
