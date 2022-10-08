import Link from 'next/link';
import React, { useContext } from 'react';

import Contexts from 'constants/contexts';
import { SITE_TAGLINE, SITE_TITLE } from 'constants/settings';
import NavStyle from 'stylesv2/Partials/NavigationBar.styles';

export function MainNavigationBar() {
  const [navIsFocused, setNavIsFocused] = useContext(Contexts.Navigation);

  return (
    <NavStyle.Container
      focused={navIsFocused}
      onMouseEnter={() => setNavIsFocused(true)}
      onMouseLeave={() => setNavIsFocused(false)}>
      <NavChildren />
    </NavStyle.Container>
  );
}

export function MobileNavigationBar() {
  const [navIsFocused] = useContext(Contexts.Navigation);
  return (
    <NavStyle.MobileContainer open={navIsFocused}>
      <NavChildren />
    </NavStyle.MobileContainer>
  );
}

function NavChildren() {
  const [, setNavIsFocused] = useContext(Contexts.Navigation);
  return (
    <React.Fragment>
      <NavStyle.NavBox>
        <NavStyle.BrandBox>
          <Link href={'/'}>
            <NavStyle.BrandLink>
              <NavStyle.BrandImage />
              <NavStyle.BrandTagline onClick={() => setNavIsFocused(false)}>
                {SITE_TITLE}: {SITE_TAGLINE}
              </NavStyle.BrandTagline>
            </NavStyle.BrandLink>
          </Link>
        </NavStyle.BrandBox>
        <NavStyle.Navigation />
      </NavStyle.NavBox>
      <NavStyle.NavBox>
        <NavStyle.ThemeSwitch />
        <NavStyle.AdminButton />
      </NavStyle.NavBox>
    </React.Fragment>
  );
}
