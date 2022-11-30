import {
  faChevronLeft,
  faChevronRight,
  faLeftLong,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';

import { DiaryStatic } from 'classes/diary/DiaryStatic';
import ShareBlock from 'components/ShareBlock';
import Events from 'constants/events';
import Settings from 'constants/settings';
import Utils from 'constants/utils';
import Layout from 'fragments/Layout';
import ContextMenu from 'fragments/shared/ContextMenu';
import ZDate from 'lib/date';
import * as ZText from 'lib/text';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import SSR from 'private/ssr';
import FORM from 'styles/Components/Form.styles';
import AS from 'styles/Pages/Article.styles';

// eslint-disable-next-line react/function-component-definition
const DiaryEntryPage: NextPageWithLayout<DiaryEntryPageProps> = ({
  pageProps,
}) => {
  const { current: diaryEntry } = pageProps;
  const [state, setState] = useState({
    contextMenuVisible: false,
    focusedTextContent: '',
  });
  const dispatch = Utils.createDispatch(setState);
  const router = useRouter();

  const { data: session } = useSession();
  const email = session?.user?.email;

  const mainRef = useRef<HTMLElement>(null);
  const contextMenuRef = useRef<HTMLMenuElement>(null);

  const tags = useMemo(() => {
    return (diaryEntry.tags as string[]).slice(0, 9).map((tag) => {
      return tag.replace(/\s/, '');
    });
  }, [diaryEntry.tags]);

  // Register paragraph event listeners.
  useEffect(() => {
    if (email === process.env.NEXT_PUBLIC_GOOGLE_EMAIL) {
      Events.setContextMenuEvents(mainRef, contextMenuRef, state, dispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainRef, contextMenuRef, email]);

  return (
    <AS.Container>
      <AS.Layout>
        <TopNavigator diaryTrio={pageProps} />
        <AS.Main ref={mainRef}>
          <AS.Date dateTime={ZDate.formatISO(diaryEntry.date)}>
            {ZDate.format(diaryEntry.date)}
          </AS.Date>
          <AS.Title>{DiaryStatic.getTitle(diaryEntry)}</AS.Title>
          {diaryEntry.isFavourite ? (
            <AS.FavouriteNotice>
              <FontAwesomeIcon icon={faStar} />
              <span>This diary entry is a personal Zavid favourite.</span>
            </AS.FavouriteNotice>
          ) : null}
          <AS.Content>{diaryEntry.content}</AS.Content>
          <AS.Signature
            layout={'fixed'}
            width={150}
            height={150}
            objectFit={'scale-down'}
          />
          <AS.Content>{diaryEntry.footnote}</AS.Content>
          <AS.Footer>
            {tags.length ? (
              <div>
                <FORM.Label>Tags:</FORM.Label>
                <AS.TagBlock>
                  {tags.map((tag: string, key: number) => {
                    return (
                      <AS.Tag key={key}>
                        <Link href={`/search?term=${tag}&onlyDiary=true`}>
                          <a>#{tag}</a>
                        </Link>
                      </AS.Tag>
                    );
                  })}
                </AS.TagBlock>
              </div>
            ) : null}
            <ShareBlock
              headline={'Share This Diary Entry'}
              message={`Read "${DiaryStatic.getTitle(diaryEntry)}" on ZAVID`}
              url={Settings.DOMAIN + router.asPath}
            />
          </AS.Footer>
        </AS.Main>
        <AS.BottomNavigator>
          <AS.BackLinkBox>
            <Link href={'/diary'} passHref={true}>
              <AS.BackLink>
                <FontAwesomeIcon icon={faLeftLong} />
                <span>Back to Diary</span>
              </AS.BackLink>
            </Link>
          </AS.BackLinkBox>
        </AS.BottomNavigator>
      </AS.Layout>
      <ContextMenu
        sourceTitle={DiaryStatic.getTitle(diaryEntry)}
        focalText={state.focusedTextContent}
        visible={state.contextMenuVisible}
        onClose={() => dispatch({ contextMenuVisible: false })}
        ref={contextMenuRef}
      />
    </AS.Container>
  );
};

function TopNavigator({ diaryTrio }: { diaryTrio: DiaryEntryTrio }) {
  const { current, previous, next } = diaryTrio;
  return (
    <AS.TopNavigator>
      {previous ? (
        <Link href={`/diary/${previous.entryNumber}`} passHref={true}>
          <AS.TopNavigatorContent direction={'previous'}>
            <FontAwesomeIcon icon={faChevronLeft} />
            <AS.TopNavigatorText>
              <h6>Previous Diary Entry</h6>
              <p>
                #{previous.entryNumber}: {previous.title}
              </p>
            </AS.TopNavigatorText>
          </AS.TopNavigatorContent>
        </Link>
      ) : null}
      <AS.TopNavigatorContent direction={'current'}>
        <AS.TopNavigatorText>
          <h6>Current Diary Entry</h6>
          <p>
            #{current.entryNumber}: {current.title}
          </p>
        </AS.TopNavigatorText>
      </AS.TopNavigatorContent>
      {next ? (
        <Link href={`/diary/${next.entryNumber}`} passHref={true}>
          <AS.TopNavigatorContent direction={'next'}>
            <FontAwesomeIcon icon={faChevronRight} />
            <AS.TopNavigatorText>
              <h6>Next Diary Entry</h6>
              <p>
                #{next.entryNumber}: {next.title}
              </p>
            </AS.TopNavigatorText>
          </AS.TopNavigatorContent>
        </Link>
      ) : null}
    </AS.TopNavigator>
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
          title: `Diary Entry #${diaryEntry.entryNumber}: ${diaryEntry.title} | ${Settings.SITE_TITLE}`,
          description: ZText.extractExcerpt(diaryEntry.content!),
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
