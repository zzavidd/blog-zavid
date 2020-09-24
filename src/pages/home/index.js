import classnames from 'classnames';
import React, { useState, useEffect } from 'react';
import { zDate } from 'zavid-modules';

import { Post } from 'classes';
import { Field, FieldRow } from 'components/form';
import { Icon } from 'components/icon';
import CloudImage, { ASPECT_RATIO, Signature } from 'components/image';
import { Flexer, Responsive } from 'components/layout';
import { Title, Paragraph, VanillaLink } from 'components/text';
import { Fader, Zoomer } from 'components/transitioner';
import { redevelopmentDate } from 'constants/settings';
import css from 'styles/pages/Home.module.scss';

const Home = ({ homeText, latestDiaryEntry, latestReverie, randomPosts }) => {
  return (
    <>
      <div className={css['home-page']}>
        <Introduction content={homeText} />
        <HomeRow>
          <HomeField xl={6}>
            <LatestDiaryEntry entry={latestDiaryEntry} />
          </HomeField>
          <HomeField xl={6}>
            <LatestReverie reverie={latestReverie} />
          </HomeField>
        </HomeRow>
      </div>
      <HomeRow>
        <RandomPostsGrid posts={randomPosts} />
      </HomeRow>
    </>
  );
};

const Introduction = ({ content }) => {
  const [isLoaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, [isLoaded]);
  return (
    <HomeRow className={css['introduction-wrapper']}>
      <HomeField xl={7}>
        <Fader
          determinant={isLoaded}
          duration={800}
          className={css['introduction-text']}>
          <Title className={css['introduction-welcome']}>
            You&#39;ve arrived. Welcome.
          </Title>
          <Paragraph
            className={css['introduction-message']}
            substitutions={{
              redevelopmentDate: zDate.formatDate(redevelopmentDate, false),
            }}>
            {content}
          </Paragraph>
        </Fader>
      </HomeField>
      <HomeField xl={5}>
        <Fader determinant={isLoaded} duration={800} delay={600}>
          <Signature className={css['introduction-signature']} />
        </Fader>
      </HomeField>
    </HomeRow>
  );
};

const LatestDiaryEntry = ({ entry }) => {
  if (!entry) return null;

  const [isLoaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, [isLoaded]);

  const date = zDate.formatDate(entry.date, true);
  return (
    <Fader
      determinant={isLoaded}
      duration={800}
      delay={1000}
      className={css['latest-diary']}>
      <Flexer>
        <div>
          <div className={css['latest-shared-heading']}>
            Latest Diary Entry:
          </div>
          <Title className={css['latest-diary-title']}>{date}</Title>
        </div>
        <Icon name={'feather-alt'} className={css['latest-diary-feather']} />
      </Flexer>
      <Paragraph
        className={css['latest-diary-content']}
        truncate={80}
        moreclass={css['latest-diary-readmore']}
        moretext={'Read my latest diary entry...'}
        morelink={`/diary/${entry.slug}`}>
        {entry.content}
      </Paragraph>
    </Fader>
  );
};

const LatestReverie = ({ reverie }) => {
  const [isLoaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, [isLoaded]);
  return (
    <Fader
      determinant={isLoaded}
      duration={800}
      delay={1200}
      className={css['latest-reverie']}>
      <Responsive
        defaultView={
          <Flexer>
            <div>
              <LatestReverieHeader reverie={reverie} />
              <LatestReverieParagraph reverie={reverie} />
            </div>
            <LatestReverieImage image={reverie.image} />
          </Flexer>
        }
        xl={
          <>
            <LatestReverieHeader reverie={reverie} />
            <LatestReverieImage image={reverie.image} />
            <LatestReverieParagraph reverie={reverie} />
          </>
        }
      />
    </Fader>
  );
};

const LatestReverieHeader = ({ reverie }) => {
  const date = zDate.formatDate(reverie.datePublished, true);
  return (
    <Flexer>
      <Icon name={'book-open'} className={css['latest-reverie-icon']} />
      <div>
        <div className={css['latest-shared-heading']}>Latest Reverie:</div>
        <Title className={css['latest-reverie-title']}>{reverie.title}</Title>
        <div className={css['latest-reverie-date']}>{date}</div>
      </div>
    </Flexer>
  );
};

const LatestReverieParagraph = ({ reverie }) => {
  return (
    <Paragraph
      className={css['latest-reverie-content']}
      truncate={60}
      moreclass={css['latest-reverie-readmore']}
      moretext={'Read my latest reverie...'}
      morelink={`/reveries/${reverie.slug}`}>
      {reverie.content}
    </Paragraph>
  );
};

const LatestReverieImage = ({ image }) => {
  const ReverieImage = ({ aspectRatio }) => {
    return (
      <CloudImage
        src={image}
        aspectRatio={aspectRatio}
        containerClassName={css['latest-reverie-image-container']}
        imageClassName={css['latest-reverie-image']}
      />
    );
  };
  return (
    <Responsive
      defaultView={<ReverieImage aspectRatio={ASPECT_RATIO.SQUARE} />}
      xl={<ReverieImage aspectRatio={ASPECT_RATIO.WIDE} />}
    />
  );
};

const RandomPostsGrid = ({ posts }) => {
  const [isLoaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, [isLoaded]);
  return (
    <div className={css['random-posts-wrapper']}>
      <Title className={css['random-posts-heading']}>
        A random selection of posts to trigger the taste buds...
      </Title>
      <div className={css['random-posts-grid']}>
        {posts.map((post, key) => {
          const directory = Post.getDirectory(post.type);
          return (
            <Zoomer
              determinant={isLoaded}
              duration={500}
              className={css['random-post-unit']}
              key={key}>
              <VanillaLink href={`/${directory}/${post.slug}`}>
                <CloudImage
                  src={post.image}
                  containerClassName={css['random-post-image-wrapper']}
                  imageClassName={css['random-post-image']}
                  aspectRatio={ASPECT_RATIO.WIDE}
                />
                <Title className={css['random-post-title']}>{post.title}</Title>
                <div className={css['random-post-date']}>
                  {post.type} | {zDate.formatDate(post.datePublished, true)}
                </div>
              </VanillaLink>
            </Zoomer>
          );
        })}
      </div>
    </div>
  );
};

const HomeRow = (props) => {
  const classes = classnames(css['home-row'], props.className);
  return (
    <FieldRow {...props} className={classes}>
      {props.children}
    </FieldRow>
  );
};

const HomeField = (props) => {
  return (
    <Field {...props} className={css['home-field']}>
      {props.children}
    </Field>
  );
};

Home.getInitialProps = async ({ query }) => {
  return { ...query };
};

export default Home;
