const crypto = require('crypto')
const JWT = require('jsonwebtoken')

const cache = {}
const payload = {
  id: 1,
  email: 'email@test.com',
  role: 'admin'
}
const secretKey = crypto.randomBytes(64)
console.log(`private key: ${secretKey.toString('hex')}`)

const token = JWT.sign(payload, secretKey)
cache[token] = payload

const isVerified = JWT.verify(token, secretKey)
if (isVerified) {
  if (token in cache) {
    console.log(JWT.decode(token))
  }
}

// Token modified / not cached
const modifiedToken = JWT.sign(
  {
    exp: Math.floor(Date.now() / 1000) * (60 * 60),
    ...payload,
  }, secretKey
)

try {
  const validated = JWT.verify(modifiedToken, secretKey)
  console.log(JWT.decode(modifiedToken))
  if (validated in cache) {
    console.log('unreachable code', validated)
  }
} catch (e) {
  console.log(e.name)
}

// Expired token
const expiredToken = JWT.sign(
  {
    exp: Math.floor(Date.now() / 1000) - (60 * 60),
    ...payload,
  }, secretKey
)

try {
  const validated = JWT.verify(expiredToken, secretKey)
  console.log('unreachable code', validated)
} catch (e) {
  console.log(e.name)
}
