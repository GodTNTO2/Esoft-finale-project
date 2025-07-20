import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { BaseController } from "../../Base/BaseController";
import { LoggerService } from "../../services/Logger/loggerServices";
import { TYPES } from "../../inversify/types";
import { ValidateRequestMiddleware } from "../../middlewere/ValidateRequestMiddleware";
import { categoriesSchema, productCreateSchema, productUpdateSchema } from "../../../shared/zodSchema/product.schema";
import { IProductService } from "./interfaces/IProductService";
import { IProductController } from "./interfaces/IProductController";
import { backendPath } from "../../../shared/path";
import { BadRequestError } from "../../Error/BadRequestError";
import { imageUploadMiddleware } from "../../middlewere/imageUploadMiddleware";




@injectable()
export class ProductController extends BaseController implements IProductController {
    constructor(
        @inject(TYPES.Logger) logger: LoggerService,
        @inject(TYPES.Product.IProductService) private productService: IProductService
    ) {
        super(logger)
        this.bindRoutes([
        {
            path: backendPath.product.productsWithCategory,
            method: "get",
            func: this.getProductsByCategory as any,
            middlewares: [
            new ValidateRequestMiddleware(categoriesSchema, 'params')
            ]
        },
        {
            path: backendPath.product.products,
            method: "get",
            func: this.getProductsWithPagination
        },
        {
            path: backendPath.product.productById,
            method: "get",
            func: this.getProductById as any
        },
        {
            path: backendPath.product.productCreate,
            method: "post",
            func: this.createProduct,
            middlewares: [
                new imageUploadMiddleware('images'),
                new ValidateRequestMiddleware(productCreateSchema)
            ]
        },
        {
            path: backendPath.product.productUpdate,
            method: "patch",
            func: this.updateProduct as any,
            middlewares: [new ValidateRequestMiddleware(productUpdateSchema)]
        },
        {
            path: backendPath.product.productDelete,
            method: "delete",
            func: this.deleteProduct as any
        },
        {
            path: backendPath.product.productToggleAvailability,
            method: "patch",
            func: this.toggleProductAvailability as any
        },
        {
            path: backendPath.product.productUpdateImages,
            method: "put",
            func: this.updateproduct_images as any,
            middlewares: [new imageUploadMiddleware('images')]
        },
        {
            path: backendPath.product.deleteproduct_images,
            method: 'delete',
            func: this.deleteproduct_images as any
        }
        ])
    }

    public async getProductsByCategory(
        req: Request<{ category: 'flowers' | 'gifts' }>, 
        res: Response
    ): Promise<void> {
        try {

            const { category } = req.params

            if(!category) {
                throw new BadRequestError("Invalid category")
            }

            const products = await this.productService.getByCategory(category)
            this.ok(res, products)

        } catch (error) {
            this.logger.error(`Failed to get products by category: ${error}`)
            res.status(500).json({ error: "Internal server error" })
        }
    }



    public async getProductsWithPagination(
        req: Request<{}, {}, {}, { page?: string; limit?: string }>,
        res: Response
    ): Promise<void> {
        try {

            const page = parseInt(req.query.page || '1')
            const limit = parseInt(req.query.limit || '10')
            
            const { products, total } = await this.productService.getWithPagination(page, limit)
            
            res.status(200).json({products, total})

        } catch (error) {
            this.logger.error(`Failed to get paginated products: ${error}`)
            res.status(500).json({ error: "Internal server error" })
        }
    }

    public async getProductById(
        req: Request<{ id: string }>,
        res: Response
    ): Promise<void> {
        try {
            const productId = parseInt(req.params.id)

            if(!productId) {
                throw new BadRequestError("Invalid productId")
            }
            const productDetails = await this.productService.getProductById(productId)
            
            if (!productDetails) {
                res.status(404).json({ error: "Product not found" })
                return
            }
        
            this.ok(res, productDetails)
        } catch (error) {
            this.logger.error(`Failed to get product details: ${error}`)
            res.status(500).json({ error: "Internal server error" })
        }
    }



    public async createProduct(req: Request, res: Response): Promise<void> {
        try {
            let images 


            console.log(req.body.images)
            images = Array.isArray(req.body.images) 
                ? req.body.images.map((f: string) => `/uploads/products/${f}`)
                : [`/uploads/products/${req.body.images}`]
            if(req.files) {
                console.log(!(req.files))
                images = Array.isArray(req.files) 
                    ? req.files.map((f: {filename: string}) => `/uploads/products/${f.filename}`)
                    : [`/uploads/products/${req.files?.filename}`]
            }

                
            console.log(images)
            

            const { name, description, price, remains, is_available, category_name } = req.body
            console.log({ name, description, price, remains, is_available, category_name,  images})
            const newProduct = await this.productService.createProduct(
                {
                    name,
                    description,
                    price: Number(price),
                    remains: Number(remains),
                    is_available: is_available || true,
                    category_name
                }, 
                images
            )
            console.log(newProduct)
            
            this.created(res, newProduct)
        } catch (error) {
            throw new BadRequestError("Failed to create product");
        }
    }


    public async updateProduct(
        req: Request<{ id: string }>,
        res: Response
    ): Promise<void> {
        try {
            const productId = parseInt(req.params.id)

            if(!productId) {
                throw new BadRequestError("Invalid productId")
            }

            const updatedProduct = await this.productService.updateProduct(productId, req.body)
            
            if (!updatedProduct) {
                throw new BadRequestError("Product not found")
            }

            this.ok(res, updatedProduct)
        } catch (error) {
            throw new BadRequestError("Failed to update product")
        }
    }


    public async deleteProduct(
        req: Request<{ id: string }>,
        res: Response
    ): Promise<void> {
        try {
            const productId = parseInt(req.params.id)
            if(!productId) {
                throw new BadRequestError("Invalid productId")
            }
            const success = await this.productService.deleteProduct(productId)
            
            if (!success) {
                throw new BadRequestError("Product not found")
            }

            this.ok(res, { success: true })
        } catch (error) {
            throw new BadRequestError("Failed to delete product")
        }
    }


    public async toggleProductAvailability(
        req: Request<{ id: string }>,
        res: Response
    ): Promise<void> {
        try {
            const productId = parseInt(req.params.id)
            if(!productId) {
                throw new BadRequestError("Invalid productId")
            }
            const success = await this.productService.toggleProductAvailability(productId)
            
            if (!success) {
                throw new BadRequestError("Product not found or update failed")
            }

            this.ok(res, { success: true })
        } catch (error) {
            throw new BadRequestError("Failed to toggle product availability")
        }
    }


    public async updateproduct_images(
        req: Request<{ id: string }>,
        res: Response
    ): Promise<void> {
        try {
            const productId = parseInt(req.params.id)
            
            if(!productId) {
                throw new BadRequestError("Invalid productId")
            }

            if (!req.files) {
                throw new BadRequestError("No images uploaded")
            }
            
            const {deleteOld} = req.body

            const images = Array.isArray(req.files) 
                ? req.files.map(f => `/uploads/products/${f.filename}`)
                : [`/uploads/products/${req.files.filename}`]
            
            const updatedProduct = await this.productService.updateproduct_images(
                productId, 
                images,
                deleteOld
            );
            
            if (!updatedProduct) {
                throw new BadRequestError("Product not found or update failed");
            }

            this.ok(res, updatedProduct);
        } catch (error) {
            throw new BadRequestError("Failed to update product images");
        }
    }

    public async deleteproduct_images(
        req: Request<{ id: string }>,
        res: Response
    ): Promise<void> {
        try {
            const productId = parseInt(req.params.id)
            if(!productId) {
                throw new BadRequestError("Invalid productId")
            }
            const success = await this.productService.deleteproduct_images(productId)
            
            if (!success) {
                throw new BadRequestError("Product not found")
            }

            this.ok(res, { success: true })
        } catch (error) {
            throw new BadRequestError("Failed to delete product")
        }
    }
}