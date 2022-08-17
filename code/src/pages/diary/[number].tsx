import type { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';
import { zDate, zText } from 'zavid-modules';

import type { DiaryDAO } from 'classes';
import { AdminButton, BackButton } from 'src/components/button';
import { Curator } from 'src/components/curator';
import { Label } from 'src/components/form';
import { Signature } from 'src/components/image';
import { Spacer, Toolbar } from 'src/components/layout';
import ShareBlock from 'src/components/share';
import { Divider, Paragraph, Title } from 'src/components/text';
import Timeline, { TimelineType } from 'src/components/timeline';
import type { PathDefinition } from 'src/constants/paths';
import { isAuthenticated } from 'src/lib/cookies';
import { Icon } from 'src/lib/library';
import TagBlock from 'src/lib/pages/diary/tags';
import { CuratePrompt } from 'src/lib/pages/posts/prompt';
import PageMetadata from 'src/partials/meta';
import { siteTitle } from 'src/settings';
import css from 'src/styles/pages/Posts.module.scss';

import { getDiaryEntrySSR } from '../api/diary';

// eslint-disable-next-line react/function-component-definition
const DiaryEntryPage: NextPage<DiaryEntryPageProps> = ({
  pathDefinition,
  pageProps,
}) => {
  const {
    current: diaryEntry,
    previous: previousDiaryEntry,
    next: nextDiaryEntry,
  } = pageProps;

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
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
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
              label: `Diary Entry #${previousDiaryEntry.entryNumber}: ${previousDiaryEntry.title}`,
            }}
            next={{
              slug: nextDiaryEntry.entryNumber?.toString(),
              label: `Diary Entry #${nextDiaryEntry.entryNumber}: ${nextDiaryEntry.title}`,
            }}
          />
          <Divider />
          <Label>Tags:</Label>
          <TagBlock tags={diaryEntry.tags!} />
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
      <CuratePrompt
        target={curatePromptRef!}
        visible={isCuratePromptVisible}
        onHide={() => setCuratePromptVisible(false)}
        onClick={() => {
          setImageModalVisibility(true);
          setCuratePromptVisible(false);
        }}
      />
    </React.Fragment>
  );
};

function FavouriteNotice({ diaryEntry }: { diaryEntry: DiaryDAO }) {
  if (!diaryEntry.isFavourite) return null;
  return (
    <div className={css['diary-single-favourite']}>
      <Icon name={'star'} />
      <span>{'This diary entry is a personal Zavid favourite.'}</span>
    </div>
  );
}

const navigateToReveries = (): void => {
  location.href = '/diary';
};
const navigateToEdit = (id: number): void => {
  location.href = `/admin/diary/edit/${id}`;
};

export const getServerSideProps: GetServerSideProps<
  DiaryEntryPageProps
> = async ({ query }) => {
  try {
    const entries = JSON.parse(await getDiaryEntrySSR(query.number as string));
    return {
      props: {
        pathDefinition: {
          title: `Diary Entry #${entries.current.entryNumber}: ${entries.current.title} | ${siteTitle}`,
          description: zText.extractExcerpt(entries.current.content!),
          url: `/diary/${entries.current.slug}`,
        },
        pageProps: entries,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default DiaryEntryPage;

interface DiaryEntryPageProps {
  pathDefinition: PathDefinition;
  pageProps: {
    current: DiaryDAO;
    previous: DiaryDAO;
    next: DiaryDAO;
  };
}