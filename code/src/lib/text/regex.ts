/**
 * A map of emphasis constants.
 * Ordered chronologically.
 */
export enum Emphasis {
  BOLD = 'bold',
  ITALIC = 'italic',
  BOLDITALIC = 'bold-italic',
  UNDERLINE = 'underline',
  STRIKETHROUGH = 'strikethrough',
  HYPERLINK = 'hyperlink',
  COLOR = 'color',
  HIGHLIGHT = 'highlight',
  SUPERSCRIPT = 'superscript',
  SUBSCRIPT = 'subscript',
  CUSTOM = 'custom',
  ESCAPE = 'escape',
}

/**
 * A map of section constants.
 * Ordered chronologically
 */
export enum Section {
  HEADING = 'heading',
  SUBHEADING = 'subheading',
  IMAGE = 'image',
  DIVIDER = 'divider',
  BULLET_LIST = 'bullet',
  HYPHEN_LIST_ITEM = 'hyphen',
  NUMBERED_LIST = 'numbered',
  BLOCKQUOTE = 'blockquote',
  TWEET = 'tweet',
  INSTAGRAM = 'instagram-post',
  SPOTIFY = 'spotify-track',
  SOUNDCLOUD = 'soundcloud-track',
}

/**
 * The regex mapping for emphasis constants.
 * Ordered in terms of power.
 */
export const emphasisRegexMapping: Record<Emphasis, EmphasisRegexValue> = {
  [Emphasis.CUSTOM]: {
    pure: new RegExp(/\%{2}(.*?)\%{2}/),
    split: new RegExp(/(\%{2}.*?\%{2})/),
  },
  [Emphasis.ESCAPE]: {
    pure: new RegExp(/\\(.*?)\\/),
    split: new RegExp(/(\\.*?\\)/),
  },
  [Emphasis.HYPERLINK]: {
    pure: new RegExp(/\[(.*?)\]\((.*?)\)/),
    split: new RegExp(/(\[.*?\]\(.*?\))/),
  },
  [Emphasis.BOLDITALIC]: {
    pure: new RegExp(/\*{3}(.*?)\*{3}/),
    split: new RegExp(/(\*{3}.*?\*{3})/),
  },
  [Emphasis.BOLD]: {
    pure: new RegExp(/\*{2}(.*?)\*{2}/),
    split: new RegExp(/(\*{2}.*?\*{2})/),
  },
  [Emphasis.ITALIC]: {
    pure: new RegExp(/\*{1}(.*?)\*{1}/),
    split: new RegExp(/(\*{1}.*?\*{1})/),
  },
  [Emphasis.UNDERLINE]: {
    pure: new RegExp(/\_(.*?)\_/),
    split: new RegExp(/(\_.*?\_)/),
  },
  [Emphasis.STRIKETHROUGH]: {
    pure: new RegExp(/\~(.*?)\~/),
    split: new RegExp(/(\~.*?\~)/),
  },
  [Emphasis.SUPERSCRIPT]: {
    pure: new RegExp(/\^{2}(.*?)\^{2}/),
    split: new RegExp(/(\^{2}.*?\^{2})/),
  },
  [Emphasis.SUBSCRIPT]: {
    pure: new RegExp(/\^{1}(.*?)\^{1}/),
    split: new RegExp(/(\^{1}.*?\^{1})/),
  },
  [Emphasis.HIGHLIGHT]: {
    pure: new RegExp(/\<(\#[a-fA-F0-9]{6})\>\{{2}(.*?)\}{2}/),
    split: new RegExp(/(\<\#[a-fA-F0-9]{6}\>\{{2}.*?\}{2})/),
  },
  [Emphasis.COLOR]: {
    pure: new RegExp(/\<(\#[a-fA-F0-9]{6})\>\{(.*?)\}/),
    split: new RegExp(/(\<\#[a-fA-F0-9]{6}\>\{.*?\})/),
  },
};

/**
 * The regex mapping for section constants.
 * Ordered in terms of power.
 */
export const sectionRegexMapping: Record<Section, RegExp> = {
  [Section.HEADING]: new RegExp(/^\#\s(.*?)$/),
  [Section.SUBHEADING]: new RegExp(/^\#{2}\s(.*?)$/),
  [Section.IMAGE]: new RegExp(/^\!\[(.*?)\]\((.*?)\)(F?)$/),
  [Section.DIVIDER]: new RegExp(/^(\-{3}|\_{3})$/),
  [Section.BULLET_LIST]: new RegExp(/\:\:ul(b)?\n((?:\+\s*.*\n+)*)\:\:end/),
  [Section.HYPHEN_LIST_ITEM]: new RegExp(/^\-\s*(.*?)$/),
  [Section.NUMBERED_LIST]: new RegExp(
    /\:\:ol(b)?\n((?:(?:[0-9]+[\.\)]|\+)\s*.*\n+)*)\:\:end/,
  ),
  [Section.BLOCKQUOTE]: new RegExp(/^\>\s(.*?)$/),
  [Section.TWEET]: new RegExp(/^\!\{Tweet\}\(([0-9]+)\)$/i),
  [Section.INSTAGRAM]: new RegExp(/^\!\{Insta\}\((.*?)\)$/i),
  [Section.SPOTIFY]: new RegExp(/^\!\{Spotify\}\((.*?)\)$/i),
  [Section.SOUNDCLOUD]: new RegExp(/^\!\{Soundcloud\}\((.*?)\)$/i),
};

/** Regular expression for new lines except numbered lists. */
export const newLinesExceptNumberedListsRegex = new RegExp(
  /\n\n(?![0-9]+[\.\)])/,
);

/** Regular expression for new lines except numbered lists. */
export const strayRegexToOmit = new RegExp(/\:{2}[a-z]+/);

/**
 * Combine all emphasis regular expressions for splitting.
 * If the 'alterForHyperlinks' flag is set to true, will prevent
 * display of hyperlink text on deformat.
 * @param options The options for combining emphasis regex.
 */
export function getCombinedEmphasisRegex(
  options: CombinedEmphasisOptions = {},
) {
  const { alterForHyperlinks = false } = options;

  const emphasisRegexList = Object.values(emphasisRegexMapping).map(
    (regex: EmphasisRegexValue) => {
      const isHyperlink = regex === emphasisRegexMapping[Emphasis.HYPERLINK];
      if (alterForHyperlinks && isHyperlink) {
        regex.split = new RegExp(/(\[.*?\]\(.*?\))/);
      }
      return regex.split.source;
    },
  );

  return new RegExp(emphasisRegexList.join('|'), 'g');
}

interface CombinedEmphasisOptions {
  alterForHyperlinks?: boolean;
}

interface EmphasisRegexValue {
  pure: RegExp;
  split: RegExp;
}
