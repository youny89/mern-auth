import asyncHandler from "express-async-handler"
import { unAuthorizedError } from "../utils/errorResponse.js"
import jwt from "jsonwebtoken"

export const authenticate = asyncHandler(async(req,res,next) => {
    const authorization = req.headers.authorization;
    if(!authorization) throw unAuthorizedError('토큰이 없어요.');

    const accessToken = authorization.startsWith('Bearer') && authorization.split('Bearer ')[1].trim();
    if(!accessToken) throw unAuthorizedError('토큰이 없어요~')
    try {
        const user = jwt.verify(accessToken,process.env.JWT_ACCESS_TOKEN_SECRET);
        req.user = user.id;
        next();
    } catch (error) {
        if(error.name === 'TokenExpiredError') {
            return res.status(401).json({
                isError:true,
                expired: true,
                message:"토큰 만료."
            })
        }
        throw unAuthorizedError(error.message);
    }
        
})