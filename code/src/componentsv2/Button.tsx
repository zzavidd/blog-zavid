import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CPX from 'stylesv2/Components.styles';

namespace Button {
  export function Icon({ icon, children, ...props }: IconButtonProps) {
    return (
      <CPX.IconButton {...props} type={'button'}>
        <FontAwesomeIcon icon={icon} />
        {children}
      </CPX.IconButton>
    );
  }
}

export default Button;

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconDefinition;
}
