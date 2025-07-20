import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { BaseController } from "../../Base/BaseController";
import { LoggerService } from "../../services/Logger/loggerServices";
import { TYPES } from "../../inversify/types";
import { IAddressService } from "./interfaces/IAddressService";
import { IAddressController } from "./interfaces/IAddressController";
import { backendPath } from "../../../shared/path";
import { BadRequestError } from "../../Error/BadRequestError";
import { ValidateRequestMiddleware } from "../../middlewere/ValidateRequestMiddleware";
import { addressCreateSchema, addressUpdateSchema } from "../../../shared/zodSchema/address.schema";


@injectable()
export class AddressController extends BaseController implements IAddressController {
    constructor(
        @inject(TYPES.Logger) logger: LoggerService,
        @inject(TYPES.Address.IAddressService) private addressService: IAddressService
    ) {
        super(logger)
        this.bindRoutes([
        {
            path: backendPath.address.create,
            method: "post",
            func: this.createAddress,
            middlewares: [new ValidateRequestMiddleware(addressCreateSchema)]
        },
        {
            path: backendPath.address.getAll,
            method: "get",
            func: this.getUserAddresses
        },
        {
            path: backendPath.address.getById,
            method: "get",
            func: this.getAddressById
        },
        {
            path: backendPath.address.update,
            method: "patch",
            func: this.updateAddress,
            middlewares: [new ValidateRequestMiddleware(addressUpdateSchema)]
        },
        {
            path: backendPath.address.delete,
            method: "delete",
            func: this.deleteAddress
        },
        {
            path: backendPath.address.setPrimary,
            method: "post",
            func: this.setPrimaryAddress
        }
        ]);
    }

    public async createAddress(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.session.user
            if (!userId) {
                throw new BadRequestError("User not authenticated")
            }

            const{street, house_number, apartment_number, entrance, floor, is_primary} = req.body

            const address = await this.addressService.createAddress(userId, {user_id: userId, street, house_number, apartment_number, entrance, floor, is_primary})
            this.created(res, address)
        } catch (error) {
            this.logger.error(`Failed to create address: ${error}`)
            this.internalError(res, "Failed to create address")
        }
    }

    public async getUserAddresses(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.session.user
            if (!userId) {
                throw new BadRequestError("User not authenticated")
            }

            const addresses = await this.addressService.getUserAddresses(userId)
            this.ok(res, addresses)
        } catch (error) {
            this.logger.error(`Failed to get user addresses: ${error}`)
            this.internalError(res, "Failed to get user addresses")
        }
    }

    public async getAddressById(req: Request, res: Response): Promise<void> {
        try {
            const addressId = parseInt(req.params.id)
            if (!addressId) {
                throw new BadRequestError("Invalid address ID")
            }

            const address = await this.addressService.getAddressById(addressId)
            this.ok(res, address)
        } catch (error) {
            this.logger.error(`Failed to get address: ${error}`)
            this.internalError(res, "Failed to get address")
        }
    }

    public async updateAddress(req: Request, res: Response): Promise<void> {
        try {
            const addressId = parseInt(req.params.id)
            if (!addressId) {
                throw new BadRequestError("Invalid address ID")
            }

            const{street, house_number, apartment_number, entrance, floor, is_primary} = req.body

            const address = await this.addressService.updateAddress(addressId, {street, house_number, apartment_number, entrance, floor, is_primary})
            this.ok(res, address)
        } catch (error) {
            this.logger.error(`Failed to update address: ${error}`)
            this.internalError(res, "Failed to update address")
        }
    }

    public async deleteAddress(req: Request, res: Response): Promise<void> {
        try {
            const addressId = parseInt(req.params.id)
            if (!addressId) {
                throw new BadRequestError("Invalid address ID")
            }

            await this.addressService.deleteAddress(addressId)
            this.ok(res, { success: true })
        } catch (error) {
            this.logger.error(`Failed to delete address: ${error}`)
            this.internalError(res, "Failed to delete address")
        }
    }

    public async setPrimaryAddress(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.session.user
            const addressId = parseInt(req.params.id)
            
            if (!userId || !addressId) {
                throw new BadRequestError("Invalid request data")
            }

            const addresses = await this.addressService.setPrimaryAddress(userId, addressId)
            this.ok(res, addresses)
        } catch (error) {
            this.logger.error(`Failed to set primary address: ${error}`)
            this.internalError(res, "Failed to set primary address")
        }
    }
}