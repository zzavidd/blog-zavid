import { Edit } from '@mui/icons-material';
import { Container, Divider, Stack, Typography } from '@mui/material';

import type { BreadcrumbLink } from 'components/Breadcrumbs';
import Breadcrumbs from 'components/Breadcrumbs';
import { NextImage, Signature } from 'components/Image';
import { LinkIconButton } from 'components/Link';
import Paragraph from 'components/Typography/Paragraph';
import Time from 'components/Typography/Time';
import { AdminLock } from 'fragments/AdminGateway';

import MenuProvider from './MenuProvider';

export default function ContentSingle({
  breadcrumbLinks,
  contentDate,
  contentTitle,
  content,
  curatorInfo,
  dateFirst,
  editHref,
  image,
  Navigation,
  TitleExtras,
  ContentExtras,
  PageExtras,
}: ContentSingleProps) {
  return (
    <MenuProvider info={curatorInfo}>
      <Container maxWidth={'sm'} sx={{ padding: (t) => t.spacing(2, 4, 4) }}>
        <Stack spacing={4} divider={<Divider />}>
          <Stack alignContent={'center'} spacing={4}>
            <Breadcrumbs links={breadcrumbLinks} />
            {Navigation}
          </Stack>
          <Stack spacing={2} position={'relative'} useFlexGap={true}>
            <AdminLock>
              <LinkIconButton
                href={editHref}
                sx={{ position: 'absolute', top: 0, right: 0 }}>
                <Edit color={'primary'} />
              </LinkIconButton>
            </AdminLock>
            <Typography variant={'h2'} textAlign={{ xs: 'left', sm: 'center' }}>
              {contentTitle}
            </Typography>
            <Time
              variant={'body2'}
              textAlign={{ xs: 'left', md: 'center' }}
              date={contentDate}
              order={dateFirst ? -1 : undefined}
            />
            {TitleExtras}
          </Stack>
          <Stack spacing={5}>
            {image ? (
              <NextImage
                src={image}
                alt={contentTitle}
                style={{ borderRadius: 12, objectFit: 'cover' }}
                height={720}
                width={1080}
              />
            ) : null}
            <Paragraph variant={'text'} dataTestId={'zb.content'}>
              {content}
            </Paragraph>
            <Signature width={180} />
            {ContentExtras}
          </Stack>
          {PageExtras}
        </Stack>
      </Container>
    </MenuProvider>
  );
}

interface ContentSingleProps {
  breadcrumbLinks: (BreadcrumbLink | null)[];
  content: string;
  contentDate: Date | null;
  contentTitle: string;
  curatorInfo: PageCuratorInfo;
  editHref: string;
  dateFirst?: boolean;
  image?: string | null;
  Navigation?: React.ReactNode;
  TitleExtras?: React.ReactNode;
  ContentExtras?: React.ReactNode;
  PageExtras?: React.ReactNode;
}
