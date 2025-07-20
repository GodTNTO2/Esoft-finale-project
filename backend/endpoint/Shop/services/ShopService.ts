import { inject, injectable } from "inversify";
import { IShopService } from "../interfaces/IShopService";
import { IShopRepository } from "../interfaces/IShopRepository";
import { TYPES } from "../../../inversify/types";
import { BadRequestError } from "../../../Error/BadRequestError";
import { Shop, ShopCreateData } from "../../../../shared/Types/Shop";


@injectable()
export class ShopService implements IShopService {
    constructor(
        @inject(TYPES.Shop.IShopRepository) private repository: IShopRepository
    ) {}

    public async createShop(shopData: ShopCreateData): Promise<Shop> {
        if (!shopData.name || !shopData.phone) {
            throw new BadRequestError("Shop name and phone are required")
        }

        return this.repository.create(shopData)
    }

    public async getShopById(shopId: number): Promise<Shop> {
        if (!shopId) {
            throw new BadRequestError("Shop ID is required")
        }

        const shop = await this.repository.findById(shopId);
        if (!shop) {
            throw new BadRequestError("Shop not found")
        }

        return shop
    }

    public async getAllShops(): Promise<Shop[]> {
        return this.repository.findAll()
    }
}