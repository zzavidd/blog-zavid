import React, { useState, useEffect, memo } from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';

import { LazyLoader } from 'components/loader.js';
import { Title, Paragraph } from 'components/text.js';
import { Zoomer } from 'components/transitioner.js';
import request from 'constants/request.js';
import { CloudinaryImage, TRANSFORMATIONS } from 'components/image.js';

import css from 'styles/pages/Reveries.module.scss';

const query = `
{
  getAllPosts(limit: 3, type: Reverie) {
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

const Reverie = memo(({ reverie }) => {
  const [isInView, setInView] = useState(false);
  return (
    <LazyLoader setInView={setInView}>
      <Zoomer
        determinant={isInView}
        duration={400}
        className={css['reveries-index-reverie']}>
        <Title>{reverie.title}</Title>
        <ReverieImage reverie={reverie} />
        <Paragraph className={css['reveries-index-paragraph']} truncate={60}>
          {reverie.description}
        </Paragraph>
      </Zoomer>
    </LazyLoader>
  );
});

/**
 * Retrieve reverie image if exists
 * @param {Object} reverie - Reference reverie to image
 */
const ReverieImage = ({ reverie }) => {
  const theme = useSelector(({theme}) => theme)
  if (!reverie.image) return null;
  return (
    <CloudinaryImage
      src={reverie.image}
      alt={reverie.title}
      lazy={TRANSFORMATIONS.MEDIUM_WIDE}
      className={css[`reveries-index-image-${theme}`]}
    />
  );
};

export default Reveries;
