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
};

export default pathDefinitions;

export interface PathDefinition {
  title: string;
  description: string;
  url: string;
  cardImage?: string;
}

type Path = '404' | 'Home';