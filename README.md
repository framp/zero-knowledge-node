# zero-knowledge-node
A presentation about zero knowledge proofs in node.js 

[![Presentation](https://img.youtube.com/vi/cMoD0wIxIpQ/0.jpg)](https://www.youtube.com/watch?v=cMoD0wIxIpQ)

## Introduction to Zero Knowledge Proof

Great articles to go through this and sources for the talk:
 - https://medium.com/swlh/a-zero-knowledge-proof-for-wheres-wally-930c21e55399
 - https://blog.cryptographyengineering.com/2014/11/27/zero-knowledge-proofs-illustrated-primer/
 - http://web.mit.edu/~ezyang/Public/graph/svg.html
 
 ## Authentication
 
 A demo of an authentication system using RSA keypairs to prove the user has a password, without sending the password.
  - https://github.com/framp/zero-knowledge-node/tree/master/keypair-auth

 This is bad because we use the password as a source of randomness.
 
 ------ 
 
 A demo of an authentication system using RSA keypairs to prove the user has a password, without sending the password.
   - https://github.com/framp/zero-knowledge-node/tree/master/keypair-auth-v2

 The cons of this approach is that we store the keypair on the client side (which needs to be accounted for in the system).
 
 ------
 
 Moral of the story: Don't roll your own crypto!
 
 Alternatives:
 - https://github.com/bitwiseshiftleft/sjcl/pull/273

## Paillier Zero Knowledge

An implementation of [this paper](https://paillier.daylightingsociety.org/Paillier_Zero_Knowledge_Proof.pdf).
 - https://github.com/framp/zero-knowledge-node/blob/master/paillier-zero-knowledge/
 - https://github.com/framp/paillier-in-set-zkp (demoed code packaged as a lib)

We want to be able to encrypt a value and generate a proof that the encrypted value is among a set of valid values.

## Cool things happening thanks to advancement in ZKP

- https://getmonero.org/
- https://z.cash/
- https://blog.z.cash/the-design-of-the-ceremony/
- https://blockstream.com/2018/02/21/bulletproofs-faster-rangeproofs-and-much-more.html
- This talk :D
