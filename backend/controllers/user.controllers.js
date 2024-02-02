import { set } from "mongoose";
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
        throw new ApiError(401,"username or email is already exist, try with something new username and email or login with existing creaditials");
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
    .json(new ApiResponse(201,"User registered successfully",{ user: newUser, accessToken, refreshToken }))
})

const userLogin=asyncHandler(async(req,res,next)=>{
    const {username,email,password} = req.body;
    const user=await User.findOne({
        $or:[{username,email}]
    });
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const isPasswordCorrect=await user.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        throw new ApiError(402, "Invalid password");
    }
    const {accessToken,refreshToken}=generateAccessAndRefreshToken(user._id);
    const newUser=await User.findById(user._id).select(
            "-password -refreshToken"
        );
    res.status(201)
    .cookie("accessToken",accessToken)
    .cookie("refreshToken",refreshToken)
    .json(new ApiResponse(200,"User login successfully",{ user: newUser, accessToken, refreshToken }))
})

const userLogout=asyncHandler(async (req,res,next)=>{
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json(new ApiResponse(200,"Logout successfully",{}));
})

const changeUsername=asyncHandler(async(req,res,next)=>{
    const {username}=req.body;
    const existingUser=await User.findOne({username}).select("-password -refreshToken");
    if(existingUser){
        throw new ApiError(402,"username already exist");
    }
    const updatedUser=await User.findByIdAndUpdate(req.user._id,{$set:{
        username:username
    }})
    if(!updatedUser){
        throw new ApiError(500,"something went wrong while updating the username")
    }
    res.status(200).json(new ApiResponse(200,"username updated successfully",updatedUser));
})

const checkUsernameExist=asyncHandler(async(req,res,next)=>{
    const {username}=req.body;
    const checkExistingUser=await User.findOne({username:username});
    if(checkExistingUser){
        res.status(200).json(new ApiResponse(200,"User already exists",true))
    }
    else {
        res.status(200).json(new ApiResponse(200,"User already exists",false));
    }
})

const changePassword=asyncHandler(async (req,res,next)=>{
    const {oldPassword,newPassword}=req.body;
    const existingUser=await User.findById(req.user._id);
    const isPasswordCorrect=existingUser.isPasswordCorrect(oldPassword);
    if(!isPasswordCorrect){
        throw new ApiError(404,"Incorrect password");
    }
    existingUser.password=newPassword;
    existingUser.save();
    res.status(200).json(new ApiResponse(200,"User password change successfully",{}));
})
/**
 * 
 * @description ResetPassword, change CoverImage and change pic Url controller is left
 */
export {
    userRegister,
    userLogin,
    userLogout,
    changeUsername,
    checkUsernameExist,
    changePassword,

}