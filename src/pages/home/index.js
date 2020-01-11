import React, {Component} from 'react';
import { Container } from 'react-bootstrap';

import { zAlerts } from 'zavid-modules';

export default class Home extends Component {
  render(){
    return (
      <Container>
        <p>This is the home of Zavid Egbue.</p>
        <button onClick={() => zAlerts.alert.success('Nice!')}>Yo bro</button>
      </Container>
    )
  }
}