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

  export const constructCleanSlug = (...input: string[]): string => {
    return input
      .join(' ')
      .toLowerCase() // Turn to lowercase
      .replace('é', 'e') // Replace accents
      .replace(/[^a-zA-Z 0-9]+/g, ' ') // Remove all non-alphanumeric characters
      .replace(/\b(a|an|and|the|but|or|so)\b/g, '') // Remove stopwords
      .trim() // Trim remnant whitespace
      .replace(/\s+/g, '-'); // Replace spaces with dashes
  };

  export const constructSimpleNameSlug = (name: string): string => {
    const array = name.split(/[\W_]+/);

    for (let i = 0; i < array.length; i++) {
      if (i < 1) continue;
      array[i] = array[i].substring(0, 1);
    }

    const slug = array.join();

    return slug
      .toLowerCase() // Turn to lowercase
      .replace(/[^a-zA-Z 0-9]+/g, ''); // Remove all non-alphanumeric characters
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

  /**
   * Generate a random string of characters.
   * @deprecated
   */
  export const generateRandomString = (length: number): string => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  interface CSVToArrayOptions {
    lowercase?: boolean;
  }
}

export default ZString;
