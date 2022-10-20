import { useContext } from 'react';

import Contexts from 'constants/contexts';
import type * as ZBT from 'constants/types';
import * as Style from 'stylesv2/Components/Popup.styles';

export default function AlertBar() {
  const { alerts } = useContext(Contexts.Alerts);
  return (
    <Style.Alert.Container>
      {alerts.map((props, key) => {
        return <Alert {...props} index={key} key={key} />;
      })}
    </Style.Alert.Container>
  );
}

function Alert({ message, type, index }: AlertProps) {
  const Alerts = useContext(Contexts.Alerts);

  function closeSnack() {
    Alerts.remove(index);
  }

  return (
    <Style.Alert.Dialog type={type} onClick={closeSnack}>
      {message}
    </Style.Alert.Dialog>
  );
}

interface AlertProps extends ZBT.AlertDefinition {
  index: number;
}
