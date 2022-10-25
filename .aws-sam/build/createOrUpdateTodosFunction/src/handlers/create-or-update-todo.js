
const tableName = process.env.SAMPLE_TABLE;
const dynamodb = require('aws-sdk/clients/dynamodb');
// const docClient = new dynamodb.DocumentClient();
const docClient = process.env.AWS_SAM_LOCAL ? new dynamodb.DocumentClient({
    endpoint: "http://host.docker.internal:8000"
  }) : new dynamodb.DocumentClient()
const uuid = require('uuid');

exports.createOrUpdateTodosHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    // const data = JSON.parse(event.body);
    // data.id = uuid.v1();
    // data.updatedAt = new Date().getTime();
  
    // // Creates a new item, or replaces an old item with a new item
    // var params = {
    //     TableName : tableName,
    //     Item: data
    // };

    const body = JSON.parse(event.body);
    const id = body.id ? body.id : uuid.v1();
    const name = body.name;

    var params = {
        TableName : tableName,
        Item: { id : id, name: name }
    };

    const result = await docClient.put(params).promise();

    const response = {
        statusCode: 200,
        body: JSON.stringify(params.Item)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
