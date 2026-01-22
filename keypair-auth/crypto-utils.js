const forge = require('node-forge')
const PKI = forge.pki
const RANDOM = forge.random
const RSA = forge.pki.rsa
const MD = forge.md

const generateKeyPair = (opts) => {
  const bits = opts.bits || 2048;
  const e = opts.e || 0x10001;
  const state = PKI.rsa.createKeyPairGenerationState(bits, e, opts);
  PKI.rsa.stepKeyPairGenerationState(state, 0);
  return state.keys;
}

// Don't do this pls
const brokenPrng = (secret) => {
  const source = secret + secret.length
  const prng = RANDOM.createInstance()
  prng.seedFileSync = (needed) => {
    let r = '', i = 0, j = 0
    while (i++ < needed) {
      r += source[j++]
      if (j === source.length) j = 0
    }
    return r
  }
  return prng
}
const makeKeyPair = (secret) =>
  generateKeyPair({ bits: 2048, prng: brokenPrng(secret) })

const makePublicKey = (secret) => {
  const { publicKey } = makeKeyPair(secret)
  return PKI.publicKeyToPem(publicKey)
}

const getPublicKeyFromPem = (pemPublicKey) => PKI.publicKeyFromPem(pemPublicKey)

const makeAuthSignature = (secret) => {
  const { privateKey, publicKey } = makeKeyPair(secret)
  const message = 'Let me in ' + Date.now()
  const md = MD.sha1.create();
  md.update(message, 'utf8');
  const signature = privateKey.sign(md);
  return [message, forge.util.encode64(signature)]
}

const verifyAuthSignature = (publicKey, message, signature) => {
  try {
    const md = MD.sha1.create();
    md.update(message, 'utf8');
    const verification = publicKey.verify(md.digest().getBytes(), forge.util.decode64(signature));
    if (!verification) {
      throw new Error('Signature verification failed');
    }
    return verification;
  } catch (err) {
    throw new Error('Signature verification failed: ' + err.message);
  }
}

module.exports = {
  makeKeyPair,
  makePublicKey,
  getPublicKeyFromPem,
  makeAuthSignature,
  verifyAuthSignature,
}
