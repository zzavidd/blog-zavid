import 'colors';

const logger = {
  info(message: any): void {
    const prefix = `[INFO ${time()}]`.green;
    console.info(`${prefix}: ${message}`);
  },
  debug(message: any): void {
    const prefix = `[DEBUG ${time()}]`.cyan;
    console.info(`${prefix}: ${message}`);
  },
  warn(message: any): void {
    const prefix = `[WARN ${time()}]`.yellow;
    console.warn(`${prefix}: ${message}`);
  },
  error(message: any): void {
    const prefix = `[ERROR ${time()}]`.red;
    console.info(`${prefix}: ${message}`);
  },
};

export default logger;

function time(): string {
  return new Intl.DateTimeFormat('en-CA', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour12: false,
    timeZone: 'Europe/London',
  }).format(new Date());
}
