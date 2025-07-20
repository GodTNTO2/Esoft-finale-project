import { ColumnType, Generated } from "kysely"

// ColumnType<Date, string | undefined, never>

export interface UserTable {
    user_id: Generated<number>
    email: string | null
    password_hash: string
    role: 'user' | 'moderator' | 'admin'
    name: string
    phone: string
    created_at: Date
    updated_at: Date
}

// Адреса пользователей
export interface UserAddressTable {
    address_id: Generated<number>
    user_id: number
    street: string
    house_number: string
    apartment_number: string 
    entrance: string | null
    floor: string | null
    is_primary: boolean
    created_at: Date
    updated_at: Date
}

// Категории товаров
export interface CategoryTable {
    category_id: Generated<number>
    name: 'flowers' | 'gifts'
    description: string | null
    image_url: string | null
    created_at: Date
    updated_at: Date
}

// Товары
export interface ProductTable {
    product_id: Generated<number>
    category_id: number
    name: string
    description: string | null
    price: number
    remains: number
    is_available: boolean
    created_at: Date
    updated_at: Date
}

// Изображения товаров
export interface ProductImageTable {
    image_id: Generated<number>
    product_id: number
    image_url: string
    is_primary: boolean
    alt_text: string | null
    created_at: Date
}

// Корзины
export interface CartTable {
    cart_id: Generated<number>
    user_id: number | null
    alt_user_id: string | null
    created_at: Date
    updated_at: Date
}

// Элементы корзины
export interface CartItemTable {
    cart_item_id: Generated<number>
    cart_id: number
    product_id: number
    quantity: number
    added_at: Date
}

// Заказы
export interface OrderTable {
    order_id: Generated<number>
    user_id: number
    shop_id: number
    order_date: Date
    status: 'processing' | 'delivered' | 'finished' | 'cancelled'
    total_amount: number
    payment_status: 'pending' | 'finished' | 'cancelled'
    street: string
    house_number: string
    apartment_number: string 
    entrance: string | null
    floor: string | null
    recipient_name: string
    recipient_phone: string
    delivery_date: Date
    delivery_time_slot: string
    delivery_instructions: string | null
    gift_message: string | null
    created_at: Date
    updated_at: Date
}

// Элементы заказа
export interface OrderItemTable {
    order_item_id: Generated<number>
    order_id: number
    product_id: number
    quantity: number
    unit_price: number
    discount_amount: number
    special_instructions: string | null
}

// Магазины
export interface ShopTable {
    shop_id: Generated<number>
    name: string
    street: string
    house_number: string
    phone: string
    is_active: boolean
    created_at: Date
    updated_at: Date
}