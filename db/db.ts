import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from "pg"
import dotenv from 'dotenv'

import { inject, injectable } from 'inversify';
import { TYPES } from '../inversify/types';
import { ConfigService } from '../services/config.env';


interface Database {
  categories: CategoryTable
  products: ProductTable
//   product_attributes: ProductAttributeTable
//   customers: CustomerTable
//   orders: OrderTable
//   order_items: OrderItemTable
//   deliveries: DeliveryTable
//   payments: PaymentTable
//   reviews: ReviewTable
}


interface CategoryTable {
  category_id: number
  name: string
  description: string | null
  parent_category_id: number | null
  created_at: Date   
  updated_at: Date
}

interface ProductTable {
  product_id: number
  category_id: number
  name: string
  description: string | null
  price: number
  stock_quantity: number
  is_active: boolean
  is_gift: boolean
  is_flower: boolean
  image_url: string | null
  created_at: Date
  updated_at: Date
}

@injectable()
export class DataBaseCreate{
    private db: Kysely<Database>;

    constructor(@inject(TYPES.ConfigService) private configService: ConfigService,) {
        const dialect = new PostgresDialect({
            pool: new Pool({
                database: this.configService.get('DB_NAME'),
                host: this.configService.get('DB_HOST'),
                user: this.configService.get('DB_USER'),
                password: this.configService.get('DB_PASSWORD'),
                port: Number(this.configService.get('DB_PORT'))
            }),
        })

        this.db = new Kysely<Database>({
            dialect,
        })
    } 

    public getDb(): Kysely<Database> {
        return this.db;
    }

}

