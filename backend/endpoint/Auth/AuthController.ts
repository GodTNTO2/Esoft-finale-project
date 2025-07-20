import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { BaseController } from "../../Base/BaseController";
import { IAuthController } from "./interfaces/IAuthController";
import { LoggerService } from "../../services/Logger/loggerServices";
import { TYPES } from "../../inversify/types";
import { IAuthService } from "./interfaces/IAuthServices";
import { BadRequestError } from "../../Error/BadRequestError";
import { ValidateRequestMiddleware } from "../../middlewere/ValidateRequestMiddleware";
import { loginSchema, registerSchema } from "../../../shared/zodSchema/auth.schema";
import { CustomSession } from "../../types/express-session";
import { hashPassword } from "./utils/authUtils";
import { backendPath } from "../../../shared/path";
import { ICartService } from "../Cart/interfaces/ICartService";



@injectable()
export class AuthController extends BaseController implements IAuthController {

    constructor(
        @inject(TYPES.Logger) logger: LoggerService,
        @inject(TYPES.Auth.IAuthService) private authService: IAuthService,
        @inject(TYPES.Cart.ICartService) private cartService: ICartService
    ) {
        super(logger)
        this.bindRoutes([
            {
                path: backendPath.auth.registration,
                method: 'post',
                func: this.register,
                middlewares: [new ValidateRequestMiddleware(registerSchema)]
            },
            {
                path: backendPath.auth.login,
                method: 'post',
                func: this.login,
                middlewares: [new ValidateRequestMiddleware(loginSchema)]
            },
            {
                path: backendPath.auth.logout,
                method: 'post',
                func: this.logout,
            },
            {
                path: backendPath.auth.check,
                method: 'get',
                func: this.getCurrentUser,
            }
        ]);
    }

    public async register(req: Request, res: Response): Promise<void> {
        const { phone, password, name, role, email } = req.body;

        if (!phone || !password || !name) {
            throw new BadRequestError("Invalid data")
        }

        const password_hash = await hashPassword(password)

        const { user_id, role: userRole, name: userName, email: userEmail } = await this.authService.register({
            phone,
            password_hash,
            name,
            role,
            email
        });

        (req.session as CustomSession).user = user_id



        const tempUserId = `temp_${req.sessionID}`
        await this.cartService.mergeCarts(tempUserId, user_id)
        
        res.status(201).json({ id: user_id, role: userRole, phone: phone, name: userName, email: userEmail});
    }

    public async login(req: Request, res: Response): Promise<void> {
        const { phone, password } = req.body


        const user = await this.authService.login(phone, password);
        
        
        (req.session as CustomSession).user = user.user_id
        console.log(req.session.user)
        const tempUserId = `temp_${req.sessionID}`
        await this.cartService.mergeCarts(tempUserId, user.user_id)


        res.status(200).json({ id: user.user_id, name: user.name, role: user.role, phone: phone, email: user.email })
    }

    public async logout(req: Request, res: Response): Promise<void> {

        req.session.destroy((err) => {
            if (err) throw err; 
            res.clearCookie("sessionUser")
            return res.sendStatus(200)
        })
    }
    

    public async getCurrentUser(req: Request, res: Response): Promise<void> {
        if (!req.session.user) {
            throw new BadRequestError("Not authorized")
        }

        const user = await this.authService.getUserById(req.session.user)

        if(!user) {
            throw new BadRequestError("there is no user")
        }

        res.status(200).json({ id: user.user_id, name: user.name, role: user.role, phone: user.phone, email: user.email })
    }

}