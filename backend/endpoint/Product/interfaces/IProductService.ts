import { ProductWithDetails } from "../../../../shared/Types/Products";



export interface IProductService {
    getByCategory(category: string): Promise<ProductWithDetails[]>

    getWithPagination(page: number, limit: number): Promise<{ 
      products: ProductWithDetails[]
      total: number }>

    getProductById(productId: number): Promise<ProductWithDetails | null>

    createProduct(
      productData: Omit<ProductWithDetails, 'product_id' | 'images'>,
      images: string[]
    ): Promise<ProductWithDetails>

    updateProduct(
      productId: number,
      productData: Partial<Omit<ProductWithDetails, 'product_id' | 'images'>>
    ): Promise<ProductWithDetails | null>

    deleteProduct(productId: number): Promise<boolean>

    toggleProductAvailability(productId: number): Promise<boolean>

    updateproduct_images(
      productId: number,
      images: string[],
      deleteOld: boolean
    ): Promise<ProductWithDetails | null>

    deleteproduct_images(productId: number): Promise<boolean>

}