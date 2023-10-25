import {
  ErrorOutline,
  Inventory2Outlined,
  type SvgIconComponent,
} from '@mui/icons-material';
import {
  Unstable_Grid2 as Grid,
  Stack,
  Typography,
  type Grid2Props,
} from '@mui/material';

import { useAppSelector } from 'utils/reducers';
import { trpc } from 'utils/trpc';

import WishlistGridItem, { PlaceholderItem } from './Item/WishlistItem';

const gridProps: Grid2Props = {
  columns: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
  spacing: { xs: 3, lg: 4 },
  m: 0,
  px: 2,
  py: 3,
  width: '100%',
};

export default function WishlistGrid() {
  const params = useAppSelector((state) => state.wishlist.params);
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

interface ErrorMessageProps {
  message: string;
  Icon: SvgIconComponent;
}
