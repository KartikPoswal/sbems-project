const awsIot = require('aws-iot-device-sdk');

const device = awsIot.device({
  keyPath: 'certs-new/private.key',
  certPath: 'certs-new/device.crt',
  caPath: 'certs-new/AmazonRootCA1.pem',
  clientId: 'temp-sensor-001',
  host: 'a222twej2fua03-ats.iot.us-east-1.amazonaws.com',
  port: 8883,
  protocol: 'mqtts'
});

function generateTemperature() {
  return (20 + Math.random() * 10).toFixed(2);
}

device.on('connect', () => {
  console.log('Temperature simulator connected to AWS IoT Core!');
  setInterval(() => {
    const value = generateTemperature();
    const now = Date.now();
    const payload = JSON.stringify({
      sensor_id: 'T001',
      value: value,
      unit: 'C',
      timestamp: now,
      sent_at: now
    });
    const topic = 'building/001/floor1/room101/temp/T001/telemetry';
    device.publish(topic, payload);
    console.log(`Published: ${payload}`);
  }, 5000);
});

device.on('error', (err) => {
  console.error('Error:', err.message);
});