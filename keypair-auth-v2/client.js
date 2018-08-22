const { 
  makeKeyPair, makePublicKeyPem, makeAuthSignature, 
  encryptPrivateKey, decryptPrivateKey 
} = require('./crypto-utils')

const register = document.getElementById('register')

register.addEventListener('submit', async (event) => {
  event.stopPropagation()
  event.preventDefault()
  const username = document.querySelector('#register > [name=username]').value
  const password = document.querySelector('#register > [name=password]').value

  const { publicKey, privateKey } = await makeKeyPair()
  const publicKeyPem = makePublicKeyPem(publicKey)
  const encryptedPrivateKey = encryptPrivateKey(privateKey, password)
  localStorage.setItem(username, encryptedPrivateKey);

  const action = register.getAttribute('action')
  const method = register.getAttribute('method')
  fetch(action, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      publicKey: publicKeyPem
    })
  }).then(response => {
    alert(response.status)
  })
})

const login = document.getElementById('login')

login.addEventListener('submit', async (event) => {
  event.stopPropagation()
  event.preventDefault()
  const username = document.querySelector('#login > [name=username]').value
  const password = document.querySelector('#login > [name=password]').value

  const encryptedPrivateKey = localStorage.getItem(username)
  const privateKey = decryptPrivateKey(encryptedPrivateKey, password)
  if (!privateKey) {
    return alert('Wrong password mate')
  }
  const [message, signature] = await makeAuthSignature(privateKey, password)

  const action = login.getAttribute('action')
  const method = login.getAttribute('method')
  fetch(action, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      message,
      signature,
    })
  }).then(response => {
    alert(response.status)
  })
})