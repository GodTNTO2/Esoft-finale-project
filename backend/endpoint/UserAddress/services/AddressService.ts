import { inject, injectable } from "inversify";
import { IAddressService } from "../interfaces/IAddressService";
import { IAddressRepository } from "../interfaces/IAddressRepository";
import { TYPES } from "../../../inversify/types";
import { Address, AddressCreateData, AddressUpdateData } from "../../../../shared/Types/Address";
import { BadRequestError } from "../../../Error/BadRequestError";

@injectable()
export class AddressService implements IAddressService {
    constructor(
        @inject(TYPES.Address.IAddressRepository) private repository: IAddressRepository
    ) {}



    public async createAddress(userId: number, addressData: AddressCreateData): Promise<Address> {
        if (!userId) {
            throw new BadRequestError("Invalid Id")
        }

        if (addressData.is_primary) {
            await this.repository.clearPrimaryStatus(userId)
        }

        return this.repository.create({
            ...addressData,
            user_id: userId
        })
    }



    public async getUserAddresses(userId: number): Promise<Address[]> {
        if (!userId) {
            throw new BadRequestError("Invalid Id")
        }

        return this.repository.findByUserId(userId)
    }



    public async getAddressById(addressId: number): Promise<Address> {
        if (!addressId) {
            throw new BadRequestError("Invalid aId")
        }

        const address = await this.repository.findById(addressId)
        if (!address) {
            throw new BadRequestError("Address not found")
        }

        return address
    }



    public async updateAddress(addressId: number, addressData: AddressUpdateData): Promise<Address> {
        if (!addressId) {
            throw new BadRequestError("Invalid aId")
        }

        const address = await this.repository.findById(addressId)
        if (!address) {
            throw new BadRequestError("Address not found")
        }

        if (addressData.is_primary) {
            await this.repository.setAsPrimary(address.user_id, addressId)
            return this.repository.findById(addressId) as Promise<Address>
        }

        return this.repository.update(addressId, addressData)
    }



    public async deleteAddress(addressId: number): Promise<void> {
        if (!addressId) {
            throw new BadRequestError("Invalid aId")
        }

        const address = await this.repository.findById(addressId)
        if (!address) {
            throw new BadRequestError("Address not found")
        }

        await this.repository.delete(addressId)

        
        if (address.is_primary) {
            const addresses = await this.repository.findByUserId(address.user_id)
            if (addresses.length > 0) {
                await this.repository.setAsPrimary(address.user_id, addresses[0].address_id)
            }
        }
    }



    public async setPrimaryAddress(userId: number, addressId: number): Promise<Address[]> {
        if (!userId || !addressId) {
            throw new BadRequestError("Invalidsss Idss")
        }

        await this.repository.setAsPrimary(userId, addressId)
        return this.repository.findByUserId(userId)
    }
}