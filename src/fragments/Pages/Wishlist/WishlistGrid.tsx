import {
  ErrorOutline,
  Inventory2Outlined,
  type SvgIconComponent,
} from '@mui/icons-material';
import {
  Card,
  CardContent,
  Unstable_Grid2 as Grid,
  Skeleton,
  Stack,
  Typography,
  useTheme,
  type Grid2Props,
} from '@mui/material';
import { WishlistVisibility } from '@prisma/client';
import immutate from 'immutability-helper';

import { useIsAdmin } from 'utils/hooks';
import { useAppSelector } from 'utils/reducers';
import { trpc } from 'utils/trpc';

import WishlistGridItem from './Item/WishlistItem';

const gridProps: Grid2Props = {
  columns: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
  spacing: { xs: 3, lg: 4 },
  m: 0,
  px: 2,
  py: 3,
  width: '100%',
};

export default function WishlistGrid() {
  const isAdmin = useIsAdmin();
  const params = useAppSelector((state) =>
    immutate(
      state.wishlist.params,
      isAdmin
        ? {}
        : {
            where: {
              visibility: { $set: { in: [WishlistVisibility.PUBLIC] } },
            },
          },
    ),
  );
  const {
    data: wishlist = [],
    error,
    isLoading,
  } = trpc.wishlist.findMany.useQuery(params);

  if (error) {
    return (
      <ErrorMessage Icon={ErrorOutline} message={'Could not load wishlist.'} />
    );
  }

  if (isLoading) {
    return (
      <Grid container={true} {...gridProps}>
        {Array(18)
          .fill(null)
          .map((_, i) => (
            <Grid xs={1} key={i}>
              <PlaceholderItem />
            </Grid>
          ))}
      </Grid>
    );
  }

  if (!wishlist.length) {
    return (
      <ErrorMessage Icon={Inventory2Outlined} message={'No wishlist items.'} />
    );
  }

  return (
    <Grid container={true} {...gridProps}>
      {wishlist.map((wishlistItem) => (
        <Grid xs={1} key={wishlistItem.id}>
          <WishlistGridItem wishlistItem={wishlistItem} />
        </Grid>
      ))}
    </Grid>
  );
}

function ErrorMessage({ message, Icon }: ErrorMessageProps) {
  return (
    <Stack justifyContent={'center'} alignItems={'center'}>
      <Stack alignItems={'center'} rowGap={2}>
        <Icon color={'action'} sx={{ fontSize: (t) => t.spacing(8) }} />
        <Typography variant={'h6'} component={'p'}>
          {message}
        </Typography>
      </Stack>
    </Stack>
  );
}

function PlaceholderItem() {
  const theme = useTheme();
  return (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant={'rectangular'} height={theme.spacing(12)} />
      <CardContent>
        <Stack>
          <Skeleton
            variant={'text'}
            height={theme.spacing(7)}
            width={theme.spacing(11)}
          />
          <Skeleton variant={'text'} width={theme.spacing(10)} />
          <Skeleton variant={'text'} width={theme.spacing(9)} />
        </Stack>
        <Skeleton
          variant={'rounded'}
          height={theme.spacing(6)}
          width={'100%'}
        />
      </CardContent>
    </Card>
  );
}

interface ErrorMessageProps {
  message: string;
  Icon: SvgIconComponent;
}
