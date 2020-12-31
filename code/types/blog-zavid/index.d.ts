interface String {
  standardize(): string;
}

interface CanvasRenderingContext2D {
  insertText(
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): void;
}
