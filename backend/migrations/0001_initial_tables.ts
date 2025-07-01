import { Kysely, sql } from 'kysely'


export async function up(db: Kysely<any>): Promise<void> {
  // Создаем таблицу пользователей
  await db.schema
    .createTable('users')
    .addColumn('user_id', 'serial', (col) => col.primaryKey())
    .addColumn('email', 'varchar(255)', (col) => col.unique())
    .addColumn('password_hash', 'varchar(255)', (col) => col.notNull())
    .addColumn('role', 'varchar(20)')
    .addColumn('name', 'varchar(100)', (col) => col.notNull())
    .addColumn('phone', 'varchar(20)', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo('now()').notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo('now()').notNull()
    )
    .execute()

  // Создаем таблицу адресов пользователей
  await db.schema
    .createTable('user_addresses')
    .addColumn('address_id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) =>
      col.references('users.user_id').onDelete('cascade').notNull()
    )
    .addColumn('city', 'varchar(100)', (col) => col.notNull())
    .addColumn('street', 'varchar(255)', (col) => col.notNull())
    .addColumn('house_number', 'varchar(20)', (col) => col.notNull())
    .addColumn('apartment_number', 'varchar(20)', (col) => col.notNull())
    .addColumn('entrance', 'varchar(20)')
    .addColumn('floor', 'varchar(20)')
    .addColumn('is_primary', 'boolean', (col) => col.defaultTo(false))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo('now()').notNull()
    )
    .execute()

  // Создаем таблицу категорий
  await db.schema
    .createTable('categories')
    .addColumn('category_id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(100)', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('is_active', 'boolean', (col) => col.defaultTo(true))
    .addColumn('image_url', 'varchar(255)')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo('now()').notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo('now()').notNull()
    )
    .execute()

  // Создаем таблицу товаров
  await db.schema
    .createTable('products')
    .addColumn('product_id', 'serial', (col) => col.primaryKey())
    .addColumn('category_id', 'integer', (col) =>
      col.references('categories.category_id').onDelete('set null').notNull()
    )
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('price', sql`numeric(10,2)`, (col) => col.notNull())
    .addColumn('discount_price', sql`numeric(10,2)`)
    .addColumn('is_available', 'boolean', (col) => col.defaultTo(true))
    .addColumn('remains', 'integer', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo('now()').notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo('now()').notNull()
    )
    .execute()

  // Создаем таблицу изображений товаров
  await db.schema
    .createTable('product_images')
    .addColumn('image_id', 'serial', (col) => col.primaryKey())
    .addColumn('product_id', 'integer', (col) =>
      col.references('products.product_id').onDelete('cascade').notNull()
    )
    .addColumn('image_url', 'varchar(255)', (col) => col.notNull())
    .addColumn('is_primary', 'boolean', (col) => col.defaultTo(false))
    .addColumn('alt_text', 'varchar(255)')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo('now()').notNull()
    )
    .execute()

  // Создаем таблицу корзин
  await db.schema
    .createTable('carts')
    .addColumn('cart_id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) =>
      col.references('users.user_id').onDelete('cascade').notNull()
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo('now()').notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo('now()').notNull()
    )
    .execute()

  // Создаем таблицу элементов корзины
  await db.schema
    .createTable('cart_items')
    .addColumn('cart_item_id', 'serial', (col) => col.primaryKey())
    .addColumn('cart_id', 'integer', (col) =>
      col.references('carts.cart_id').onDelete('cascade').notNull()
    )
    .addColumn('product_id', 'integer', (col) =>
      col.references('products.product_id').onDelete('cascade').notNull()
    )
    .addColumn('quantity', 'integer', (col) => col.notNull().defaultTo(1))
    .addColumn('added_at', 'timestamptz', (col) =>
      col.defaultTo('now()').notNull()
    )
    .execute()

  // Создаем таблицу магазинов
  await db.schema
    .createTable('shops')
    .addColumn('shop_id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('city', 'varchar(100)', (col) => col.notNull())
    .addColumn('street', 'varchar(255)', (col) => col.notNull())
    .addColumn('house_number', 'varchar(20)', (col) => col.notNull())
    .addColumn('phone', 'varchar(20)', (col) => col.notNull())
    .addColumn('is_active', 'boolean', (col) => col.defaultTo(true))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo('now()').notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo('now()').notNull()
    )
    .execute()

  // Создаем таблицу заказов
  await db.schema
    .createTable('orders')
    .addColumn('order_id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) =>
      col.references('users.user_id').onDelete('restrict').notNull()
    )
    .addColumn('shop_id', 'integer', (col) =>
      col.references('shops.shop_id').onDelete('restrict').notNull()
    )
    .addColumn('order_date', 'timestamptz', (col) =>
      col.defaultTo('now()').notNull()
    )
    .addColumn('status', 'varchar(50)', (col) =>
      col.notNull().defaultTo('pending')
    )
    .addColumn('total_amount', sql`numeric(10,2)`, (col) => col.notNull())
    .addColumn('payment_method', 'varchar(50)', (col) => col.notNull())
    .addColumn('payment_status', 'varchar(50)', (col) =>
      col.notNull().defaultTo('pending')
    )
    .addColumn('address_id', 'integer', (col) =>
      col.references('user_addresses.address_id').notNull()
    )
    .addColumn('recipient_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('recipient_phone', 'varchar(20)', (col) => col.notNull())
    .addColumn('delivery_date', 'date', (col) => col.notNull())
    .addColumn('delivery_time_slot', 'varchar(100)', (col) => col.notNull())
    .addColumn('delivery_instructions', 'text')
    .addColumn('gift_message', 'text')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo('now()').notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo('now()').notNull()
    )
    .execute()

  // Создаем таблицу элементов заказа
  await db.schema
    .createTable('order_items')
    .addColumn('order_item_id', 'serial', (col) => col.primaryKey())
    .addColumn('order_id', 'integer', (col) =>
      col.references('orders.order_id').onDelete('restrict').notNull()
    )
    .addColumn('product_id', 'integer', (col) =>
      col.references('products.product_id').onDelete('restrict').notNull()
    )
    .addColumn('quantity', 'integer', (col) => col.notNull())
    .addColumn('unit_price', sql`numeric(10,2)`, (col) => col.notNull())
    .addColumn('discount_amount', sql`numeric(10,2)`, (col) =>
      col.defaultTo(0).notNull()
    )
    .addColumn('special_instructions', 'text')
    .execute()

  // Создаем индексы
  await db.schema
    .createIndex('idx_users_email')
    .on('users')
    .column('email')
    .execute()

  await db.schema
    .createIndex('idx_users_phone')
    .on('users')
    .column('phone')
    .execute()

  await db.schema
    .createIndex('idx_products_category')
    .on('products')
    .column('category_id')
    .execute()

  await db.schema
    .createIndex('idx_orders_user')
    .on('orders')
    .column('user_id')
    .execute()

}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('order_items').execute()
  await db.schema.dropTable('orders').execute()
  await db.schema.dropTable('cart_items').execute()
  await db.schema.dropTable('carts').execute()
  await db.schema.dropTable('product_images').execute()
  await db.schema.dropTable('products').execute()
  await db.schema.dropTable('categories').execute()
  await db.schema.dropTable('user_addresses').execute()
  await db.schema.dropTable('shops').execute()
  await db.schema.dropTable('users').execute()
}