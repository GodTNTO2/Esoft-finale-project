import { inject, injectable } from "inversify";
import { IProductRepository } from "../interfaces/IProductRepository";
import { TYPES } from "../../../inversify/types";
import { DataBaseUseCreate } from "../../../db/db";
import { ProductWithDetails } from "../../../../shared/Types/Products";

@injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @inject(TYPES.DataBaseUseCreate) private db: DataBaseUseCreate
  ) {}



  public async findByCategory(categoryName: string): Promise<ProductWithDetails[]> {

    const products = await this.db.getDb()
        .selectFrom('products as p')
        .innerJoin('categories as c', 'c.category_id', 'p.category_id')
        .select([
            'p.product_id',
            'p.name',
            'p.description',
            'p.price',
            'p.remains',
            'p.is_available',
            'c.name as category_name'
        ])
        .where('c.name', '=', categoryName as 'flowers' | 'gifts')
        .execute();

    const productIds = products.map(p => p.product_id);
    const images = await this.db.getDb()
        .selectFrom('product_images')
        .select(['product_images.product_id', 'product_images.image_url'])
        .where('product_images.product_id', 'in', productIds)
        .orderBy('product_images.is_primary', 'desc')
        .execute();


    const imagesMap = images.reduce((acc, img) => {
        if (!acc[img.product_id]) {
            acc[img.product_id] = [];
        }
        acc[img.product_id].push(img.image_url);
        return acc;
    }, {} as Record<number, string[]>);


    const result: ProductWithDetails[] = products.map(product => ({
        ...product,
        price: Number(product.price),
        remains: Number(product.remains),
        images: imagesMap[product.product_id] || []
    })) 

    return result
  }





  public async findWithPagination(offset: number, limit: number): Promise<{
    products: ProductWithDetails[]
    total: number 
  }> {

    const products = await this.db.getDb()
        .selectFrom('products as p')
        .innerJoin('categories as c', 'c.category_id', 'p.category_id')
        .select([
            'p.product_id',
            'p.name',
            'p.description',
            'p.price',
            'p.remains',
            'p.is_available',
            'c.name as category_name'
        ])
        .offset(offset)
        .limit(limit)
        .orderBy('p.product_id')
        .execute()


    const totalResult = await this.db.getDb()
        .selectFrom('products')
        .select(({ fn }) => [fn.count<number>('product_id').as('total')])
        .executeTakeFirstOrThrow()


    const productIds = products.map(p => p.product_id);
    const images = productIds.length > 0 ? await this.db.getDb()
        .selectFrom('product_images')
        .select(['product_images.product_id', 'product_images.image_url'])
        .where('product_images.product_id', 'in', productIds)
        .orderBy('product_images.is_primary', 'desc')
        .orderBy('product_images.image_id')
        .execute() : []


    const imagesMap = images.reduce((acc, img) => {
        if (!acc[img.product_id]) {
            acc[img.product_id] = [];
        }
        acc[img.product_id].push(img.image_url);
        return acc;
    }, {} as Record<number, string[]>)


    const productsWithImages = products.map(product => ({
        ...product,
        price: Number(product.price),
        remains: Number(product.remains),
        images: imagesMap[product.product_id] || []
    }))

    return {
        products: productsWithImages,
        total: Number(totalResult.total)
    }
  }



  public async getProductById(productId: number): Promise<ProductWithDetails> {
    const [product, category, images] = await Promise.all([
      this.db.getDb()
        .selectFrom('products')
        .select([
            'product_id',
            'name',
            'description',
            'price',
            'remains',
            'is_available',
        ])
        .where('product_id', '=', productId)
        .executeTakeFirstOrThrow(),
      
      this.db.getDb()
        .selectFrom('categories')
        .select('categories.name')
        .where('category_id', '=', (qb) => 
          qb.selectFrom('products')
            .select('category_id')
            .where('product_id', '=', productId)
        )
        .executeTakeFirstOrThrow(),
      
      this.db.getDb()
        .selectFrom('product_images')
        .select('image_url')
        .where('product_id', '=', productId)
        .orderBy('is_primary', 'desc')
        .execute()
    ])

    return {
      ...product,
      price: Number(product.price),
      remains: Number(product.remains),
      category_name: category.name,
      images: images.map(img => img.image_url) || []
    };
  }



  public async createProduct(
    productData: Omit<ProductWithDetails, 'product_id' | 'images'>,
    images: string[]
  ): Promise<ProductWithDetails> {
      const isCategory = await this.db.getDb()
        .selectFrom('categories')
        .select('category_id')
        .where('name', '=', productData.category_name)
        .executeTakeFirst();

      if(!isCategory) {
        await this.db.getDb()
          .insertInto('categories')
          .values({
            name: productData.category_name,
            created_at: new Date(),
            updated_at: new Date()
          }).executeTakeFirst();
      }
      
      const category = await this.db.getDb()
        .selectFrom('categories')
        .select('category_id')
        .where('name', '=', productData.category_name)
        .executeTakeFirstOrThrow();

      const product = await this.db.getDb()
        .insertInto('products')
        .values({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          remains: productData.remains,
          is_available: productData.is_available,
          category_id: category.category_id,
          created_at: new Date(),
          updated_at: new Date()
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      
      if (images.length > 0) {
        this.addproduct_images(product.product_id, images)
      }
      

      return this.getProductById(product.product_id)
  }



  public async updateProduct(
    productId: number,
    productData: Partial<Omit<ProductWithDetails, 'product_id' | 'images'>>
  ): Promise<ProductWithDetails | null> {
    const updateData: {
      name?: string;
      description?: string | null;
      price?: number;
      remains?: number;
      is_available?: boolean;
      category_id?: number;
      updated_at: Date;
    } = {
      updated_at: new Date()
    };

    if (productData.name) updateData.name = productData.name
    if (productData.description) updateData.description = productData.description
    if (productData.price) updateData.price = productData.price
    if (productData.remains) updateData.remains = productData.remains
    if (productData.is_available !== undefined) updateData.is_available = productData.is_available


    if (productData.category_name) {
      const category = await this.db.getDb()
        .selectFrom('categories')
        .select('category_id')
        .where('name', '=', productData.category_name)
        .executeTakeFirstOrThrow()
      
      updateData.category_id = category.category_id
    }

    const result = await this.db.getDb()
      .updateTable('products')
      .set(updateData)
      .where('product_id', '=', productId)
      .executeTakeFirst()

    if (result.numUpdatedRows === BigInt(0)) {
      return null
    }

    return this.getProductById(productId)
  }


  public async deleteProduct(productId: number): Promise<boolean> {
    return this.db.getDb().transaction().execute(async (trx) => {
      await trx
        .deleteFrom('product_images')
        .where('product_id', '=', productId)
        .execute()


      const result = await trx
        .deleteFrom('products')
        .where('product_id', '=', productId)
        .executeTakeFirst()


      return result.numDeletedRows > BigInt(0)
    })
  }


  public async toggleAvailability(productId: number): Promise<boolean> {
    const current = await this.db.getDb()
      .selectFrom('products')
      .select('is_available')
      .where('product_id', '=', productId)
      .executeTakeFirst();

    if (!current) return false;

    const result = await this.db.getDb()
      .updateTable('products')
      .set({
        is_available: !current.is_available,
        updated_at: new Date()
      })
      .where('product_id', '=', productId)
      .executeTakeFirst();

    return result.numUpdatedRows > BigInt(0);
  }



  public async deleteproduct_images(productId: number): Promise<boolean> {
    const result = await this.db.getDb()
      .deleteFrom('product_images')
      .where('product_id', '=', productId)
      .executeTakeFirst();
    return result.numDeletedRows > BigInt(0);
  }

  public async addproduct_images(productId: number, images: string[]): Promise<boolean> {
    if (images.length === 0) return false


    const data = images.map((img, index) => ({
        product_id: productId,
        image_url: img,
        is_primary: index === 0,
        created_at: new Date(),
      }))
    

    
    try {
        const result = await this.db.getDb()
            .insertInto('product_images')
            .values(data)
            .execute()

        return result.length > 0;
    } catch (error) {
        console.error('Error adding product images:', error)
        return false
    }
  }
}

