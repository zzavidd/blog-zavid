import { AttachMoneyRounded } from '@mui/icons-material';
import { Box, Button, Stack } from '@mui/material';
import { useContext, useEffect } from 'react';

import { trpc } from 'utils/trpc';

import { WishlistContext } from './WishlistContext';
import WishlistDrawer from './WishlistDrawer';
import WishlistGrid from './WishlistGrid';
import WishlistToolbar from './WishlistToolbar';

export default function WishlistIndex({ categoryParams }: WishlistPageProps) {
  useCategoryPreload(categoryParams);

  return (
    <Stack direction={'row'} flex={1}>
      <Stack alignItems={'center'} flex={1}>
        <Box pt={4}>
          <Button
            href={'https://settleup.starlingbank.com/davidegbue/pay'}
            target={'_blank'}
            variant={'contained'}
            startIcon={<AttachMoneyRounded />}>
            Send Monetary Gift
          </Button>
        </Box>
        <WishlistGrid />
        <WishlistToolbar />
      </Stack>
      <WishlistDrawer />
    </Stack>
  );
}

function useCategoryPreload(params: WishlistCategoryFindManyInput) {
  const [, setContext] = useContext(WishlistContext);

  const { data: categories = [] } =
    trpc.wishlistCategory.findMany.useQuery<WishlistCategoryWithCount[]>(
      params,
    );

  useEffect(() => {
    setContext((c) => ({ ...c, categories }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
