import { Edit } from '@mui/icons-material';
import type { Theme } from '@mui/material';
import {
  Container,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';

import Breadcrumbs from 'components/Breadcrumbs';
import { Signature } from 'components/Image';
import { LinkIconButton } from 'components/Link';
import Paragraph from 'components/Typography/Paragraph';
import Time from 'components/Typography/Time';
import { AdminLock } from 'fragments/AdminGateway';
import MenuProvider from 'fragments/Shared/MenuProvider';
import PagePlaceholder from 'fragments/Shared/Placeholders/PagePlaceholder';
import type { RouterInput } from 'server/routers/_app.router';
import { trpc } from 'utils/trpc';

export default function Passage({ params }: PassagePageProps) {
  const { data: passage, error } = trpc.post.find.useQuery(params);
  const isMobile = useMediaQuery<Theme>((t) => t.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, error]);

  if (!passage) return <PagePlaceholder />;

  const links = [{ label: 'Home', href: '/' }, { label: passage.title }];
  const pageCuratorInfo: PageCuratorInfo = {
    title: passage.title,
    date: passage.datePublished!,
    categories: [],
  };
  return (
    <MenuProvider info={pageCuratorInfo}>
      <Container maxWidth={'sm'} sx={{ padding: (t) => t.spacing(4) }}>
        <Stack spacing={4} divider={<Divider />}>
          <Breadcrumbs links={links} />
          <Stack spacing={2} position={'relative'}>
            <AdminLock>
              <LinkIconButton
                href={`/admin/posts/edit/${passage.id}`}
                sx={{ position: 'absolute', top: 0, right: 0 }}>
                <Edit color={'primary'} />
              </LinkIconButton>
            </AdminLock>
            <Time
              variant={'body2'}
              textAlign={isMobile ? 'left' : 'center'}
              date={passage.datePublished}
            />
            <Typography variant={'h2'} textAlign={{ xs: 'left', sm: 'center' }}>
              {passage.title}
            </Typography>
          </Stack>
          <Stack spacing={5}>
            <Paragraph variant={'text'} dataTestId={'zb.passages.content'}>
              {passage.content}
            </Paragraph>
            <Signature width={180} />
          </Stack>
        </Stack>
      </Container>
    </MenuProvider>
  );
}

export interface PassagePageProps extends AppPageProps {
  params: RouterInput['post']['find'];
  slug: string;
}
