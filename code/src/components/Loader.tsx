import type { IContentLoaderProps } from 'react-content-loader';
import ContentLoader from 'react-content-loader';

export default function Loader({ children, ...props }: IContentLoaderProps) {
  return (
    <ContentLoader backgroundOpacity={0.7} foregroundOpacity={0.9} {...props}>
      {children}
    </ContentLoader>
  );
}
