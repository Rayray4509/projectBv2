// const winston = require('winston');
import winston  from 'winston';

import 'winston-daily-rotate-file';

//自定義紀錄格式
const customFormat = winston.format.printf(info => 
	//紀錄的層級轉為全大寫、紀錄時間、紀錄訊息
	`${info.level.toUpperCase()}: ${info.timestamp} message:${info.message}`
);


let exceptionHandlers = [
	new winston.transports.DailyRotateFile({
		name: 'exceptionError Logs',
		filename: 'logs/errLogs/exceptions-%DATE%.log',
		datePattern: 'YYYY-MM-DD',
		zippedArchive: true,
		maxSize: '128m',
		maxFiles: '14d'
	})
]

//非info、warn層級返回false，不予紀錄
const infoAndWarnFilter = winston.format((info) => info.level === 'info' || info.level === 'warn' ? info : false);

const errorFilter = winston.format((info) => info.level === 'error' ? info : false);


//多個層級的日誌輪換
let transports = [
	//使用日誌輪換
	new winston.transports.DailyRotateFile({
		name: 'Error Logs',
		//文件的名稱
		filename: 'logs/errLogs/error-%DATE%.log',
		//日誌的日期格式
		datePattern: 'YYYY-MM-DD',
		//gzip歸檔
		zippedArchive: true,
		//文件的大小
		maxSize: '128m',
		//要保留的日誌數，後綴d為天數
		maxFiles: '1d',
		//層級
		level: 'error',
		//使用json格式
		json: true,
		//不使用套件默認色彩
		colorize: false,
		//紀錄的格式設定(使用組合格式)
		format: winston.format.combine(
			//非設定層級對象不予紀錄
			errorFilter(),
			//使用時間戳
			winston.format.timestamp(),
			//插入 %d %s 樣式的消息字串
			winston.format.splat(),
			//使用json格式
            winston.format.json(),
			//自定義紀錄格式
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

//創建紀錄器
const logger = winston.createLogger({
	//為每一個層級創建一個紀錄器
	transports: transports,
	//在設定之外的意外紀錄
	exceptionHandlers: exceptionHandlers,
	//紀錄層級
	level: winston.config.npm.levels  ? 'debug' : 'info',
	//錯誤被紀錄後繼續執行
	exitOnError: false,
	//紀錄的格式設定(使用組合格式)
	format: winston.format.combine(
		//時間格式ex: 2022/12/09 14:35:26
		winston.format.timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
		//自定義紀錄格式
		customFormat
	)
})

export {logger};