import { Share as ShareIcon } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
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

import Settings from 'constants/settings';

export default function ShareBlock({ headline, message }: ShareBlockProps) {
  const router = useRouter();
  const url = `${Settings.DOMAIN}${router.asPath}`;

  const props: SocialShareProps = { message, url };
  return (
    <Stack mt={4} spacing={2}>
      <Typography variant={'subtitle2'}>{headline}:</Typography>
      <Stack direction={'row'} spacing={1}>
        <ShareFacebook {...props} />
        <ShareTwitter {...props} />
        <ShareLinkedin {...props} />
        <ShareWhatsapp {...props} />
        <ShareLink {...props} />
      </Stack>
    </Stack>
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
  const { enqueueSnackbar } = useSnackbar();

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    enqueueSnackbar("Copied this page's link to clipboard.", {
      variant: 'success',
    });
  }

  return (
    <Box>
      <IconButton onClick={copyLink} sx={{ backgroundColor: 'primary.main' }}>
        <ShareIcon fontSize={'large'} />
      </IconButton>
    </Box>
  );
}

interface ShareBlockProps {
  headline: string;
  message: string;
}

interface SocialShareProps {
  message: string;
  url: string;
}
