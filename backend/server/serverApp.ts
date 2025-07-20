import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { json } from 'body-parser';
import 'reflect-metadata';
import cors from 'cors';
import cookieParser from "cookie-parser";
import helmet from 'helmet';
import bodyParser from 'body-parser';

import { TYPES } from '../inversify/types';

import { LoggerService } from '../services/Logger/loggerServices';
import { ConfigService } from '../services/ConfigService';
import { serverRouts } from './serverRouts';
import expressSession from '../middlewere/expressSession';
import { DataBaseUseCreate } from '../db/db';
import { useErrorHandles } from '../middlewere/useErrorhandlers';






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
        @inject(TYPES.DataBaseUseCreate) private DB: DataBaseUseCreate,
	) {
		this.initApp()
	}

    private initApp(): void {
        this.app = express();
		this.port = +this.configService.get('PORT-S') || 8080;
        this.basePath = '/api';
    }

	applyMiddleware(): this {
        this.app.use(cors({
            origin: true, 
            credentials: true, 
            methods: ["GET", "POST", "PUT", "DELETE"],
        }))
        this.app.use(cookieParser())
        this.app.use(helmet())
        this.app.use(json())
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(expressSession)


        return this
	}
    
    private applyErrorHandlers(): this {
       useErrorHandles(this.app)
        return this;
    }

	private useRoutes(): this {
		this.app.use(this.basePath, this.serverRouts.router);
        
        return this;
	}

    private applyMigration(): this {
        this.DB.migrateToLatest()   
            .then(() => console.log("Migrations completed"))
            .catch(err => console.error("Migrations failed:", err));
        return this
    }


 
    private configureApp(): void {
        this
            .applyMigration()
            .applyMiddleware()
            .useRoutes()
            .applyErrorHandlers()
    }


	public async init(): Promise<void> {
        this.configureApp()

		this.server = this.app.listen(this.port)
		this.logger.log(`server start on http://localhost:${this.port}`)
	}

	public close(): void {
        if (this.server) {
        this.server.close(() => {
            this.logger.log('Сервер всё')
        })
    }
	}
}