import {
  faChevronLeft,
  faChevronRight,
  faLeftLong,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { zText } from 'zavid-modules';

import type { DiaryDAO } from 'classes/diary/DiaryDAO';
import { DiaryStatic } from 'classes/diary/DiaryStatic';
import ShareBlock from 'componentsv2/ShareBlock';
import { DOMAIN, SITE_TITLE } from 'constants/settings';
import type { NextPageWithLayout, PathDefinition } from 'constants/types';
import Layout from 'fragments/Layout';
import PageMetadata from 'fragments/PageMetadata';
import ZDate from 'lib/date';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import SSR from 'private/ssr';
import FORM from 'stylesv2/Components/Form.styles';
import DiaryStyle from 'stylesv2/Pages/Diary.styles';
import DSS from 'stylesv2/Pages/Article.styles';

// eslint-disable-next-line react/function-component-definition
const DiaryEntryPage: NextPageWithLayout<DiaryEntryPageProps> = ({
  pathDefinition,
  pageProps,
}) => {
  const { current: diaryEntry } = pageProps;
  const router = useRouter();

  const tags = useMemo(() => {
    return (diaryEntry.tags as string[]).slice(0, 9).map((tag) => {
      return tag.replace(/\s/, '');
    });
  }, [diaryEntry.tags]);

  return (
    <DSS.Container>
      <PageMetadata {...pathDefinition} />
      <DSS.Layout>
        <TopNavigator diaryTrio={pageProps} />
        <DSS.Main>
          <DSS.Date dateTime={ZDate.formatISO(diaryEntry.date)}>
            {ZDate.format(diaryEntry.date)}
          </DSS.Date>
          <DSS.Title>{DiaryStatic.getTitle(diaryEntry)}</DSS.Title>
          {diaryEntry.isFavourite ? (
            <DSS.FavouriteNotice>
              <FontAwesomeIcon icon={faStar} />
              <span>This diary entry is a personal Zavid favourite.</span>
            </DSS.FavouriteNotice>
          ) : null}
          <DSS.Content>{diaryEntry.content}</DSS.Content>
          <DSS.Signature
            layout={'fixed'}
            width={200}
            height={200}
            objectFit={'scale-down'}
          />
          <DSS.Content>{diaryEntry.footnote}</DSS.Content>
          <DSS.Footer>
            <div>
              <FORM.Label>Tags:</FORM.Label>
              <DiaryStyle.EntryTagBlock>
                {tags.map((tag: string, key: number) => {
                  return (
                    <DiaryStyle.EntryTag key={key}>
                      <Link href={`/search?term=${tag}&onlyDiary=true`}>
                        <a>#{tag}</a>
                      </Link>
                    </DiaryStyle.EntryTag>
                  );
                })}
              </DiaryStyle.EntryTagBlock>
            </div>
            <ShareBlock
              headline={'Share This Diary Entry'}
              message={`Read "${DiaryStatic.getTitle(diaryEntry)}" on ZAVID`}
              url={DOMAIN + router.asPath}
            />
          </DSS.Footer>
        </DSS.Main>
        <DSS.BottomNavigator>
          <DSS.BackLinkBox>
            <Link href={'/diary'} passHref={true}>
              <DSS.BackLink>
                <FontAwesomeIcon icon={faLeftLong} />
                <span>Back to Diary</span>
              </DSS.BackLink>
            </Link>
          </DSS.BackLinkBox>
        </DSS.BottomNavigator>
      </DSS.Layout>
      {/* <Curator
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
        /> */}
    </DSS.Container>
  );
};

function TopNavigator({ diaryTrio }: { diaryTrio: DiaryEntryTrio }) {
  const { current, previous, next } = diaryTrio;
  return (
    <DSS.TopNavigator>
      {previous ? (
        <Link href={`/diary/${previous.entryNumber}`} passHref={true}>
          <DSS.TopNavigatorContent direction={'previous'}>
            <FontAwesomeIcon icon={faChevronLeft} />
            <DSS.TopNavigatorText>
              <h6>Previous Diary Entry</h6>
              <p>
                #{previous.entryNumber}: {previous.title}
              </p>
            </DSS.TopNavigatorText>
          </DSS.TopNavigatorContent>
        </Link>
      ) : null}
      <DSS.TopNavigatorContent direction={'current'}>
        <DSS.TopNavigatorText>
          <h6>Current Diary Entry</h6>
          <p>
            #{current.entryNumber}: {current.title}
          </p>
        </DSS.TopNavigatorText>
      </DSS.TopNavigatorContent>
      {next ? (
        <Link href={`/diary/${next.entryNumber}`} passHref={true}>
          <DSS.TopNavigatorContent direction={'next'}>
            <FontAwesomeIcon icon={faChevronRight} />
            <DSS.TopNavigatorText>
              <h6>Next Diary Entry</h6>
              <p>
                #{next.entryNumber}: {next.title}
              </p>
            </DSS.TopNavigatorText>
          </DSS.TopNavigatorContent>
        </Link>
      ) : null}
    </DSS.TopNavigator>
  );
}

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
            tags: diaryEntry.tags as string[],
          },
        },
        pageProps: diaryTrio,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
};

DiaryEntryPage.getLayout = Layout.addPartials;
export default DiaryEntryPage;

interface DiaryEntryPageProps {
  pathDefinition: PathDefinition;
  pageProps: DiaryEntryTrio;
}

interface DiaryEntryTrio {
  current: DiaryDAO;
  previous: DiaryDAO;
  next: DiaryDAO;
}
