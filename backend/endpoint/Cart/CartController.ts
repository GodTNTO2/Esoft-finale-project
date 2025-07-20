import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { BaseController } from "../../Base/BaseController";
import { LoggerService } from "../../services/Logger/loggerServices";
import { TYPES } from "../../inversify/types";
import { ICartService } from "./interfaces/ICartService";
import { ICartController } from "./interfaces/ICartController";
import { backendPath } from "../../../shared/path";
import { ValidateRequestMiddleware } from "../../middlewere/ValidateRequestMiddleware";
import { cartItemSchema } from "../../../shared/zodSchema/cart.schema";
import { BadRequestError } from "../../Error/BadRequestError";

@injectable()
export class CartController extends BaseController implements ICartController {
    constructor(
        @inject(TYPES.Logger) logger: LoggerService,
        @inject(TYPES.Cart.ICartService) private cartService: ICartService
    ) {
        super(logger)
        this.bindRoutes([
            {
                path: backendPath.cart.getCart,
                method: "get",
                func: this.getCart,
            },
            {
                path: backendPath.cart.addItem,
                method: "post",
                func: this.addItemToCart,
                middlewares: [new ValidateRequestMiddleware(cartItemSchema)]
            },
            {
                path: backendPath.cart.updateItem,
                method: "patch",
                func: this.updateCartItem,
                middlewares: [new ValidateRequestMiddleware(cartItemSchema)]
            },
            {
                path: backendPath.cart.removeItem,
                method: "delete",
                func: this.removeItemFromCart,
            },
            {
                path: backendPath.cart.clearCart,
                method: "delete",
                func: this.clearCart,
            },
            {
                path: backendPath.cart.getTempCartId,
                method: "get",
                func: this.getTempCartId,
            }
            // {
            //     path: backendPath.cart.mergeCarts,
            //     method: "post",
            //     func: this.mergeCarts,
            // }
        ])
    }



    
    private getUserId(req: Request): string | number {
        return req.session.user ? req.session.user : `temp_${req.sessionID}`
    }



    public async getCart(req: Request, res: Response): Promise<void> {
        try {
            const userId = this.getUserId(req);
            const cart = await this.cartService.getCart(userId)
            
            this.ok(res, cart)
        } catch (error) {
            this.logger.error(`Failed to get cart: ${error}`)
            this.internalError(res, "Failed to get cart")
        }
    }




    public async addItemToCart(req: Request, res: Response): Promise<void> {
        try {
            const userId = this.getUserId(req)
            console.log(req.session.user)
            const { productId, quantity } = req.body
            
            if (!productId || quantity <= 0) {
                throw new BadRequestError("Invalid product data")
            }

            const cart = await this.cartService.addItemToCart(userId, productId, quantity)
            this.ok(res, cart);
        } catch (error) {
            if (error instanceof BadRequestError) {
                this.clientError(res, error.message)
            } else {
                this.logger.error(`Failed to add item to cart: ${error}`)
                this.internalError(res, "Failed to add item to cart")
            }
        }
    }




    public async updateCartItem(req: Request, res: Response): Promise<void> {
        try {
            const userId = this.getUserId(req)
            const { productId, quantity } = req.body
            
            if (!productId || quantity <= 0) {
                throw new BadRequestError("Invalid product data")
            }

            const cart = await this.cartService.updateCartItem(userId, productId, quantity)
            this.ok(res, cart);
        } catch (error) {
            if (error instanceof BadRequestError) {
                this.clientError(res, error.message)
            } else {
                this.logger.error(`Failed to update cart item: ${error}`)
                this.internalError(res, "Failed to update cart item")
            }
        }
    }




    public async removeItemFromCart(req: Request, res: Response): Promise<void> {
        try {
            const userId = this.getUserId(req)
            const { productId } = req.params
            
            if (!productId) {
                throw new BadRequestError("Product ID is required")
            }

            const cart = await this.cartService.removeItemFromCart(
                userId, 
                parseInt(productId)
            )
            this.ok(res, cart)
        } catch (error) {
            if (error instanceof BadRequestError) {
                this.clientError(res, error.message)
            } else {
                this.logger.error(`Failed to remove item from cart: ${error}`)
                this.internalError(res, "Failed to remove item from cart")
            }
        }
    }



    public async clearCart(req: Request, res: Response): Promise<void> {
        try {
            const userId = this.getUserId(req)
            const success = await this.cartService.clearCart(userId)
            
            this.ok(res, { success })
        } catch (error) {
            this.logger.error(`Failed to clear cart: ${error}`)
            this.internalError(res, "Failed to clear cart")
        }
    }

    public async getTempCartId(req: Request, res: Response): Promise<void> {
        try {
            const userId = this.getUserId(req)
            
            this.ok(res, { userId })
        } catch (error) {
            this.logger.error(`Failed to clear cart: ${error}`)
            this.internalError(res, "Failed to clear cart")
        }
    }

    // public async mergeCarts(req: Request, res: Response): Promise<void> {
    //     try {
    //         if (!req.session.user) {
    //             throw new BadRequestError("User not authenticated")
    //         }

    //         const tempUserId = `temp_${req.sessionID}`
    //         await this.cartService.mergeCarts(tempUserId, req.session.user)
            
    //         this.ok(res, { success: true })
    //     } catch (error) {
    //         if (error instanceof BadRequestError) {
    //             this.clientError(res, error.message)
    //         } else {
    //             this.logger.error(`Failed to merge carts: ${error}`)
    //             this.internalError(res, "Failed to merge carts")
    //         }
    //     }
    // }
}