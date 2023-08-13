import { Typography } from '@mui/material';

import ContentSingle from 'fragments/Shared/ContentSingle';
import PagePlaceholder from 'fragments/Shared/Placeholders/PagePlaceholder';
import {
  createExclusiveNavigationInfo,
  embedSubscriber,
} from 'utils/functions';
import { trpc } from 'utils/trpc';

export default function Exclusive({
  params,
  previousParams,
  nextParams,
  indexParams,
}: ExclusivePageProps) {
  const { data: exclusive } = trpc.exclusive.find.useQuery(params);
  const { data: previous } = trpc.exclusive.find.useQuery(previousParams);
  const { data: next } = trpc.exclusive.find.useQuery(nextParams);
  const { data: index = 0 } = trpc.exclusive.index.useQuery(indexParams);

  if (!exclusive) return <PagePlaceholder />;

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Exclusives' },
    { label: exclusive.subject },
  ];
  const pageCuratorInfo: PageCuratorInfo = {
    title: `Exclusive: ${exclusive.subject}`,
    date: exclusive.date,
    entity: 'exclusive',
  };

  const NavigationProps: ContentNavigationProps = {
    previous: createExclusiveNavigationInfo(previous, index - 1),
    next: createExclusiveNavigationInfo(next, index + 1),
  };
  return (
    <ContentSingle
      breadcrumbLinks={links}
      contentDate={exclusive.date}
      contentTitle={exclusive.subject}
      content={embedSubscriber(exclusive)}
      curatorInfo={pageCuratorInfo}
      editHref={`/admin/exclusives/edit/${exclusive.id}`}
      NavigationProps={NavigationProps}
      TitleExtras={
        <Typography
          fontSize={13}
          fontWeight={900}
          textAlign={{ xs: 'left', md: 'center' }}
          lineHeight={0.5}
          order={-1}>
          Exclusive #{index}:
        </Typography>
      }
    />
  );
}

export interface ExclusivePageProps extends AppPageProps {
  params: ExclusiveFindInput;
  previousParams: ExclusiveFindInput;
  nextParams: ExclusiveFindInput;
  indexParams: number;
  slug: string;
}
