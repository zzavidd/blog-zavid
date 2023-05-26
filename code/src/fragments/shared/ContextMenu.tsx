import { Menu, MenuItem, MenuList } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react';

import { MenuContext } from 'utils/contexts';

import Curator from './Curator';

export default function ContextMenu() {
  const [state, setState] = useState({ curatorVisible: false });
  const [context, setContext] = useContext(MenuContext);
  const { enqueueSnackbar } = useSnackbar();

  async function copyText() {
    await navigator.clipboard.writeText(context.focusedTextContent);
    enqueueSnackbar('Copied paragraph to clipboard.', { variant: 'info' });
    onClose();
  }

  function curate() {
    setState({ curatorVisible: true });
    onClose();
  }

  function onClose() {
    setContext((s) => ({ ...s, contextMenuVisible: false }));
  }

  return (
    <React.Fragment>
      <Menu
        open={context.contextMenuVisible}
        onClose={onClose}
        elevation={2}
        anchorReference={'anchorPosition'}
        anchorPosition={context.position}>
        <MenuList disablePadding={true}>
          <MenuItem onClick={copyText}>Copy Text</MenuItem>
          <MenuItem onClick={curate}>Curate</MenuItem>
        </MenuList>
      </Menu>
      <Curator
        visible={state.curatorVisible}
        onClose={() => setState({ curatorVisible: false })}
      />
    </React.Fragment>
  );
}
