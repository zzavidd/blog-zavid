import type { SvgIconComponent } from '@mui/icons-material';
import { Instagram, LinkedIn, Twitter } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import type { Theme } from '@mui/material';
import {
  Box,
  Container,
  Divider,
  FormControl,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import { Link, LinkIconButton } from 'components/Link';
import Settings from 'utils/settings';
import { trpc } from 'utils/trpc';
import { zSubscribeForm } from 'utils/validators';

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
  const isMediumAbove = useMediaQuery<Theme>((t) => t.breakpoints.up('sm'));
  return (
    <Paper
      square={true}
      elevation={4}
      sx={{
        padding: (t) => t.spacing(5, 4),
        width: '100%',
      }}>
      <Container maxWidth={'md'}>
        <Stack spacing={5}>
          {isMediumAbove ? (
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              spacing={4}
              divider={<Divider orientation={'vertical'} flexItem={true} />}>
              <FooterLinks />
              <QuickSubscribe />
              <SocialPlugs />
            </Stack>
          ) : (
            <Stack
              direction={'column'}
              justifyContent={'space-between'}
              spacing={4}
              divider={<Divider />}>
              <QuickSubscribe />
              <SocialPlugs />
              <FooterLinks />
            </Stack>
          )}
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
      <Stack rowGap={2}>
        {FOOTER_LINKS.map(({ name, url }, key) => {
          return (
            <Link href={url} color={'text.primary'} fontSize={16} key={key}>
              {name}
            </Link>
          );
        })}
      </Stack>
    </Stack>
  );
}

function QuickSubscribe() {
  const [state, setState] = useState({ email: '' });
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: addSubscriber } = trpc.subscriber.create.useMutation();
  const theme = useTheme();

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setState({ email: e.target.value });
  }

  function subscribeEmail() {
    const result = zSubscribeForm.safeParse({ email: state.email });
    if (!result.success) {
      return enqueueSnackbar(result.error.issues[0].message, {
        variant: 'error',
      });
    }

    addSubscriber(
      {
        data: {
          email: state.email,
          subscriptions: { Diary: true, Reveries: true },
          token: '',
        },
      },
      {
        onSuccess: () => {
          enqueueSnackbar(
            <Typography variant={'body2'}>
              Thank you for subscribing! I&apos;ve added&nbsp;
              <Box fontWeight={'bold'} display={'inline'} component={'span'}>
                &ldquo;{state.email}&rdquo;
              </Box>
              &nbsp;to my mailing list.
            </Typography>,
            { variant: 'success' },
          );
        },
        onError: (e) => {
          enqueueSnackbar(e.message, { variant: 'error' });
        },
      },
    );
  }

  const inputProps = { style: { fontSize: theme.spacing(4) } };

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
            inputProps={{ 'data-testid': 'zb.quicksubscribe.email' }}
            InputProps={inputProps}
            InputLabelProps={inputProps}
          />
        </FormControl>
        <LoadingButton
          variant={'outlined'}
          onClick={subscribeEmail}
          data-testid={'zb.quicksubscribe.button'}>
          Subscribe
        </LoadingButton>
      </Stack>
    </Stack>
  );
}

function SocialPlugs() {
  return (
    <Stack alignItems={{ xs: 'flex-start', md: 'center' }}>
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
