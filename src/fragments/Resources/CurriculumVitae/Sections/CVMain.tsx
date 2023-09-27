import type { StackProps } from '@mui/material';
import {
  Box,
  Divider,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { EDUCATION, EXPERIENCE } from '../CurriculumVitae.utils';

const sxProps: StackProps = {
  pl: 3,
  sx: {
    borderLeft: (t) => `4px solid ${t.palette.primary.light}`,
  },
};

export default function CVMain() {
  return (
    <Stack
      bgcolor={'white'}
      height={'100%'}
      width={'100%'}
      p={4}
      rowGap={3}
      justifyContent={'space-between'}
      divider={<Divider />}>
      <Stack rowGap={1}>
        <Typography variant={'h2'}>Experience</Typography>
        <Stack rowGap={5}>
          {EXPERIENCE.map((e, i) => (
            <Stack rowGap={2} {...sxProps} key={i}>
              <Box>
                <Stack direction={'row'} justifyContent={'space-between'}>
                  <Typography
                    variant={'h3'}
                    color={'secondary.main'}
                    fontWeight={700}>
                    {e.role}
                  </Typography>
                  <Typography variant={'caption'}>{e.duration}</Typography>
                </Stack>
                <Typography fontSize={11} fontWeight={700}>
                  {e.company} • {e.employment}
                </Typography>
                {e.location ? (
                  <Typography fontSize={11} fontStyle={'italic'}>
                    {e.location}
                  </Typography>
                ) : null}
              </Box>
              <Typography variant={'body2'} fontWeight={400}>
                {e.description}
              </Typography>
              <Grid container={true} columns={2} spacing={2}>
                {e.highlights.map(({ label, description }, i) => (
                  <Grid xs={1} py={0} key={i}>
                    <ListItem
                      sx={{
                        color: (t) => t.palette.text.primary,
                      }}
                      key={i}>
                      <ListItemText
                        primary={label}
                        secondary={description}
                        primaryTypographyProps={{
                          variant: 'subtitle1',
                        }}
                        secondaryTypographyProps={{
                          variant: 'body2',
                        }}
                      />
                    </ListItem>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          ))}
        </Stack>
      </Stack>
      <Stack rowGap={1}>
        <Typography variant={'h2'}>Education</Typography>
        <Stack>
          {EDUCATION.map((e, i) => (
            <Stack {...sxProps} key={i}>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography
                  variant={'h3'}
                  color={'secondary.main'}
                  fontSize={14}>
                  {e.location}
                </Typography>
                <Typography variant={'caption'}>{e.duration}</Typography>
              </Stack>
              <Typography fontSize={12}>{e.course}</Typography>
              <Typography fontSize={12} fontWeight={700}>
                {e.award}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
