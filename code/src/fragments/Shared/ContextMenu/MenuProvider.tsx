import { Close, TipsAndUpdates } from '@mui/icons-material';
import type { Theme } from '@mui/material';
import {
  IconButton,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import type { MenuContextProps } from 'utils/contexts';
import { InitialMenuState, MenuContext } from 'utils/contexts';
import Settings from 'utils/settings';

import ContextMenu, { styleParagraph } from './ContextMenu';

export default function MenuProvider({ info, children }: MenuProviderProps) {
  useLongPressTip();

  const context = useContextMenuEvents(info);
  return (
    <MenuContext.Provider value={context}>
      {children}
      <ContextMenu />
    </MenuContext.Provider>
  );
}

export function useLongPressTip() {
  const [cookies, setCookie] = useCookies([
    Settings.COOKIES.CONSENT,
    Settings.COOKIES.TIP,
  ]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const isConsented = cookies[Settings.COOKIES.CONSENT];
  const isTipDismissed = cookies[Settings.COOKIES.TIP];

  function dismissTip() {
    const date = dayjs().add(1, 'day').toDate();
    setCookie(Settings.COOKIES.TIP, true, { expires: date });
    closeSnackbar();
  }

  useEffect(() => {
    if (isConsented === undefined || isTipDismissed) {
      return;
    }

    setTimeout(() => {
      enqueueSnackbar({
        message: (
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            columnGap={2}>
            <Stack
              direction={'row'}
              alignItems={{ xs: 'flex-start' }}
              columnGap={2}>
              <TipsAndUpdates fontSize={'small'} sx={{ mt: '2px' }} />
              <span>
                <Typography
                  display={'inline'}
                  fontSize={'inherit'}
                  fontWeight={800}>
                  Tip:
                </Typography>
                &nbsp;Long press on a paragraph to curate it.
              </span>
            </Stack>
            <IconButton onClick={dismissTip}>
              <Close
                fontSize={'small'}
                sx={{
                  color: (t) => t.palette.common.white,
                }}
              />
            </IconButton>
          </Stack>
        ),
        variant: 'default',
        onExit: dismissTip,
      });
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConsented, isTipDismissed]);
}

/**
 * Custom hook for setting the context menu events.
 * @param info The info of the page for the curate prompt.
 * @returns The menu state.
 */
function useContextMenuEvents(info: PageCuratorInfo): MenuContextProps {
  const [state, setState] = useState({ ...InitialMenuState, info });
  const theme = useTheme();
  const isDesktopAbove = useMediaQuery<Theme>((t) => t.breakpoints.up('lg'));

  const openContextMenu = useCallback((e: MouseEvent | TouchEvent) => {
    const left = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const top = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

    const dataText = (e.target as HTMLParagraphElement).getAttribute(
      'data-text',
    )!;

    setState((s) => ({
      ...s,
      contextMenuVisible: true,
      focusedTextContent: dataText,
      position: { left, top },
    }));

    if (e instanceof MouseEvent) {
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    let menuTimeout: NodeJS.Timeout;
    let highlightTimeout: NodeJS.Timeout;

    const onParagraphMouseDown = (e: MouseEvent | TouchEvent) => {
      highlightTimeout = setTimeout(() => {
        const { mode, primary } = theme.palette;
        const highlightColor = mode === 'light' ? primary.light : primary.dark;
        styleParagraph(e.target, {
          backgroundColor: alpha(highlightColor, 0.6),
          padding: '1em',
        });
      }, 850);

      menuTimeout = setTimeout(() => {
        setState((s) => ({
          ...s,
          focusedElement: e.target as HTMLParagraphElement,
        }));
        openContextMenu(e);
        e.preventDefault();
      }, 1000);
    };

    const onParagraphMouseUp = (e: MouseEvent | TouchEvent) => {
      if (highlightTimeout) {
        styleParagraph(e.target, {
          backgroundColor: 'transparent',
          padding: '0',
        });
      }
      clearTimeout(menuTimeout);
      clearTimeout(highlightTimeout);
    };

    const paragraphs = document.querySelectorAll<HTMLParagraphElement>('pre p');
    paragraphs.forEach((p) => {
      if (isDesktopAbove) {
        p.addEventListener('contextmenu', openContextMenu);
      } else {
        p.addEventListener('mousedown', onParagraphMouseDown);
        p.addEventListener('mouseup', onParagraphMouseUp);
      }
      p.addEventListener('touchstart', onParagraphMouseDown);
      p.addEventListener('touchend', onParagraphMouseUp);
    });
    return () => {
      paragraphs.forEach((p) => {
        p.removeEventListener('contextmenu', openContextMenu);
        p.removeEventListener('mousedown', onParagraphMouseDown);
        p.removeEventListener('mouseup', onParagraphMouseUp);
        p.removeEventListener('touchstart', onParagraphMouseDown);
        p.removeEventListener('touchend', onParagraphMouseUp);
      });
    };
  }, [isDesktopAbove, openContextMenu, state.contextMenuVisible, theme]);

  return [state, setState];
}

interface MenuProviderProps extends React.PropsWithChildren {
  info: PageCuratorInfo;
}
