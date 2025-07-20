import { inject, injectable } from "inversify";
import { IAuthRepository } from "../interfaces/IAuthRepository";
import { TYPES } from "../../../inversify/types";
import { DataBaseUseCreate } from "../../../db/db";
import { UserTable } from "../../../db/Idb";




@injectable()
export class AuthRepository implements IAuthRepository {
    constructor(
        @inject(TYPES.DataBaseUseCreate) private db: DataBaseUseCreate
    ) {}

    public async checkPhone(phone: string) {
        const query = await this.db.getDb().selectFrom('users')
            .select('user_id')
            .where("phone", '=', phone)
            .executeTakeFirst()
        return query
    }

    public async createUser(data: Omit<UserTable, "user_id" | "created_at" | "updated_at">) {
        return this.db.getDb().insertInto('users')
            .values({
                ...data,
                created_at: new Date(),
                updated_at: new Date()
            })
            .returning(['user_id', 'role', 'email', 'name'])
            .executeTakeFirstOrThrow();
    }

    public async getUser(phone: string) {
        return this.db.getDb().selectFrom('users')
            .select(['user_id', 'name', 'role', 'email', 'password_hash'])
            .where("phone", "=", phone)
            .executeTakeFirst();
    }

    public async getUserById(userId: number) {
        return this.db.getDb().selectFrom('users')
            .select(['user_id', 'phone', 'name', 'role', 'email'])
            .where("user_id", "=", userId)
            .executeTakeFirst()
    }
}