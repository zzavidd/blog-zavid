import React, { useState, useEffect, memo } from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { CloudinaryImage, TRANSFORMATIONS } from 'components/image.js';
import { LazyLoader } from 'components/loader.js';
import { Title, Paragraph } from 'components/text.js';
import { Zoomer } from 'components/transitioner.js';
import request from 'constants/request.js';
import css from 'styles/pages/Reveries.module.scss';

const query = `
{
  getAllPosts(type: Reverie) {
    id
    title,
    content,
    image
  }
}
`;

const ReveriesList = () => {
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
        setReveries(data.getAllPosts);
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
          {reverie.content}
        </Paragraph>
      </Zoomer>
    </LazyLoader>
  );
});

const ReverieImage = ({ reverie }) => {
  const theme = useSelector(({theme}) => theme);
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

export default ReveriesList;
