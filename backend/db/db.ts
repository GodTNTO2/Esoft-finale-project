import { Kysely, PostgresDialect, Migrator, FileMigrationProvider, MigrationResultSet } from 'kysely'
import { Pool } from "pg"
import { promises as fs } from 'fs'
import * as path from 'path'


import { inject, injectable } from 'inversify';
import { TYPES } from '../inversify/types';
import { ConfigService } from '../services/ConfigService';
import { CategoryTable, ProductTable, UserAddressTable, UserTable, ProductImageTable, CartTable, CartItemTable, OrderTable, OrderItemTable, ShopTable } from './Idb';
import { LoggerService } from '../services/Logger/loggerServices'


interface Database {
  users: UserTable
  user_addresses: UserAddressTable
  categories: CategoryTable
  products: ProductTable
  product_images: ProductImageTable
  carts: CartTable
  cart_items: CartItemTable
  orders: OrderTable
  order_items: OrderItemTable
  shops: ShopTable
}

@injectable()
export class DataBaseUseCreate{
    private db: Kysely<Database>;
    private migrator: Migrator;


    constructor(
      @inject(TYPES.ConfigService) private configService: ConfigService,
      @inject(TYPES.Logger) private logger: LoggerService
    ) {
        const dialect = new PostgresDialect({
            pool: new Pool({
                database: this.configService.get('DB_NAME'),
                host: this.configService.get('DB_HOST'),
                user: this.configService.get('DB_USER'),
                password: this.configService.get('DB_PASSWORD'),
                port: Number(this.configService.get('DB_PORT'))
                // database: 'flowerShop',
                // host: 'localhost',
                // user: 'postgres',
                // password: "sudo",
                // port: 5432
            }),
        })

        this.db = new Kysely<Database>({
            dialect,
        })

        this.migrator = new Migrator({
          db: this.db,
          provider: new FileMigrationProvider({
            fs,
            path,
            migrationFolder: path.join(__dirname, '../migrations')
          })
        })
    } 

    public async migrateToLatest(): Promise<MigrationResultSet> {
      const { error, results } = await this.migrator.migrateToLatest();
      
      if (error) {
        this.logger.error(`migration fails: ${error}`);
        throw error;
      }

      results?.forEach((it) => {
        if (it.status === 'Success') {
          this.logger.log(`Migration "${it.migrationName}" Success`);
        } else if (it.status === 'Error') {
          this.logger.log(`Migration fail "${it.migrationName}"`);
        }
      });

      return { error, results };
    }


    public getDb(): Kysely<Database> {
        return this.db;
    }

}
