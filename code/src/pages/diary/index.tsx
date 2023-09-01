import type { GetServerSideProps } from 'next';
import { useEffect } from 'react';

import Layout from 'fragments/Layout';
import type { DiaryIndexProps } from 'fragments/Pages/Diary/Index/DiaryIndex';
import DiaryIndex from 'fragments/Pages/Diary/Index/DiaryIndex';
import {
  DiaryIndexContext,
  SortOption,
  useSortMenuOptions,
} from 'fragments/Pages/Diary/Index/DiaryIndex.utils';
import { AppActions, useAppDispatch, useAppSelector } from 'utils/reducers';
import Settings from 'utils/settings';
import { getServerSideHelpers } from 'utils/ssr';

const DiaryIndexPage: NextPageWithLayout<DiaryIndexProps> = (props) => {
  const { sort } = useAppSelector((state) => state.diary);
  const dispatch = useAppDispatch();
  const sortMenuOptions = useSortMenuOptions(props.searchTerm);

  useEffect(() => {
    if (props.searchTerm) {
      dispatch(
        AppActions.setDiarySieve({
          sort: { $set: sortMenuOptions[SortOption.RELEVANT].value },
        }),
      );
    } else if (sort._relevance) {
      dispatch(
        AppActions.setDiarySieve({
          sort: { $set: sortMenuOptions[SortOption.NEWEST].value },
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.searchTerm]);

  return (
    <DiaryIndexContext.Provider value={props}>
      <DiaryIndex />
    </DiaryIndexContext.Provider>
  );
};

export const getServerSideProps: GetServerSideProps<DiaryIndexProps> = async (
  ctx,
) => {
  const helpers = getServerSideHelpers(ctx);
  const params = { where: { slug: 'diary' } };

  const page = await helpers.page.find.fetch(params);
  await helpers.page.find.prefetch(params);

  return {
    props: {
      params,
      searchTerm: (ctx.query.search as string) ?? '',
      pathDefinition: {
        title: `Diary | ${Settings.SITE_TITLE}`,
        description: page?.excerpt ?? '',
        url: '/diary',
      },
      trpcState: helpers.dehydrate(),
    },
  };
};

DiaryIndexPage.getLayout = Layout.addPartials;
export default DiaryIndexPage;
