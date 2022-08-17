import React from 'react';

import type {
  ReactHook,
  ReactInputChangeEvent,
  SubscriptionsMapping,
} from 'classes';
import { Checkbox } from 'components/form/checkbox';
import css from 'styles/pages/Subscribers.module.scss';

export default function ({
  preferences = {},
  setPreferences,
}: SubscriptionPreferenceProps) {
  const checkPreference = (e: ReactInputChangeEvent) => {
    const { name, checked } = e.target;
    setPreferences(
      Object.assign({}, preferences, {
        [name]: checked,
      }),
    );
  };

  const checks = Object.entries(preferences).map(([label, checked], key) => {
    return (
      <Checkbox
        key={key}
        name={label}
        label={label}
        checked={checked}
        onChange={checkPreference}
      />
    );
  });
  return (
    <div className={css['pref-checks']}>
      <div className={css['pref-checks-checkboxes']}>{checks}</div>
    </div>
  );
}

interface SubscriptionPreferenceProps {
  preferences: SubscriptionsMapping;
  setPreferences: ReactHook<SubscriptionsMapping>;
}
