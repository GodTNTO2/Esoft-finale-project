import { Router } from "express";
import { injectable } from "inversify";
import { TYPES } from "../inversify/types";
import { BaseController } from "../Base/BaseController";
import controllerContainerDI from "../inversify/containerDI";


@injectable()
export class serverRouts {
    router: Router

    constructor() {
        this.router = Router()

        const arrControllers = [...Object.values(TYPES.Controllers)]
        arrControllers.forEach(contrl => {
            const controller: BaseController = controllerContainerDI.get(contrl)
            this.router.use(controller.router)
        })
    }
}