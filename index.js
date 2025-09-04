const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());

app.post('/generate-jwt', (req, res) => {
  const { id, secret } = req.body;
  if (!id || !secret) return res.status(400).json({ error: 'Missing id or secret' });
  const header = { alg: 'HS256', typ: 'JWT', kid: id };
  const now = Math.floor(Date.now() / 1000);
  const payload = { iat: now, exp: now + 300, aud: '/admin/' };
  const headerBase64 = Buffer.from(JSON.stringify(header)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const headerPayload = `${headerBase64}.${payloadBase64}`;
  const secretBytes = Buffer.from(secret, 'hex');
  const signature = crypto.createHmac('sha256', secretBytes).update(headerPayload).digest('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const token = `${headerPayload}.${signature}`;
  res.json({ token });
});

app.listen(3000, () => console.log('Running on port 3000'));