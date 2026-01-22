const { makePublicKey, makeAuthSignature } = require('./crypto-utils')

const register = document.getElementById('register')

register.addEventListener('submit', (event) => {
  event.stopPropagation()
  event.preventDefault()
  const username = document.querySelector('#register [name=username]').value
  const password = document.querySelector('#register [name=password]').value

  const publicKey = makePublicKey(password)

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
    if (response.ok) {
      showNotification('Account Created! 🎉', 'You can now log in with your credentials', 'success')
    } else if (response.status === 409) {
      showNotification('Username Taken', 'Please choose a different username', 'error')
    } else {
      showNotification('Registration Failed', 'Unable to create account. Please try again', 'error')
    }
  })
})

const login = document.getElementById('login')

login.addEventListener('submit', (event) => {
  event.stopPropagation()
  event.preventDefault()
  const username = document.querySelector('#login [name=username]').value
  const password = document.querySelector('#login [name=password]').value

  const [message, signature] = makeAuthSignature(password)

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
    if (response.ok) {
      showNotification('Welcome Back! 👋', 'Authentication successful', 'success')
    } else if (response.status === 401) {
      showNotification('Authentication Failed', 'Invalid username or password', 'error')
    } else if (response.status === 404) {
      showNotification('User Not Found', 'Please register first', 'error')
    } else {
      showNotification('Login Failed', 'Unable to authenticate. Please try again', 'error')
    }
  })
})
