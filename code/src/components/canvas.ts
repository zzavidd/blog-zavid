import { Dispatch, SetStateAction } from 'react';

import {
  FilterShapeOption,
  FilterThemeOption,
  Theme,
  ThemeOption
} from 'classes';

const constants = {
  [FilterShapeOption.SQUARE]: {
    RECT_PADDING_X: 115,
    RECT_PADDING_Y: 80,
    TEXT_PADDING_X: 45,
    TEXT_PADDING_Y: 90,
    EXTRA_Y_SHIFT: 30,
    INITIAL_FONT_SIZE: 42,
    INITIAL_LINE_LIMIT: 8,
    TITLE_FONT_SIZE: 35,
    TITLE_LINE_HEIGHT: 45,
    TITLE_START_X: 30,
    TITLE_START_Y: 65
  },
  [FilterShapeOption.TALL]: {
    RECT_PADDING_X: 175,
    RECT_PADDING_Y: 120,
    TEXT_PADDING_X: 60,
    TEXT_PADDING_Y: 145,
    EXTRA_Y_SHIFT: 45,
    INITIAL_FONT_SIZE: 65,
    INITIAL_LINE_LIMIT: 12,
    TITLE_FONT_SIZE: 50,
    TITLE_LINE_HEIGHT: 70,
    TITLE_START_X: 45,
    TITLE_START_Y: 90
  }
};

/**
 * Creates a canvas from a div element.
 * @param canvas The base canvas.
 * @param content The div element to create the canvas from.
 */
export function createCanvasFromContent(
  canvas: HTMLCanvasElement,
  content: HTMLDivElement,
  sourceTitle: string,
  theme: ThemeOption,
  colour: FilterThemeOption,
  shape: FilterShapeOption,
  setImageSource: Dispatch<SetStateAction<string>>
) {
  const ctx = canvas.getContext('2d');
  const text: string[] = [];

  content.firstChild?.childNodes.forEach((value) => {
    text.push(value.textContent!);
  });

  const SHAPE = constants[shape];

  if (ctx !== null) {
    const img = new Image();
    img.src = `/images/filters/${shape}/${colour}`;
    img.onload = () => {
      const LINE_LIMIT = SHAPE.INITIAL_LINE_LIMIT + text.length;

      let fontSize = SHAPE.INITIAL_FONT_SIZE;
      let [fontStyle, lineHeight] = getFontStyle(fontSize);

      canvas.width = img.width;
      canvas.height = img.height;

      const rectWidth = canvas.width - SHAPE.RECT_PADDING_X;
      const maxTextWidth = rectWidth - SHAPE.TEXT_PADDING_X * 2;

      // Draft text on canvas to determine text height.
      // Do until number of lines is less than or equal to limit.
      let textHeight = 0;
      let numOfLines = 0;
      do {
        if (fontSize < SHAPE.INITIAL_FONT_SIZE * (2 / 3)) break;

        [fontStyle, lineHeight] = getFontStyle(fontSize);
        ctx.font = fontStyle;
        textHeight = insertText(ctx, text, 0, 0, maxTextWidth, lineHeight);
        numOfLines = textHeight / lineHeight;
        fontSize -= 3;
      } while (numOfLines > LINE_LIMIT);

      // Draw background image.
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const rectHeight = textHeight + SHAPE.RECT_PADDING_Y;
      const extraYShift = Math.ceil(numOfLines) === LINE_LIMIT ? SHAPE.EXTRA_Y_SHIFT : 0;

      const startRectX = canvas.width / 2 - rectWidth / 2;
      const startRectY = canvas.height / 2 - rectHeight / 2 - extraYShift;
      const startTextX = startRectX + SHAPE.TEXT_PADDING_X;
      const startTextY = startRectY + SHAPE.TEXT_PADDING_Y;

      // Draw bounding box for text.
      ctx.fillStyle = Theme.isLight(theme)
        ? 'rgba(255,255,255,0.85)'
        : 'rgba(0,0,0,0.8)';
      ctx.fillRect(startRectX, startRectY, rectWidth, rectHeight);

      // Insert text into bounding box.
      ctx.fillStyle = Theme.isLight(theme) ? 'black' : 'white';
      insertText(ctx, text, startTextX, startTextY, maxTextWidth, lineHeight);

      // Draw source title at top left corner.
      ctx.fillStyle = 'white';
      ctx.font = `${SHAPE.TITLE_FONT_SIZE}px Calistoga`;
      insertText(
        ctx,
        [sourceTitle],
        SHAPE.TITLE_START_X,
        SHAPE.TITLE_START_Y,
        canvas.width * (4 / 7),
        SHAPE.TITLE_LINE_HEIGHT
      );

      // Marshal data source to image element.
      canvas.toBlob((blob) => {
        const image = new Image();
        image.src = URL.createObjectURL(blob);
        image.onload = () => {
          setImageSource(image.src);
        };
      }, 'image/jpeg');
    };
  }
}

/**
 * Draws the text onto the canvas, wrapping long lines.
 * @param ctx The cavnvas context.
 * @param text The text to be inserted.
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
  lineHeight: number
): number {
  let line = '';
  let textHeight = 0;

  paragraphs.forEach((paragraph, i) => {
    const words = paragraph.split(' ');
    words.forEach((word, j) => {
      const textLine = line + word + ' ';
      const textWidth = ctx.measureText(textLine).width;

      if (textWidth > maxWidth && j > 0) {
        ctx.fillText(line, x, y);
        line = word + ' ';
        y += lineHeight;
        textHeight += lineHeight;
      } else {
        line = textLine;
      }
    });

    // If last paragraph, add extra space.
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
 * Downloads the image on the canvas.
 * @param image The URL of the image.
 */
export function downloadImage(image: string) {
  fetch(image, {
    method: 'GET',
    headers: {}
  })
    .then((response) => {
      response.arrayBuffer().then(function (buffer) {
        const url = window.URL.createObjectURL(new Blob([buffer]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'zavid-excerpt.jpg');
        document.body.appendChild(link);
        link.click();
      });
    })
    .catch(console.error);
}

/**
 * Generate the font style from a specified font size.
 * @param fontSize The size of the font.
 */
function getFontStyle(fontSize: number): [string, number] {
  const lineHeight = (7 / 4) * fontSize;
  return [`${fontSize}px Mulish`, lineHeight];
}
