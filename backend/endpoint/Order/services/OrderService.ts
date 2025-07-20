import { inject, injectable } from "inversify";
import { IOrderService } from "../interfaces/IOrderService";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import { TYPES } from "../../../inversify/types";
import { BadRequestError } from "../../../Error/BadRequestError";
import { OrderCreateData, OrderStatus, OrderWithItems } from "../../../../shared/Types/Orders";

@injectable()
export class OrderService implements IOrderService {
    constructor(
        @inject(TYPES.Order.IOrderRepository) private orderRepository: IOrderRepository
    ) {}

    public async createOrder(orderData: OrderCreateData): Promise<OrderWithItems | boolean> {
        if (!orderData.items || orderData.items.length === 0) {
            throw new BadRequestError("Bolshe items");
        }

        return this.orderRepository.createOrder({
            ...orderData,
        })
    }

    public async getOrderById(orderId: number): Promise<OrderWithItems> {
        if (!orderId) {
            throw new BadRequestError("Order ID is required")
        }

        return this.orderRepository.getOrderWithItems(orderId)
    }

    public async getUserOrders(userId: number): Promise<OrderWithItems[]> {
        if (!userId) {
            throw new BadRequestError("User ID is required")
        }

        return this.orderRepository.getOrdersByUser(userId)
    }

    public async updateOrderStatus(orderId: number, status: OrderStatus): Promise<OrderWithItems> {
        if (!orderId) {
            throw new BadRequestError("Order ID is required")
        }

        await this.orderRepository.updateOrderStatus(orderId, status)
        return this.orderRepository.getOrderWithItems(orderId)
    }

    public async cancelOrder(orderId: number): Promise<OrderWithItems> {
        if (!orderId) {
            throw new BadRequestError("Order ID is required")
        }

        await this.orderRepository.updateOrderStatus(orderId, 'cancelled')
        return this.orderRepository.getOrderWithItems(orderId)
    }
}