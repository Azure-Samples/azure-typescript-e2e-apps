const fs = require('fs');
const forge = require('node-forge');

// Function to convert a private key in PEM format to JWK format
function pemToJwk(pem) {
  const privateKey = forge.pki.privateKeyFromPem(pem);

  const jwk = {
    kty: 'RSA',
    n: Buffer.from(privateKey.n.toString(16), 'hex').toString('base64'),
    e: Buffer.from(privateKey.e.toString(16), 'hex').toString('base64'),
    d: Buffer.from(privateKey.d.toString(16), 'hex').toString('base64'),
    p: Buffer.from(privateKey.p.toString(16), 'hex').toString('base64'),
    q: Buffer.from(privateKey.q.toString(16), 'hex').toString('base64'),
    dp: Buffer.from(privateKey.dP.toString(16), 'hex').toString('base64'),
    dq: Buffer.from(privateKey.dQ.toString(16), 'hex').toString('base64'),
    qi: Buffer.from(privateKey.qInv.toString(16), 'hex').toString('base64'),
  };

  return jwk;
}

// Usage example
const privateKeyPem = fs.readFileSync('private_key.pem', 'utf8');

const jwk = pemToJwk(privateKeyPem);
fs.writeFileSync('private_key.jwk', JSON.stringify(jwk, null, 2)); // Output the JWK object
