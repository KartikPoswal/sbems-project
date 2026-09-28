const awsIot = require('aws-iot-device-sdk');

const device = awsIot.device({
  keyPath: 'certs/private.key',
  certPath: 'certs/device.crt',
  caPath: 'certs/AmazonRootCA1.pem',
  clientId: 'humidity-sensor-001',
  host: 'a1f8tjq9xaxpr3-ats.iot.ap-southeast-2.amazonaws.com',
  port: 8883,
  protocol: 'mqtts'
});

// Generate random humidity value (40-60%)
function generateHumidity() {
  return (40 + Math.random() * 20).toFixed(1);
}

device.on('connect', () => {
  console.log('Humidity simulator connected to AWS IoT Core!');
  
  // Publish every 5 seconds
  setInterval(() => {
    const value = generateHumidity();
    const payload = JSON.stringify({
      sensor_id: 'H001',
      value: value,
      unit: '%',
      timestamp: Date.now()
    });
    
    const topic = 'building/001/floor1/room101/humidity/H001/telemetry';
    device.publish(topic, payload);
    console.log(`Published: ${payload}`);
  }, 5000);
});

device.on('error', (err) => {
  console.error('Error:', err.message);
});