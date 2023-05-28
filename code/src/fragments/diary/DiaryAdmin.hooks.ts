/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useSnackbar } from 'notistack';
import { useContext } from 'react';

import { trpc } from 'utils/trpc';

import { DiaryAdminContext } from './DiaryAdmin.context';

export function useGetDiary() {
  const [context] = useContext(DiaryAdminContext);

  const { order, property } = context.sort;
  return trpc.getDiary.useQuery({
    orderBy: { [property]: order },
  });
}

export function useUpdateDiaryEntry() {
  const { enqueueSnackbar } = useSnackbar();
  const utils = trpc.useContext();

  return trpc.updateDiaryEntry.useMutation({
    onSuccess: async (entry) => {
      await utils.getDiary.refetch();
      const message = `You've updated diary entry #${entry.entryNumber}.`;
      enqueueSnackbar(message, { variant: 'success' });
    },
  });
}
