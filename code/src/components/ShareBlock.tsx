import { faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';

import FORM from 'styles/Components/Form.styles';
import SBS from 'styles/Components/ShareBlock.styles';
import Contexts from 'utils/contexts';

export default function ShareBlock({ headline, ...props }: ShareProps) {
  return (
    <SBS.Container>
      <FORM.Label>{headline}:</FORM.Label>
      <SBS.ButtonGroup>
        <ShareFacebook {...props} />
        <ShareTwitter {...props} />
        <ShareLinkedin {...props} />
        <ShareWhatsapp {...props} />
        <ShareLink {...props} />
      </SBS.ButtonGroup>
    </SBS.Container>
  );
}

function ShareFacebook({ message, url }: SocialShareProps) {
  return (
    <FacebookShareButton quote={message} url={url}>
      <FacebookIcon size={50} round={true} />
    </FacebookShareButton>
  );
}

function ShareTwitter({ message, url }: SocialShareProps) {
  const handle = 'zzavidd';
  return (
    <TwitterShareButton title={message} url={url} via={handle}>
      <TwitterIcon size={50} round={true} />
    </TwitterShareButton>
  );
}

function ShareWhatsapp({ message, url }: SocialShareProps) {
  return (
    <WhatsappShareButton title={message} separator={'\n'} url={url}>
      <WhatsappIcon size={50} round={true} />
    </WhatsappShareButton>
  );
}

function ShareLinkedin({ message, url }: SocialShareProps) {
  return (
    <LinkedinShareButton title={message} url={url}>
      <LinkedinIcon size={50} round={true} />
    </LinkedinShareButton>
  );
}

function ShareLink({ url }: SocialShareProps) {
  const Alerts = useContext(Contexts.Alerts);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    Alerts.success("Copied this page's link to clipboard.");
  }

  return (
    <SBS.ShareLinkButton onClick={copyLink}>
      <FontAwesomeIcon icon={faShare} />
    </SBS.ShareLinkButton>
  );
}

interface SocialShareProps {
  message: string;
  url: string;
}

interface ShareProps extends SocialShareProps {
  headline: string;
}
