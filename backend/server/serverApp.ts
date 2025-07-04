import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { json } from 'body-parser';
import 'reflect-metadata';
import cors from 'cors';
import cookieParser from "cookie-parser";
import helmet from 'helmet';

import { TYPES } from '../inversify/types';

import { LoggerService } from '../services/Logger/loggerServices';
import { ConfigService } from '../services/ConfigService';
import { serverRouts } from './serverRouts';
import expressSession from '../middlewere/expressSession';





@injectable()
export class App {
	app!: Express;
	server!: Server;

	port!: number;
    basePath!: string;

	constructor(
		@inject(TYPES.Logger) private logger: LoggerService,
		@inject(TYPES.ConfigService) private configService: ConfigService,
		@inject(serverRouts) private serverRouts: serverRouts,
	) {
		this.initApp()
	}

    private initApp(): void {
        this.app = express();
		this.port = +this.configService.get('PORT-S') || 8080;
        this.basePath = this.configService.get('BASE_PATH') || '';
    }

	applyMiddleware(): this {
        this.app.use(cors(
            // this.configService.get('CORS_OPTIONS')
        ));
        this.app.use(cookieParser())
        this.app.use(helmet())
        this.app.use(json());
        this.app.use(expressSession)


        return this
	}

	useRoutes(): this {
		this.app.use(this.basePath, this.serverRouts.router);
        
        return this;
	}
 
    private configureApp(): void {
        this
            .applyMiddleware()
            .useRoutes();
    }


	public async init(): Promise<void> {
        this.configureApp()

		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
	}

	public close(): void {
        if (this.server) {
        this.server.close(() => {
            this.logger.log('Сервер всё');
        });
    }
	}
}