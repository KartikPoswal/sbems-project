const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const client = new DynamoDBClient({ region: 'us-east-1' });

exports.handler = async (event) => {
    const now = Date.now();
    const sentAt = event.sent_at || now;
    let latency = now - sentAt;
    if (latency < 0) latency = 0;

    console.log(JSON.stringify({
        device_id: event.sensor_id,
        latency_ms: latency,
        value: event.value
    }));

    try {
        await client.send(new PutItemCommand({
            TableName: 'sbems-telemetry',
            Item: {
                device_id: { S: String(event.sensor_id || 'unknown') },
                timestamp: { N: String(now) },
                value: { N: String(event.value || 0) },
                unit: { S: String(event.unit || '') },
                sent_at: { N: String(sentAt) },
                latency_ms: { N: String(latency) }
            }
        }));
        return { statusCode: 200 };
    } catch (err) {
        console.error('DynamoDB error:', err);
        throw err;
    }
};