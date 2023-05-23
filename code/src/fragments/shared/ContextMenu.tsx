import React, { useContext, useState } from 'react';

import { CuratePromptStyle as CPS } from 'styles/Components/Curate.styles';
import Contexts from 'utils/contexts';

import Curator from './Curator';

const ContextMenu = React.forwardRef<HTMLMenuElement, CuratePromptProps>(
  ({ sourceTitle, focalText, visible, onClose }, ref) => {
    const [state, setState] = useState({
      curatorVisible: false,
    });

    const Alerts = useContext(Contexts.Alerts);

    async function copyText() {
      await navigator.clipboard.writeText(focalText);
      Alerts.success('Copied paragraph to clipboard.');
      onClose();
    }

    function curate() {
      setState({ curatorVisible: true });
      onClose();
    }

    return (
      <React.Fragment>
        <CPS.Menu visible={visible} ref={ref}>
          <CPS.MenuItem onClick={copyText}>Copy Text</CPS.MenuItem>
          <CPS.MenuItem onClick={curate}>Curate</CPS.MenuItem>
        </CPS.Menu>
        <Curator
          visible={state.curatorVisible}
          sourceTitle={sourceTitle}
          focalText={focalText}
          onClose={() => setState({ curatorVisible: false })}
        />
      </React.Fragment>
    );
  },
);

export default ContextMenu;

interface CuratePromptProps {
  sourceTitle: string;
  focalText: string;
  visible: boolean;
  onClose: () => void;
}
