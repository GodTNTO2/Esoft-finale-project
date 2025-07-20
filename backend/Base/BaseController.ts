import { NextFunction, Response, Request, Router } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';

import { LoggerService } from '../services/Logger/loggerServices'


export interface IControllerRoute {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	middlewares?: any[]; 
}

export type TExpressReturn = Response<any, Record<string, any>>;

const HTTP_STATUSES = {
	'OK': 200,
	'CREATED': 201
} as const


@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(public logger: LoggerService) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	protected ok(res: Response, data?: any) {
		res.status(200).json(data);
	}

	protected created(res: Response, data?: any) {
		res.status(201).json(data);
	}

	protected clientError(res: Response, message?: string) {
		res.status(400).json({ error: message || 'Bad Request' });
	}

	protected unauthorized(res: Response, message?: string) {
		res.status(401).json({ error: message || 'Unauthorized' });
	}

	protected notFound(res: Response, message?: string) {
		res.status(404).json({ error: message || 'Not Found' });
	}

	protected internalError(res: Response, message?: string) {
		this.logger.error(message);
		res.status(500).json({ error: message || 'Internal Server Error' });
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);
			const middleware = route.middlewares?.map((m) => {
				if (!m?.execute) {
					throw new Error(`Middleware is invalid: no 'execute' method in ${m}`);
				}
				return m.execute.bind(m);
			});
			const handler = route.func.bind(this);
			const pipeline = middleware ? [...middleware, handler] : handler;

			this.router[route.method](route.path, pipeline);
		}
	}
}