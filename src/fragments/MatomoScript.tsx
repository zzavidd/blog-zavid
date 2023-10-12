import Script from 'next/script';
import { useCookies } from 'react-cookie';

import Settings from 'utils/settings';

export default function MatomoScript() {
  const [cookies] = useCookies([Settings.COOKIES.CONSENT]);

  // Only track on production.
  if (process.env.NEXT_PUBLIC_APP_ENV !== 'production') return null;

  // Don't track if user is admin.
  const enableTracking = cookies[Settings.COOKIES.CONSENT];
  if (!enableTracking) {
    return null;
  }

  return (
    <Script id={'matomo'}>
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
