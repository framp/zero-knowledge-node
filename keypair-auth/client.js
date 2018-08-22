const { makePublicKey, makeAuthSignature } = require('./crypto-utils')

const register = document.getElementById('register')

register.addEventListener('submit', async (event) => {
  event.stopPropagation()
  event.preventDefault()
  const username = document.querySelector('#register > [name=username]').value
  const password = document.querySelector('#register > [name=password]').value

  const publicKey = await makePublicKey(password)

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
      publicKey
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

  const [message, signature] = await makeAuthSignature(password)

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