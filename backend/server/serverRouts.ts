import { Router } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import { BaseController } from "../Base/BaseController";
import controllerContainerDI from "../inversify/containerDI";
import { LoggerService } from "../services/Logger/loggerServices";
import listEndpoints = require('express-list-endpoints');


// @injectable()
// export class serverRouts {
//     router: Router

//     constructor() {
//         this.router = Router()

//         const arrControllers = [...Object.values(TYPES.Controllers)]
//         arrControllers.forEach(controllerType => {
//             try {
//                 const controller: BaseController = controllerContainerDI.get<BaseController>(controllerType);
//                 this.router.use(controller.router);
//             } catch (error) {
//                 console.error(`Failed to register controller:`, error);
//             }
//         })
//     }
// }
@injectable()
export class serverRouts {
    public readonly router: Router;
    private logger: LoggerService;

    constructor(
        @inject(TYPES.Logger) logger: LoggerService
    ) {
        this.router = Router();
        this.logger = logger;
        this.registerControllers();
        this.registerHealthCheck();
        this.printRoutes();
    }

    private registerControllers(): void {
        const arrControllers = [...Object.values(TYPES.Controllers)];
        
        arrControllers.forEach(controllerType => {
            try {
                const controller = controllerContainerDI.get<BaseController>(controllerType);
                this.router.use(controller.router);
                this.logger.log(`Controller ${controllerType.toString()} registered successfully`);
            } catch (error) {
                this.logger.error(`Failed to register controller : ${error}`);
                throw error;
            }
        });
    }

    private registerHealthCheck(): void {
        this.router.get('/healthcheck', (_req, res) => {
            this.logger.log('test')
            res.status(200).json({ status: 'OK' });
        });
        this.logger.log('Healthcheck route registered at /healthcheck');
    }

    private printRoutes(): void {
    this.logger.log('\nRegistered routes:');
    const endpoints = listEndpoints(this.router);
    endpoints.forEach(endpoint => {
        this.logger.log(`[${endpoint.methods.join('|')}] ${endpoint.path}`);
    });
}
}