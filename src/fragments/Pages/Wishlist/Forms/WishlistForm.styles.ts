import { IconButton, Stack, css, styled } from '@mui/material';

export const ImagePreviewStack = styled(Stack)(
  ({ theme }) => css`
    align-items: center;
    align-self: center;
    height: ${theme.spacing(12)};
    justify-content: center;
    overflow: hidden;
    position: relative;
    width: 80%;
  `,
);

export const ImagePreview = styled('img')`
  height: 100%;
  object-fit: contain;
  width: 100%;
`;

export const RemoveImageButton = styled(IconButton)`
  position: absolute;
  right: 0;
  top: 0;
`;
