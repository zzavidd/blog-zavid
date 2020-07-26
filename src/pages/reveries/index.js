import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import { Title, Paragraph } from 'components/text.js';
import request from 'constants/request.js';
import { cloudinary } from 'constants/settings.js';

import css from 'styles/pages/Reveries.module.scss';

/** The index page for reveries. */
const Reveries = () => {
  const [reveries, setReveries] = useState([]);
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    getReveries();
  }, [isLoaded]);

  /** Get all reveries */
  const getReveries = () => {
    request({
      url: '/api/v1/posts/reveries',
      method: 'GET',
      onSuccess: (reveries) => {
        setReveries(reveries);
        console.log(reveries);
        setLoaded(true)
      }
    });
  };

  return (
    <Container className={css.index}>
      {reveries.map((reverie, key) => (
        <div key={key}>
          <Title>{reverie.title}</Title>
          <ReverieImage reverie={reverie} />
          <Paragraph>{reverie.description}</Paragraph>
        </div>
      ))}
    </Container>
  );
};

/**
 * Retrieve reverie image if exists
 * @param {Object} reverie - Reference reverie to image
 */
const ReverieImage = (reverie) => {
  if (!reverie.image) return null;
  return (
    <img
      src={`${cloudinary.url}/w_1280,h_720/${reverie.image}`}
      alt={reverie.title}
      className={css.image}
    />
  );
};

export default Reveries;
