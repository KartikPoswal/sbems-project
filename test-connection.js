const awsIot = require('aws-iot-device-sdk');

const device = awsIot.device({
  keyPath: 'certs/private.key',
  certPath: 'certs/device.crt',
  caPath: 'certs/AmazonRootCA1.pem',
  clientId: 'temp-sensor-001',
  host: 'a1f8tjq9xaxpr3-ats.iot.ap-southeast-2.amazonaws.com',
  port: 8883,
  protocol: 'mqtts'
});

device.on('connect', () => {
  console.log('Connected to AWS IoT Core!');
  device.publish('building/001/floor1/room101/temp/T001/telemetry', JSON.stringify({
    sensor_id: 'T001',
    value: 22.5,
    unit: 'C',
    timestamp: Date.now()
  }));
  console.log('Published test message');
  device.end();
});

device.on('error', (err) => {
  console.error('Error:', err.message);
});