import pino from "pino";
import { ILogger } from "./loggerServices";
import { injectable } from "inversify";

const logger = pino({
	transport: {
		target: 'pino-pretty'
	},
})
logger.info('Салам алейкум')

@injectable()
export class PinoService implements ILogger {
  
	log: ILogger['log'] = (data) => {
		logger.info(data)
	}

	error: ILogger['error'] = (data: any) => {
		logger.error(data)
	}
} 


export default logger