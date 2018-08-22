const paillier = require('paillier-js')
const bigInt = require('big-integer')
const crypto = require('crypto')

// Based on https://paillier.daylightingsociety.org/Paillier_Zero_Knowledge_Proof.pdf

paillier.PublicKey.prototype.rEncrypt = function (m) {
  let r;
  do {
      r = bigInt.randBetween(2, this.n);
  } while (r.leq(1));
  return [r, this.g.modPow(bigInt(m), this._n2).multiply(r.modPow(this.n, this._n2)).mod(this._n2)];
}

const getCoprime = (bits, target) => {
  while (true) {
    const lowerBound = bigInt(2).pow(bits-1).plus(1)
    const size = bigInt(2).pow(bits).subtract(lowerBound)
    const result = lowerBound.plus(bigInt.rand(bits))
    let possible = lowerBound.plus(bigInt.rand(bits))
    while(target > 0) {
			[possible, target] = [target, possible.mod(target)]
    }
		if (possible == 1) return result
  }
}
const getCoprimeN = (n) => {
  while (true) {
    const coprime = getCoprime(Math.round(Math.log2(n)), n)
    if (coprime.greater(bigInt(0)) && coprime.lesser(n)) return coprime
  }
}

const proveValidMessage = (publicKey, m, validMessages, bits, evil=false) => {
  if (!evil && validMessages.indexOf(m) === -1) {
    throw new Error('Message not allowed')
  }
  const [r, c] = publicKey.rEncrypt(m)

  const as = []
  const es = []
  const zs = []

  const om = getCoprimeN(publicKey.n)
  const ap = om.modPow(publicKey.n, publicKey._n2)

  let mi = null
  validMessages.forEach((mk, i) => {
    const gmk = publicKey.g.modPow(bigInt(mk), publicKey._n2)
    const uk = c.times(gmk.modInv(publicKey._n2)).mod(publicKey._n2)
    if (m === mk) {
      as.push(ap)
      zs.push(null)
      es.push(null)
      mi = i
    } else {
      const zk = getCoprimeN(publicKey.n)
      zs.push(zk)
      const ek = bigInt.rand(bits).subtract(bigInt(1))
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
  const rep = r.modPow(ep, publicKey.n)
  const zp = om.mod(rep.times(publicKey.n))
  es[mi] = ep
  zs[mi] = zp

  return [c, [as, es, zs]]
}

const verifyMessage = (publicKey, cipher, validMessages, [as, es, zs]) => {
  const hash = crypto.createHash('sha256').update(as.join('')).digest('hex');

  const us = validMessages.map(mk => {
    const gmk = publicKey.g.modPow(mk, publicKey._n2)
    const uk = cipher.times(gmk.modInv(publicKey._n2)).mod(publicKey._n2)
    return uk
  })

  const esum = es.reduce((acc, ek) => acc.plus(ek).mod(bigInt(2).pow(256)), bigInt(0))
  if (!bigInt(hash, 16).equals(esum)) {
    return false
  }
  return zs.every((zk, i) => {
    const ak = as[i]
    const ek = es[i]
    const uk = us[i]
    const zkn = zk.modPow(publicKey.n, publicKey._n2)
    const uke = uk.modPow(ek, publicKey._n2)
    const akue = ak.times(uke).mod(publicKey._n2)
    return zkn.equals(akue)
  })
}

const bits = 256
const {publicKey, privateKey} = paillier.generateRandomKeys(bits)
const validMessages = [42,666,13]
const message = 43

const [cipher, commitments] = proveValidMessage(publicKey, message, validMessages, bits, 'evil')
const result = verifyMessage(publicKey, cipher, validMessages, commitments)

console.log(result)