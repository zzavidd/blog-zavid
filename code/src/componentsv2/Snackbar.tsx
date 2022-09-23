import React from 'react';
import { useSelector } from 'react-redux';

import type { AppState } from 'constants/reducers';
import AppStyles from 'stylesv2/App.styles';

export default function Snackbar() {
  const { snackMessages } = useSelector((state: AppState) => state);
  return (
    <AppStyles.Snackbar>
      {snackMessages.map((message) => {
        return <Snack message={message} key={message} />;
      })}
    </AppStyles.Snackbar>
  );
}

function Snack({ message }: SnackProps) {
  return <AppStyles.Snack>{message}</AppStyles.Snack>;
}

interface SnackProps {
  message: string;
}
