import { inject, injectable } from "inversify";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import { TYPES } from "../../../inversify/types";

import { DataBaseUseCreate } from "../../../db/db";
import { OrderWithItems, OrderCreateData, OrderStatus } from "../../../../shared/Types/Orders";


@injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @inject(TYPES.DataBaseUseCreate) private db: DataBaseUseCreate
  ) {}

  public async createOrder(orderData: OrderCreateData): Promise<OrderWithItems | boolean> {
    return this.db.getDb().transaction().execute(async (trx) => {
        const order = await trx
            .insertInto('orders')
            .values({
                user_id: orderData.user_id,
                shop_id: orderData.shop_id,
                street: orderData.street,
                house_number: orderData.house_number,
                apartment_number: orderData.apartment_number,
                entrance: orderData.entrance,
                floor: orderData.floor,
                recipient_name: orderData.recipient_name,
                recipient_phone: orderData.recipient_phone,
                delivery_date: orderData.delivery_date,
                delivery_time_slot: orderData.delivery_time_slot,
                delivery_instructions: orderData.delivery_instructions || null,
                gift_message: orderData.gift_message || null,
                status: 'processing',
                payment_status: 'pending',
                total_amount: orderData.total_amount,
                order_date: new Date(),
                created_at: new Date(),
                updated_at: new Date()
            })
            .returningAll()
            .executeTakeFirstOrThrow()


        const items = await Promise.all(
            orderData.items.map(item => 
            trx
                .insertInto('order_items')
                .values({
                    order_id: order.order_id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: trx.selectFrom('products')
                        .select('price')
                        .where('product_id', '=', item.product_id),
                    discount_amount: 0,
                    special_instructions: item.special_instructions || null
                })
                .returning(['product_id', 'quantity', 'unit_price', 'discount_amount'])
                .executeTakeFirstOrThrow()
            )
        )


        const total = items.reduce((sum, item) =>  sum + (Number(item.unit_price) - Number(item.discount_amount)) * item.quantity, 0)

        if(orderData.total_amount != total) {
            return false
        }

        return this.getOrderWithItems(order.order_id)
    })
  }

    public async getOrderWithItems(orderId: number): Promise<OrderWithItems> {
        const order = await this.db.getDb()
        .selectFrom('orders')
        .selectAll()
        .where('order_id', '=', orderId)
        .executeTakeFirstOrThrow()

        const items = await this.db.getDb()
        .selectFrom('order_items as oi')
        .innerJoin('products as p', 'p.product_id', 'oi.product_id')
        .select([
            'oi.product_id',
            'p.name',
            'oi.quantity',
            'oi.unit_price',
            'oi.discount_amount',
            'oi.special_instructions'
        ])
        .where('oi.order_id', '=', orderId)
        .execute()

        return {
        ...order,
        total_amount: Number(order.total_amount),
        items: items.map(item => ({
            product_id: item.product_id,
            name: item.name,
            quantity: item.quantity,
            unit_price: Number(item.unit_price),
            discount_amount: Number(item.discount_amount)
        }))
        }
    }

    public async getOrdersByUser(userId: number): Promise<OrderWithItems[]> {
        const orders = await this.db.getDb()
        .selectFrom('orders')
        .select('order_id')
        .where('user_id', '=', userId)
        .orderBy('order_date', 'desc')
        .execute()

        return Promise.all(orders.map(order => this.getOrderWithItems(order.order_id)))
    }

    public async updateOrderStatus(orderId: number, status: OrderStatus): Promise<void> {
        await this.db.getDb()
        .updateTable('orders')
        .set({ 
            status,
            updated_at: new Date()
        })
        .where('order_id', '=', orderId)
        .execute()
    }
}