import { Address, AddressCreateData, AddressUpdateData } from "../../../../shared/Types/Address"


export interface IAddressRepository {
    create(addressData: AddressCreateData): Promise<Address>
    findByUserId(userId: number): Promise<Address[]>
    findById(addressId: number): Promise<Address | null>
    update(addressId: number, addressData: AddressUpdateData): Promise<Address>
    delete(addressId: number): Promise<void>
    setAsPrimary(userId: number, addressId: number): Promise<void>
    clearPrimaryStatus(userId: number): Promise<void>
}