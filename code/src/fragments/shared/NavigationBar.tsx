import React from 'react';

import NavStyle from 'stylesv2/Partials/LeftNavigationBar.styles';

export default function LeftNavigationBar() {
  return (
    <NavStyle.Container>
      <NavStyle.BrandButton />
      {/* <AdminButton /> */}
      <NavStyle.ThemeSwitch />
    </NavStyle.Container>
  );
}
