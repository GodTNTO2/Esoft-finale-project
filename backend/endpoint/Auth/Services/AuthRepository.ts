import { inject, injectable } from "inversify";
import { IAuthRepository } from "../interfaces/IAuthRepository";
import { TYPES } from "../../../inversify/types";
import { DataBaseUseCreate } from "../../../db/db";


interface emailOrPhone {
    email?: string
    phone?: string
}

@injectable()
export class AuthRepository implements IAuthRepository {
    constructor(
        @inject(TYPES.DataBaseUseCreate) private db: DataBaseUseCreate
    ) {}

    public async checkEmailOrPhone(criteria: emailOrPhone) {
        let query = this.db.getDb().selectFrom('users').select('user_id')
        if (criteria.email && criteria.phone) {
            query = query.where("email", "=", criteria.email).where("phone", '=', criteria.phone)
        }
    }
}