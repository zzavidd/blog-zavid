import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import React, { useState } from 'react';
import { zDate, zText } from 'zavid-modules';

import type { DiaryDAO } from 'classes/diary/DiaryDAO';
import { DiaryStatic } from 'classes/diary/DiaryStatic';
import { AdminButton, BackButton } from 'components/button';
import { Curator } from 'components/curator';
import { Label } from 'components/form';
import { Signature } from 'components/image';
import { Spacer, Toolbar } from 'components/layout';
import { Icon } from 'components/library';
import ShareBlock from 'components/share';
import { Divider, Paragraph, Title } from 'components/text';
import Timeline, { TimelineType } from 'components/timeline';
import { SITE_TITLE } from 'constants/settings';
import type { NextPageWithLayout, PathDefinition } from 'constants/types';
import AdminLock from 'fragments/AdminLock';
import TagBlock from 'fragments/diary/DiaryTags';
import Layout from 'fragments/Layout';
import PageMetadata from 'fragments/PageMetadata';
import { CuratePrompt } from 'fragments/shared/CuratePrompt';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import SSR from 'private/ssr';
import css from 'styles/pages/Posts.module.scss';

// eslint-disable-next-line react/function-component-definition
const DiaryEntryPage: NextPageWithLayout<DiaryEntryPageProps> = ({
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
              slug: previousDiaryEntry?.entryNumber?.toString(),
              label: `Diary Entry #${previousDiaryEntry?.entryNumber}: ${previousDiaryEntry?.title}`,
            }}
            next={{
              slug: nextDiaryEntry?.entryNumber?.toString(),
              label: `Diary Entry #${nextDiaryEntry?.entryNumber}: ${nextDiaryEntry?.title}`,
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
          <AdminLock>
            <AdminButton onClick={() => navigateToEdit(diaryEntry.id!)}>
              Edit Diary Entry
            </AdminButton>
          </AdminLock>
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
> = async ({ query, req, res }) => {
  try {
    const number = parseInt(query.number as string);
    const diaryTrio = JSON.parse(await SSR.Diary.getByNumber(number));
    const diaryEntry = diaryTrio.current;

    const session = await unstable_getServerSession(req, res, nextAuthOptions);
    if (!session && DiaryStatic.isProtected(diaryEntry)) {
      throw new Error('No diary entry found');
    }

    if (!DiaryStatic.isPublished(diaryEntry)) {
      res.setHeader('X-Robots-Tag', 'noindex');
    }

    return {
      props: {
        pathDefinition: {
          title: `Diary Entry #${diaryEntry.entryNumber}: ${diaryEntry.title} | ${SITE_TITLE}`,
          description: zText.extractExcerpt(diaryEntry.content!),
          url: `/diary/${diaryEntry.slug}`,
          article: {
            publishedTime: diaryEntry.date as string,
            tags: JSON.parse(diaryEntry.tags as string),
          },
        },
        pageProps: diaryTrio,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

DiaryEntryPage.getLayout = Layout.addPartials;
export default DiaryEntryPage;

interface DiaryEntryPageProps {
  pathDefinition: PathDefinition;
  pageProps: {
    current: DiaryDAO;
    previous: DiaryDAO;
    next: DiaryDAO;
  };
}
