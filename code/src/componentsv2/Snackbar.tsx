import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';

import Contexts from 'constants/contexts';
import type * as ZBT from 'constants/types';
import AppStyles from 'stylesv2/App.styles';

import Clickable from './Clickable';

export default function Snackbar() {
  const { snacks } = useContext(Contexts.Snacks);
  return (
    <AppStyles.Snackbar>
      {snacks.map((props, key) => {
        return <Snack {...props} index={key} key={key} />;
      })}
    </AppStyles.Snackbar>
  );
}

function Snack({ message, duration = 6000, index }: SnackProps) {
  const Snacks = useContext(Contexts.Snacks);

  function closeSnack() {
    Snacks.remove(index);
  }

  return (
    <AppStyles.Snack duration={duration}>
      {message}
      <Clickable.Icon icon={faTimes} onClick={closeSnack} />
    </AppStyles.Snack>
  );
}

interface SnackProps extends ZBT.Snack {
  index: number;
}
