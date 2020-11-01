const isObject = (value: any): boolean => {
  return typeof value === 'object';
};

const isString = (value: any): boolean => {
  return typeof value === 'string';
};

const getRandom = (list: any[]): any => {
  const random = Math.floor(Math.random() * list.length);
  return list[random];
};

export { isObject, isString, getRandom };
