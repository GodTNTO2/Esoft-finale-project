import { inject, injectable } from "inversify";
import { BaseController } from "../../Base/BaseController";
import { IAuthController } from "./interfaces/IAuthController";
import { LoggerService } from "../../services/Logger/loggerServices";
import { TYPES } from "../../inversify/types";



@injectable()
export class AuthController extends BaseController implements IAuthController {

    constructor(
        @inject(TYPES.Logger) logger: LoggerService
    ) {
        super(logger)
    }
}