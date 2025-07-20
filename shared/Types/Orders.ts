export type OrderStatus = 'processing' | 'delivered' | 'finished' | 'cancelled'
export type PaymentStatus = 'pending' | 'finished' | 'cancelled'

export interface OrderItem {
    product_id: number
    name: string
    quantity: number
    unit_price: number
    discount_amount: number
}

export interface OrderWithItems {
    order_id: number
    user_id: number
    shop_id: number
    order_date: Date
    status: OrderStatus
    total_amount: number
    payment_status: PaymentStatus
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
    items: OrderItem[]
}

export interface OrderCreateData {
    user_id: number
    shop_id: number
    street: string
    house_number: string
    apartment_number: string 
    entrance: string | null
    floor: string | null
    recipient_name: string
    recipient_phone: string
    delivery_date: Date
    delivery_time_slot: string
    delivery_instructions?: string | null
    gift_message?: string | null
    total_amount: number
    items: {
        product_id: number
        quantity: number
        special_instructions?: string | null
    }[]
}