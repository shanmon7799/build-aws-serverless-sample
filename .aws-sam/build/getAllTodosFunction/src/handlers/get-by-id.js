const tableName = process.env.SAMPLE_TABLE;
const dynamodb = require('aws-sdk/clients/dynamodb');
// const docClient = new dynamodb.DocumentClient();
const docClient = process.env.AWS_SAM_LOCAL ? new dynamodb.DocumentClient({
    endpoint: "http://host.docker.internal:8000"
  }) : new dynamodb.DocumentClient()

exports.getByIdHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);
    
    const id = event.pathParameters.id;
    
    var params = {
      TableName : tableName,
      Key: { id: id },
    };
    const data = await docClient.get(params).promise();
    const item = data.Item;

    const response = {
        statusCode: 200,
        body: JSON.stringify(item)
    };
console.log(data)
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    
    return response;
}
