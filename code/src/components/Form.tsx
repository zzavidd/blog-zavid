import type { StackProps } from '@mui/material';
import {
  Button,
  Container,
  Drawer,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';
import React, { useState } from 'react';

import Paragraph from './Typography/Paragraph';

export default function Form({
  Content,
  ToolbarActions,
  previewContent,
  previewTitle,
}: FormProps) {
  const [state, setState] = useState({ isPreviewOpen: false });

  function togglePreview() {
    setState({ isPreviewOpen: !state.isPreviewOpen });
  }

  return (
    <Container maxWidth={false} disableGutters={true}>
      <Container maxWidth={'xl'}>
        <Stack mx={{ xs: 3, md: 5 }} my={5} spacing={6}>
          {Content}
        </Stack>
      </Container>
      <Toolbar
        disableGutters={true}
        component={Paper}
        sx={{
          backgroundColor: (t) => t.palette.background.paper,
          bottom: 0,
          position: 'sticky',
        }}>
        <Container maxWidth={'xl'}>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            px={5}
            py={4}
            width={'100%'}>
            {previewContent ? (
              <Button onClick={togglePreview}>
                {state.isPreviewOpen ? 'Hide' : 'Show'} Preview
              </Button>
            ) : null}
            <Stack
              direction={'row'}
              spacing={3}
              justifyContent={'flex-end'}
              flexGrow={1}>
              {ToolbarActions}
            </Stack>
          </Stack>
        </Container>
      </Toolbar>
      {previewContent ? (
        <Drawer
          open={state.isPreviewOpen}
          variant={'persistent'}
          anchor={'right'}
          hideBackdrop={true}
          PaperProps={{ sx: { maxWidth: '50%' } }}>
          <Toolbar />
          <Stack m={5}>
            {previewTitle ? (
              <Typography variant={'h2'} mb={5}>
                {previewTitle}
              </Typography>
            ) : null}
            <Paragraph>{previewContent}</Paragraph>
          </Stack>
        </Drawer>
      ) : null}
    </Container>
  );
}

export function FormRow(props: StackProps) {
  return <Stack direction={'row'} spacing={5} {...props} />;
}

interface FormProps extends React.PropsWithChildren {
  Content: ReactNode;
  ToolbarActions: ReactNode;
  previewContent?: string;
  previewTitle?: string;
}
