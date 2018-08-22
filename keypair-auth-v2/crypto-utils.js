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

const makeKeyPair = () => 
  generateKeyPair({ bits: 2048 })

  const makePublicKeyPem = (publicKey) => PKI.publicKeyToPem(publicKey)

  const makePrivateKeyPem = (publicKey) => PKI.privateKeyToPem(publicKey)

const getPublicKeyFromPem = (pemPublicKey) => PKI.publicKeyFromPem(pemPublicKey)

const encryptPrivateKey = (privateKey, secret) => 
  PKI.encryptRsaPrivateKey(privateKey, secret)

const decryptPrivateKey = (pemPrivateKey, secret) => 
  PKI.decryptRsaPrivateKey(pemPrivateKey, secret)

const makeAuthSignature = async (privateKey, secret) => {
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
  makePublicKeyPem,
  makePrivateKeyPem,
  getPublicKeyFromPem,
  makeAuthSignature,
  verifyAuthSignature,
  encryptPrivateKey,
  decryptPrivateKey,
}
