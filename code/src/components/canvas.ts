import { Dispatch, SetStateAction } from 'react';

import { FilterThemeOption, Theme, ThemeOption } from 'classes';

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
  setImageSource: Dispatch<SetStateAction<string>>
) {
  const ctx = canvas.getContext('2d');
  const text: string[] = [];

  content.firstChild?.childNodes.forEach((value) => {
    text.push(value.textContent!);
  });

  if (ctx !== null) {
    const img = new Image();
    img.src = `/images/zavid-filter/${colour}`;
    img.onload = () => {
      const RECT_PADDING_X = 225;
      const RECT_PADDING_Y = 200;
      const TEXT_PADDING_X = 90;
      const TEXT_PADDING_Y = 200;

      const LINE_LIMIT = 8 + text.length;
      const INITIAL_FONT_SIZE = 85;

      let fontSize = INITIAL_FONT_SIZE;
      let [fontStyle, lineHeight] = getFontStyle(fontSize);

      canvas.width = img.width;
      canvas.height = img.height;

      const rectWidth = canvas.width - RECT_PADDING_X;
      const maxTextWidth = rectWidth - TEXT_PADDING_X * 2;

      // Draft text on canvas to determine text height.
      // Do until number of lines is less than or equal to limit.
      let textHeight = 0;
      let numOfLines = 0;
      do {
        if (fontSize < INITIAL_FONT_SIZE * (2 / 3)) break;

        [fontStyle, lineHeight] = getFontStyle(fontSize);
        ctx.font = fontStyle;
        textHeight = insertText(ctx, text, 0, 0, maxTextWidth, lineHeight);
        numOfLines = textHeight / lineHeight;
        fontSize -= 3;
      } while (numOfLines > LINE_LIMIT);

      // Draw background image.
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const rectHeight = textHeight + RECT_PADDING_Y;
      const extraYShift = numOfLines === LINE_LIMIT ? 30 : 0;

      const startRectX = canvas.width / 2 - rectWidth / 2;
      const startRectY = canvas.height / 2 - rectHeight / 2 - extraYShift;
      const startTextX = startRectX + TEXT_PADDING_X;
      const startTextY = startRectY + TEXT_PADDING_Y;

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
      ctx.font = '70px Calistoga';
      insertText(ctx, [sourceTitle], 60, 135, canvas.width * (4 / 7), 90);

      // Marshal data source to image element.
      const image = new Image();
      image.src = canvas.toDataURL();
      image.onload = () => {
        setImageSource(image.src);
      };
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
