namespace ZNumber {
  export const toDoubleDigit = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  /**
   * Generates a random number between specified upper and lower bounds.
   */
  export const generateRandom = (start: number, end: number) => {
    return Math.floor(Math.random() * end) + start;
  };
}

export default ZNumber;
