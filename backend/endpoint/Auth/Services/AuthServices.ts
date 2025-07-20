import { inject, injectable } from "inversify";
import { IAuthService } from "../interfaces/IAuthServices";
import { IAuthRepository } from "../interfaces/IAuthRepository"
import { TYPES } from "../../../inversify/types";
import { UserTable } from "../../../db/Idb";
import { comparePasswords } from "../utils/authUtils";
import { BadRequestError } from "../../../Error/BadRequestError";


@injectable()
export class AuthService implements IAuthService {
    constructor(
        @inject(TYPES.Auth.IAuthRepository) private authRepository: IAuthRepository
    ) {}

    public async register(data: { 
            phone: string
            password_hash: string
            name: string
            role?: UserTable['role']
            email?: string
        }) {
        const existingUser = await this.authRepository.checkPhone(data.phone);
        
        if (existingUser) {
            throw new BadRequestError("Phone alredy exist");
        }

        return this.authRepository.createUser({
            phone: data.phone,
            password_hash: data.password_hash, 
            name: data.name,
            role: data.role || "user",
            email: data.email || null
        })
    }

    public async login(phone: string, password: string) {
        const user = await this.authRepository.getUser(phone)

        
        if (!user) {
            throw new BadRequestError("Phone not found")
        }

        const isPasswordValid = await comparePasswords(password, user.password_hash)

        if (!isPasswordValid) {
            throw new BadRequestError("Password incorect")
        }

 
        return {
            user_id: user.user_id,
            name: user.name,
            role: user.role,
            email: user.email
        }
    }

    public async getUserById(userId: number) {
        if (!userId) {
            throw new BadRequestError("ID invalid")
        }

        return this.authRepository.getUserById(userId)

    }
}