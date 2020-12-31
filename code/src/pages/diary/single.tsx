import { NextPageContext } from 'next';
import React, { useState } from 'react';
import { zDate } from 'zavid-modules';

import { DiaryDAO } from 'classes';
import { AdminButton, BackButton } from 'src/components/button';
import { Icon } from 'src/components/icon';
import { Signature } from 'src/components/image';
import { Spacer, Toolbar } from 'src/components/layout';
import { ImageModal } from 'src/components/modal';
import ShareBlock from 'src/components/share';
import { Divider, Paragraph, Title } from 'src/components/text';
import Timeline, { TimelineType } from 'src/components/timeline';
import { isAuthenticated } from 'src/lib/cookies';
import TagBlock from 'src/lib/pages/diary/tags';
import { DAOParse } from 'src/lib/parser';
import css from 'src/styles/pages/Posts.module.scss';

const DiarySingle = ({
  diaryEntry,
  previousDiaryEntry = {},
  nextDiaryEntry = {}
}: DiarySingle) => {
  const date = zDate.formatDate(diaryEntry.date!, { withWeekday: true });
  const shareMessage = `"Diary: ${date}" on ZAVID`;

  const [isImageModalVisible, setImageModalVisibility] = useState(false);
  const [imageContent, setImageContent] = useState('');

  return (
    <>
      <Spacer>
        <div className={css['post-single']}>
          <Title className={css['diary-single-title']}>
            Diary Entry #{diaryEntry.entryNumber}: {diaryEntry.title}
          </Title>
          <div className={css['diary-single-date']}>{date}</div>
          <FavouriteNotice diaryEntry={diaryEntry} />
          <Paragraph
            className={css['post-single-content']}
            onMouseUpEachParagraph={(e) => {
              setImageContent(e.currentTarget.innerText);
              setImageModalVisibility(true);
            }}>
            {diaryEntry.content}
          </Paragraph>
          <Signature />
          <Paragraph className={css['post-single-footnote']}>
            {diaryEntry.footnote}
          </Paragraph>
          <Timeline
            type={TimelineType.DIARY}
            previous={{
              slug: previousDiaryEntry.entryNumber?.toString(),
              label: `Diary Entry #${previousDiaryEntry.entryNumber}: ${previousDiaryEntry.title}`
            }}
            next={{
              slug: nextDiaryEntry.entryNumber?.toString(),
              label: `Diary Entry #${nextDiaryEntry.entryNumber}: ${nextDiaryEntry.title}`
            }}
          />
          <TagBlock
            tags={diaryEntry.tags!}
            className={css['diary-single-tags']}
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
            <AdminButton onClick={() => navigateToEdit(diaryEntry.id!)}>
              Edit Diary Entry
            </AdminButton>
          )}
        </Toolbar>
      </Spacer>
      <ImageModal
        visible={isImageModalVisible}
        closeFunction={() => setImageModalVisibility(false)}
        content={imageContent}
      />
    </>
  );
};

const FavouriteNotice = ({ diaryEntry }: { diaryEntry: DiaryDAO }) => {
  if (!diaryEntry.isFavourite) return null;
  return (
    <div className={css['diary-single-favourite']}>
      <Icon name={'star'} />
      <span>{'This diary entry is a personal Zavid favourite.'}</span>
    </div>
  );
};

const navigateToReveries = (): void => {
  location.href = '/diary';
};
const navigateToEdit = (id: number): void => {
  location.href = `/admin/diary/edit/${id}`;
};

DiarySingle.getInitialProps = async ({ query }: NextPageContext) => {
  const diaryEntry = DAOParse<DiaryDAO>(query.diaryEntry);
  const previousDiaryEntry = DAOParse<DiaryDAO>(query.previousDiaryEntry);
  const nextDiaryEntry = DAOParse<DiaryDAO>(query.nextDiaryEntry);
  return { diaryEntry, previousDiaryEntry, nextDiaryEntry };
};

export default DiarySingle;

interface DiarySingle {
  diaryEntry: DiaryDAO;
  previousDiaryEntry: DiaryDAO;
  nextDiaryEntry: DiaryDAO;
}
