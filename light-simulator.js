const awsIot = require('aws-iot-device-sdk');

const device = awsIot.device({
  keyPath: 'certs/private.key',
  certPath: 'certs/device.crt',
  caPath: 'certs/AmazonRootCA1.pem',
  clientId: 'light-sensor-001',
  host: 'a1f8tjq9xaxpr3-ats.iot.ap-southeast-2.amazonaws.com',
  port: 8883,
  protocol: 'mqtts'
});

// Generate random light value (100-600 lux)
function generateLight() {
  return Math.floor(100 + Math.random() * 500);
}

device.on('connect', () => {
  console.log('Light simulator connected to AWS IoT Core!');
  
  // Publish every 10 seconds
  setInterval(() => {
    const value = generateLight();
    const payload = JSON.stringify({
      sensor_id: 'L001',
      value: value,
      unit: 'lux',
      timestamp: Date.now()
    });
    
    const topic = 'building/001/floor1/room101/light/L001/telemetry';
    device.publish(topic, payload);
    console.log(`Published: ${payload}`);
  }, 10000);
});

device.on('error', (err) => {
  console.error('Error:', err.message);
});