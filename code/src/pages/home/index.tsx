import classnames from 'classnames';
import { NextPageContext } from 'next';
import React, { useEffect, useState } from 'react';
import { ColProps } from 'react-bootstrap';
import { zDate } from 'zavid-modules';

import { DiaryDAO, PostDAO, PostStatic, ReactComponent } from 'classes';
import { Field, FieldRow } from 'src/components/form';
import { Icon } from 'src/components/icon';
import CloudImage, { AspectRatio, Signature } from 'src/components/image';
import { Flexer, Responsive } from 'src/components/layout';
import { Paragraph, Title, VanillaLink } from 'src/components/text';
import { Fader, Zoomer } from 'src/components/transitioner';
import { DAOParse } from 'src/lib/parser';
import { redevelopmentDate } from 'src/settings';
import css from 'src/styles/pages/Home.module.scss';

const Home = ({
  homeText,
  latestDiaryEntry,
  latestReverie,
  randomPosts
}: HomeProps) => {
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

const Introduction = ({ content }: Introduction) => {
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
              redevelopmentDate: zDate.formatDate(redevelopmentDate)
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

const LatestDiaryEntry = ({ entry }: LatestDiaryEntry) => {
  if (!entry) return null;

  const [isLoaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, [isLoaded]);

  const date = zDate.formatDate(entry.date!, { withWeekday: true });
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
          <Title className={css['latest-diary-title']}>
            Diary Entry #{entry.entryNumber}: {entry.title}
          </Title>
          <div className={css['latest-diary-date']}>{date}</div>
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

const LatestReverie = ({ reverie }: LatestReverie) => {
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
            <LatestReverieImage image={reverie.image as string} />
          </Flexer>
        }
        xl={
          <>
            <LatestReverieHeader reverie={reverie} />
            <LatestReverieImage image={reverie.image as string} />
            <LatestReverieParagraph reverie={reverie} />
          </>
        }
      />
    </Fader>
  );
};

const LatestReverieHeader = ({ reverie }: LatestReverie) => {
  const date = zDate.formatDate(reverie.datePublished!, { withWeekday: true });
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

const LatestReverieParagraph = ({ reverie }: LatestReverie) => {
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

const LatestReverieImage = ({ image }: LatestReverieImage) => {
  interface ReverieImage {
    aspectRatio: AspectRatio;
  }
  const ReverieImage = ({ aspectRatio }: ReverieImage) => {
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
      defaultView={<ReverieImage aspectRatio={AspectRatio.SQUARE} />}
      xl={<ReverieImage aspectRatio={AspectRatio.WIDE} />}
    />
  );
};

const RandomPostsGrid = ({ posts }: RandomPostsGrid) => {
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
          const directory = PostStatic.getDirectory(post.type!);
          return (
            <Zoomer
              determinant={isLoaded}
              duration={500}
              className={css['random-post-unit']}
              key={key}>
              <VanillaLink href={`/${directory}/${post.slug}`}>
                <CloudImage
                  src={post.image as string}
                  containerClassName={css['random-post-image-wrapper']}
                  imageClassName={css['random-post-image']}
                  aspectRatio={AspectRatio.WIDE}
                />
                <Title className={css['random-post-title']}>{PostStatic.getPostTitle(post)}</Title>
                <div className={css['random-post-date']}>
                  {post.type} |{' '}
                  {zDate.formatDate(post.datePublished!, { withWeekday: true })}
                </div>
              </VanillaLink>
            </Zoomer>
          );
        })}
      </div>
    </div>
  );
};

const HomeRow = (props: ReactComponent) => {
  const classes = classnames(css['home-row'], props.className);
  return (
    <FieldRow {...props} className={classes}>
      {props.children}
    </FieldRow>
  );
};

const HomeField = (props: ColProps) => {
  return (
    <Field {...props} className={css['home-field']}>
      {props.children}
    </Field>
  );
};

Home.getInitialProps = async ({ query }: NextPageContext) => {
  const homeText = query.homeText as string;
  const latestDiaryEntry = DAOParse<DiaryDAO>(query.latestDiaryEntry as string);
  const latestReverie = DAOParse<PostDAO>(query.latestReverie as string);
  const randomPosts = DAOParse<PostDAO[]>(query.randomPosts as string);
  return { homeText, latestDiaryEntry, latestReverie, randomPosts };
};

export default Home;

interface HomeProps {
  homeText: string;
  latestDiaryEntry: DiaryDAO;
  latestReverie: PostDAO;
  randomPosts: PostDAO[];
}

interface Introduction {
  content: string;
}

interface LatestDiaryEntry {
  entry: DiaryDAO;
}

interface LatestReverie {
  reverie: PostDAO;
}

interface LatestReverieImage {
  image: string;
}

interface RandomPostsGrid {
  posts: PostDAO[];
}
