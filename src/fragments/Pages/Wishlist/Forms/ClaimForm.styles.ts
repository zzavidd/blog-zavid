import { Stack, css, styled } from '@mui/material';

namespace ClaimFormStyles {
  export const ImageBox = styled(Stack)(
    ({ theme }) => css`
      align-items: center;
      border-radius: ${theme.spacing(2)};
      height: ${theme.spacing(11)};
      justify-content: center;
      margin-block: ${theme.spacing(3)};
      overflow: hidden;

      img {
        border: 2px groove ${theme.palette.divider};
        height: 100%;
        object-fit: cover;
      }
    `,
  );
}

export default ClaimFormStyles;
