import { NextFunction, Request, Response } from "express";

export interface IOrderController {
    createOrder(req: Request, res: Response, next: NextFunction): Promise<void>
    getOrderById(req: Request, res: Response, next: NextFunction): Promise<void>
    getUserOrders(req: Request, res: Response, next: NextFunction): Promise<void>
    updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void>
    cancelOrder(req: Request, res: Response, next: NextFunction): Promise<void>
}