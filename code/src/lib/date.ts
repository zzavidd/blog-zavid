namespace ZDate {
  export function format(date: Date) {
    const suffixes = new Map([
      ['one', 'st'],
      ['two', 'nd'],
      ['few', 'rd'],
      ['other', 'th'],
    ]);

    const parts = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'long',
    })
      .formatToParts(date)
      .map(({ type, value }) => {
        if (type === 'day') {
          const rule = new Intl.PluralRules('en-GB', {
            type: 'ordinal',
          }).select(parseInt(value));
          const suffix = suffixes.get(rule);
          return `${value}${suffix}`;
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
