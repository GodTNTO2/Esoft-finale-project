import { NextFunction, Request, Response } from "express"

export interface IShopController {
    createShop(req: Request, res: Response, next: NextFunction): Promise<void>
    getShopById(req: Request, res: Response, next: NextFunction): Promise<void>
    getAllShops(req: Request, res: Response, next: NextFunction): Promise<void>
}