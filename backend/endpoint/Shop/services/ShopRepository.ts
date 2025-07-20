import { inject, injectable } from "inversify";
import { IShopRepository } from "../interfaces/IShopRepository";
import { TYPES } from "../../../inversify/types";
import { DataBaseUseCreate } from "../../../db/db";
import { Shop, ShopCreateData } from "../../../../shared/Types/Shop";

@injectable()
export class ShopRepository implements IShopRepository {
    constructor(
        @inject(TYPES.DataBaseUseCreate) private db: DataBaseUseCreate
    ) {}

    public async create(shopData: ShopCreateData): Promise<Shop> {
        const shop = await this.db.getDb()
        .insertInto('shops')
        .values({
            ...shopData,
            is_active: shopData.is_active ?? true,
            created_at: new Date(),
            updated_at: new Date()
        })
        .returningAll()
        .executeTakeFirstOrThrow()

        return shop;
    }

    public async findById(shopId: number): Promise<Shop | null> {
        const shop = await this.db.getDb()
        .selectFrom('shops')
        .selectAll()
        .where('shop_id', '=', shopId)
        .executeTakeFirst()

        return shop || null
    }

    public async findAll(): Promise<Shop[]> {
        return this.db.getDb()
        .selectFrom('shops')
        .selectAll()
        .orderBy('shop_id', 'asc')
        .execute()
    }

}