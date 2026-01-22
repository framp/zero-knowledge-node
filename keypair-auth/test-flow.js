const { makePublicKey, makeAuthSignature, getPublicKeyFromPem, verifyAuthSignature } = require('./crypto-utils')

async function testFlow() {
  const username = 'testuser'
  const password = 'testpassword'

  console.log('1. Registration: generating public key from password...')
  const publicKeyPem = await makePublicKey(password)
  console.log('Public key generated:', publicKeyPem.substring(0, 50) + '...')

  console.log('\n2. Server: storing public key...')
  const storedPublicKey = getPublicKeyFromPem(publicKeyPem)
  console.log('Public key stored')

  console.log('\n3. Login: generating signature with same password...')
  const [message, signature] = await makeAuthSignature(password)
  console.log('Message:', message)
  console.log('Signature (base64):', signature.substring(0, 50) + '...')

  console.log('\n4. Server: verifying signature...')
  try {
    const verified = await verifyAuthSignature(storedPublicKey, message, signature)
    console.log('Verification result:', verified)
    if (verified) {
      console.log('\n✅ SUCCESS: Authentication flow works!')
    } else {
      console.log('\n❌ FAILED: Signature did not verify')
    }
  } catch (err) {
    console.log('\n❌ ERROR during verification:', err.message)
    throw err
  }
}

testFlow().catch(err => {
  console.error('Test failed:', err)
  process.exit(1)
})
