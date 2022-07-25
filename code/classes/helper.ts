export const isObject = (value: unknown): boolean => {
  return typeof value === 'object';
};

export const isString = (value: unknown): boolean => {
  return typeof value === 'string';
};

export const randomElementFromList = <T extends unknown>(list: T[]): T => {
  const random = Math.floor(Math.random() * list.length);
  return list[random];
};

export const randomEnumValue = <T extends unknown>(
  enumeration: T
): T[keyof T] => {
  const keys = (Object.entries(enumeration as T[])
    .filter(([k]) => isNaN(parseInt(k, 10)))
    .map(([, v]) => v) as unknown) as T[keyof T][];
  const random = Math.floor(Math.random() * keys.length);
  return keys[random];
};
