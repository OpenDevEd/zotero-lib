import { createLogger, format, transports } from 'winston';

function getLogingLevel() {
  let level = 'info';

  if (process.env.NODE_ENV === 'production') {
    level = 'error';
  }

  return level;
}

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
const logger = createLogger({
  // To see more detailed errors, change this to 'debug'
  level: getLogingLevel(),
  format: format.combine(format.splat(), format.simple()),
  transports: [new transports.Console()],
});

export default logger;
