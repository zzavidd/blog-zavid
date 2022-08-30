import React from 'react';

import type { ReactInputChangeEvent, SubscriptionsMapping } from 'classes';
import { Checkbox } from 'components/form/checkbox';
import css from 'styles/pages/Subscribers.module.scss';

export default function SubscriptionPreferences({
  preferences = {},
  setPreferences,
}: SubscriptionPreferenceProps) {
  function checkPreference(e: ReactInputChangeEvent) {
    const { name, checked } = e.target;
    setPreferences({
      ...preferences,
      [name]: checked,
    });
  }

  return (
    <div className={css['pref-checks']}>
      <div className={css['pref-checks-checkboxes']}>
        {Object.entries(preferences).map(([label, checked], key) => {
          return (
            <Checkbox
              key={key}
              name={label}
              label={label}
              checked={checked}
              onChange={checkPreference}
            />
          );
        })}
      </div>
    </div>
  );
}

interface SubscriptionPreferenceProps {
  preferences?: SubscriptionsMapping;
  setPreferences: (value: SubscriptionsMapping) => void;
}
