const forge = require('node-forge')
const PKI = forge.pki
const RANDOM = forge.random
const RSA = forge.pki.rsa
const MD = forge.md

const generateKeyPair = (opts) => new Promise((resolve, reject) => {
  RSA.generateKeyPair(opts, (err, result) => {
    if (err) {
      reject(err)
    } else {
      resolve(result)
    }
  })
})

// Don't do this pls
const brokenPrng = (secret) => {
  const prng = RANDOM.createInstance()
  prng.seedFileSync = (needed) => {
    let r = '', i = 0, j = 0
    while (i++ < needed) {
      r += secret[j++]
      if (j === secret.length) j = 0
    }
    return r
  }
  return prng
}
const makeKeyPair = (secret) => 
  generateKeyPair({ bits: 2048, prng: brokenPrng(secret) })

const makePublicKey = async (secret) => {
  const { publicKey } = await makeKeyPair(secret)
  return PKI.publicKeyToPem(publicKey)
}

const getPublicKeyFromPem = (pemPublicKey) => PKI.publicKeyFromPem(pemPublicKey)

const makeAuthSignature = async (secret) => {
  const { privateKey, publicKey } = await makeKeyPair(secret)
  const message = 'Let me in ' + Date.now()
  const md = MD.sha1.create();
  md.update(message, 'utf8');
  const signature = privateKey.sign(md);
  return [message, signature]
}

const verifyAuthSignature = async (publicKey, message, signature) => {
  const md = MD.sha1.create();
  md.update(message, 'utf8');
  const verification = publicKey.verify(md.digest().getBytes(), signature);
  return verification
}

module.exports = {
  makeKeyPair,
  makePublicKey,
  getPublicKeyFromPem,
  makeAuthSignature,
  verifyAuthSignature,
}
