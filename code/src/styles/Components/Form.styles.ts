import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AutoSizingTextarea from 'react-textarea-autosize';
import type {
  DefaultTheme,
  FlattenInterpolation,
  ThemeProps,
} from 'styled-components';
import styled, { createGlobalStyle, css } from 'styled-components';

import Mixins from 'styles/Mixins.styles';
import { BREAKPOINTS, COLOR, SIZES } from 'styles/Variables.styles';

import CPX from './Components.styles';

namespace FORM {
  const DefaultStyle: FlattenInterpolation<ThemeProps<DefaultTheme>> = css`
    background: none;
    border: none;
    color: ${({ theme }) => theme.Color.Font.Body};
    font-family: ${({ theme }) => theme.Font.Body};
    font-size: 1.1em;
    outline: none;
    padding: 0.3em;
    width: 100%;
  `;

  export const Container = styled.form`
    ${Mixins.Responsive([
      'height',
      '100vh',
      { sm: `calc(100vh - ${SIZES.HEADER_HEIGHT})` },
    ])}
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
  `;

  export const Main = styled.section`
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2em;
    overflow-y: auto;
    padding: 2em;
  `;

  export const FieldRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1.5em 2.5em;
    width: 100%;
  `;

  export const FieldSet = styled.div<{ flex?: number; order?: number }>`
    display: flex;
    flex: ${({ flex = 1 }) => `${flex} ${flex}`};
    flex-direction: column;
    gap: 1.5em;

    @media (max-width: ${BREAKPOINTS.lg}) {
      flex: auto;
      order: ${({ order = 'unset' }) => order};
      width: 100%;
    }
  `;

  export const Field = styled.div<{ flex?: number }>`
    flex: ${({ flex = 1 }) => `${flex} ${flex}`};
    width: 100%;
  `;

  export const Footer = styled.footer`
    display: flex;
    flex: 0 1 auto;
  `;

  const FooterButton = styled(CPX.Button)`
    color: ${COLOR.WHITE};
    flex: 1 1 auto;
    font-size: 1em;
    font-weight: bold;
    height: 100%;
    padding: 1.3em;
  `;

  export const SubmitButton = styled(FooterButton)`
    ${Mixins.ClickBehavior('#2f223d', {
      hover: 0.05,
      active: 0.07,
    })}
  `;

  export const CancelButton = styled(FooterButton)`
    ${Mixins.ClickBehavior('#533c6c', {
      hover: -0.05,
      active: 0.02,
    })}
  `;

  export const Label = styled.label`
    font-family: ${({ theme }) => theme.Font.Title};
    font-size: 1.1em;
  `;

  export const SelectContainer = styled.div`
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.Color.Font.Body};
    display: flex;
    padding-block: 0.5em;

    svg {
      margin-left: 0.4em;
    }
  `;

  export const Select = styled.select`
    ${DefaultStyle}
    appearance: none;
  `;

  export namespace Date {
    export const Container = styled.div`
      align-items: center;
      border-bottom: 1px solid ${({ theme }) => theme.Color.Font.Body};
      display: flex;
      padding-block: 0.5em;
    `;

    export const LeadingIcon = styled(FontAwesomeIcon)`
      margin-right: 0.5em;
    `;

    export const ReactDatepickerGlobalStyle = createGlobalStyle`
      .react-datepicker,
      .react-datepicker__header,
      .react-datepicker__today-button {
        background-color: rgba(36, 36, 36, 1);
      }

      .react-datepicker-popper[data-placement^=top] {
        padding-bottom: 0;
      }

      .react-datepicker__header *,
      .react-datepicker__today-button,
      .react-datepicker__day {
        color: #ffffff;
      }

      .react-datepicker__day--disabled,
      .react-datepicker__day--outside-month {
        color: rgba(255, 255, 255, 0.2);
      }

      .react-dateinput {
        ${DefaultStyle}
      }
    `;
  }

  export namespace Input {
    export const Container = styled.div`
      align-items: center;
      border-bottom: 1px solid ${({ theme }) => theme.Color.Font.Body};
      display: flex;
      padding-block: 0.5em;
    `;

    export const Standard = styled.input`
      ${DefaultStyle}
      ${({ disabled }) =>
        disabled &&
        css`
          color: #808080;
        `}
    `;

    export const Textarea = styled(AutoSizingTextarea)`
      ${DefaultStyle}
      border-bottom: 1px solid ${({ theme }) => theme.Color.Font.Body};
      min-height: 50px;
      padding: 0.8em 0.3em;
    `;
  }
}

export default FORM;
