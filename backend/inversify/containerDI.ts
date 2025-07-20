import { Container, ContainerModule } from "inversify";
import { ConfigService } from "../services/ConfigService";
import { TYPES } from "./types";
import { LoggerService } from "../services/Logger/loggerServices";
import { DataBaseUseCreate } from "../db/db";
import { AuthController } from "../endpoint/Auth/AuthController";
import { serverRouts } from "../server/serverRouts";
import { App } from "../server/serverApp";
import { IAuthService } from "../endpoint/Auth/interfaces/IAuthServices";
import { AuthService } from "../endpoint/Auth/Services/AuthServices";
import { IAuthRepository } from "../endpoint/Auth/interfaces/IAuthRepository";
import { AuthRepository } from "../endpoint/Auth/Services/AuthRepository";
import { PinoService } from "../services/Logger/logger";
import { IProductService } from "../endpoint/Product/interfaces/IProductService";
import { ProductService } from "../endpoint/Product/Services/ProductService";
import { ProductRepository } from "../endpoint/Product/Services/ProductRepository";
import { IProductRepository } from "../endpoint/Product/interfaces/IProductRepository";
import { ProductController } from "../endpoint/Product/ProductController";
import { ICartRepository } from "../endpoint/Cart/interfaces/ICartRepository";
import { CartRepository } from "../endpoint/Cart/services/CartRepository";
import { ICartService } from "../endpoint/Cart/interfaces/ICartService";
import { CartService } from "../endpoint/Cart/services/CartService";
import { CartController } from "../endpoint/Cart/CartController";
import { IOrderRepository } from "../endpoint/Order/interfaces/IOrderRepository";
import { OrderRepository } from "../endpoint/Order/services/OrderRepository";
import { IOrderService } from "../endpoint/Order/interfaces/IOrderService";
import { OrderService } from "../endpoint/Order/services/OrderService";
import { OrderController } from "../endpoint/Order/OrderController";
import { YandexDistanceService } from "../services/yandexDistanceService";
import { ShopController } from "../endpoint/Shop/ShopController";
import { AddressController } from "../endpoint/UserAddress/AddressController";
import { IAddressRepository } from "../endpoint/UserAddress/interfaces/IAddressRepository";
import { AddressRepository } from "../endpoint/UserAddress/services/AddressRepository";
import { IAddressService } from "../endpoint/UserAddress/interfaces/IAddressService";
import { AddressService } from "../endpoint/UserAddress/services/AddressService";
import { IShopRepository } from "../endpoint/Shop/interfaces/IShopRepository";
import { ShopRepository } from "../endpoint/Shop/services/ShopRepository";
import { IShopService } from "../endpoint/Shop/interfaces/IShopService";
import { ShopService } from "../endpoint/Shop/services/ShopService";




export const appContainerDI = new ContainerModule(({bind}) => {
    bind<ConfigService>(TYPES.ConfigService).to(ConfigService)
    bind<LoggerService>(TYPES.Logger).to(LoggerService)
    bind<PinoService>(PinoService).toSelf()
    bind<YandexDistanceService>(TYPES.yandexDistanceService).to(YandexDistanceService)

    bind<DataBaseUseCreate>(TYPES.DataBaseUseCreate).to(DataBaseUseCreate)

    bind<IAuthService>(TYPES.Auth.IAuthService).to(AuthService)
    bind<IAuthRepository>(TYPES.Auth.IAuthRepository).to(AuthRepository)

    bind<IProductService>(TYPES.Product.IProductService).to(ProductService)
    bind<IProductRepository>(TYPES.Product.IProductRepository).to(ProductRepository)

    bind<ICartRepository>(TYPES.Cart.ICartRepository).to(CartRepository)
    bind<ICartService>(TYPES.Cart.ICartService).to(CartService)

    bind<IOrderRepository>(TYPES.Order.IOrderRepository).to(OrderRepository)
    bind<IOrderService>(TYPES.Order.IOrderService).to(OrderService)
    
    bind<IAddressRepository>(TYPES.Address.IAddressRepository).to(AddressRepository)
    bind<IAddressService>(TYPES.Address.IAddressService).to(AddressService)

    bind<IShopRepository>(TYPES.Shop.IShopRepository).to(ShopRepository)
    bind<IShopService>(TYPES.Shop.IShopService).to(ShopService)


    bind<serverRouts>(serverRouts).toSelf()

    bind<App>(App).toSelf()
})

const controllerContainerDI = new Container()
controllerContainerDI.load(appContainerDI)

controllerContainerDI.bind<AuthController>(TYPES.Controllers.Auth).to(AuthController)
controllerContainerDI.bind<ProductController>(TYPES.Controllers.Product).to(ProductController)
controllerContainerDI.bind<CartController>(TYPES.Controllers.Cart).to(CartController)
controllerContainerDI.bind<OrderController>(TYPES.Controllers.Order).to(OrderController)
controllerContainerDI.bind<AddressController>(TYPES.Controllers.Address).to(AddressController)
controllerContainerDI.bind<ShopController>(TYPES.Controllers.Shop).to(ShopController)




export default controllerContainerDI