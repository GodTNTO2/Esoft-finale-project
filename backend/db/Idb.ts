import { ColumnType, Generated } from "kysely"

export interface UserTable {
    user_id: Generated<number>
    email: string
    password_hash: string
    role: string
    name: string
    phone: string
    created_at: ColumnType<Date, string | undefined, never>
    updated_at: ColumnType<Date, string | undefined, never>
}

// Адреса пользователей
export interface UserAddressTable {
    address_id: Generated<number>
    user_id: number
    city: string
    street: string
    house_number: string
    apartment_number: string 
    entrance: string | null
    floor: string | null
    is_primary: boolean
    created_at: ColumnType<Date, string | undefined, never>
    updated_at: ColumnType<Date, string | undefined, never>
}

// Категории товаров
export interface CategoryTable {
    category_id: Generated<number>
    name: string
    description: string | null
    parent_id: number | null
    is_active: boolean
    image_url: string | null
    created_at: ColumnType<Date, string | undefined, never>
    updated_at: ColumnType<Date, string | undefined, never>
}

// Товары
export interface ProductTable {
    product_id: Generated<number>
    category_id: number
    name: string
    description: string | null
    price: ColumnType<number, string, string> 
    remains: number
    discount_price: ColumnType<number | null, string, string> 
    is_available: boolean
    created_at: ColumnType<Date, string | undefined, never>
    updated_at: ColumnType<Date, string | undefined, never>
}

// Изображения товаров
export interface ProductImageTable {
    image_id: Generated<number>
    product_id: number
    image_url: string
    is_primary: boolean
    alt_text: string | null
    created_at: ColumnType<Date, string | undefined, never>
}

// Корзины
export interface CartTable {
    cart_id: Generated<number>
    user_id: number
    created_at: ColumnType<Date, string | undefined, never>
    updated_at: ColumnType<Date, string | undefined, never>
}

// Элементы корзины
export interface CartItemTable {
    cart_item_id: Generated<number>
    cart_id: number
    product_id: number
    quantity: number
    added_at: ColumnType<Date, string | undefined, never>
}

// Заказы
export interface OrderTable {
    order_id: Generated<number>
    user_id: number
    shop_id: number | null
    order_date: ColumnType<Date, string | undefined, never>
    status: string
    total_amount: ColumnType<number, string, string>
    payment_method: string
    payment_status: string
    delivery_address_id: number 
    recipient_name: string
    recipient_phone: string
    delivery_date: ColumnType<Date, string, string>
    delivery_time_slot: string
    delivery_instructions: string | null
    gift_message: string | null
    created_at: ColumnType<Date, string | undefined, never>
    updated_at: ColumnType<Date, string | undefined, never>
}

// Элементы заказа
export interface OrderItemTable {
    order_item_id: Generated<number>
    order_id: number
    product_id: number
    quantity: number
    unit_price: ColumnType<number, string, string>
    discount_amount: ColumnType<number, string, string>
    special_instructions: string | null
}

// Магазины
export interface ShopTable {
    shop_id: Generated<number>
    name: string
    city: string
    street: string
    house_number: string
    phone: string
    is_active: boolean
    created_at: ColumnType<Date, string | undefined, never>
    updated_at: ColumnType<Date, string | undefined, never>
}