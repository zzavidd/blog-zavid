export const NumberParse = (value: unknown) => {
  return parseInt(value as string);
};

export const DAOParse = <T>(value: unknown): T | undefined => {
  let object;

  try {
    object = JSON.parse(value as string) as T;
  } catch (err) {
    console.warn(err);
    object = undefined;
  }
  return object;
};
