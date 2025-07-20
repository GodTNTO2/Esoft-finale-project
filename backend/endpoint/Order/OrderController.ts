import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { BaseController } from "../../Base/BaseController";
import { IOrderController } from "./interfaces/IOrderController";
import { LoggerService } from "../../services/Logger/loggerServices";
import { TYPES } from "../../inversify/types";
import { IOrderService } from "./interfaces/IOrderService";
import { backendPath } from "../../../shared/path";
import { ValidateRequestMiddleware } from "../../middlewere/ValidateRequestMiddleware";
import { BadRequestError } from "../../Error/BadRequestError";
import { OrderCreateData } from "../../../shared/Types/Orders";
import { ICartService } from "../Cart/interfaces/ICartService";
import { orderCreateSchema, orderStatusSchema } from "../../../shared/zodSchema/order.schema";
import { IShopService } from "../Shop/interfaces/IShopService";
import { YandexDistanceService } from "../../services/yandexDistanceService";
import { Shop } from "../../../shared/Types/Shop";


@injectable()
export class OrderController extends BaseController implements IOrderController {
    constructor(
        @inject(TYPES.Logger) logger: LoggerService,
        @inject(TYPES.Order.IOrderService) private orderService: IOrderService,
        @inject(TYPES.Cart.ICartService) private cartService: ICartService,
        @inject(TYPES.Shop.IShopService) private shopService: IShopService,
        @inject(TYPES.yandexDistanceService) private yandexService: YandexDistanceService
    ) {
        super(logger)
        this.bindRoutes([
        {
            path: backendPath.order.create,
            method: "post",
            func: this.createOrder,
            middlewares: [new ValidateRequestMiddleware(orderCreateSchema)]
        },
        {
            path: backendPath.order.getById,
            method: "get",
            func: this.getOrderById,
        },
        {
            path: backendPath.order.getUserOrders,
            method: "get",
            func: this.getUserOrders,
        },
        {
            path: backendPath.order.updateStatus,
            method: "patch",
            func: this.updateOrderStatus,
            middlewares: [new ValidateRequestMiddleware(orderStatusSchema)]
        },
        {
            path: backendPath.order.cancel,
            method: "delete",
            func: this.cancelOrder,
        }
        ]);
    }

    public async createOrder(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.session.user
            if (!userId) {
                throw new BadRequestError("User not authenticated")
            }

            const items = await this.cartService.getCart(userId)
            const total = items.items.reduce((sum, item) =>  sum + (Number(item.price)) * item.quantity, 0)
            
            const allShops = await this.shopService.getAllShops()

            const { 
                recipient_name,
                recipient_phone, 
                delivery_date, 
                delivery_time_slot,
                delivery_instructions,
                gift_message,
                street,
                house_number,
                apartment_number,
                entrance,
                floor,
            } = req.body

            const deliveryAddress = `Тюмень, ${street}, ${house_number}`
            let closestShop!: Shop & {distance: number}
            let minDistance = Infinity

            allShops.forEach(async shop => { 
                try {
                    const shopAddress = `Тюмень, ${shop.street}, ${shop.house_number}`;

                    const result = await this.yandexService.calculateDistance(
                        shopAddress,
                        deliveryAddress
                    );

                    if (result.distance < minDistance) {
                        minDistance = result.distance;
                        closestShop = {
                            ...shop,
                            distance: result.distance / 1000,
                        }
                    }
                } catch (error) {
                    this.logger.error(`Error shop id: ${shop.shop_id}: ${error}`)
                }
            })

            

            const data:OrderCreateData = {
                user_id: userId,
                shop_id: closestShop.shop_id,  
                recipient_name,
                recipient_phone, 
                delivery_date, 
                delivery_time_slot,
                delivery_instructions,
                gift_message,
                street,
                house_number,
                apartment_number,
                entrance,
                floor,
                total_amount: total,
                items: items.items.map(i => ({
                    product_id: i.product_id,
                    quantity: i.quantity
                }))
            }
            const order = await this.orderService.createOrder(data)
            this.created(res, order)
        } catch (error) {
            this.logger.error(`Failed to create order: ${error}`)
            this.internalError(res, "Failed to create order")
        }
    }

    public async getOrderById(req: Request, res: Response): Promise<void> {
        try {
            const orderId = parseInt(req.params.id)
            if (!orderId) {
                throw new BadRequestError("Invalid order ID")
            }

            const order = await this.orderService.getOrderById(orderId)
            this.ok(res, order)
        } catch (error) {
            this.logger.error(`Failed to get order: ${error}`)
            this.internalError(res, "Failed to get order")
        }
    }

    public async getUserOrders(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.session.user
            if (!userId) {
                throw new BadRequestError("User not authenticated")
            }

            const orders = await this.orderService.getUserOrders(userId)
            this.ok(res, orders)
        } catch (error) {
            this.logger.error(`Failed to get user orders: ${error}`)
            this.internalError(res, "Failed to get user orders")
        }
    }

    public async updateOrderStatus(req: Request, res: Response): Promise<void> {
        try {
            const orderId = parseInt(req.params.id)
            if (!orderId) {
                throw new BadRequestError("Invalid ID")
            }

            const { status } = req.body
            const order = await this.orderService.updateOrderStatus(orderId, status)
            this.ok(res, order)
        } catch (error) {
            this.logger.error(`Failed to update order status: ${error}`)
            this.internalError(res, "Failed to update order status")
        }
    }

    public async cancelOrder(req: Request, res: Response): Promise<void> {
        try {
            const orderId = parseInt(req.params.id)
            if (!orderId) {
                throw new BadRequestError("Invalid ID")
            }

        const order = await this.orderService.cancelOrder(orderId)
        this.ok(res, order)
        } catch (error) {
            this.logger.error(`Failed to cancel order: ${error}`)
            this.internalError(res, "Failed to cancel order")
        }
    }
}