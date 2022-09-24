import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';

import type { AppState } from 'constants/reducers';
import { AppActions } from 'constants/reducers';
import type * as ZBT from 'constants/types';
import AppStyles from 'stylesv2/App.styles';

import Clickable from './Clickable';

export default function Snackbar() {
  const { snackMessages } = useSelector((state: AppState) => state);
  return (
    <AppStyles.Snackbar>
      {snackMessages.map((props, key) => {
        return <Snack {...props} index={key} key={props.message} />;
      })}
    </AppStyles.Snackbar>
  );
}

function Snack({ message, duration = 6000, index }: SnackProps) {
  const dispatch = useDispatch();

  function closeSnack() {
    dispatch(AppActions.clearSnackMessage(index));
  }

  return (
    <AppStyles.Snack duration={duration}>
      {message}
      <Clickable.Icon icon={faTimes} onClick={closeSnack} />
    </AppStyles.Snack>
  );
}

interface SnackProps extends ZBT.SnackMessage {
  index: number;
}
