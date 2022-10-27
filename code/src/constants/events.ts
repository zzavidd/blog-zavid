import type React from 'react';

namespace Events {
  /**
   * Sets the context menu events.
   * @param mainRef The content ref.
   * @param contextMenuRef The context menu ref.
   * @param state The page state.
   * @param dispatch The page dispatch.
   */
  export function setContextMenuEvents<T extends EventState>(
    mainRef: React.RefObject<HTMLElement>,
    contextMenuRef: React.RefObject<HTMLMenuElement>,
    state: T,
    dispatch: (state: Partial<T>) => void,
  ) {
    const paragraphs = mainRef.current?.querySelectorAll('p');
    const contextMenu = contextMenuRef.current;
    if (!contextMenu || !paragraphs) return;

    let timeout: NodeJS.Timeout;
    const onParagraphMouseDown = (e: MouseEvent | TouchEvent) => {
      timeout = setTimeout(() => {
        const left = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const top = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        contextMenu.style.left = `${left}px`;
        contextMenu.style.top = `${top}px`;

        const { innerText } = e.target as HTMLParagraphElement;
        dispatch({
          contextMenuVisible: true,
          focusedTextContent: innerText,
        } as T);
      }, 1000);
      e.preventDefault();
    };
    const onParagraphMouseUp = (e: MouseEvent | TouchEvent) => {
      clearTimeout(timeout);
      e.stopPropagation();
    };

    const onAnyClick = () => {
      if (state.contextMenuVisible) {
        dispatch({ contextMenuVisible: false } as T);
      }
    };

    window.addEventListener('mousedown', onAnyClick, false);
    paragraphs.forEach((p) => {
      p.addEventListener('contextmenu', (e) => e.preventDefault());
      p.addEventListener('mousedown', onParagraphMouseDown);
      p.addEventListener('mouseup', onParagraphMouseUp);
      p.addEventListener('touchstart', onParagraphMouseDown);
      p.addEventListener('touchend', onParagraphMouseUp);
    });
    return () => {
      window.removeEventListener('mousedown', onAnyClick);
      paragraphs.forEach((p) => {
        p.removeEventListener('contextmenu', (e) => e.preventDefault());
        p.removeEventListener('mousedown', onParagraphMouseDown);
        p.removeEventListener('touchstart', onParagraphMouseDown);
        p.removeEventListener('mouseup', onParagraphMouseUp);
        p.removeEventListener('touchend', onParagraphMouseUp);
      });
    };
  }
}

export default Events;

interface EventState {
  contextMenuVisible: boolean;
  focusedTextContent: string;
}
