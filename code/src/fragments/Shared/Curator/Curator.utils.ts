import { useContext, useEffect, useState } from 'react';

import { FilterShapeOption } from 'utils/theme';

import { CuratorContext } from './Curator.context';

export const DIMENSIONS = {
  [FilterShapeOption.TALL]: {
    CONTAINER_MARGIN: '5rem',
    CONTAINER_PADDING: '3rem',
    FONT_SIZE_CATEGORY: 32,
    FONT_SIZE_DATE: 36,
    FONT_SIZE_TITLE: 82,
    FONT_SIZE_TITLE_CORNER: 40,
    TITLE_MARGIN_Y: '1rem',
  },
  [FilterShapeOption.SQUARE]: {
    CONTAINER_MARGIN: '3rem',
    CONTAINER_PADDING: '2.5rem',
    FONT_SIZE_CATEGORY: 24,

    FONT_SIZE_DATE: 28,
    FONT_SIZE_TITLE: 70,
    FONT_SIZE_TITLE_CORNER: 36,
    TITLE_MARGIN_Y: '0.5rem',
  },
  [FilterShapeOption.WIDE]: {
    CONTAINER_MARGIN: '3rem',
    CONTAINER_PADDING: '2.5rem',
    FONT_SIZE_CATEGORY: 24,
    FONT_SIZE_DATE: 28,
    FONT_SIZE_TITLE: 70,
    FONT_SIZE_TITLE_CORNER: 36,
    TITLE_MARGIN_Y: '0.5rem',
  },
};

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
