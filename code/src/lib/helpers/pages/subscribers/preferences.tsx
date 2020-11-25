import React from 'react';

import { ReactHook, ReactInputChangeEvent, SubscriptionsMapping } from 'classes';
import { Checkbox } from 'src/components/form/checkbox';
import css from 'src/styles/pages/Subscribers.module.scss';

export default ({ preferences = {}, setPreferences }: SubscriptionPreferenceProps) => {
  const checkPreference = (e: ReactInputChangeEvent) => {
    const { name, checked } = e.target;
    setPreferences(
      Object.assign({}, preferences, {
        [name]: checked
      })
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
};

interface SubscriptionPreferenceProps {
  preferences: SubscriptionsMapping
  setPreferences: ReactHook<SubscriptionsMapping>
}