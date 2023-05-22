import type { SvgIconComponent } from '@mui/icons-material';
import { Instagram, LinkedIn, Twitter } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Container,
  Divider,
  FormControl,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import Link, { LinkIconButton } from 'componentsv2/Link';
import Settings from 'constants/settings';
import { trpc } from 'utils/trpc';

const FOOTER_LINKS = [
  { name: 'About Zavid', url: '/about' },
  { name: 'Privacy Policy', url: '/privacy' },
  { name: 'Cookie Policy', url: '/cookies' },
];

const SOCIAL_PLUGS: SocialPlug[] = [
  { name: 'twitter', Icon: Twitter },
  { name: 'instagram', Icon: Instagram },
  { name: 'linkedin', Icon: LinkedIn },
];

export default function Footer() {
  return (
    <Paper sx={{ padding: (t) => t.spacing(5, 4) }}>
      <Container maxWidth={'md'}>
        <Stack>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            divider={<Divider orientation={'vertical'} flexItem={true} />}>
            <FooterLinks />
            <SubscribeForm />
            <SocialPlugs />
          </Stack>
          <Typography variant={'subtitle2'}>{Settings.COPYRIGHT}</Typography>
        </Stack>
      </Container>
    </Paper>
  );
}

function FooterLinks() {
  return (
    <Stack>
      <Typography variant={'h4'}>INFORMATION</Typography>
      <Stack spacing={1}>
        {FOOTER_LINKS.map(({ name, url }, key) => {
          return (
            <Link color={'text.primary'} variant={'body2'} href={url} key={key}>
              {name}
            </Link>
          );
        })}
      </Stack>
    </Stack>
  );
}

function SubscribeForm() {
  const [state, setState] = useState({ email: '' });
  const { enqueueSnackbar } = useSnackbar();
  const { mutate, error, isSuccess } = trpc.createSubscriber.useMutation();

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar(
        <Typography variant={'body2'}>
          Thank you for subscribing! I&apos;ve added&nbsp;
          <Box fontWeight={'bold'} display={'inline'}>
            &ldquo;{state.email}&rdquo;
          </Box>
          &nbsp;to my mailing list.
        </Typography>,
        { variant: 'success' },
      );
    }

    if (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, error]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setState({ email: e.target.value });
  }

  function subscribeEmail() {
    mutate({
      email: state.email,
      subscriptions: { Diary: true, Reveries: true },
    });
  }

  return (
    <Stack>
      <Typography variant={'h4'}>Quick Subscribe</Typography>
      <Stack spacing={4}>
        <Typography variant={'body2'}>
          And never miss a diary entry nor a post.
        </Typography>
        <FormControl>
          <TextField
            variant={'outlined'}
            type={'email'}
            value={state.email}
            label={'Email address:'}
            onChange={onChange}
            placeholder={'Enter your email address'}
          />
        </FormControl>
        <LoadingButton variant={'outlined'} onClick={subscribeEmail}>
          Subscribe
        </LoadingButton>
      </Stack>
    </Stack>
  );
}

function SocialPlugs() {
  return (
    <Stack alignItems={'center'}>
      <Typography variant={'h4'}>Follow me on socials</Typography>
      <Stack direction={'row'} justifyContent={'center'}>
        {SOCIAL_PLUGS.map(({ name, Icon }) => {
          return (
            <LinkIconButton
              href={Settings.ACCOUNTS[name]}
              newTab={true}
              key={name}>
              <Icon
                sx={{
                  color: (t) => t.palette.text.primary,
                  fontSize: (t) => t.spacing(7),
                }}
              />
            </LinkIconButton>
          );
        })}
      </Stack>
    </Stack>
  );
}

interface SocialPlug {
  name: keyof typeof Settings.ACCOUNTS;
  Icon: SvgIconComponent;
}
