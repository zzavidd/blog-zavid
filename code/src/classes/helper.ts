export const randomElementFromList = <T>(list: T[]): T => {
  const random = Math.floor(Math.random() * list.length);
  return list[random];
};

export const randomEnumValue = <T extends Record<string, string>>(
  enumeration: T,
): T[keyof T] => {
  const keys = Object.entries(enumeration as T)
    .filter(([k]) => isNaN(parseInt(k, 10)))
    .map(([, v]) => v) as unknown as T[keyof T][];
  const random = Math.floor(Math.random() * keys.length);
  return keys[random];
};
