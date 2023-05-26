interface EntityFormProps {
  onSubmit?: () => void;
  onCancel?: () => void;
  onSubmitText: string;
}

interface AppPageProps {
  pathDefinition: PathDefinition;
  pageProps?: Record<string, unknown>;
}

interface PathDefinition {
  title: string;
  description?: string;
  url?: string;
  cardImage?: string;
  article?: {
    publishedTime: string;
    tags: string[];
  };
}

interface CuratorState {
  contentTheme: PaletteMode;
  filterTheme: FilterThemeOption;
  filterShape: FilterShapeOption;
  imageSource: string;
  isTitleOnly: boolean;
}

interface Substitutions {
  [key: string]: string | number;
}

interface EditButtonProps {
  id: number;
}
