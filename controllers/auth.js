import asyncHandler from "express-async-handler";
import { unAuthorizedError, badRequest, notFound } from "../utils/errorResponse.js";

export const ping = asyncHandler(async(req,res,next) => {

    // throw unAuthorizedError()
    // throw badRequest(['error1','error2'])
    // throw notFound()
    res.json('hello')
})