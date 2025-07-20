import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';

import { TYPES } from '../inversify/types';
import { LoggerService } from './Logger/loggerServices';

@injectable()
export class ConfigService  {
	private config!: DotenvParseOutput;
	
    constructor(@inject(TYPES.Logger) private logger: LoggerService) {
		const result: DotenvConfigOutput = config();


		if (result.error) {
			this.logger.error('Error env');
            return
        }

        this.logger.log('.env Success');
        this.config = result.parsed as DotenvParseOutput;
	}

	get(key: string): string {
		return this.config[key];
	}
}