const awsIot = require('aws-iot-device-sdk');

const device = awsIot.device({
  keyPath: 'certs/private.key',
  certPath: 'certs/device.crt',
  caPath: 'certs/AmazonRootCA1.pem',
  clientId: 'occupancy-sensor-001',
  host: 'a1f8tjq9xaxpr3-ats.iot.ap-southeast-2.amazonaws.com',
  port: 8883,
  protocol: 'mqtts'
});

// Generate random occupancy (0 or 1)
function generateOccupancy() {
  return Math.random() > 0.5 ? 1 : 0;
}

device.on('connect', () => {
  console.log('Occupancy simulator connected to AWS IoT Core!');
  
  // Publish every 15 seconds
  setInterval(() => {
    const value = generateOccupancy();
    const payload = JSON.stringify({
      sensor_id: 'P001',
      value: value,
      unit: 'occupancy',
      timestamp: Date.now()
    });
    
    const topic = 'building/001/floor1/room101/occupancy/P001/telemetry';
    device.publish(topic, payload);
    console.log(`Published: ${payload}`);
  }, 15000);
});

device.on('error', (err) => {
  console.error('Error:', err.message);
});