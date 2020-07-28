import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import { Title, Paragraph } from 'components/text.js';
import request from 'constants/request.js';
import { CloudinaryImage, TRANSFORMATIONS } from 'components/image.js';

import css from 'styles/pages/Reveries.module.scss';

const query = `
{
  getAllPosts(type: Reverie) {
    id
    title,
    description,
    image
  }
}
`;

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
      query: JSON.stringify({ query }),
      onSuccess: ({ data }) => {
        const reveries = data.getAllPosts;
        setReveries(reveries);
        setLoaded(true);
      }
    });
  };

  return (
    <Container className={css['reveries-index']}>
      {reveries.map((reverie, key) => (
        <Reverie reverie={reverie} key={key} />
      ))}
    </Container>
  );
};

const Reverie = ({ reverie }) => {
  return (
    <div className={css['reveries-index-reverie']}>
      <Title>{reverie.title}</Title>
      <ReverieImage reverie={reverie} />
      <Paragraph className={css['reveries-index-paragraph']} truncate={60}>
        {reverie.description}
      </Paragraph>
    </div>
  );
};

/**
 * Retrieve reverie image if exists
 * @param {Object} reverie - Reference reverie to image
 */
const ReverieImage = ({ reverie }) => {
  if (!reverie.image) return null;
  return (
    <CloudinaryImage
      src={reverie.image}
      alt={reverie.title}
      lazy={TRANSFORMATIONS.MEDIUM_WIDE}
      className={css['reveries-index-image']}
    />
  );
};

export default Reveries;
