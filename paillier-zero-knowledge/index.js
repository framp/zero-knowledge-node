const paillier = require('paillier-js')
const bigInt = require('big-integer')
const crypto = require('crypto')

// Based on https://paillier.daylightingsociety.org/Paillier_Zero_Knowledge_Proof.pdf

// rEncrypt :: Paillier.PublicKey -> Message
// Fork from paillier-js - Create Paillier Encryption of message and return the random Paillier.R with the result
const rEncrypt = function ({ n, g }, message) {
  const _n2 = n.pow(2)
  let r
  do {
      r = bigInt.randBetween(2, n)
  } while (r.leq(1))
  return [r, g.modPow(bigInt(message), _n2).multiply(r.modPow(n, _n2)).mod(_n2)]
}

// getCoprime :: Bits -> Number -> Number
// Generate a coprime number of target (their GCD should be 1)
const getCoprime = (target) => {
  const bits = Math.floor(Math.log2(target))
  while (true) {
    const lowerBound = bigInt(2).pow(bits-1).plus(1)
    const size = bigInt(2).pow(bits).subtract(lowerBound)
    let possible = lowerBound.plus(bigInt.rand(bits)).or(1)
    const result = bigInt(possible)
    if (possible.gt(bigInt(2).pow(1024))) return result
    while(target > 0) {
      [possible, target] = [target, possible.mod(target)]
    }
    if (possible.eq(bigInt(1))) return result
  }
}

// encryptWithProof :: Paillier.PublickKEy -> Message, -> [Message] -> Bits
// Generate a message encryption and a Zero Knowledge proof that the message 
// is among a set of valid messages
const encryptWithProof = (publicKey, message, validMessages, bits=512) => {
  const as = []
  const es = []
  const zs = []

  const [random, cipher] = rEncrypt(publicKey, message)

  const om = getCoprime(publicKey.n)
  const ap = om.modPow(publicKey.n, publicKey._n2)

  let mi = null
  validMessages.forEach((mk, i) => {
    const gmk = publicKey.g.modPow(bigInt(mk), publicKey._n2)
    const uk = cipher.times(gmk.modInv(publicKey._n2)).mod(publicKey._n2)
    if (message === mk) {
      as.push(ap)
      zs.push(null)
      es.push(null)
      mi = i
    } else {
      const zk = getCoprime(publicKey.n)
      zs.push(zk)
      const ek = bigInt.randBetween(2, bigInt(2).pow(bits).subtract(1));
      es.push(ek)
      const zn = zk.modPow(publicKey.n, publicKey._n2)
      const ue = uk.modPow(ek, publicKey._n2)
      const ak = zn.times(ue.modInv(publicKey._n2)).mod(publicKey._n2)
      as.push(ak)
    }
  })

  const hash = crypto.createHash('sha256').update(as.join('')).digest('hex');

  const esum = es.filter(Boolean).reduce((acc, ek) => acc.plus(ek).mod(bigInt(2).pow(256)), bigInt(0))
  const ep = bigInt(hash, 16).subtract(esum).mod(bigInt(2).pow(256))
  const rep = random.modPow(ep, publicKey.n)
  const zp = om.times(rep).mod(publicKey.n)
  es[mi] = ep
  zs[mi] = zp

  const proof = [as, es, zs]

  return [cipher, proof]
}

// verifyMessage :: Paillier.PublickKEy -> Paillier.Encryption, -> Proof -> [Message] -> Bool
// Verify a Zero Knowledge proof that an encrypted message is among a set of valid messages
const verifyMessage = (publicKey, cipher, [as, es, zs], validMessages) => {
  const hash = crypto.createHash('sha256').update(as.join('')).digest('hex');

  const us = validMessages.map(mk => {
    const gmk = publicKey.g.modPow(mk, publicKey._n2)
    const uk = cipher.times(gmk.modInv(publicKey._n2)).mod(publicKey._n2)
    return uk
  })

  const esum = es.reduce((acc, ek) => acc.plus(ek).mod(bigInt(2).pow(256)), bigInt(0))
  if (!bigInt(hash, 16).eq(esum)) {
    return false
  }
  return zs.every((zk, i) => {
    const ak = as[i]
    const ek = es[i]
    const uk = us[i]
    const zkn = zk.modPow(publicKey.n, publicKey._n2)
    const uke = uk.modPow(ek, publicKey._n2)
    const akue = ak.times(uke).mod(publicKey._n2)
    return zkn.eq(akue)
  })
}

const bits = 32
const {publicKey, privateKey} = paillier.generateRandomKeys(bits)
const validMessages = [42,666,13]

{
  const message = 42
  const [cipher, proof] = encryptWithProof(publicKey, message, validMessages, bits)
  const result = verifyMessage(publicKey, cipher, proof, validMessages)
  console.log('Valid Message:', result)
}

{
  const evilMessage = 43
  const [cipher, proof] = encryptWithProof(publicKey, evilMessage, validMessages, bits)
  const result = verifyMessage(publicKey, cipher, proof, validMessages)
  console.log('Evil Message: ', result)
}