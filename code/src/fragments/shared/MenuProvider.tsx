import { useEffect, useState } from 'react';

import type { MenuContextProps, MenuContextState } from 'utils/contexts';
import { MenuContext } from 'utils/contexts';

import ContextMenu from './ContextMenu';

export default function MenuProvider({ title, children }: MenuProviderProps) {
  const context = useContextMenuEvents(title);
  return (
    <MenuContext.Provider value={context}>
      {children}
      <ContextMenu />
    </MenuContext.Provider>
  );
}

/**
 * Custom hook for setting the context menu events.
 * @param title The title of the page for the curate prompt.
 * @returns The menu state.
 */
function useContextMenuEvents(title: string): MenuContextProps {
  const [state, setState] = useState<MenuContextState>({
    contextMenuVisible: false,
    focusedTextContent: '',
    position: { left: 0, top: 0 },
    title,
  });

  useEffect(() => {
    const paragraphs = document.querySelectorAll<HTMLParagraphElement>('p');

    let timeout: NodeJS.Timeout;
    const onParagraphMouseDown = (e: MouseEvent | TouchEvent) => {
      timeout = setTimeout(() => {
        const left = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const top = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

        const { innerText } = e.target as HTMLParagraphElement;
        setState((s) => ({
          ...s,
          contextMenuVisible: true,
          focusedTextContent: innerText,
          position: { left, top },
        }));
      }, 1000);

      if (e instanceof MouseEvent) {
        e.preventDefault();
      }
    };
    const onParagraphMouseUp = (e: MouseEvent | TouchEvent): void => {
      clearTimeout(timeout);
      e.stopPropagation();
    };

    const onAnyClick = (): void => {
      if (state.contextMenuVisible) {
        setState((s) => ({ ...s, contextMenuVisible: false }));
      }
    };

    window.addEventListener('mousedown', onAnyClick);
    window.addEventListener('touchstart', onAnyClick, false);
    paragraphs.forEach((p) => {
      p.addEventListener('contextmenu', (e) => e.preventDefault());
      p.addEventListener('mousedown', onParagraphMouseDown);
      p.addEventListener('mouseup', onParagraphMouseUp);
      p.addEventListener('touchstart', onParagraphMouseDown);
      p.addEventListener('touchend', onParagraphMouseUp);
      p.style.userSelect = 'none';
    });
    return () => {
      window.removeEventListener('mousedown', onAnyClick);
      window.removeEventListener('touchstart', onAnyClick);
      paragraphs.forEach((p) => {
        p.removeEventListener('contextmenu', (e) => e.preventDefault());
        p.removeEventListener('mousedown', onParagraphMouseDown);
        p.removeEventListener('mouseup', onParagraphMouseUp);
        p.removeEventListener('touchstart', onParagraphMouseDown);
        p.removeEventListener('touchend', onParagraphMouseUp);
      });
    };
  }, [state.contextMenuVisible]);

  return [state, setState];
}

interface MenuProviderProps extends React.PropsWithChildren {
  title: string;
}
