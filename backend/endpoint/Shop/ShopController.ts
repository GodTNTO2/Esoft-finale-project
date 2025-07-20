import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { BaseController } from "../../Base/BaseController";
import { LoggerService } from "../../services/Logger/loggerServices";
import { TYPES } from "../../inversify/types";
import { IShopService } from "./interfaces/IShopService";
import { IShopController } from "./interfaces/IShopController";
import { backendPath } from "../../../shared/path";
import { ValidateRequestMiddleware } from "../../middlewere/ValidateRequestMiddleware";
import { shopCreateSchema } from "../../../shared/zodSchema/shop.schema";



@injectable()
export class ShopController extends BaseController implements IShopController {
    constructor(
        @inject(TYPES.Logger) logger: LoggerService,
        @inject(TYPES.Shop.IShopService) private shopService: IShopService
    ) {
        super(logger);
        this.bindRoutes([
        {
            path: backendPath.shop.create,
            method: "post",
            func: this.createShop,
            middlewares: [new ValidateRequestMiddleware(shopCreateSchema)]
        },
        {
            path: backendPath.shop.getById,
            method: "get",
            func: this.getShopById
        },
        {
            path: backendPath.shop.getAll,
            method: "get",
            func: this.getAllShops
        }
        ]);
    }

    public async createShop(req: Request, res: Response): Promise<void> {
        try {
            const shop = await this.shopService.createShop(req.body)
            this.created(res, shop)
        } catch (error) {
            this.logger.error(`Failed to create shop: ${error}`)
            this.internalError(res, "Failed to create shop")
        }
    }

    public async getShopById(req: Request, res: Response): Promise<void> {
        try {
            const shopId = parseInt(req.params.id)
            const shop = await this.shopService.getShopById(shopId)
            this.ok(res, shop)
        } catch (error) {
            this.logger.error(`Failed to get shop: ${error}`)
            this.internalError(res, "Failed to get shop")
        }
    }

    public async getAllShops(req: Request, res: Response): Promise<void> {
        try {
            const shops = await this.shopService.getAllShops()
            this.ok(res, shops)
        } catch (error) {
            this.logger.error(`Failed to get shops: ${error}`)
            this.internalError(res, "Failed to get shops")
        }
    }
}