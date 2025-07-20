import { inject, injectable } from "inversify";
import { IAddressRepository } from "../interfaces/IAddressRepository";
import { TYPES } from "../../../inversify/types";
import { DataBaseUseCreate } from "../../../db/db";
import { Address, AddressCreateData, AddressUpdateData } from "../../../../shared/Types/Address";


@injectable()
export class AddressRepository implements IAddressRepository {
    constructor(
        @inject(TYPES.DataBaseUseCreate) private db: DataBaseUseCreate
    ) {}

    public async create(addressData: AddressCreateData): Promise<Address> {
        const address = await this.db.getDb()
        .insertInto('user_addresses')
        .values({
            user_id: addressData.user_id,
            street: addressData.street,
            house_number: addressData.house_number,
            apartment_number: addressData.apartment_number,
            entrance: addressData.entrance || null,
            floor: addressData.floor || null,
            is_primary: addressData.is_primary || false,
            created_at: new Date(),
            updated_at: new Date()
        })
        .returningAll()
        .executeTakeFirstOrThrow()

        return address
    }

    public async findByUserId(userId: number): Promise<Address[]> {
        const addresses = await this.db.getDb()
        .selectFrom('user_addresses')
        .selectAll()
        .where('user_id', '=', userId)
        .orderBy('is_primary', 'desc')
        .orderBy('created_at', 'desc')
        .execute()

        return addresses
    }

    public async findById(addressId: number): Promise<Address | null> {
        const address = await this.db.getDb()
        .selectFrom('user_addresses')
        .selectAll()
        .where('address_id', '=', addressId)
        .executeTakeFirst()

        return address || null
    }

    public async update(addressId: number, addressData: AddressUpdateData): Promise<Address> {
        const updateData: Record<string, any> = {
            updated_at: new Date()
        }

        if (addressData.street) updateData.street = addressData.street
        if (addressData.house_number) updateData.house_number = addressData.house_number
        if (addressData.apartment_number) updateData.apartment_number = addressData.apartment_number
        if ('entrance' in addressData) updateData.entrance = addressData.entrance
        if ('floor' in addressData) updateData.floor = addressData.floor
        if ('is_primary' in addressData) updateData.is_primary = addressData.is_primary

        const address = await this.db.getDb()
        .updateTable('user_addresses')
        .set(updateData)
        .where('address_id', '=', addressId)
        .returningAll()
        .executeTakeFirstOrThrow()

        return address
    }

    public async delete(addressId: number): Promise<void> {
        await this.db.getDb()
        .deleteFrom('user_addresses')
        .where('address_id', '=', addressId)
        .execute()
    }

    public async setAsPrimary(userId: number, addressId: number): Promise<void> {
        await this.db.getDb().transaction().execute(async (trx) => {
        await trx
            .updateTable('user_addresses')
            .set({ is_primary: false })
            .where('user_id', '=', userId)
            .execute();

        
        await trx
            .updateTable('user_addresses')
            .set({ is_primary: true })
            .where('address_id', '=', addressId)
            .where('user_id', '=', userId)
            .execute()
        })
    }

    public async clearPrimaryStatus(userId: number): Promise<void> {
        await this.db.getDb()
        .updateTable('user_addresses')
        .set({ is_primary: false })
        .where('user_id', '=', userId)
        .execute()
    }
}