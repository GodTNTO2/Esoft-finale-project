import { NextFunction, Request, Response } from "express";

export interface ICartController {
    getCart(req: Request, res: Response, next: NextFunction): Promise<void>
    addItemToCart(req: Request, res: Response, next: NextFunction): Promise<void>
    updateCartItem(req: Request, res: Response, next: NextFunction): Promise<void>
    removeItemFromCart(req: Request, res: Response, next: NextFunction): Promise<void>
    clearCart(req: Request, res: Response, next: NextFunction): Promise<void>
    getTempCartId(req: Request, res: Response, next: NextFunction): Promise<void>
}