const awsIot = require('aws-iot-device-sdk');
const fs = require('fs');

const DEVICE_COUNT = parseInt(process.argv[2]) || 10;
const DURATION_SEC = parseInt(process.argv[3]) || 60;
const INTERVAL_MS = 5000;

const endpoint = 'a222twej2fua03-ats.iot.us-east-1.amazonaws.com';

console.log(`Starting: ${DEVICE_COUNT} devices for ${DURATION_SEC}s`);

const device = awsIot.device({
  keyPath: './certs-new/private.key',
  certPath: './certs-new/device.crt',
  caPath: './certs-new/AmazonRootCA1.pem',
  clientId: 'load-test-' + Date.now(),
  host: endpoint,
  port: 8883,
  protocol: 'mqtts'
});

let sent = 0;
let errors = 0;
const start = Date.now();

device.on('connect', () => {
  console.log('Connected. Publishing...');
  const timer = setInterval(() => {
    if (Date.now() - start > DURATION_SEC * 1000) {
      clearInterval(timer);
      const summary = {
        devices: DEVICE_COUNT,
        duration_sec: DURATION_SEC,
        total_sent: sent,
        errors: errors
      };
      fs.writeFileSync(`load-test-results-${DEVICE_COUNT}.json`, JSON.stringify(summary, null, 2));
      console.log('Done:', summary);
      process.exit(0);
    }
    for (let i = 0; i < DEVICE_COUNT; i++) {
      const now = Date.now();
      device.publish(
        `building/001/floor1/room${i % 10}/temp/dev${i}/telemetry`,
        JSON.stringify({
          sensor_id: `dev-${i}`,
          value: 20 + Math.random() * 5,
          unit: 'C',
          sent_at: now
        })
      );
      sent++;
    }
  }, INTERVAL_MS);
});

device.on('error', (e) => {
  errors++;
  console.error('Error:', e.message);
});