namespace ZString {
  export function capitalise(text: string): string {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
  }

  export const toTitleCase = (text: string): string => {
    if (!text || typeof text !== 'string') return '';

    const sentence = text.toLowerCase().split(' ');
    for (let i = 0; i < sentence.length; i++) {
      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }

    return sentence.join(' ');
  };

  export const toPunctuatedList = (
    items: string[],
    conjunction = '&',
  ): string => {
    const elements = [items.slice(0, -1).join(', '), items.slice(-1)[0]];
    const str = elements.join(items.length < 2 ? '' : ` ${conjunction} `);
    return str;
  };

  export const convertCsvToArray = (
    words: string | string[],
    options: CSVToArrayOptions = {},
  ): string[] => {
    let list: string[] = [];
    if (!words) return list;
    if (typeof words === 'object') return words;

    const { lowercase = true } = options;

    words
      .trim()
      .split(',')
      .forEach((word) => {
        let text: string = word;
        if (lowercase) {
          text = text.toLowerCase();
        }
        text = text.trim();
        list.push(text);
      });

    list = list.filter((e) => e);
    return list;
  };

  export const convertArrayToCsv = (list: string | string[]): string => {
    if (!list || !list.length) return '';
    if (typeof list === 'string') return list;
    list = list.filter((el) => el);
    return list.join(', ');
  };
}

export default ZString;

interface CSVToArrayOptions {
  lowercase?: boolean;
}
