import { injectable } from 'inversify';
import 'reflect-metadata';

//Иммитация любой либы для логов
export class Logger {
    info(...args: unknown[]): void {
		console.log(...args);
	}

	error(...args: unknown[]): void {
		console.log(...args);
	}

	warn(...args: unknown[]): void {
		console.log(...args);
	}
}


@injectable()
export class LoggerService {
	public logger: Logger;

	constructor() {
		this.logger = new Logger();
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	error(...args: unknown[]): void {
		// отправка в sentry / rollbar
		this.logger.error(...args);
	}

	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}