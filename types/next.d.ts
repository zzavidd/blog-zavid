import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { type ReactElement, type ReactNode } from 'react';

declare global {
  export type AppPropsWithLayout<T = AppPageProps> = AppProps<T> & {
    Component: NextPageWithLayout;
  };

  export type NextPageWithLayout<
    P = Record<string, unknown>,
    IP = P,
  > = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
  };
}
