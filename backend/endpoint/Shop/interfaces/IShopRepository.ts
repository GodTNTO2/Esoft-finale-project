import { Shop, ShopCreateData } from "../../../../shared/Types/Shop";

export interface IShopRepository {
    create(shopData: ShopCreateData): Promise<Shop>
    findById(shopId: number): Promise<Shop | null>
    findAll(): Promise<Shop[]>
}