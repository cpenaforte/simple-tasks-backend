import winston from 'winston';
import expressWinston from 'express-winston';

const options = {
  file: {
    level: 'error',
    filename: 'src/logs/app.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = expressWinston.logger({
  transports: [ new winston.transports.File(options.file),
    new winston.transports.Console(options.console) ],
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'DD/MM/YYYY HH:mm:ss',
    }),
    winston.format.printf(info => `${[info.timestamp]}: ${info.level}: ${info.message}`),
  ),
});

export default logger;