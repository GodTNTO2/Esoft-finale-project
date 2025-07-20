import { UserTable } from "../../../db/Idb";


export interface IAuthService {
    register(data: { phone: string; password_hash: string; name: string; role?: UserTable['role']; email?: string }): Promise<{ user_id: number; role: "user" | "moderator" | "admin"; email?: string | null; name: string }>;
    login(phone: string, password_hash: string): Promise<{ user_id: number; name: string; role: "user" | "moderator" | "admin", email: string | null }>;
    getUserById(userId: number): Promise<{user_id: number; email: string | null; role: "user" | "moderator" | "admin"; name: string; phone: string} | undefined>
}