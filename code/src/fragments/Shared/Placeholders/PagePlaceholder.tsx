import { Container, Divider, Skeleton, Stack, useTheme } from '@mui/material';

export default function PagePlaceholder() {
  const theme = useTheme();
  return (
    <Container maxWidth={'sm'} sx={{ padding: (t) => t.spacing(4) }}>
      <Stack spacing={4} divider={<Divider />}>
        <Skeleton variant={'text'} />
        <Stack alignItems={'center'} spacing={2}>
          <Skeleton variant={'rounded'} width={'30%'} />
          <Skeleton
            variant={'rounded'}
            height={theme.spacing(6)}
            width={'90%'}
          />
          <Skeleton
            variant={'rounded'}
            height={theme.spacing(6)}
            width={'60%'}
          />
          <Skeleton variant={'rounded'} width={'20%'} />
        </Stack>
        <Stack spacing={4}>
          {Array(10)
            .fill(null)
            .map((_, i) => (
              <Stack key={i}>
                <Skeleton variant={'text'} width={'95%'} />
                <Skeleton variant={'text'} width={'95%'} />
                <Skeleton variant={'text'} width={'75%'} />
              </Stack>
            ))}
        </Stack>
      </Stack>
    </Container>
  );
}
