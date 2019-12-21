import React, {Component} from 'react';
import { Container } from 'react-bootstrap';

export default class Home extends Component {
  render(){
    return (
      <Container style={{
        backgroundColor: 'black',
        width: '100%',
        height: '100vh'
        }}>
        <p style={{color: 'white'}}></p>
      </Container>
    )
  }
}