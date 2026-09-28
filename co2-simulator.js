const awsIot = require('aws-iot-device-sdk');

const device = awsIot.device({
  keyPath: 'certs/private.key',
  certPath: 'certs/device.crt',
  caPath: 'certs/AmazonRootCA1.pem',
  clientId: 'co2-sensor-001',
  host: 'a1f8tjq9xaxpr3-ats.iot.ap-southeast-2.amazonaws.com',
  port: 8883,
  protocol: 'mqtts'
});

// Generate random CO2 value (400-600 ppm)
function generateCO2() {
  return Math.floor(400 + Math.random() * 200);
}

device.on('connect', () => {
  console.log('CO2 simulator connected to AWS IoT Core!');
  
  // Publish every 30 seconds
  setInterval(() => {
    const value = generateCO2();
    const payload = JSON.stringify({
      sensor_id: 'C001',
      value: value,
      unit: 'ppm',
      timestamp: Date.now()
    });
    
    const topic = 'building/001/floor1/room101/co2/C001/telemetry';
    device.publish(topic, payload);
    console.log(`Published: ${payload}`);
  }, 30000);
});

device.on('error', (err) => {
  console.error('Error:', err.message);
});