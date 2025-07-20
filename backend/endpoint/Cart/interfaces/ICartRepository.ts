import { CartWithItems } from "../../../../shared/Types/Cart"


export interface ICartRepository {
    getCartWithItems(userId: number | string): Promise<CartWithItems>
    createCart(userId: number | string): Promise<number>
    addItemToCart(cartId: number, productId: number, quantity: number): Promise<void>
    updateCartItem(cartId: number, productId: number, quantity: number): Promise<void>
    removeItemFromCart(cartId: number, productId: number): Promise<void>
    clearCart(cartId: number): Promise<void>
    getCartIdByUserId(userId: number | string): Promise<number>
    mergeCarts(sourceCartId: number, targetCartId: number): Promise<CartWithItems>
}