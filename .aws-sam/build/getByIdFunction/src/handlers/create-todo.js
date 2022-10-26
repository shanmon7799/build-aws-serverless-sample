const tableName = process.env.SAMPLE_TABLE;
const dynamodb = require('aws-sdk/clients/dynamodb');
// const docClient = new dynamodb.DocumentClient();
const docClient = process.env.AWS_SAM_LOCAL ? new dynamodb.DocumentClient({
    endpoint: "http://host.docker.internal:8000"
  }) : new dynamodb.DocumentClient()
const uuid = require('uuid');

exports.createTodoHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    const body = JSON.parse(event.body);
    const id = body.id ? body.id : uuid.v1();
    const title = body.title;

    var params = {
        TableName : tableName,
        Item: { id : id, title: title }
    };

    const result = await docClient.put(params).promise();

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, POST"
        },
        body: JSON.stringify(params.Item)
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
