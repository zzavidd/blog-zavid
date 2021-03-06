import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from 'react-share';

import { Icon } from 'src/lib/library';
import css from 'src/styles/components/Share.module.scss';

import { alert } from './alert';
import { InvisibleButton } from './button';

export default (props: Share) => {
  const { headline = 'Share This Post' } = props;
  return (
    <div className={css['share-block']}>
      <div className={css['share-title']}>{headline}:</div>
      <div className={css['share-buttons']}>
        <ShareFacebook {...props} />
        <ShareTwitter {...props} />
        <ShareLinkedin {...props} />
        <ShareWhatsapp {...props} />
        <ShareLink {...props} />
      </div>
    </div>
  );
};

const ShareFacebook = ({ message, url }: Share) => {
  return (
    <FacebookShareButton quote={message} url={url}>
      <FacebookIcon size={50} round={true} />
    </FacebookShareButton>
  );
};

const ShareTwitter = ({ message, url }: Share) => {
  const handle = 'zzavidd';
  return (
    <TwitterShareButton title={message} url={url} via={handle}>
      <TwitterIcon size={50} round={true} />
    </TwitterShareButton>
  );
};

const ShareWhatsapp = ({ message, url }: Share) => {
  return (
    <WhatsappShareButton title={message} separator={'\n'} url={url}>
      <WhatsappIcon size={50} round={true} />
    </WhatsappShareButton>
  );
};

const ShareLinkedin = ({ message, url }: Share) => {
  return (
    <LinkedinShareButton title={message} url={url}>
      <LinkedinIcon size={50} round={true} />
    </LinkedinShareButton>
  );
};

const ShareLink = ({ url }: Share) => {
  const copyLink = () => {
    navigator.clipboard.writeText(url);
    alert.success("Copied this post's link to clipboard!");
  };
  return (
    <InvisibleButton className={css['copy-link-button']} onClick={copyLink}>
      <div>
        <Icon name={'share'} className={css['copy-link-icon']} />
      </div>
    </InvisibleButton>
  );
};

interface Share {
  headline?: string;
  message: string;
  url: string;
}
