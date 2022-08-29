export class UIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UIError';
  }
}
