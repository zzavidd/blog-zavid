import { useContext } from 'react';

import * as Style from 'styles/Components/Popup.styles';
import Contexts from 'utils/contexts';

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

interface AlertProps extends AlertDefinition {
  index: number;
}
