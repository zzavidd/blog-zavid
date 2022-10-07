import React from 'react';

import { SITE_TAGLINE, SITE_TITLE } from 'constants/settings';
import NavStyle from 'stylesv2/Partials/LeftNavigationBar.styles';

export default function LeftNavigationBar() {
  return (
    <NavStyle.Container>
      <NavStyle.NavBox>
        <NavStyle.BrandBox>
          <NavStyle.BrandButton />
          <NavStyle.BrandTagline>
            {SITE_TITLE}: {SITE_TAGLINE}
          </NavStyle.BrandTagline>
        </NavStyle.BrandBox>
        <NavStyle.Navigation />
      </NavStyle.NavBox>
      <NavStyle.NavBox>
        <NavStyle.ThemeSwitch />
        <NavStyle.AdminButton />
      </NavStyle.NavBox>
    </NavStyle.Container>
  );
}
