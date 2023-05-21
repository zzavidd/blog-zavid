import Settings from 'constants/settings';

const suffixes = new Map([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th'],
]);

namespace ZDate {
  export function format(date?: Date | string): string {
    if (!date) return '';
    const parts = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'full',
    })
      .formatToParts(new Date(date))
      .map(({ type, value }) => {
        // Extract and include day ordinal.
        if (type === 'day') {
          const rule = new Intl.PluralRules('en-GB', {
            type: 'ordinal',
          }).select(parseInt(value));
          const suffix = suffixes.get(rule);
          return `${value}${suffix}`;
        }

        // Remove commas.
        if (value === ', ') {
          return ' ';
        }

        return value;
      });
    return parts.join('');
  }

  export function formatISO(date?: Date | string): string {
    if (!date) return '';
    return new Intl.DateTimeFormat('sv-SE').format(new Date(date));
  }

  export function calculateZavidAge(): number {
    const diff = Date.now() - Settings.ZAVID_BIRTHDAY.getTime();
    const diffInYears = new Date(diff).getUTCFullYear() - 1970;
    return diffInYears;
  }
}

export default ZDate;
