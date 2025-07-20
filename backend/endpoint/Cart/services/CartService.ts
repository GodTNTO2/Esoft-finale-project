import { inject, injectable } from "inversify";
import { ICartService } from "../interfaces/ICartService";
import { ICartRepository } from "../interfaces/ICartRepository";
import { TYPES } from "../../../inversify/types";
import { CartWithItems } from "../../../../shared/Types/Cart";
import { BadRequestError } from "../../../Error/BadRequestError";

@injectable()
export class CartService implements ICartService {
    constructor(
        @inject(TYPES.Cart.ICartRepository) private cartRepository: ICartRepository
    ) {}

    public async getCart(userId: number | string): Promise<CartWithItems> {
        if (!userId) {
            throw new BadRequestError("Id invalid")
        }
        return this.cartRepository.getCartWithItems(userId)
    }



    public async addItemToCart(userId: number | string, productId: number, quantity: number=1): Promise<CartWithItems> {
        if (!userId || !productId) {
            throw new BadRequestError("User ID and Product ID are invalid")
        }
        console.log(userId, productId)
        const cartId = await this.cartRepository.getCartIdByUserId(userId)

        console.log(cartId)

        await this.cartRepository.addItemToCart(cartId, productId, quantity)
        return this.cartRepository.getCartWithItems(userId)
    }



    public async updateCartItem(userId: number | string, productId: number, quantity: number=1): Promise<CartWithItems> {
        if (!userId || !productId) {
            throw new BadRequestError("User ID and Product ID are required")
        }


        const cartId = await this.cartRepository.getCartIdByUserId(userId)


        await this.cartRepository.updateCartItem(cartId, productId, quantity)
        return this.cartRepository.getCartWithItems(userId)
    }



    public async removeItemFromCart(userId: number | string, productId: number): Promise<CartWithItems> {
        if (!userId || !productId) {
            throw new BadRequestError("User ID and Product ID are required")
        }

        const cartId = await this.cartRepository.getCartIdByUserId(userId)


        await this.cartRepository.removeItemFromCart(cartId, productId)
        return this.cartRepository.getCartWithItems(userId)
    }



    public async clearCart(userId: number | string): Promise<boolean> {
        if (!userId) {
            throw new BadRequestError("ID invalid")
        }

        const cartId = await this.cartRepository.getCartIdByUserId(userId);


        await this.cartRepository.clearCart(cartId)
        return true
    }


    public async mergeCarts(tempUserId: string, permanentUserId: number): Promise<CartWithItems> {
        const tempCartId = await this.cartRepository.getCartIdByUserId(tempUserId)
        const permanentCartId = await this.cartRepository.getCartIdByUserId(permanentUserId)


        if (tempCartId < 0) {
            return this.cartRepository.getCartWithItems(permanentUserId)
        }


        return await this.cartRepository.mergeCarts(tempCartId, permanentCartId)
    }
}