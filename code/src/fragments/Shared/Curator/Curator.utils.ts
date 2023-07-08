import { useContext, useEffect, useState } from 'react';

import { CuratorContext } from './Curator.context';

export function useBackgroundImage(): HTMLImageElement | null {
  const [state, setState] = useState<UseBackgroundImageState>({
    image: null,
  });
  const [curatorContext] = useContext(CuratorContext);

  useEffect(() => {
    const bgImage = new Image();
    bgImage.onload = () => setState({ image: bgImage });
    bgImage.src = `/images/filters/${curatorContext.filterShape}-${curatorContext.filterTheme}.jpg`;
  }, [curatorContext.filterShape, curatorContext.filterTheme]);

  return state.image;
}

interface UseBackgroundImageState {
  image: HTMLImageElement | null;
}
