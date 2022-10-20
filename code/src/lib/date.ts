const suffixes = new Map([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th'],
]);

namespace ZDate {
  export function format(date: Date | string) {
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

  export function formatISO(date: Date | string) {
    return new Intl.DateTimeFormat('en-CA').format(new Date(date));
  }
}

export default ZDate;
