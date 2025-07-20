import { CartWithItems } from "../../../../shared/Types/Cart";

export interface ICartService {
    getCart(userId: number | string): Promise<CartWithItems>
    addItemToCart(userId: number | string, productId: number, quantity: number): Promise<CartWithItems>
    updateCartItem(userId: number | string, productId: number, quantity: number): Promise<CartWithItems>
    removeItemFromCart(userId: number | string, productId: number): Promise<CartWithItems>
    clearCart(userId: number | string): Promise<boolean>
    mergeCarts(tempUserId: string, permanentUserId: number): Promise<CartWithItems>
}