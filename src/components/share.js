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

import css from 'styles/components/Share.module.scss';

import { alert } from './alert';
import { InvisibleButton } from './button';
import { Icon } from './icon';

export default (props) => {
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

const ShareFacebook = ({ message, url }) => {
  return (
    <FacebookShareButton quote={message} url={url}>
      <FacebookIcon size={50} round={true} />
    </FacebookShareButton>
  );
};

const ShareTwitter = ({ message, url }) => {
  const handle = 'zzavidd';
  return (
    <TwitterShareButton title={message} url={url} via={handle}>
      <TwitterIcon size={50} round={true} />
    </TwitterShareButton>
  );
};

const ShareWhatsapp = ({ message, url }) => {
  return (
    <WhatsappShareButton title={message} separator={'\n'} url={url}>
      <WhatsappIcon size={50} round={true} />
    </WhatsappShareButton>
  );
};

const ShareLinkedin = ({ message, url }) => {
  return (
    <LinkedinShareButton title={message} url={url}>
      <LinkedinIcon size={50} round={true} />
    </LinkedinShareButton>
  );
};

const ShareLink = ({ url }) => {
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
