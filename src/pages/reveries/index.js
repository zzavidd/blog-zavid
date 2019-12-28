import React, {Component} from 'react';
import { Container } from 'react-bootstrap';

import { Title, Paragraph } from '~/components/text.js';
import { cloudinary, request } from '~/constants/settings.js';

import css from '~/styles/reveries.scss';

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

  /**
   * Get all reveries
   */
  getReveries = () => {
    request({
      url: '/posts/reveries',
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
      <Container className={css.index}>
        {this.state.reveries.map((reverie, idx) => (
          <div key={idx}>
            <Title>{reverie.title}</Title>
            {previewImage(reverie)}
            <Paragraph>{reverie.description}</Paragraph>
          </div>
        ))}
      </Container>
    )
  }
}

/**
 * Retrieve reverie image if exists
 * @param {Object} reverie - Reference reverie to image
 */
const previewImage = (reverie) => {
  if (!reverie.image) return null;
  return (
    <img
      src={`${cloudinary.url}/w_1280,h_720/${reverie.image}`}
      alt={reverie.title}
      className={css.image} />
  )
}