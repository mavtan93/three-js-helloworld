# Install

npm install express body-parser

# Run
node server.js

# generate SSL certs
mkdir -p secrets
openssl req -x509 -newkey rsa:2048 -keyout secrets/key.pem -out secrets/cert.pem -sha256 -days 365 -nodes -subj                                     │
 │   "/C=US/ST=California/L=Mountain View/O=Google/OU=Gemini/CN=localhost"