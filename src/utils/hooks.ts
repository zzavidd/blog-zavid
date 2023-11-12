/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type dayjs from 'dayjs';
import immutate, { type Spec } from 'immutability-helper';
import { useSession } from 'next-auth/react';
import { useContext } from 'react';
import useSWR from 'swr';

import { trpc } from './trpc';

export function useIsAdmin(): boolean {
  const session = useSession();
  return session.data?.user?.email === process.env.NEXT_PUBLIC_GOOGLE_EMAIL;
}

export function useDiaryCategories() {
  return trpc.diaryCategory.findMany.useQuery();
}

export function useImage(src: string) {
  return useSWR<string, Error, string>(
    src,
    (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(url);
        img.src = url;
      });
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );
}

export function useForm<T, K extends keyof T>(
  context: React.Context<ReactUseState<T>>,
  key: K,
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

  function onDateChange(date: dayjs.Dayjs | null, property: keyof T[K]) {
    setContext((c) =>
      immutate(c, {
        [key]: { [property]: { $set: date?.toDate() } },
      } as Spec<T>),
    );
  }

  return { onTextChange, onCheckboxChange, onDateChange };
}
