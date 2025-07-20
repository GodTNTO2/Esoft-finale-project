import { ProductWithDetails } from "../../../../shared/Types/Products";


export interface IProductRepository {
    findByCategory(categoryName: string): Promise<ProductWithDetails[]> 
    findWithPagination(offset: number, limit: number): Promise<{
      products: ProductWithDetails[]
      total: number 
    }>
    getProductById(productId: number): Promise<ProductWithDetails | null>
    createProduct(productData: Omit<ProductWithDetails, 'product_id' | 'images'>, images: string[]): Promise<ProductWithDetails>
    updateProduct(productId: number, productData: Partial<Omit<ProductWithDetails, 'product_id' | 'images'>>): Promise<ProductWithDetails | null>
    deleteProduct(productId: number): Promise<boolean>
    toggleAvailability(productId: number): Promise<boolean>
    deleteproduct_images(productId: number): Promise<boolean>
    addproduct_images(productId: number, images: string[]): Promise<boolean>
}