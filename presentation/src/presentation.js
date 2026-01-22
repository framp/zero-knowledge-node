// Import React
import React from 'react';

// Import Spectacle Core tags
import {
  Deck,
  Heading,
  ListItem,
  List,
  Slide,
  Text,
  Link,
  Image,
  Notes
} from 'spectacle';

// Import theme
import createTheme from 'spectacle/lib/themes/default';

// Require CSS
require('normalize.css');

const theme = createTheme(
  {
    primary: '#ecf0f1'
  },
  {
    primary: 'Source Sans Pro',
  }
);

export default class Presentation extends React.Component {
  render() {
    return (
      <Deck
        transition={['slide']}
        transitionDuration={500}
        theme={theme}
      >
        <Slide transition={['fade']} textFont="Source Sans Pro" textColor="#2c3e50" bgColor="#ecf0f1">
          <Heading size={1} fit caps lineHeight={1} textFont="Open Sans" textColor="#2c3e50">
            Zero Knowledge Proofs in node.js
          </Heading>
          <br />
          <Image src="/images/wally.jpg" height={500} />
        </Slide>

        <Slide bgColor="#2980b9" textFont="Source Sans Pro" textColor="#ecf0f1">
          <Heading size={5} caps lineHeight={1.5} textFont="Open Sans" textColor="#ecf0f1">
            @framp
          </Heading>
          <Heading size={5} caps lineHeight={1.5} textFont="Open Sans" textColor="#2c3e50">
            framp.me
          </Heading>
        </Slide>


        <Slide bgColor="#2980b9" textFont="Source Sans Pro" textColor="#ecf0f1">
          <Heading size={5} caps lineHeight={1.5} textFont="Open Sans" textColor="#2c3e50">
            Zero Knowledge Proof
          </Heading>
          <Text textColor="#ecf0f1">
          The prover Peggy wants to prove the verifier Victor that she knows a value <i>x</i>, without leaking any information apart from the fact that she knows the value <i>x</i>. <br />
          </Text>
          <List>
            <ListItem>We're not revealing <i>x</i></ListItem>
            <ListItem>We're not leaking information about <i>x</i></ListItem>
          </List>
        </Slide>

        <Slide bgColor="#2980b9" textFont="Source Sans Pro" textColor="#ecf0f1">
          <Heading size={5} caps lineHeight={1.5} textFont="Open Sans" textColor="#2c3e50">
            Example: Where's Wally?
          </Heading>
          <Image src="/images/wally.jpg" height={500} />
        </Slide>

        <Slide bgColor="#2980b9" textFont="Source Sans Pro" textColor="#ecf0f1">
          <Heading size={5} caps lineHeight={1.5} textFont="Open Sans" textColor="#2c3e50">
            Example: Where's Wally?
          </Heading>
          <Image src="/images/wally-proof-1.png" />
          <Image src="/images/wally-proof-2.png" />
        </Slide>

        <Slide bgColor="#2980b9" textFont="Source Sans Pro" textColor="#ecf0f1">
          <Heading size={5} caps lineHeight={1.5} textFont="Open Sans" textColor="#2c3e50">
            Example: 3 colorable graphs
          </Heading>
          <Image src="/images/petersen-graph.svg" />
        </Slide>

        <Slide bgColor="#2980b9" textFont="Source Sans Pro" textColor="#ecf0f1">
          <Heading size={5} caps lineHeight={1.5} textFont="Open Sans" textColor="#2c3e50">
            Example: 3 colorable graphs
          </Heading>
          <iframe src="/graph.html" height={600} width={800} style={({ background: '#ecf0f1' })} / >
        </Slide>

        <Slide bgColor="#2980b9" textFont="Source Sans Pro" textColor="#ecf0f1">
          <Heading size={5} caps lineHeight={1.5} textFont="Open Sans" textColor="#2c3e50">
            Non Interactive Zero Knowledge Proof
          </Heading>
          <List>
            <ListItem>By agreeing on a random hash we can compute Victor's questions in advance</ListItem>
            <ListItem>This removes the need for interaction</ListItem>
          </List>
        </Slide>

        <Slide bgColor="#2980b9" textFont="Source Sans Pro" textColor="#ecf0f1">
          <Heading size={5} caps lineHeight={1.5} textFont="Open Sans" textColor="#2c3e50">
            Zero Knowledge Proof
          </Heading>
          <List>
            <ListItem>Completeness: Peggy can convince Victor</ListItem>
            <ListItem>Soundness: a Peggy impersonator can't</ListItem>
            <ListItem>Zero-knowledge: if a Peggy impersonator could rewind time, Victor won't be able to tell the difference</ListItem>
          </List>
        </Slide>

        <Slide bgColor="#2980b9" textFont="Source Sans Pro" textColor="#ecf0f1">
          <Heading size={5} caps lineHeight={1.5} textFont="Open Sans" textColor="#2c3e50">
            Authentication
          </Heading>
          <List>
            <ListItem>Sending a username and password to the server</ListItem>
            <ListItem>Can we avoid leaking the password if the server is compromised?</ListItem>
          </List>
        </Slide>

        <Slide bgColor="#2980b9" textFont="Source Sans Pro" textColor="#ecf0f1">
          <Heading size={5} caps lineHeight={1.5} textFont="Open Sans" textColor="#2c3e50">
            Authentication Demo
          </Heading>
        </Slide>

        <Slide bgColor="#2980b9" textFont="Source Sans Pro" textColor="#ecf0f1">
          <Heading size={5} caps lineHeight={1.5} textFont="Open Sans" textColor="#2c3e50">
            What's wrong with it?
          </Heading>
          <List>
            <ListItem>Using a user provided password for randomness is going to get you pwned</ListItem>
            <ListItem>There are tricks to increase the attack size (EKE authentication system)</ListItem>
            <ListItem>... and there are just better zero knowledge system that build on them: SRP, SPAKE</ListItem>
          </List>
        </Slide>

        <Slide bgColor="#2980b9" textFont="Source Sans Pro" textColor="#ecf0f1">
          <Heading size={5} caps lineHeight={1.5} textFont="Open Sans" textColor="#2c3e50">
            Public/Private Key Signature
          </Heading>
          <List>
            <ListItem>Completeness: Peggy can provide a signature to Victor</ListItem>
            <ListItem>Soundness: a Peggy impostor without a Private Key can't</ListItem>
            <ListItem>Zero Knowledge: Private Key is not disclosed</ListItem>
            <ListItem>Zero Knowledge: With infinite time, a time rewinder impostor could produce the right signature</ListItem>
          </List>
        </Slide>

        <Slide bgColor="#2980b9" textFont="Source Sans Pro" textColor="#ecf0f1">
          <Heading size={5} caps lineHeight={1.5} textFont="Open Sans" textColor="#2c3e50">
            Zero Knowledge Proof for NPC problems
          </Heading>
          <List>
            <ListItem>Remember the 3 Coloring Graph problem? Yeah, totes NPC</ListItem>
            <ListItem>We can use Zero Knowledge Proof on any NPC problem</ListItem>
            <ListItem>... like the ones we use to encrypt things</ListItem>
          </List>
        </Slide>

        <Slide bgColor="#2980b9" textFont="Source Sans Pro" textColor="#ecf0f1">
          <Heading size={5} caps lineHeight={1.5} textFont="Open Sans" textColor="#2c3e50">
            Zero Knowledge with Paillier cryptosystem
          </Heading>
          <List>
            <ListItem>Homomorphic encryption scheme</ListItem>
            <ListItem>We can prove properties of encrypted values</ListItem>
          </List>
        </Slide>

        <Slide bgColor="#2980b9" textFont="Source Sans Pro" textColor="#ecf0f1">
          <Heading size={5} caps lineHeight={1.5} textFont="Open Sans" textColor="#2c3e50">
            Paillier Demo
          </Heading>
        </Slide>

        <Slide bgColor="#2980b9" textFont="Source Sans Pro" textColor="#ecf0f1">
          <Heading size={5} caps lineHeight={1.5} textFont="Open Sans" textColor="#2c3e50">
            Zero Knowledge in the world
          </Heading>
          <List>
            <ListItem>Cryptocurrencies can use Zero Knowledge Proof to prove validity</ListItem>
            <ListItem>We can hide information in public</ListItem>
          </List>
        </Slide>

        <Slide bgColor="#2980b9" textFont="Source Sans Pro" textColor="#ecf0f1">
          <Heading size={5} caps lineHeight={1.5} textFont="Open Sans" textColor="#ecf0f1">
            FIN<br />
            <a style={({ color: '#ecf0f1'})} href="http://github.com/framp/zero-knowledge-node">github.com/framp/zero-knowledge-node</a>
          </Heading>
        </Slide>
      </Deck>
    );
  }
}
