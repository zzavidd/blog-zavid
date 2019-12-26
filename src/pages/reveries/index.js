import React, {Component} from 'react';
import { Container } from 'react-bootstrap';

import { cloudinary, request } from '~/constants/settings.js';

export default class Reveries extends Component {
  constructor(props){
    super(props);
    this.state = {
      reveries: [],
      isLoaded: false
    }
  }

  componentDidMount() {
    this.getReveries();
  }

  /** Get all reveries */
  getReveries = () => {
    request({
      url: '/reveries/all',
      method: 'GET',
      onSuccess: (reveries) => {
        this.setState({
          reveries,
          isLoaded: true
        });
      }
    });
  }

  render(){
    return (
      <Container>
        {this.state.reveries.map((reverie, idx) => (
          <div>
            <img
              src={`${cloudinary.url}/w_1280,h_720/${reverie.image}`}
              alt={reverie.title}
              style={{width: '60%'}} />
            <div key={idx}>{reverie.description}</div>
          </div>
        ))}
      </Container>
    )
  }
}