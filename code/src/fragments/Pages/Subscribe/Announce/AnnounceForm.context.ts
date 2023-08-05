import React from 'react';

export const InitialAnnounceFormState: AnnounceFormState = {
  announcement: {
    content: '',
    subject: '',
    preview: '',
  },
};

export const AnnounceFormContext = React.createContext<
  ReactUseState<AnnounceFormState>
>([InitialAnnounceFormState, () => {}]);

interface AnnounceFormState {
  announcement: SubscriberAnnouncement;
}
