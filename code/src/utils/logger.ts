namespace Logger {
  export function info(message: any): void {
    console.info(`${format(message)} [INFO]`);
  }

  export function error(message: any): void {
    console.error(`${format(message)} [ERROR]`);
  }
}

function format(message: any): string {
  const timestamp = new Intl.DateTimeFormat('en-CA', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour12: false,
    timeZone: 'Europe/London',
  }).format(new Date());
  return `${timestamp} - ${message}`;
}

export default Logger;
