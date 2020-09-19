import classnames from 'classnames';
import React from 'react';
import { zDate } from 'zavid-modules';

import { Post } from 'classes';
import { Field, FieldRow } from 'components/form';
import CloudImage, { ASPECT_RATIO, Signature } from 'components/image';
import { Title, Paragraph, VanillaLink, Divider } from 'components/text';
import { redevelopmentDate } from 'constants/settings';
import css from 'styles/pages/Home.module.scss';

const Home = ({ homeText, latestDiaryEntry, randomPosts }) => {
  return (
    <>
      <div className={css['home-page']}>
        <Introduction content={homeText} />
        <Divider />
        <HomeRow>
          <HomeField lg={6}>
            <LatestDiaryEntry entry={latestDiaryEntry} />
          </HomeField>
          <HomeField lg={6}></HomeField>
        </HomeRow>
      </div>
      <HomeRow>
        <RandomPosts posts={randomPosts} />
      </HomeRow>
    </>
  );
};

const Introduction = ({ content }) => {
  return (
    <HomeRow className={css['introduction-wrapper']}>
      <HomeField xl={8}>
        <div className={css['introduction-text']}>
          <Title className={css['introduction-welcome']}>
            You&#39;ve arrived. Welcome.
          </Title>
          <Paragraph
            className={css['introduction-message']}
            substitutions={{
              redevelopmentDate: zDate.formatDate(redevelopmentDate, false)
            }}>
            {content}
          </Paragraph>
        </div>
      </HomeField>
      <HomeField xl={4}>
        <Signature className={css['introduction-signature']} />
      </HomeField>
    </HomeRow>
  );
};

const LatestDiaryEntry = ({ entry }) => {
  const date = zDate.formatDate(entry.date, true);
  return (
    <div className={css['latest-diary']}>
      <div>Latest Diary Entry:</div>
      <Title className={css['latest-diary-title']}>{date}</Title>
      <Paragraph
        className={css['latest-diary-content']}
        truncate={60}
        moreclass={css['latest-diary-readmore']}
        moretext={'Read my latest diary entry...'}
        morelink={`/diary/${entry.slug}`}>
        {entry.content}
      </Paragraph>
    </div>
  );
};

const RandomPosts = ({ posts }) => {
  return (
    <div className={css['random-posts']}>
      {posts.map((post, key) => {
        const directory = Post.getDirectory(post.type);
        return (
          <VanillaLink
            href={`/${directory}/${post.slug}`}
            className={css['random-post']}
            key={key}>
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
        );
      })}
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
