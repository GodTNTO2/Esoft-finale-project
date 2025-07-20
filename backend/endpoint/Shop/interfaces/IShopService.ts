import { Shop, ShopCreateData } from "../../../../shared/Types/Shop";


export interface IShopService {
    createShop(shopData: ShopCreateData): Promise<Shop>
    getShopById(shopId: number): Promise<Shop>
    getAllShops(): Promise<Shop[]>;
}