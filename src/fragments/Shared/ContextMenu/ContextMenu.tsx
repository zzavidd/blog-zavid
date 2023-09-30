import {
  ContentCopy as ContentCopyIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import type { Theme } from '@mui/material';
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  useMediaQuery,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react';

import { MenuContext } from 'utils/contexts';

import Curator from '../Curator/Curator';
import {
  CuratorContext,
  InitialCuratorContextState,
} from '../Curator/Curator.context';

export default function ContextMenu() {
  const [state, setState] = useState({ curatorVisible: false });
  const [curatorState, setCuratorState] = useState(InitialCuratorContextState);

  const [context, setContext] = useContext(MenuContext);
  const isDesktopAbove = useMediaQuery<Theme>((t) => t.breakpoints.up('lg'));
  const { enqueueSnackbar } = useSnackbar();

  async function copyText() {
    await navigator.clipboard?.writeText(context.focusedTextContent);
    enqueueSnackbar('Copied paragraph to clipboard.', { variant: 'success' });
    onClose();
  }

  function curate() {
    setState({ curatorVisible: true });
    onClose();
  }

  function onClose() {
    setContext((s) => ({ ...s, contextMenuVisible: false }));

    const paragraphs = document.querySelectorAll<HTMLParagraphElement>('pre p');
    paragraphs.forEach((p) => {
      if (context.contextMenuVisible) {
        styleParagraph(p, {
          backgroundColor: 'transparent',
          padding: '0',
        });
      }
    });
  }

  const menuItems = [
    { label: 'Copy text', icon: <ContentCopyIcon />, onClick: copyText },
    {
      label: 'Curate',
      icon: <ImageIcon />,
      onClick: curate,
      dataTestId: 'zb.curate',
    },
  ];

  return (
    <React.Fragment>
      <Menu
        open={context.contextMenuVisible}
        onClose={onClose}
        elevation={2}
        anchorEl={context.focusedElement}
        anchorReference={isDesktopAbove ? 'anchorPosition' : 'anchorEl'}
        anchorPosition={context.position}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{ userSelect: 'none' }}>
        <MenuList disablePadding={true}>
          {menuItems.map(({ label, icon, onClick, dataTestId }) => (
            <MenuItem
              onClick={onClick}
              sx={{ padding: (t) => t.spacing(4, 5) }}
              data-testid={dataTestId}
              key={label}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText>{label}</ListItemText>
              <ListItemIcon />
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <CuratorContext.Provider value={[curatorState, setCuratorState]}>
        <Curator
          visible={state.curatorVisible}
          onClose={() => setState({ curatorVisible: false })}
        />
      </CuratorContext.Provider>
    </React.Fragment>
  );
}

export function styleParagraph(
  p: EventTarget | null,
  styles: React.CSSProperties,
) {
  if (!p) return;
  Object.entries(styles).forEach(([key, value]) => {
    (p as HTMLParagraphElement).style[key as any] = value;
  });
}
