import { NextFunction, Response, Request, Router } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';

import { LoggerService } from '../services/Logger/logger.services'


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
	public readonly basePath: string;

	constructor(private logger: LoggerService, basePath:string) {
		this._router = Router();
		this.basePath = basePath;
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): TExpressReturn {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): TExpressReturn {
		return this.send<T>(res, HTTP_STATUSES.OK, message);
	}

	public created(res: Response): TExpressReturn {
		return res.sendStatus(HTTP_STATUSES.OK);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);

			const middleware = route.middlewares?.map((m) => m.execute.bind(m));
			const handler = route.func.bind(this);
			const pipeline = middleware ? [...middleware, handler] : handler;

			this.router[route.method](route.path, pipeline);
		}
	}
}