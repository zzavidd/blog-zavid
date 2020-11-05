const isObject = (value: any): boolean => {
  return typeof value === 'object';
};

const isString = (value: any): boolean => {
  return typeof value === 'string';
};

const randomEnumValue = <T extends unknown>(enumeration: T): T[keyof T] => {
  const keys = (Object.entries(enumeration as any)
    .filter(([k]) => isNaN(parseInt(k, 10)))
    .map(([, v]) => v) as unknown) as T[keyof T][];
  const random = Math.floor(Math.random() * keys.length);
  return keys[random];
};

export { isObject, isString, randomEnumValue };
