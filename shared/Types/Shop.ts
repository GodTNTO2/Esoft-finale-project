export interface Shop {
    shop_id: number
    name: string
    street: string
    house_number: string
    phone: string
    is_active: boolean
    created_at: Date
    updated_at: Date
}

export interface ShopCreateData {
    name: string
    street: string
    house_number: string
    phone: string
    is_active?: boolean
}