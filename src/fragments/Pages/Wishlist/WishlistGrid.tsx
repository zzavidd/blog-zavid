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
  useMediaQuery,
  useTheme,
  type Grid2Props,
} from '@mui/material';
import { WishlistVisibility } from '@prisma/client';
import immutate from 'immutability-helper';
import { useContext } from 'react';

import { useIsAdmin } from 'utils/hooks';
import { useAppSelector } from 'utils/reducers';
import { trpc } from 'utils/trpc';

import WishlistGridItem from './Item/WishlistItem';
import { WishlistContext } from './WishlistContext';

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
  const gridProps = useGridProps();

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
    <Stack justifyContent={'center'} alignItems={'center'} flex={1}>
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

function useGridProps(): Grid2Props {
  const [context] = useContext(WishlistContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const columnOffset = context.trayFormContent && !isMobile ? 1 : 0;
  return {
    columns: {
      xs: 2 - columnOffset,
      sm: 3 - columnOffset,
      md: 4 - columnOffset,
      lg: 5 - columnOffset,
      xl: 6 - columnOffset,
    },
    flex: 1,
    m: 0,
    px: 2,
    py: 3,
    spacing: { xs: 3, lg: 4 },
    width: '100%',
  };
}

interface ErrorMessageProps {
  message: string;
  Icon: SvgIconComponent;
}
