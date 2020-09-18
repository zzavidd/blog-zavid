import React from 'react';
import { zDate } from 'zavid-modules';

import { Post } from 'classes';
import { Field, FieldRow } from 'components/form';
import CloudImage, { ASPECT_RATIO } from 'components/image';
import { Title, Paragraph, VanillaLink } from 'components/text';
import css from 'styles/pages/Home.module.scss';

const Home = ({ homeText, latestDiaryEntry, randomPosts }) => {
  return (
    <div className={css['home-page']}>
      <FieldRow>
        <Field xl={4}>
          <LatestDiaryEntry entry={latestDiaryEntry} />
        </Field>
        <Field xl={4}>
          <Introduction content={homeText} />
        </Field>
      </FieldRow>
      <FieldRow>
        <RandomPosts posts={randomPosts} />
      </FieldRow>
    </div>
  );
};

const Introduction = ({content}) => {
  return (
    <div className={css['introduction']}>
      <div className={css['introduction-text']}>{content}</div>
    </div>
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

Home.getInitialProps = async ({ query }) => {
  return { ...query };
};

export default Home;
