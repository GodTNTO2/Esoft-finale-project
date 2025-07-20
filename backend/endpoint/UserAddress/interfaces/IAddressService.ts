import { Address, AddressCreateData, AddressUpdateData } from "../../../../shared/Types/Address"


export interface IAddressService {
    createAddress(userId: number, addressData: AddressCreateData): Promise<Address>
    getUserAddresses(userId: number): Promise<Address[]>
    getAddressById(addressId: number): Promise<Address>
    updateAddress(addressId: number, addressData: AddressUpdateData): Promise<Address>
    deleteAddress(addressId: number): Promise<void>
    setPrimaryAddress(userId: number, addressId: number): Promise<Address[]>
}