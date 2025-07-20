import { NextFunction, Request, Response } from "express";

export interface IAddressController {
    createAddress(req: Request, res: Response, next: NextFunction): Promise<void>
    getUserAddresses(req: Request, res: Response, next: NextFunction): Promise<void>
    getAddressById(req: Request, res: Response, next: NextFunction): Promise<void>
    updateAddress(req: Request, res: Response, next: NextFunction): Promise<void>
    deleteAddress(req: Request, res: Response, next: NextFunction): Promise<void>
    setPrimaryAddress(req: Request, res: Response, next: NextFunction): Promise<void>
}