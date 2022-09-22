import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CPX from 'stylesv2/Components.styles';

namespace Clickable {
  export function Icon({ icon, ...props }: IconClickableProps) {
    return (
      <CPX.Clickable {...props} type={'button'} disabled={!props.onClick}>
        <FontAwesomeIcon icon={icon} />
      </CPX.Clickable>
    );
  }
}

export default Clickable;

interface IconClickableProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconDefinition;
}
