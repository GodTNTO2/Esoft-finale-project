import { Kysely, PostgresDialect, Migrator, FileMigrationProvider, MigrationResultSet } from 'kysely'
import { Pool } from "pg"
import { promises as fs } from 'fs'
import * as path from 'path'


import { inject, injectable } from 'inversify';
import { TYPES } from '../inversify/types';
import { ConfigService } from '../services/config.env';
import { CategoryTable, ProductTable, UserAddressTable, UserTable, ProductImageTable, CartTable, CartItemTable, OrderTable, OrderItemTable, ShopTable } from './Idb';
import { LoggerService } from '../services/Logger/logger.services'


interface Database {
  users: UserTable
  userAddresses: UserAddressTable
  categories: CategoryTable
  products: ProductTable
  productImages: ProductImageTable
  carts: CartTable
  cartItems: CartItemTable
  orders: OrderTable
  orderItems: OrderItemTable
  shops: ShopTable
}

@injectable()
export class DataBaseCreate{
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
        this.logger.error(`Migration failed: ${error}`);
        throw error;
      }

      results?.forEach((it) => {
        if (it.status === 'Success') {
          this.logger.log(`Migration "${it.migrationName}" was executed successfully`);
        } else if (it.status === 'Error') {
          this.logger.log(`Failed to execute migration "${it.migrationName}"`);
        }
      });

      return { error, results };
    }


    public getDb(): Kysely<Database> {
        return this.db;
    }

}
