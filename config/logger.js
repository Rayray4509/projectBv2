// const winston = require('winston');
import winston  from 'winston';

import 'winston-daily-rotate-file';

const customFormat = winston.format.printf(info => 
	`${info.level.toUpperCase()}: ${info.tinfomestamp} message:${i.message}`
);


let exceptionHandlers = [
	new winston.transports.DailyRotateFile({
		name: 'Error Logs',
		filename: 'logs/errLogs/exceptions-%DATE%.log',
		datePattern: 'YYYY-MM-DD',
		zippedArchive: true,
		maxSize: '128m',
		maxFiles: '14d'
	})
]

const infoAndWarnFilter = winston.format((info) => { 
	return info.level === 'info' || info.level === 'warn' ? info : false;
})

const errorFilter = winston.format((info) => { 
	return info.level === 'error' ? info : false ;
})
// const warnFilter = winston.format((info, opts) => { 
// 	return info.level === 'warn' ? info : false 
// })


let transports = [
	new winston.transports.DailyRotateFile({
		name: 'Error Logs',
		filename: 'logs/errLogs/error-%DATE%.log',
		datePattern: 'YYYY-MM-DD',
		zippedArchive: true,
		maxSize: '128m',
		maxFiles: '1d',
		level: 'error',
		json: true,
		colorize: false,
		
		format: winston.format.combine(
			errorFilter(),
			winston.format.timestamp(),
			winston.format.splat(),
            winston.format.json(),
			customFormat
		)
	}),
	new winston.transports.DailyRotateFile({
		name: 'INFO logs',
		filename: 'logs/infoLogs/info-%DATE%.log',
		datePattern: 'YYYY-MM-DD',
		zippedArchive: true,
		maxSize: '128m',
		maxFiles: '1d',
		json: true,
		colorize: false,
		level: 'info',
		format: winston.format.combine(
			infoAndWarnFilter(),
			winston.format.timestamp(),
            winston.format.json(),
			winston.format.splat(),
			customFormat
		)
	}),
	new winston.transports.Console({		
		level: winston.config.npm.levels ? 'debug' : 'warn',
		handleExceptions: true,
		json: false,
		colorize: true,
		format: winston.format.combine(
            // warnFilter(),
			winston.format.colorize(),
			winston.format.simple(),
			winston.format.splat()
		)
	})
]

const logger = winston.createLogger({
	transports: transports,
	exceptionHandlers: exceptionHandlers,
	level: winston.config.npm.levels  ? 'debug' : 'info',
	exitOnError: false,
	// defaultMeta:true,
	// Default format
	format: winston.format.combine(
		winston.format.timestamp({format:'MM-DD-YYYY HH:mm:ss'}),
        // winston.format.simple(),
		// winston.format.splat(),
		customFormat
	)
})

export {logger};