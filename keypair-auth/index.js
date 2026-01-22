const express = require('express')
const { getPublicKeyFromPem, verifyAuthSignature, makeKeyPair } = require('./crypto-utils')

const app = express()
app.use(express.static('public'))
app.use(express.json())



const users = {}

app.post('/register', (req, res) => {
  console.log('DEBUG: Received', req.body)
  try {
    users[req.body.username] = getPublicKeyFromPem(req.body.publicKey)
  } catch (err) {
    console.log('ERROR: ', err)
    return res.send(400)
  }
  res.sendStatus(201)
})

app.post('/login', (req, res) => {
  console.log('DEBUG: Received', req.body)
  const publicKey = users[req.body.username]
  if (!publicKey){
    return res.sendStatus(404)
  }
  try {
    verifyAuthSignature(publicKey, req.body.message, req.body.signature)
  } catch (err) {
    console.log('ERROR: ', err)
    return res.send(401)
  }
  res.sendStatus(200)
})
app.listen(1337)
