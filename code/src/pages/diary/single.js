import React from 'react';
import { zDate } from 'zavid-modules';

import { BackButton, AdminButton } from 'components/button';
import { Signature } from 'components/image';
import { Spacer, Toolbar } from 'components/layout';
import ShareBlock from 'components/share';
import { Paragraph, Title, Divider } from 'components/text';
import Timeline, { TimelineType } from 'components/timeline';
import { isAuthenticated } from 'lib/cookies';
import css from 'styles/pages/Posts.module.scss';

const DiarySingle = ({
  diaryEntry,
  previousDiaryEntry = {},
  nextDiaryEntry = {}
}) => {
  const date = zDate.formatDate(diaryEntry.date, { withWeekday: true });
  const shareMessage = `"Diary: ${date}" on ZAVID`;

  return (
    <Spacer>
      <div className={css['post-single']}>
        <Title className={css['diary-single-title']}>
          Diary Entry #{diaryEntry.entryNumber}: {diaryEntry.title}
        </Title>
        <div className={css['diary-single-date']}>{date}</div>
        <Paragraph className={css['post-single-content']}>
          {diaryEntry.content}
        </Paragraph>
        <Signature />
        <Timeline
          type={TimelineType.DIARY}
          previous={{
            slug: previousDiaryEntry.slug,
            label: `Diary Entry #${previousDiaryEntry.entryNumber}: ${previousDiaryEntry.title}`
          }}
          next={{
            slug: nextDiaryEntry.slug,
            label: `Diary Entry #${nextDiaryEntry.entryNumber}: ${nextDiaryEntry.title}`
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
        {isAuthenticated() && (
          <AdminButton onClick={() => navigateToEdit(diaryEntry.id)}>
            Edit Diary Entry
          </AdminButton>
        )}
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
