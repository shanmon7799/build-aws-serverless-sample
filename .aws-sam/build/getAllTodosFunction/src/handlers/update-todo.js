const tableName = process.env.SAMPLE_TABLE;
const dynamodb = require('aws-sdk/clients/dynamodb');
// const docClient = new dynamodb.DocumentClient();
const docClient = process.env.AWS_SAM_LOCAL ? new dynamodb.DocumentClient({
    endpoint: "http://host.docker.internal:8000"
  }) : new dynamodb.DocumentClient()
// const uuid = require('uuid');

exports.updateTodoHandler = async (event) => {
    if (event.httpMethod !== 'PUT') {
        throw new Error(`postMethod only accepts PUT method, you tried: ${event.httpMethod} method.`);
    }

    console.info('received:', JSON.stringify(event));
    
    const body = JSON.parse(event.body);
    const title = body.title;
    const id = event.pathParameters.id;

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
            "Access-Control-Allow-Methods": "OPTIONS, PUT"
        },
        body: JSON.stringify(params.Item)
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
