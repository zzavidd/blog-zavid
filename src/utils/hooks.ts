/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type dayjs from 'dayjs';
import immutate, { type Spec } from 'immutability-helper';
import { useSession } from 'next-auth/react';
import { useContext } from 'react';

import { trpc } from './trpc';

export function useIsAdmin(): boolean {
  const session = useSession();
  return session.data?.user?.email === process.env.NEXT_PUBLIC_GOOGLE_EMAIL;
}

export function useDiaryCategories() {
  return trpc.diaryCategory.findMany.useQuery();
}

export function useForm<T>(
  context: React.Context<ReactUseState<T>>,
  key: keyof T,
) {
  const [, setContext] = useContext(context);

  function onTextChange(e: ChangeEvent) {
    const { name, value } = e.target;
    setContext((c) =>
      immutate(c, { [key]: { [name]: { $set: value } } } as Spec<T>),
    );
  }

  function onCheckboxChange(e: ChangeEvent, checked: boolean) {
    const { name } = e.target;
    setContext((c) =>
      immutate(c, { [key]: { [name]: { $set: checked } } } as Spec<T>),
    );
  }

  function onDateChange(date: dayjs.Dayjs | null) {
    setContext((c) =>
      immutate(c, { [key]: { date: { $set: date?.toDate() } } } as Spec<T>),
    );
  }

  return { onTextChange, onCheckboxChange, onDateChange };
}
