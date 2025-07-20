import { OrderCreateData, OrderStatus, OrderWithItems } from "../../../../shared/Types/Orders"

export interface IOrderService {
    createOrder(orderData: OrderCreateData): Promise<OrderWithItems | boolean>
    getOrderById(orderId: number): Promise<OrderWithItems>
    getUserOrders(userId: number): Promise<OrderWithItems[]>
    updateOrderStatus(orderId: number, status: OrderStatus): Promise<OrderWithItems>
    cancelOrder(orderId: number): Promise<OrderWithItems>
}