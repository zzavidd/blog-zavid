import Link from 'next/link';
import React, { useContext } from 'react';

import Contexts from 'constants/contexts';
import Settings from 'constants/settings';
import * as NavWidgets from 'fragments/shared/NavWidgets';
import NavStyle from 'styles/Partials/NavigationBar.styles';

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
    <NavStyle.MobileNavigationBar open={navIsFocused}>
      <NavChildren />
    </NavStyle.MobileNavigationBar>
  );
}

function NavChildren() {
  const [, setNavIsFocused] = useContext(Contexts.Navigation);
  return (
    <React.Fragment>
      <NavStyle.NavBox>
        <NavStyle.BrandBox>
          <Link href={'/'} passHref={true}>
            <NavStyle.BrandLink>
              <NavStyle.BrandImage />
              <NavStyle.BrandTagline onClick={() => setNavIsFocused(false)}>
                {Settings.SITE_TITLE}: {Settings.SITE_TAGLINE}
              </NavStyle.BrandTagline>
            </NavStyle.BrandLink>
          </Link>
        </NavStyle.BrandBox>
        <NavWidgets.NavigationLinks />
      </NavStyle.NavBox>
      <NavStyle.NavBox>
        <NavStyle.ThemeSwitch />
        <NavStyle.AdminButton />
      </NavStyle.NavBox>
    </React.Fragment>
  );
}
