export const copyImageToCanvas = (
  canvas: HTMLCanvasElement,
  text: HTMLDivElement
) => {
  const ctx = canvas.getContext('2d');
  if (ctx !== null) {
    const img = new Image();
    img.src = '/images/zavid-filter/purple';
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, 2160, 2160);

      const rectPaddingX = 300;
      const rectPaddingY = 800;

      const rectWidth = canvas.width - rectPaddingX;
      const rectHeight = canvas.height - rectPaddingY;
      const midWidth = canvas.width / 2 - rectWidth / 2;
      const midHeight = canvas.height / 2 - rectHeight / 2;

      ctx.fillRect(midWidth, midHeight, rectWidth, rectHeight);

      ctx.font = '80px Mulish';
      ctx.fillStyle = 'white';
      insertText(
        ctx,
        text.innerText,
        midWidth + 100,
        midHeight + 200,
        rectWidth - 200,
        130
      );

      // downloadImage(canvas.toDataURL());
    };
  }
};

const downloadImage = (image: string) => {
  fetch(image, {
    method: 'GET',
    headers: {}
  })
    .then((response) => {
      response.arrayBuffer().then(function (buffer) {
        const url = window.URL.createObjectURL(new Blob([buffer]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'image.jpg');
        document.body.appendChild(link);
        link.click();
      });
    })
    .catch(console.error);
};

function insertText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
