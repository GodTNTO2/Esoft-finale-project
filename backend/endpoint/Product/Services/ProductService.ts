import { inject, injectable } from "inversify";
import { IProductService } from "../interfaces/IProductService";
import { IProductRepository } from "../interfaces/IProductRepository";
import { TYPES } from "../../../inversify/types";
import { ProductWithDetails } from "../../../../shared/Types/Products";
import { BadRequestError } from "../../../Error/BadRequestError";


@injectable()
export class ProductService implements IProductService {
    constructor(
        @inject(TYPES.Product.IProductRepository) private productRepository: IProductRepository
    ) {}



    public async getByCategory(category: string): Promise<ProductWithDetails[]> {
        
        
        if (!category) {
            throw new BadRequestError("Category is required")
        }

        return this.productRepository.findByCategory(category)
    }



    public async getWithPagination(page: number, limit: number): Promise<{
            products: ProductWithDetails[]
            total: number
    }> {
            if (page < 1 || limit < 1) {
                throw new BadRequestError("Invalid pagination parameters");
            }

            const offset = (page - 1) * limit

            return this.productRepository.findWithPagination(offset, limit);
    }


    public async getProductById(productId: number): Promise<ProductWithDetails | null> {
        return this.productRepository.getProductById(productId)
    }


    public async createProduct(
        productData: Omit<ProductWithDetails, 'product_id' | 'images'>,
        images: string[]
    ): Promise<ProductWithDetails> {


        if (!productData.name || !productData.category_name) {
            throw new BadRequestError("Name and category are required")
        }
        if (!images || images.length === 0) {
            throw new BadRequestError("At least one image is required")
        }
        console.log(11)
        return this.productRepository.createProduct(productData, images)
    }



    public async updateProduct(
        productId: number,
        productData: Partial<Omit<ProductWithDetails, 'product_id' | 'images'>>
    ): Promise<ProductWithDetails | null> {
        if (!productId) {
            throw new BadRequestError("Invalid ID")
        }
        if (Object.keys(productData).length === 0) {
            throw new BadRequestError("No fields to update")
        }
        return this.productRepository.updateProduct(productId, productData)
    }


    public async deleteProduct(productId: number): Promise<boolean> {
        if (!productId) {
            throw new BadRequestError("Invalid ID")
        }
        return this.productRepository.deleteProduct(productId)
    }


    public async toggleProductAvailability(productId: number): Promise<boolean> {
        if (!productId) {
            throw new BadRequestError("Invalid ID")
        }

        return this.productRepository.toggleAvailability(productId)
    }


    public async updateproduct_images(
        productId: number,
        images: string[],
        deleteOld: boolean
    ): Promise<ProductWithDetails | null> {
        if (!productId) {
            throw new BadRequestError("Invalid ID")
        }
        if (!images || images.length === 0) {
            throw new BadRequestError("At least one image is required")
        }

        if (deleteOld) {
            await this.productRepository.deleteproduct_images(productId)
        }

        await this.productRepository.addproduct_images(productId, images)
        return this.productRepository.getProductById(productId)
    }

    public async deleteproduct_images(productId: number): Promise<boolean> {
        if (!productId) {
            throw new BadRequestError("Invalid ID")
        }
        return this.productRepository.deleteproduct_images(productId)
    }

}