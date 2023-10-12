import { MoodTimeOfDay, type Prisma } from '@prisma/client';
import React from 'react';

export const InitialMoodDashboardState: MoodDashboardState = {
  isMoodFormOpen: false,
  mood: {
    date: new Date(),
    timeOfDay:
      6 < new Date().getHours() && new Date().getHours() < 18
        ? MoodTimeOfDay.MORNING
        : MoodTimeOfDay.EVENING,
    value: 0,
    reason: '',
  },
};

export const MoodDashboardContext = React.createContext<
  ReactUseState<MoodDashboardState>
>([InitialMoodDashboardState, () => {}]);

interface MoodDashboardState {
  isMoodFormOpen: boolean;
  mood: Prisma.MoodCreateInput;
}
