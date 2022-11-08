import {
  faChevronLeft,
  faChevronRight,
  faLeftLong,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import type { PostDAO } from 'classes/posts/PostDAO';
import { PostStatic } from 'classes/posts/PostStatic';
import { NextImage } from 'components/Image';
import ShareBlock from 'components/ShareBlock';
import Events from 'constants/events';
import Settings from 'constants/settings';
import type { Substitutions } from 'constants/types';
import Utils from 'constants/utils';
import ContextMenu from 'fragments/shared/ContextMenu';
import ZDate from 'lib/date';
import ZString from 'lib/string';
import AS from 'styles/Pages/Article.styles';

export default function PostTemplatePage(postTrio: PostTrio) {
  const { current: post } = postTrio;
  const shareMessage = `"${post.title}" on ZAVID`;

  const [state, setState] = useState({
    contextMenuVisible: false,
    focusedTextContent: '',
  });
  const dispatch = Utils.createDispatch(setState);

  const mainRef = useRef<HTMLElement>(null);
  const contextMenuRef = useRef<HTMLMenuElement>(null);
  const router = useRouter();

  const substitutions = useMemo(() => {
    const subs: Substitutions = {};
    const contentImages = JSON.parse(post.contentImages as string) || [];
    contentImages.forEach((image: string, key: number) => {
      subs[`image${key + 1}`] = `![](${Settings.CLOUDINARY_BASE_URL}/${image})`;
    });
    return subs;
  }, [post.contentImages]);

  const { backUrl, backButtonText } = useMemo(() => {
    let url;
    let buttonText = 'Back to ';

    if (PostStatic.isPage(post)) {
      const basePath = PostStatic.getDirectory(post.domainType!);
      url = `/${basePath}/${post.domainSlug}`;
      buttonText += post.domainTitle;
    } else {
      url = `/${PostStatic.getDirectory(post.type!)}`;
      buttonText += `${post.type}s`;
    }

    return {
      backUrl: url,
      backButtonText: buttonText,
    };
  }, [post]);

  // Register paragraph event listeners.
  useEffect(() => {
    Events.setContextMenuEvents(mainRef, contextMenuRef, state, dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainRef, contextMenuRef]);

  return (
    <React.Fragment>
      <AS.Layout>
        <TopNavigator postTrio={postTrio} />
        <AS.Main ref={mainRef}>
          <AS.Title>{PostStatic.getPostTitle(post)}</AS.Title>
          {post.datePublished && !PostStatic.isPrivate(post) ? (
            <AS.Date dateTime={ZDate.formatISO(post.datePublished)}>
              {ZDate.format(post.datePublished)}
            </AS.Date>
          ) : null}
          {post.image ? (
            <AS.ImageBox>
              <NextImage
                src={post.image as string}
                alt={post.title}
                layout={'responsive'}
                width={16}
                height={9}
                objectFit={'cover'}
                priority={true}
                placeholder={'blur'}
                blurDataURL={post.imagePlaceholder}
              />
            </AS.ImageBox>
          ) : null}
          <AS.Content substitutions={substitutions}>{post.content}</AS.Content>
          <AS.Signature
            layout={'fixed'}
            width={200}
            height={200}
            objectFit={'scale-down'}
          />
          <AS.Footer>
            <ShareBlock
              headline={'Share This Post'}
              message={shareMessage}
              url={`${Settings.DOMAIN}/${router.asPath}`}
            />
          </AS.Footer>
        </AS.Main>
        <AS.BottomNavigator>
          {/* TODO: Cater for post pages with 'random' domain. */}
          <AS.BackLinkBox>
            <Link href={backUrl} passHref={true}>
              <AS.BackLink>
                <FontAwesomeIcon icon={faLeftLong} />
                <span>{backButtonText}</span>
              </AS.BackLink>
            </Link>
          </AS.BackLinkBox>
        </AS.BottomNavigator>
      </AS.Layout>
      <ContextMenu
        sourceTitle={`${post.type}: ${PostStatic.getPostTitle(post)}`}
        focalText={state.focusedTextContent}
        visible={state.contextMenuVisible}
        onClose={() => dispatch({ contextMenuVisible: false })}
        ref={contextMenuRef}
      />
    </React.Fragment>
  );
}
function TopNavigator({ postTrio }: TopNavigatorProps) {
  const { current, previous, next } = postTrio;
  const directory = PostStatic.getDirectory(current.type);
  const postType = ZString.capitalise(current.type);
  return (
    <AS.TopNavigator>
      <div>
        {previous ? (
          <Link href={`/${directory}/${previous.slug}`} passHref={true}>
            <AS.TopNavigatorContent direction={'previous'}>
              <FontAwesomeIcon icon={faChevronLeft} />
              <AS.TopNavigatorText>
                <h6>Previous {postType}</h6>
                <p>
                  #{previous.typeId}: {previous.title}
                </p>
              </AS.TopNavigatorText>
            </AS.TopNavigatorContent>
          </Link>
        ) : null}
      </div>
      {!PostStatic.isPage(current) ? (
        <AS.TopNavigatorContent direction={'current'}>
          <AS.TopNavigatorText>
            <h6>Current {postType}</h6>
            <p>
              #{current.typeId}: {current.title}
            </p>
          </AS.TopNavigatorText>
        </AS.TopNavigatorContent>
      ) : null}
      <div>
        {next ? (
          <Link href={`/${directory}/${next.slug}`} passHref={true}>
            <AS.TopNavigatorContent direction={'next'}>
              <FontAwesomeIcon icon={faChevronRight} />
              <AS.TopNavigatorText>
                <h6>Next {postType}</h6>
                <p>
                  #{next.typeId}: {next.title}
                </p>
              </AS.TopNavigatorText>
            </AS.TopNavigatorContent>
          </Link>
        ) : null}
      </div>
    </AS.TopNavigator>
  );
}

export interface PostTrio {
  current: PostDAO;
  next?: PostDAO;
  previous?: PostDAO;
}

interface TopNavigatorProps {
  postTrio: PostTrio;
}
