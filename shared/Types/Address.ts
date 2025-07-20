export interface Address {
    address_id: number
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

export interface AddressCreateData {
    user_id: number
    street: string
    house_number: string
    apartment_number: string
    entrance?: string | null
    floor?: string | null
    is_primary?: boolean
}

export interface AddressUpdateData {
    street?: string
    house_number?: string
    apartment_number?: string
    entrance?: string | null
    floor?: string | null
    is_primary?: boolean
}