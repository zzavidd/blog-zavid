import { Check as CheckIcon } from '@mui/icons-material';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import type { Prisma, Subscriber } from '@prisma/client';

import ZDate from 'utils/lib/date';

export function useSubscriberTableFields(): TableField<Subscriber>[] {
  return [
    {
      title: <Typography variant={'h6'}>Email</Typography>,
      property: 'email',
      renderValue: (e) => <Typography variant={'body1'}>{e.email}</Typography>,
    },
    {
      title: <Typography variant={'h6'}>First Name</Typography>,
      property: 'firstname',
      renderValue: (e) => (
        <Typography variant={'body1'}>{e.firstname}</Typography>
      ),
    },
    {
      title: <Typography variant={'h6'}>Last Name</Typography>,
      property: 'lastname',
      renderValue: (e) => (
        <Typography variant={'body1'}>{e.lastname}</Typography>
      ),
    },

    {
      title: <Typography variant={'h6'}>Subscriptions</Typography>,
      property: 'subscriptions',
      renderValue: (e) => (
        <List disablePadding={true} dense={true}>
          {Object.entries(e.subscriptions as Prisma.JsonObject).map(
            ([type, checked]) => {
              if (!checked) return null;
              return (
                <ListItem disablePadding={true} key={type}>
                  <ListItemIcon sx={{ minWidth: (t) => t.spacing(6) }}>
                    {checked ? <CheckIcon fontSize={'small'} /> : null}
                  </ListItemIcon>
                  <ListItemText>{type}</ListItemText>
                </ListItem>
              );
            },
          )}
        </List>
      ),
    },
    {
      title: <Typography variant={'h6'}>Date Subscribed</Typography>,
      property: 'createTime',
      renderValue: (e) => (
        <Typography variant={'body1'}>{ZDate.format(e.createTime)}</Typography>
      ),
    },
  ];
}
