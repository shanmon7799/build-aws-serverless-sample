const tableName = process.env.SAMPLE_TABLE;
const dynamodb = require('aws-sdk/clients/dynamodb');
// const docClient = new dynamodb.DocumentClient();
const docClient = process.env.AWS_SAM_LOCAL ? new dynamodb.DocumentClient({
    endpoint: "http://host.docker.internal:8000"
  }) : new dynamodb.DocumentClient()

exports.deleteTodoHandler = async (event) => {
    if (event.httpMethod !== 'DELETE') {
        throw new Error(`delete todo only accept DELETE method, you tried: ${event.httpMethod}`);
    }
    
    const id = event.pathParameters.id;
    const params = {
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
