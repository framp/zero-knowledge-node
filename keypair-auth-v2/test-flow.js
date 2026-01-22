const { 
  makeKeyPair, 
  makePublicKeyPem, 
  makeAuthSignature, 
  getPublicKeyFromPem, 
  verifyAuthSignature,
  encryptPrivateKey,
  decryptPrivateKey
} = require('./crypto-utils')

async function testFlow() {
  const username = 'testuser'
  const password = 'testpassword'
  
  console.log('1. Registration: generating key pair...')
  const { publicKey, privateKey } = await makeKeyPair()
  const publicKeyPem = makePublicKeyPem(publicKey)
  console.log('Public key generated:', publicKeyPem.substring(0, 50) + '...')
  
  console.log('\n2. Client: encrypting and storing private key...')
  const encryptedPrivateKey = encryptPrivateKey(privateKey, password)
  console.log('Private key encrypted and would be stored in localStorage')
  
  console.log('\n3. Server: storing public key...')
  const storedPublicKey = getPublicKeyFromPem(publicKeyPem)
  console.log('Public key stored')
  
  console.log('\n4. Login: decrypting private key...')
  const decryptedPrivateKey = decryptPrivateKey(encryptedPrivateKey, password)
  if (!decryptedPrivateKey) {
    console.log('\n❌ FAILED: Could not decrypt private key')
    process.exit(1)
  }
  console.log('Private key decrypted successfully')
  
  console.log('\n5. Login: generating signature...')
  const [message, signature] = await makeAuthSignature(decryptedPrivateKey, password)
  console.log('Message:', message)
  console.log('Signature (base64):', signature.substring(0, 50) + '...')
  
  console.log('\n6. Server: verifying signature...')
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
