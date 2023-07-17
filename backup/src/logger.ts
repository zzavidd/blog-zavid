import log4js from 'log4js';

log4js.configure({
  appenders: {
    console: {
      type: 'console',
      layout: {
        pattern: '%[[%p %r]%] %m',
        type: 'pattern',
      },
    },
  },
  categories: {
    default: {
      appenders: ['console'],
      level: 'debug',
    },
  },
});

const logger = log4js.getLogger('console');

export default logger;
