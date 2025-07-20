import { UserTable } from "../../../db/Idb"

export interface IAuthRepository {
    checkPhone(phone: string): Promise<{ user_id: number } | undefined>
    createUser(data: Omit<UserTable, "user_id" | "created_at" | "updated_at">): Promise<{ user_id: number; role: "user" | "moderator" | "admin"; email?: string | null; name: string }>
    getUser(phone: string): Promise<{ user_id: number; role: "user" | "moderator" | "admin"; name: string; email: string | null;  password_hash: string} | undefined>
    getUserById(userId: number): Promise<{user_id: number, email: string | null; role: "user" | "moderator" | "admin"; name: string; phone: string } | undefined>
}