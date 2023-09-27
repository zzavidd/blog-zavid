import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import {
  CONTACT_DETAILS,
  PROFILE_SUMMARY,
  TECH_POOL,
} from '../CurriculumVitae.utils';

export default function CVProfile() {
  return (
    <Stack
      divider={<Divider />}
      rowGap={4}
      width={424}
      p={4}
      sx={{ backgroundColor: (t) => t.palette.primary.main }}
      justifyContent={'space-between'}>
      <Stack alignItems={'center'} rowGap={3}>
        <Avatar
          src={'/images/avatar/profile.jpg'}
          sx={{
            border: (t) => `3px solid ${t.palette.common.white}`,
            height: 168,
            width: 168,
          }}
        />
        <Stack alignItems={'center'}>
          <Typography variant={'h1'} pb={1}>
            David Egbue
          </Typography>
          <Typography fontWeight={700}>Full-Stack Engineer</Typography>
        </Stack>
      </Stack>
      <List>
        {CONTACT_DETAILS.map(({ Icon, label: title }) => (
          <ListItem alignItems={'center'} key={title}>
            <ListItemIcon sx={{ minWidth: 0, pr: 3 }}>
              <Icon sx={{ fontSize: 18 }} size={18} />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ lineHeight: 1.5 }}
              sx={{ mx: 0, my: '0.1rem' }}>
              {title}
            </ListItemText>
          </ListItem>
        ))}
      </List>
      <Stack>
        <Typography variant={'h4'}>Profile</Typography>
        <Typography>{PROFILE_SUMMARY}</Typography>
      </Stack>
      <Stack rowGap={1}>
        <Typography variant={'h4'}>Tech Pool</Typography>
        <Stack rowGap={4}>
          {Object.values(TECH_POOL).map(({ preamble, stack }) => (
            <Stack rowGap={2} key={preamble}>
              <Typography fontSize={13} fontWeight={300}>
                {preamble}
              </Typography>
              <Grid
                container={true}
                columns={2}
                rowSpacing={2}
                columnSpacing={1}>
                {stack.map(({ label, Icon }) => (
                  <Grid xs={1} key={label}>
                    <Stack
                      direction={'row'}
                      alignItems={'center'}
                      columnGap={2}>
                      <Icon size={15} />
                      <Typography
                        fontSize={13}
                        fontWeight={500}
                        lineHeight={1.5}>
                        {label}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
