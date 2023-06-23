import asyncHandler from "express-async-handler";
import { unAuthorizedError, badRequest, notFound } from "../utils/errorResponse.js";
import { validationResult } from "express-validator"
import User from "../models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Token from "../models/Token.js"

export const ping = asyncHandler(async(req,res,next) => {

    // throw unAuthorizedError()
    // throw badRequest(['error1','error2'])
    // throw notFound()
    const loggedUser = await User.findById(req.user);
    if(!loggedUser) throw notFound();
    res.json(loggedUser);
})

export const signup = asyncHandler(async(req,res,next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) throw badRequest('Bad Request',error.mapped())

    const {email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await User.create({email, password:hashedPassword});
    const {password:_, ...others} = newUser._doc

    // TODO: 확인 이메일 보내기.
    
    const accessToken = jwt.sign(
        { id: newUser._id },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn : "15m" }
    )
    
    const refreshToken = jwt.sign(
        { id: newUser.id },
        process.env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: "3d"}
    )
    
    const tokenWithUser = await Token.findOne({user: newUser._id})
    if(tokenWithUser) {
        tokenWithUser.refreshToken = refreshToken;
        await tokenWithUser.save();
    }else{
        await Token.create({ user: newUser._id, refreshToken });
    }

    res
        .cookie('refresToken',refreshToken, {
            maxAge: 24 * 60 * 60 * 1000 * process.env.JWT_COOKIE_EXPIRE,
            httpOnly: true
        })
        .status(200)
        .json({accessToken, ...others});

});

export const login = asyncHandler(async (req,res,next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) throw badRequest('Bad Request', error.mapped());

    const { email, password } = req.body;
    const user = await User.findOne({email});
    
    if(!user) throw badRequest('이메일 혹은 비밀번호가 일하지 않습니다.');

    const isMatched =  await bcrypt.compare(password, user.password);
    if(!isMatched) throw badRequest('이메일 혹은 비밀번호가 일하지 않습니다.');

    const accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: '3d'}
    )

    // refresh token 저장
    const tokenWithUser = await Token.findOne({user: user._id });
    if(tokenWithUser) {
        tokenWithUser.refreshToken = refreshToken;
        await tokenWithUser.save();
    } else {
        await Token.create({user: user._id, refreshToken});
    }
    
    const {password:_, ...others} = user._doc;
    res.cookie('refreshToken',refreshToken,{
        maxAge : 24 * 60 * 60 * 1000 * process.env.JWT_COOKIE_EXPIRE,
        httpOnly: true
    })
    .json({
        ...others,
        accessToken
    });
});

export const refresh = asyncHandler(async(req,res)=>{
    const refreshToken = req.cookies?.refreshToken;
    if(!refreshToken) throw unAuthorizedError('쿠키 만료.');

    // refresh token 유효 검증
    try {
        const verifiedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);    
        const tokenData = await Token.findOne({user : verifiedToken.id});
        if(!tokenData) throw unAuthorizedError('재발급 토큰을 찾을수 없습니다.');

        const user = await User.findById(tokenData.user)
        if(!user) throw unAuthorizedError();

        const resetAccessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn : "15m" }
        )

        const resetRefreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn : "15m" }
        )

        tokenData.refreshToken = resetRefreshToken;
        await tokenData.save();

        res.cookie('refreshToken',resetRefreshToken, {
            maxAge: 24 * 60 * 60 * 1000 * process.env.JWT_COOKIE_EXPIRE,
            httpOnly: true
        })
            .json({
                accessToken : resetAccessToken
            })
    } catch (error) {
        console.log(error)
        res.json(error.message);
    }

})