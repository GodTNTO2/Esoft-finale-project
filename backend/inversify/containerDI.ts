import { Container, ContainerModule } from "inversify";
import { ConfigService } from "../services/ConfigService";
import { TYPES } from "./types";
import { LoggerService } from "../services/Logger/loggerServices";
import { DataBaseUseCreate } from "../db/db";
import { AuthController } from "../endpoint/Auth/AuthController";
import { serverRouts } from "../server/serverRouts";
import { App } from "../server/serverApp";



export const appContainerDI = new ContainerModule(({bind}) => {
    bind<ConfigService>(TYPES.ConfigService).to(ConfigService)
    bind<LoggerService>(TYPES.Logger).to(LoggerService)

    bind<DataBaseUseCreate>(TYPES.DataBaseUseCreate).to(DataBaseUseCreate)

    bind<serverRouts>(serverRouts).toSelf()

    bind<App>(App).toSelf()
})

const controllerContainerDI = new Container()
controllerContainerDI.load(appContainerDI)

controllerContainerDI.bind<AuthController>(TYPES.Controllers.Auth).to(AuthController)



export default controllerContainerDI