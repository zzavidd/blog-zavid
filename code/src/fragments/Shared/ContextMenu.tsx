import {
  ContentCopy as ContentCopyIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react';

import { MenuContext } from 'utils/contexts';

import Curator from './Curator/Curator';
import {
  CuratorContext,
  InitialCuratorContextState,
} from './Curator/Curator.context';

export default function ContextMenu() {
  const [state, setState] = useState({ curatorVisible: false });
  const [curatorState, setCuratorState] = useState(InitialCuratorContextState);

  const [context, setContext] = useContext(MenuContext);
  const { enqueueSnackbar } = useSnackbar();

  async function copyText() {
    await navigator.clipboard.writeText(context.focusedTextContent);
    enqueueSnackbar('Copied paragraph to clipboard.', { variant: 'success' });
    onClose();
  }

  function curate() {
    setState({ curatorVisible: true });
    onClose();
  }

  function onClose() {
    setContext((s) => ({ ...s, contextMenuVisible: false }));
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
        anchorReference={'anchorPosition'}
        anchorPosition={context.position}>
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
