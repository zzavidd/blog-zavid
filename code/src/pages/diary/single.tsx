import { NextPageContext } from 'next';
import React, { useState } from 'react';
import { Overlay } from 'react-bootstrap';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { zDate } from 'zavid-modules';

import { DiaryDAO, Theme } from 'classes';
import {
  AdminButton,
  BackButton,
  InvisibleButton
} from 'src/components/button';
import { Curator } from 'src/components/curator';
import { Icon } from 'src/components/icon';
import { Signature } from 'src/components/image';
import { ScreenWidth, Spacer, Toolbar } from 'src/components/layout';
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
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const isMedium = useMediaQuery({ query: ScreenWidth.MEDIUM });

  const [isImageModalVisible, setImageModalVisibility] = useState(false);
  const [isCuratePromptVisible, setCuratePromptVisible] = useState(false);
  const [curatePromptRef, setCuratePromptRef] = useState<HTMLElement>();
  const [imageContent, setImageContent] = useState('');

  const date = zDate.formatDate(diaryEntry.date!, { withWeekday: true });
  const shareMessage = `"Diary: ${date}" on ZAVID`;

  const onTextLongPress = (target: HTMLElement) => {
    setImageContent(target.innerText);
    setCuratePromptRef(target);
    setCuratePromptVisible(true);
  };

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
            onLongPress={onTextLongPress}>
            {diaryEntry.content}
          </Paragraph>
          <Signature />
          <Paragraph
            className={css['post-single-footnote']}
            onLongPress={onTextLongPress}>
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
      <Curator
        visible={isImageModalVisible}
        closeFunction={() => setImageModalVisibility(false)}
        sourceTitle={`Diary Entry #${diaryEntry.entryNumber}: ${diaryEntry.title}`}
        content={imageContent}
      />
      {/* TODO: Abstract this for diary and post */}
      <Overlay
        target={curatePromptRef!}
        show={isCuratePromptVisible}
        onHide={() => setCuratePromptVisible(false)}
        placement={isMedium ? 'top-end' : 'right'}
        rootClose={true}
        rootCloseEvent={'mousedown'}>
        {({ ...props }) => {
          return (
            <div
              {...props}
              style={{
                backgroundColor: Theme.isLight(theme)
                  ? 'rgb(168 131 187)'
                  : 'rgb(119, 77, 140)',
                boxShadow: `0 0 5px 3px ${
                  Theme.isLight(theme)
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(0, 0, 0, 0.2)'
                }`,
                borderRadius: '5px',
                padding: '0.2em 0.6em',
                ...props.style
              }}>
              <Icon name={'image'} withRightSpace={false} />
              <InvisibleButton
                onClick={() => {
                  setImageModalVisibility(true);
                  setCuratePromptVisible(false);
                }}>
                Curate
              </InvisibleButton>
            </div>
          );
        }}
      </Overlay>
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
