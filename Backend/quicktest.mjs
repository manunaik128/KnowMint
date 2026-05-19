import https from 'https';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const KEY   = process.env.CLOUDINARY_API_KEY;
const SEC   = process.env.CLOUDINARY_API_SECRET;

const timestamp = Math.floor(Date.now()/1000).toString();
const public_id = `test-${Date.now()}`;
const sig = crypto.createHash('sha256').update(`public_id=${public_id}&timestamp=${timestamp}${SEC}`).digest('hex');
const boundary = '----B' + Math.random().toString(36).slice(2);
const fileData = Buffer.from('hello');
const pre = Buffer.from([
  `--${boundary}\r\nContent-Disposition: form-data; name="api_key"\r\n\r\n${KEY}`,
  `--${boundary}\r\nContent-Disposition: form-data; name="timestamp"\r\n\r\n${timestamp}`,
  `--${boundary}\r\nContent-Disposition: form-data; name="signature"\r\n\r\n${sig}`,
  `--${boundary}\r\nContent-Disposition: form-data; name="public_id"\r\n\r\n${public_id}`,
  `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="t.txt"\r\nContent-Type: text/plain\r\n\r\n`,
].join('\r\n') + '\r\n');
const body = Buffer.concat([pre, fileData, Buffer.from(`\r\n--${boundary}--\r\n`)]);

console.log('Posting to Cloudinary raw/upload...');
const req = https.request({
  hostname: 'api.cloudinary.com',
  path: `/v1_1/${CLOUD}/raw/upload`,
  method: 'POST',
  headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}`, 'Content-Length': body.length }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:', d);
    try { const j = JSON.parse(d); console.log('ERROR MESSAGE:', j.error?.message || 'no error - success!'); } catch(e) {}
  });
});
req.on('error', e => console.error(e));
req.write(body);
req.end();
