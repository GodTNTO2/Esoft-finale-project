import pino, { LoggerOptions } from "pino";
import PinoHttp from "pino-http";
import { ILogger } from "./logger.services";

const config: LoggerOptions  = {
	transport: {
		target: 'pino-pretty',
	},
}

const logger = pino(config)
logger.info('Салам алейкум')

export const httpLogger = PinoHttp(config)

export default logger


export class PinoService implements ILogger {
  
	log: ILogger['info'] = (data) => {
		logger.info(data)
	}

	error: ILogger['error'] = (data: any) => {
		logger.error(data)
	}
} 