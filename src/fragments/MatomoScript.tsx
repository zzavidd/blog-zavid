import * as Matomo from '@socialgouv/matomo-next';
import { useEffect } from 'react';

import { useIsAdmin, useSessionEmail } from 'utils/hooks';

export default function MatomoProvider({ children }: React.PropsWithChildren) {
  const email = useSessionEmail();
  const isAdmin = useIsAdmin();

  useEffect(() => {
    const siteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;
    if (!siteId || isAdmin) return;

    Matomo.push(['setUserId', email]);
    Matomo.push(['trackPageView']);
    Matomo.push(['enableLinkTracking']);
    Matomo.init({ url: 'https://analytics.zavidegbue.com', siteId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  return children;
}
