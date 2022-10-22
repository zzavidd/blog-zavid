import { useSession } from 'next-auth/react';
import Script from 'next/script';
import React from 'react';

export default function MatomoScript() {
  const { data: session, status } = useSession({ required: false });
  if (process.env.NEXT_PUBLIC_APP_ENV !== 'production') return null;

  // Don't track if user is admin.
  if (
    status === 'unauthenticated' ||
    (status === 'authenticated' &&
      session.user?.email === process.env.NEXT_PUBLIC_GOOGLE_EMAIL)
  ) {
    return null;
  }

  return (
    <Script id={'matomo'} strategy={'afterInteractive'}>
      {`
          var _paq = window._paq = window._paq || [];
          /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
          _paq.push(['trackPageView']);
          _paq.push(['enableLinkTracking']);
          (function() {
            var u="//analytics.zavidegbue.com/";
            _paq.push(['setTrackerUrl', u+'matomo.php']);
            _paq.push(['setSiteId', '1']);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
          })();
        `}
    </Script>
  );
}
