export const DAOParse = <T>(value: unknown): T | undefined => {
  if (!value) return;

  try {
    return JSON.parse(value as string) as T;
  } catch (err) {
    console.warn(err);
  }
};
