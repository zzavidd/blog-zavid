import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';

import Contexts from 'constants/contexts';
import HeaderStyle from 'styles/Partials/Header.styles';

export default function Header() {
  const [navIsFocused, setNavIsFocused] = useContext(Contexts.Navigation);

  return (
    <HeaderStyle.Header>
      <HeaderStyle.HeaderContent>
        <HeaderStyle.NavToggle onClick={() => setNavIsFocused(!navIsFocused)}>
          <FontAwesomeIcon icon={faBars} />
        </HeaderStyle.NavToggle>
        <HeaderStyle.ThemeSwitch />
      </HeaderStyle.HeaderContent>
    </HeaderStyle.Header>
  );
}
