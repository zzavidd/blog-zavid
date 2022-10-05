import HeaderStyle from 'stylesv2/Partials/Header.styles';

export default function Header() {
  return (
    <HeaderStyle.Header>
      <HeaderStyle.HeaderContent>
        <HeaderStyle.BrandButton />
        <HeaderStyle.Navigation />
        <HeaderStyle.ThemeSwitch />
      </HeaderStyle.HeaderContent>
    </HeaderStyle.Header>
  );
}
