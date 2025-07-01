import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';

import { TYPES } from '../inversify/types';
import { LoggerService } from './Logger/logger';

@injectable()
export class ConfigService  {
	private config!: DotenvParseOutput;
	
    constructor(@inject(TYPES.Logger) private logger: LoggerService) {
		const result: DotenvConfigOutput = config();

		if (result.error) {
			this.logger.error('Ошибка');
            return
        }

        this.logger.log('.env загружен');
        this.config = result.parsed as DotenvParseOutput;
	}

	get(key: string): string {
		return this.config[key];
	}
}