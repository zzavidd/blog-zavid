import type { Dispatch, SetStateAction } from 'react';

import type { AppTheme, FilterThemeOption } from 'classes/theme';
import { FilterShape, FilterShapeOption, Theme } from 'classes/theme';

const constants = {
  [FilterShapeOption.SQUARE]: {
    RECT_PADDING_X: 115,
    RECT_PADDING_Y: 80,
    TEXT_PADDING_X: 45,
    TEXT_PADDING_Y: 85,
    EXTRA_Y_SHIFT: 20,
    INITIAL_FONT_SIZE: 42,
    INITIAL_LINE_LIMIT: 9,
    ST_FONT_SIZE: 35,
    ST_LINE_HEIGHT: 45,
    ST_START_X: 30,
    ST_START_Y: 65,
  },
  [FilterShapeOption.TALL]: {
    RECT_PADDING_X: 175,
    RECT_PADDING_Y: 120,
    TEXT_PADDING_X: 60,
    TEXT_PADDING_Y: 130,
    EXTRA_Y_SHIFT: 45,
    INITIAL_FONT_SIZE: 55,
    INITIAL_LINE_LIMIT: 14,
    ST_FONT_SIZE: 50,
    ST_LINE_HEIGHT: 65,
    ST_START_X: 45,
    ST_START_Y: 90,
  },
  [FilterShapeOption.WIDE]: {
    RECT_PADDING_X: 500,
    RECT_PADDING_Y: 80,
    TEXT_PADDING_X: 45,
    TEXT_PADDING_Y: 85,
    EXTRA_Y_SHIFT: 20,
    INITIAL_FONT_SIZE: 42,
    INITIAL_LINE_LIMIT: 9,
    ST_FONT_SIZE: 35,
    ST_LINE_HEIGHT: 45,
    ST_START_X: 30,
    ST_START_Y: 65,
  },
  common: {
    TITLE_FONT_SIZE: 80,
    TITLE_LINE_HEIGHT: 100,
  },
};

namespace Canvas {
  /**
   * Creates a canvas from a div element.
   * @param canvas The base canvas.
   * @param content The div element to create the canvas from.
   * @param sourceTitle The title of the source post.
   * @param theme The theme of the context text to be displayed.
   * @param colour The colour of the background image filter.
   * @param shape The dimensions of the image.
   * @param setImageSource The dispatch function to set the image source.
   * @param isTitleOnly Flag indicating to only curate title..
   */
  export function createFromContent(
    canvas: HTMLCanvasElement,
    content: HTMLDivElement,
    sourceTitle: string,
    theme: AppTheme,
    colour: FilterThemeOption,
    shape: FilterShapeOption,
    setImageSource: Dispatch<SetStateAction<string>>,
    isTitleOnly: boolean,
  ) {
    const ctx = canvas.getContext('2d');
    const SHAPE = Object.assign({}, constants[shape], constants.common);
    const text: string[] = [];

    if (isTitleOnly) {
      text.push(sourceTitle);
    } else {
      content.firstChild?.childNodes.forEach((value) => {
        text.push(value.textContent!);
      });
    }

    const fontStyleOptions = {
      isTitleOnly,
      constantLineHeight: SHAPE.TITLE_LINE_HEIGHT,
    };

    if (ctx !== null) {
      const bgImage = new Image();
      bgImage.src = `/images/filters/${shape}-${colour}.jpg`;
      bgImage.onload = () => {
        const LINE_LIMIT = SHAPE.INITIAL_LINE_LIMIT + text.length;

        let fontSize = isTitleOnly
          ? SHAPE.TITLE_FONT_SIZE
          : SHAPE.INITIAL_FONT_SIZE;
        let [fontStyle, lineHeight] = getFontStyle(fontSize, fontStyleOptions);

        canvas.width = bgImage.width;
        canvas.height = bgImage.height;

        const rectWidth = canvas.width - SHAPE.RECT_PADDING_X;
        const maxTextWidth = rectWidth - SHAPE.TEXT_PADDING_X * 2;

        // Draft text on canvas to determine text height.
        // Do until number of lines is less than or equal to limit.
        let textHeight = 0;
        let numOfLines = 0;
        do {
          if (fontSize < SHAPE.INITIAL_FONT_SIZE * (2 / 3)) break;

          [fontStyle, lineHeight] = getFontStyle(fontSize, fontStyleOptions);
          ctx.font = fontStyle;
          textHeight = insertText(ctx, text, 0, 0, maxTextWidth, lineHeight);
          numOfLines = textHeight / lineHeight;
          fontSize -= 2;
        } while (numOfLines > LINE_LIMIT);

        // Draw background image.
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

        const rectHeight = textHeight + SHAPE.RECT_PADDING_Y;
        const extraYShift =
          Math.ceil(numOfLines) === LINE_LIMIT ? SHAPE.EXTRA_Y_SHIFT : 0;

        const startRectX = canvas.width / 2 - rectWidth / 2;
        const startRectY = canvas.height / 2 - rectHeight / 2 - extraYShift;
        const startTextX = startRectX + SHAPE.TEXT_PADDING_X;
        const startTextY =
          startRectY +
          SHAPE.TEXT_PADDING_Y +
          (isTitleOnly && !FilterShape.isTall(shape) ? 30 : 0);

        // Draw bounding box for text.
        ctx.fillStyle = Theme.isLight(theme)
          ? 'rgba(255,255,255,0.85)'
          : 'rgba(0,0,0,0.8)';
        ctx.fillRect(startRectX, startRectY, rectWidth, rectHeight);

        // Insert text into bounding box.
        ctx.fillStyle = Theme.isLight(theme) ? 'black' : 'white';
        insertText(ctx, text, startTextX, startTextY, maxTextWidth, lineHeight);

        // Draw source title at top left corner if not title only.
        if (!isTitleOnly) {
          ctx.fillStyle = 'white';
          ctx.font = `${SHAPE.ST_FONT_SIZE}px Calistoga`;
          insertText(
            ctx,
            [sourceTitle],
            SHAPE.ST_START_X,
            SHAPE.ST_START_Y,
            canvas.width * (4 / 7),
            SHAPE.ST_LINE_HEIGHT,
          );
        }

        // Marshal data source to image element.
        canvas.toBlob((blob) => {
          const image = new Image();
          image.src = URL.createObjectURL(blob!);
          image.onload = () => {
            setImageSource(image.src);
          };
        }, 'image/jpeg');
      };
    }
  }

  /**
   * Downloads the image on the canvas.
   * @param imageUrl The URL of the image.
   */
  export async function downloadImage(imageUrl: string) {
    try {
      const res = await fetch(imageUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'image/jpeg',
        },
      });
      const buffer = await res.arrayBuffer();
      const url = window.URL.createObjectURL(new Blob([buffer]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'zavid-excerpt.jpg');
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      console.error(e);
    }
  }
}

export default Canvas;

/**
 * Draws the text onto the canvas, wrapping long lines.
 * @param ctx The cavnvas context.
 * @param paragraphs The text to be inserted.
 * @param x The x-coordinate of the text's start point.
 * @param y The y-coordinate of the text's start point.
 * @param maxWidth The maximum width of the text box.
 * @param lineHeight The height for each line of text.
 */
function insertText(
  ctx: CanvasRenderingContext2D,
  paragraphs: string[],
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  let line = '';
  let textHeight = 0;

  paragraphs.forEach((paragraph, i) => {
    const stanzaLines = paragraph.split(/\n/);

    stanzaLines.forEach((stanzaLine, j) => {
      const words = stanzaLine.split(' ');

      words.forEach((word, k) => {
        const textLine = line + word + ' ';
        const textWidth = ctx.measureText(textLine).width;

        if (textWidth > maxWidth && k > 0) {
          ctx.fillText(line, x, y);
          line = word + ' ';
          y += lineHeight;
          textHeight += lineHeight;
        } else {
          line = textLine;
        }
      });

      // If line is not last, add extra line.
      if (j < stanzaLines.length - 1) {
        ctx.fillText(line, x, y);
        line = '';
        y += lineHeight;
        textHeight += lineHeight;
      }
    });

    // If paragraph is not last, add extra space.
    if (i < paragraphs.length - 1) {
      ctx.fillText(line, x, y);
      line = '';
      y += lineHeight * 1.5;
      textHeight += lineHeight * 1.5;
    }
  });

  ctx.fillText(line, x, y);
  textHeight += lineHeight;
  return textHeight;
}

/**
 * Generate the font style from a specified font size.
 * @param fontSize The size of the font.
 * @param isTitleOnly Flag indicating to only curate title.
 */
function getFontStyle(
  fontSize: number,
  options: FontStyleOptions,
): [string, number] {
  const { isTitleOnly, constantLineHeight } = options;
  const lineHeight = isTitleOnly ? constantLineHeight! : (7 / 4) * fontSize;
  const fontfamily = isTitleOnly ? 'Calistoga' : 'Mulish';
  return [`${fontSize}px ${fontfamily}`, lineHeight];
}

interface FontStyleOptions {
  isTitleOnly?: boolean;
  constantLineHeight?: number;
}
