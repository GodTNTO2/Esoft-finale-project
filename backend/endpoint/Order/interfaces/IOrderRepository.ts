import { OrderCreateData, OrderStatus, OrderWithItems } from "../../../../shared/Types/Orders"


export interface IOrderRepository {
    createOrder(orderData: OrderCreateData): Promise<OrderWithItems | boolean>
    getOrderWithItems(orderId: number): Promise<OrderWithItems>
    getOrdersByUser(userId: number): Promise<OrderWithItems[]>
    updateOrderStatus(orderId: number, status: OrderStatus): Promise<void>
}