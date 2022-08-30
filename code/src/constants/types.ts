export interface AppPageProps {
  pathDefinition: PathDefinition;
  pageProps?: Record<string, unknown>;
}

export interface PathDefinition {
  title: string;
  description?: string;
  url?: string;
  cardImage?: string;
}
