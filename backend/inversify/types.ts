export const TYPES = {
  DataBaseUseCreate: Symbol.for("DataBaseUseCreate"),
  Logger: Symbol.for("Logger"),
  ConfigService: Symbol.for("ConfigService"),
  yandexDistanceService: Symbol.for("yandexDistanceService"),

  Auth: {
    IAuthRepository: Symbol.for("IAuthRepository"),
    IAuthService: Symbol.for("IAuthService")
  },

  Product: {
    IProductRepository: Symbol.for("IProductRepository"),
    IProductService: Symbol.for("IProductService")
  },

  Cart: {
    ICartRepository: Symbol.for("ICartRepository"),
    ICartService: Symbol.for("ICartService")
  },

  Order: {
    IOrderRepository: Symbol.for("IOrderRepository"),
    IOrderService: Symbol.for("IOrderService")
  },

  Address: {
    IAddressRepository: Symbol.for("IAddressRepository"),
    IAddressService: Symbol.for("IAddressService")
  },

  Shop: {
    IShopRepository: Symbol.for("IShopRepository"),
    IShopService: Symbol.for("IShopService")
  },


  Controllers: {
    Auth: Symbol.for('auth-conroller'),
    Product: Symbol.for('ProductGet-conroller'),
    Cart: Symbol.for('Cart-conroller'),
    Order: Symbol.for('Order-conroller'),
    Address: Symbol.for('Address-conroller'),
    Shop: Symbol.for('Shop-conroller'),
  }
};