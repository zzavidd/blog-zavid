import React from 'react';
import { zDate } from 'zavid-modules';

import { BackButton, AdminButton } from 'components/button';
import { Spacer, Toolbar } from 'components/layout';
import ShareBlock from 'components/share';
import { Paragraph, Title, Divider } from 'components/text';
import Timeline, { TIMELINE_TYPE } from 'components/timeline';
import css from 'styles/pages/Posts.module.scss';

const DiarySingle = ({ diaryEntry, previousDiaryEntry = {}, nextDiaryEntry = {} }) => {
  const date = zDate.formatDate(diaryEntry.date, true);
  const shareMessage = `"Diary: ${date}" on ZAVID`;

  return (
    <Spacer>
      <div className={css['post-single']}>
        <Title className={css['post-single-title']}>Diary: {date}</Title>
        <Paragraph className={css['post-single-content']}>
          {diaryEntry.content}
        </Paragraph>
        <Timeline
          type={TIMELINE_TYPE.DIARY}
          previous={{
            slug: previousDiaryEntry.slug,
            label: zDate.formatDate(previousDiaryEntry.date, true)
          }}
          next={{
            slug: nextDiaryEntry.slug,
            label: zDate.formatDate(nextDiaryEntry.date, true)
          }}
        />
        <Divider />
        <ShareBlock
          headline={'Share This Diary Entry'}
          message={shareMessage}
          url={location.href}
        />
      </div>
      <Toolbar spaceItems={true} hasBackButton={true}>
        <BackButton onClick={navigateToReveries}>Back to Diary</BackButton>
        <AdminButton onClick={() => navigateToEdit(diaryEntry.id)}>
          Edit Diary Entry
        </AdminButton>
      </Toolbar>
    </Spacer>
  );
};

const navigateToReveries = () => (location.href = '/diary');
const navigateToEdit = (id) => (location.href = `/admin/diary/edit/${id}`);

DiarySingle.getInitialProps = async ({ query }) => {
  return { ...query };
};

export default DiarySingle;
