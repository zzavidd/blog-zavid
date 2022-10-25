import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';

import Contexts from 'constants/contexts';
import type * as ZBT from 'constants/types';
import * as Style from 'styles/Components/Popup.styles';

import Clickable from './Clickable';

export default function Snackbar() {
  const { snacks } = useContext(Contexts.Snacks);
  return (
    <Style.Snack.Container>
      {snacks.map((props, key) => {
        return <Snack {...props} index={key} key={key} />;
      })}
    </Style.Snack.Container>
  );
}

function Snack({ message, duration = 6000, index }: SnackProps) {
  const Snacks = useContext(Contexts.Snacks);

  function closeSnack() {
    Snacks.remove(index);
  }

  return (
    <Style.Snack.Dialog duration={duration}>
      {message}
      <Clickable.Icon icon={faTimes} onClick={closeSnack} />
    </Style.Snack.Dialog>
  );
}

interface SnackProps extends ZBT.SnackDefinition {
  index: number;
}
