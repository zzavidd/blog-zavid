import { siteTitle } from 'src/settings';

const pathDefinitions: Record<Path, PathDefinition> = {
  404: {
    title: `Page Not Found`,
    description: '',
    url: '',
  },
  Home: {
    title: `${siteTitle}: A Galaxy Mind in a Universe World`,
    description: 'Explore the metaphysical manifestation of my mind.',
    url: '/',
  },
  Subscribe: {
    title: `Subscribe | ${siteTitle}`,
    description: 'Be the first to know when a new post or diary entry drops.',
    url: '/subscribe',
  },
  SubscriptionPreferences: {
    title: `Subscription Preferences | ${siteTitle}`,
    description: '',
    url: '',
  },
};

export default pathDefinitions;

export interface PathDefinition {
  title: string;
  description: string;
  url: string;
  cardImage?: string;
}

type Path = '404' | 'Home' | 'Subscribe' | 'SubscriptionPreferences';
