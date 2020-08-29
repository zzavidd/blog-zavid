import { useQuery } from '@apollo/client';
import React, { useState, useEffect, memo } from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { zDate } from 'zavid-modules';

import { alert } from 'components/alert.js';
import { CloudinaryImage, TRANSFORMATIONS } from 'components/image.js';
import { LazyLoader } from 'components/loader.js';
import { Title, Paragraph } from 'components/text.js';
import { Zoomer } from 'components/transitioner.js';
import { GET_POSTS_QUERY } from 'private/api/queries';
import css from 'styles/pages/Reveries.module.scss';

const ReveriesList = () => {
  const [reveries, setReveries] = useState([]);
  const [isLoaded, setLoaded] = useState(false);

  const { data, error: queryError, loading: queryLoading } = useQuery(
    GET_POSTS_QUERY,
    {
      variables: {
        sort: {
          field: 'datePublished',
          order: 'DESC'
        },
        type: 'Reverie'
      }
    }
  );

  useEffect(() => {
    if (queryLoading) return;
    if (queryError) alert.error(queryError);
    setReveries(data ? data.getAllPosts : []);
    setLoaded(true);
  }, [isLoaded, queryLoading]);

  return (
    <Container className={css['reveries-container']}>
      {reveries.map((reverie, key) => (
        <Reverie reverie={reverie} key={key} />
      ))}
    </Container>
  );
};

const Reverie = memo(({ reverie }) => {
  const theme = useSelector(({ theme }) => theme);
  const [isInView, setInView] = useState(false);

  const datePublished = zDate.formatDate(parseInt(reverie.datePublished), true);
  return (
    <LazyLoader setInView={setInView}>
      <Zoomer
        determinant={isInView}
        duration={400}
        className={css[`reveries-unit-${theme}`]}>
        <Title className={css['reveries-title']}>{reverie.title}</Title>
        <div>{datePublished}</div>
        <ReverieImage reverie={reverie} />
        <Paragraph
          cssOverrides={{ paragraph: css['reveries-paragraph'] }}
          truncate={60}>
          {reverie.content}
        </Paragraph>
      </Zoomer>
    </LazyLoader>
  );
});

const ReverieImage = ({ reverie }) => {
  const theme = useSelector(({ theme }) => theme);
  if (!reverie.image) return null;
  return (
    <CloudinaryImage
      src={reverie.image}
      alt={reverie.title}
      lazy={TRANSFORMATIONS.MEDIUM_WIDE}
      containerClassName={css[`reveries-image-${theme}`]}
    />
  );
};

export default ReveriesList;
