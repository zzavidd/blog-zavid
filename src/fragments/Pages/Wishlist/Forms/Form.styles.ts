import {
  Accordion as MuiAccordion,
  buttonGroupClasses,
  css,
  formControlClasses,
  FormGroup as MuiFormGroup,
  Paper,
  Stack,
  styled,
  svgIconClasses,
  Typography,
  accordionSummaryClasses,
  listClasses,
} from '@mui/material';

namespace FormStyles {
  export const Main = styled(Stack)(
    ({ theme }) => css`
      flex: 1;
      padding: ${theme.spacing(5)};

      .${svgIconClasses.root} {
        color: ${theme.palette.primary.light};
      }
    `,
  );

  export const Fieldset = styled(Stack)(
    ({ theme }) => css`
      gap: ${theme.spacing(6)};
    `,
  );

  export const FormTitle = styled(Typography)`
    font-family: ${({ theme }) => theme.typography.overline};
    font-size: ${({ theme }) => theme.spacing(5)};
    font-weight: 500;
  `;

  export const FormGroup = styled(MuiFormGroup)(
    ({ theme }) => css`
      gap: ${theme.spacing(5)};

      .${formControlClasses.root} {
        flex: 1;
      }
    `,
  );

  export const FormFooterButtonGroup = styled(Paper)(
    ({ theme }) => css`
      border-radius: 0;
      border-top: 2px solid ${theme.palette.divider};
      bottom: 0;
      flex: 0;
      padding: ${theme.spacing(4)};
      position: sticky;
      z-index: ${theme.zIndex.drawerFooter};

      .${buttonGroupClasses.root} {
        height: ${theme.spacing(7)};
      }
    `,
  );

  export const Accordion = styled(MuiAccordion)(
    ({ theme }) => css`
      .${accordionSummaryClasses.root} {
        padding: ${theme.spacing(1, 4)};
      }

      .${listClasses.root} {
        padding: ${theme.spacing(0)};
      }
    `,
  );
}

export default FormStyles;
