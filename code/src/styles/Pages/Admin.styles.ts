import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { darken, transparentize } from 'polished';
import styled, { css } from 'styled-components';

import CPX from 'styles/Components/Components.styles';
import Mixins from 'styles/Mixins.styles';

namespace AdminStyle {
  export const Container = styled.div`
    height: 100%;
    padding: 2em;
  `;

  export const Main = styled.main`
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
  `;

  export const NavButton = styled(CPX.Button)`
    ${({ theme }) => Mixins.ClickBehavior(theme.Color.Background.Header)}
    background-color: ${({ theme }) => theme.Color.Background.Header};
    border: 2px solid ${({ theme }) => theme.Color.Font.Body};
    border-radius: 20px;
    color: ${({ theme }) => theme.Color.Font.Body};
    font-size: 1.5em;
    padding: 1em 2em;
  `;
}

export namespace AdminList {
  export const Container = styled.div`
    height: 100%;
    position: relative;
  `;

  export const Main = styled.main`
    display: flex;
    flex-direction: column;
    height: 100%;
  `;

  export const Heading = styled.h1`
    margin: 1em 0;
    text-align: center;
  `;

  export const TableBox = styled.div`
    ${Mixins.Responsive(['overflow-x', 'unset', { sm: 'auto' }])}
    width: 100%;
  `;

  export const Table = styled.table`
    border-spacing: 0;
    border-top: 1px solid ${({ theme }) => theme.Color.Font.Body};
    font-size: 1.1em;
    position: relative;
    width: 100%;
  `;

  export const TableHead = styled.thead`
    background-color: ${({ theme }) => theme.Color.Background.Header};
    font-family: ${({ theme }) => theme.Font.Title};
    position: sticky;
    top: 0;
  `;

  export const TableRow = styled.tr`
    font-family: ${({ theme }) => theme.Font.Body};
    transition: all 0.3s;

    &:hover {
      background-color: ${({ theme }) =>
        transparentize(0.1, theme.Color.Background.Header)};
    }
  `;

  const CellStyle = css<CellProps>`
    cursor: ${({ onClick }) => (onClick ? 'pointer' : 'auto')};
    text-align: ${({ align = 'left' }) => align};
  `;

  export const TableHeaderCell = styled.th<CellProps>`
    ${CellStyle}
    padding: 0.75em 1em;
  `;

  export const TableCell = styled.td<CellProps>`
    ${CellStyle}
    padding: 0.6em 1em;
  `;

  export const Button = styled(CPX.Button)`
    background: none;
    padding: 0;
  `;

  export const Icon = styled(FontAwesomeIcon)`
    color: ${({ theme }) => theme.Color.Font.Body};

    &:hover {
      svg {
        color: ${({ theme }) => darken(0.5, theme.Color.Font.Body)};
      }
    }
  `;

  export const Hyperlink = styled.a`
    color: ${({ theme }) => theme.Color.Font.Body};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  `;

  export const ModalText = styled.p`
    font-family: ${({ theme }) => theme.Font.Body};
  `;

  export const AddLink = styled.a`
    color: ${({ theme }) => theme.Color.Font.Body};
    cursor: pointer;
    text-decoration: none;
    transition: all 0.1s;

    &:hover {
      border-bottom: 1px solid ${({ theme }) => theme.Color.Font.Faded};
      color: ${({ theme }) => theme.Color.Font.Faded};
    }
  `;

  export const AddIcon = styled(FontAwesomeIcon)`
    margin-right: 0.4em;
  `;

  export const SortIcon = styled(FontAwesomeIcon)`
    margin-left: 0.4em;
  `;
}

export default AdminStyle;

interface CellProps {
  align?: TableAlign;
  onClick?: () => void;
}
type TableAlign = 'left' | 'center' | 'right';
