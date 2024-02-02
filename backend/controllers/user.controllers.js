import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const generateAccessAndRefreshToken=async(userId)=>{
    try {
        const user=await User.findById(userId);
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();
        user.refreshToken=refreshToken;
        await user.save({ validateBeforeSave: false });
        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(500,"something went wrong while generating access and refresh token",error);
    }
}
const userRegister=asyncHandler(async(req,res,next)=>{
    const {username,email,password} =req.body;
    // picUrl and coverImage is not done yet we have to do it also
    const existingUser=await User.findOne({
        $or:[{ username }, { email }]
    });
    if(existingUser){
        throw new ApiError(401,"username or email is already exist, try with something new username and email or you want to login with existing creaditials");
    }
    const userObj={
        username,
        email,
        password,
        // picUrl and coverImage is not done yet we need to do it as well
    }
    const user=await User.create(userObj);
    if(!user){
        throw new ApiError(500,"something went wrong")
    }
    const {accessToken,refreshToken}=generateAccessAndRefreshToken(user._id);
    const newUser=await User.findById(user._id).select(
            "-password -refreshToken"
        );
    res.status(201)
    .cookie("accessToken",accessToken)
    .cookie("refreshToken",refreshToken)
    .json(ApiResponse(201,"User registered successfully",{ user: newUser, accessToken, refreshToken }))
})
const userLogin=asyncHandler(async(req,res,next)=>{

})

export {
    userLogin,
}