const { zLogic } = require('zavid-modules');

exports.isObject = (value) => {
  return typeof value === 'object';
};

exports.isString = (value) => {
  return typeof value === 'string';
};

exports.getRandom = (list) => {
  const random = Math.floor(Math.random() * list.length);
  return list[random];
};

exports.checkPostValue = (input, field, expected) => {
  if (zLogic.isFalsy(input)) return false;

  if (this.isObject(input)) {
    return input[field] === expected;
  } else {
    return input === expected;
  }
};