import { inject, injectable } from "inversify";
import { ICartRepository } from "../interfaces/ICartRepository";
import { TYPES } from "../../../inversify/types";
import { DataBaseUseCreate } from "../../../db/db";
import { CartWithItems } from "../../../../shared/Types/Cart";


@injectable()
export class CartRepository implements ICartRepository {
  constructor(
    @inject(TYPES.DataBaseUseCreate) private db: DataBaseUseCreate
  ) {}

  public async getCartWithItems(userId: number | string): Promise<CartWithItems> {
    if(typeof userId === "string") {
        const cart = await this.db.getDb()
        .selectFrom('carts')
        .selectAll()
        .where('alt_user_id', '=', userId)
        .executeTakeFirst();

        if (!cart) {
            const cartId = await this.createCart(userId)
            return {
                cart_id: cartId,
                user_id: null,
                alt_user_id: userId,
                items: []
            }
        }

        const items = await this.db.getDb()
        .selectFrom('cart_items as ci')
        .innerJoin('products as p', 'p.product_id', 'ci.product_id')
        .select([
            'ci.cart_item_id',
            'ci.product_id',
            'p.name',
            'p.price',
            'ci.quantity',
        ])
        .where('ci.cart_id', '=', cart.cart_id)
        .execute()

        return {
            cart_id: cart.cart_id,
            user_id: cart.user_id,
            items: items.map(item => ({
                cart_item_id: item.cart_item_id,
                product_id: item.product_id,
                name: item.name,
                price: Number(item.price),
                quantity: item.quantity,
            }))
        }
    } else {
        const cart = await this.db.getDb()
        .selectFrom('carts')
        .selectAll()
        .where('user_id', '=', userId)
        .executeTakeFirst();
        
        if (!cart) {
            
            const cartId = await this.createCart(userId)
            return {
                cart_id: cartId,
                user_id: userId,
                items: []
            }
        }

        const items = await this.db.getDb()
        .selectFrom('cart_items as ci')
        .innerJoin('products as p', 'p.product_id', 'ci.product_id')
        .select([
            'ci.cart_item_id',
            'ci.product_id',
            'p.name',
            'p.price',
            'ci.quantity',
        ])
        .where('ci.cart_id', '=', cart.cart_id)
        .execute()

        return {
            cart_id: cart.cart_id,
            user_id: cart.user_id,
            items: items.map(item => ({
                cart_item_id: item.cart_item_id,
                product_id: item.product_id,
                name: item.name,
                price: Number(item.price),
                quantity: item.quantity,
            }))
        }
    }
  }

  public async createCart(userId: number | string): Promise<number> {
    if(typeof userId === 'string') {
        const cart = await this.db.getDb()
        .insertInto('carts')
        .values({
            alt_user_id: userId,
            created_at: new Date(),
            updated_at: new Date()
        })
        .returning('cart_id')
        .executeTakeFirstOrThrow()

        return cart.cart_id
    } else {

        const cart = await this.db.getDb()
        .insertInto('carts')
        .values({
            user_id: userId,
            created_at: new Date(),
            updated_at: new Date()
        })
        .returning('cart_id')
        .executeTakeFirstOrThrow()

        return cart.cart_id

    }
    
    
  }

  public async addItemToCart(cartId: number, productId: number, quantity: number): Promise<void> {

    const getCartItem = await this.db.getDb()
        .selectFrom('cart_items')
        .selectAll()
        .where('cart_items.product_id', "=", productId)
        .executeTakeFirst()

    if(!getCartItem) {
        await this.db.getDb()
        .insertInto('cart_items')
        .values({
            cart_id: cartId,
            product_id: productId,
            quantity: quantity,
            added_at: new Date()
        })
        .execute()
    } else{
        const newQuantity = quantity===1 ?  quantity : getCartItem?.quantity + quantity
        await this.db.getDb()
        .updateTable('cart_items')
            .set({quantity: newQuantity})
            .execute()
    }

    
  }

  public async updateCartItem(cartId: number, productId: number, quantity: number): Promise<void> {
    await this.db.getDb()
      .updateTable('cart_items')
      .set({ quantity })
      .where('cart_id', '=', cartId)
      .where('product_id', '=', productId)
      .execute()
  }

  public async removeItemFromCart(cartId: number, productId: number): Promise<void> {
    await this.db.getDb()
      .deleteFrom('cart_items')
      .where('cart_id', '=', cartId)
      .where('product_id', '=', productId)
      .execute()
  }

  public async clearCart(cartId: number): Promise<void> {
    await this.db.getDb()
      .deleteFrom('cart_items')
      .where('cart_id', '=', cartId)
      .execute()
  }

  public async getCartIdByUserId(userId: number | string): Promise<number> {
    if(typeof userId === "string") {
        const cart = await this.db.getDb()
        .selectFrom('carts')
        .select('cart_id')
        .where('alt_user_id', '=', userId)
        .executeTakeFirst()

        if (!cart) {
            return -1
        }

        return cart.cart_id
    } else {
        const cart = await this.db.getDb()
        .selectFrom('carts')
        .select('cart_id')
        .where('user_id', '=', userId)
        .executeTakeFirst()

        if (!cart) {
            const cartId = await this.createCart(userId)
            return cartId
        }

        return cart.cart_id
    }
  }



  public async mergeCarts(sourceCartId: number, targetCartId: number): Promise<CartWithItems> {
    try{

    console.log(targetCartId)
    await this.db.getDb().transaction().execute(async (trx) => {
        
      const sourceItems = await trx
        .selectFrom('cart_items')
        .selectAll()
        .where('cart_id', '=', sourceCartId)
        .execute()

    

      for (const item of sourceItems) {
        await trx
          .insertInto('cart_items')
          .values({
            cart_id: targetCartId,
            product_id: item.product_id,
            quantity: item.quantity,
            added_at: new Date()
          })
          .onConflict(oc => oc
            .columns(['cart_id', 'product_id'])
            .doUpdateSet({ 
              quantity: (eb) => eb('cart_items.quantity', '+', eb.val(item.quantity)) 
            })
          )
          .execute()
      }


      await trx
        .deleteFrom('carts')
        .where('cart_id', '=', sourceCartId)
        .execute()
    })
    
    return this.getCartWithItems(targetCartId)
    } catch(error) {
        console.error('Error adding product images:', error)
        return this.getCartWithItems(targetCartId)
    }
  }
}