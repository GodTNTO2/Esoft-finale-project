import { NextFunction, Request, Response } from "express";

export interface IProductController {
    getProductsByCategory(req: Request, res: Response, next: NextFunction): Promise<void>
    getProductsWithPagination(req: Request, res: Response): Promise<void>
    getProductById(req: Request, res: Response, next: NextFunction): Promise<void>
    createProduct(req: Request, res: Response, next: NextFunction): Promise<void>
    updateProduct(req: Request, res: Response, next: NextFunction): Promise<void>
    deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void>
    toggleProductAvailability(req: Request, res: Response, next: NextFunction): Promise<void>
    updateproduct_images(req: Request, res: Response, next: NextFunction): Promise<void>
    deleteproduct_images(req: Request, res: Response, next: NextFunction): Promise<void>
}