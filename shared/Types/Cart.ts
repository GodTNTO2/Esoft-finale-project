

export interface CartItem {
    cart_item_id: number
    product_id: number
    name: string
    price: number
    quantity: number
}

export interface CartWithItems {
    cart_id: number
    user_id: number | null
    alt_user_id?: string | null
    items: CartItem[]
}