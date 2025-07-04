import {PinoService} from "./logger"
import { inject, injectable } from "inversify"

export interface ILogger {
  log: (...args: any[]) => void,
  error: (...args: any[]) => void
}

@injectable()
export class LoggerService implements ILogger {
  constructor (
    @inject(PinoService)
    private readonly logger: ILogger
  ) {}

  log = (data: any) => {
    this.logger.log(data)
  }

  error = (data: any) => {
    this.logger.error(data)
  }
}



