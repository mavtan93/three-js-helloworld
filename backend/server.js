const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to log all requests
app.use((req, res, next) => {
  console.log('\n=== New Request ===');
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Handle ALL HTTP methods for ALL routes
app.all('/{*any}', (req, res) => {
  console.log('Body:', req.body);
  res.json({
    message: "Request received",
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });
});

const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('secrets/key.pem'),
  cert: fs.readFileSync('secrets/cert.pem')
};

https.createServer(options, app).listen(port, () => {
  console.log(`Server running on https://localhost:${port}`);
});