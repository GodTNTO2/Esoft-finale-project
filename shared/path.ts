export const frontendPath = {
    app: '/',
    admin: '/admin',

    admins: {
        create: "/create"
    },

    cards: {
        flowers: '/products/flowers',
        gifts: '/products/gifts',
        all: '/products/gifts'
    },
    basket: '/basket',

    registration: '/registration',
    login: '/login',
    account: '/account',
    orders: "/orders"
} as const

export const backendPath = {
    basePath: "http://localhost:8080/api",

    auth: {
        registration: "/auth/register",
        login: '/auth/login',
        logout: '/auth/logout',
        check: '/auth/me'
    },

    product: {
        productsWithCategory: "/products/category/:category",
        products: "/products",
        productById: '/products/:id',
        productCreate: '/products',
        productUpdate: '/products/:id',
        productDelete: '/products/:id',
        productToggleAvailability: '/products/availability/:id',
        productUpdateImages: '/products/image/:id',
        deleteproduct_images: '/products/image/:id'
    },

    cart: {
        getCart: '/cart',
        addItem: '/cart/items/:productId',
        updateItem: '/cart/items/:productId',
        removeItem: '/cart/items/:productId',
        clearCart: '/cart',
        getTempCartId: '/cart/getTempCartId'    
    },

    order: {
        create: '/order',
        getById: '/order/:id',
        getUserOrders: "/order/:user",
        updateStatus: '/order/:id',
        cancel: "/order/cancel/:id"
    },

    address: {
        create: '/addresses',
        getAll: '/addresses',
        getById: '/addresses/:id',
        update: '/addresses/:id',
        delete: '/addresses/:id',
        setPrimary: '/addresses/primary/:id'
    },

    shop: {
        create: '/shops',
        getById: '/shops/:id',
        getAll: '/shops'
  }
} as const