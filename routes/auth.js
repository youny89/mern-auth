import { Router } from "express"
import { body } from "express-validator"
import {
    login,
    ping,
    signup,
    refresh
} from "../controllers/auth.js";
import User from "../models/User.js";

import { authenticate } from "../middleware/auth.js"

const router = Router();

router.get('/ping',authenticate, ping)

router.post(
    '/signup',
    [
        body("email")
            .isEmail().withMessage('올바른 이메일을 입력해주세요')
            .custom(async (value)=>{
                const user = await User.findOne({email:value})
                if(user) throw new Error('이미 존재하는 메일입니다. 다른 메일 주소를 이용해주세요')
                return true;
            }),
        body("password").isLength({min:6, max:14}).withMessage('최소 6 ~ 최대 14사이 입력해주세요.')
    ],
    signup
);
router.post(
    '/login',
    [
        body("email",'이메일을 입력해주세요').notEmpty(),
        body("password",'비밀번호를 입력해주세요').notEmpty(),
    ],
    login
)
router.get('/refresh', refresh)

export default router;