const express = require('express');
const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');

const app = express();
app.use(cors());

// Middleware pour vérifier le JWT envoyé par le frontend
const checkJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-6knczocqqvl0i2dx.us.auth0.com/.well-known/jwks.json',
  }),
  audience: 'https://f_brain_api',
  issuer: 'https://dev-6knczocqqvl0i2dx.us.auth0.com/',
  algorithms: ['RS256'],
});

// Une route protégée
app.get('/api/private', checkJwt, (req, res) => {
  res.json({ message: 'Contenu protégé accessible uniquement avec un token valide !' });
});

app.listen(3001, () => {
  console.log('API backend sur http://localhost:3001');
});
