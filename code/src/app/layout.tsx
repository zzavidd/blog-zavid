import type { Metadata } from 'next';

import Settings from 'constants/settings';
import Footer from 'fragments/shared/Footer';
import Header from 'fragments/shared/Header';
import { NavigationDrawer } from 'fragments/shared/NavigationDrawer';

export const metadata: Metadata = {
  title: `${Settings.SITE_TITLE}: A Galaxy Mind in a Universe World`,
  description: 'Explore the metaphysical manifestation of my mind.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={'en'}>
      <body>
        <Header />
        <NavigationDrawer />
        {children}
        <Footer />
      </body>
    </html>
  );
}
