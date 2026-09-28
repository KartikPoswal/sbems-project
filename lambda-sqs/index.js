const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const client = new DynamoDBClient({ region: 'us-east-1' });

exports.handler = async (event) => {
    for (const record of event.Records) {
        const body = JSON.parse(record.body);
        const now = Date.now();
        const sentAt = body.sent_at || now;
        let latency = now - sentAt;
        if (latency < 0) latency = 0;

        console.log(JSON.stringify({
            device_id: body.sensor_id,
            latency_ms: latency,
            value: body.value
        }));

        try {
            await client.send(new PutItemCommand({
                TableName: 'sbems-telemetry',
                Item: {
                    device_id: { S: String(body.sensor_id || 'unknown') },
                    timestamp: { N: String(now) },
                    value: { N: String(body.value || 0) },
                    unit: { S: String(body.unit || '') },
                    sent_at: { N: String(sentAt) },
                    latency_ms: { N: String(latency) }
                }
            }));
        } catch (err) {
            console.error('DynamoDB error:', err);
            throw err;
        }
    }
    return { statusCode: 200 };
};