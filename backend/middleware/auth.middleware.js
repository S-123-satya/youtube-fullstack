import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import { generateAccessAndRefreshToken } from "../utils/helpers.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  let user=null;
  const token =
    req.cookies?.accessToken ||
    req.header("Autherization")?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!decodedToken) {
    // refresh the access token with refreshToken
    const reqRefreshToken =
      req.cookies?.refreshToken ||
      req.header("refreshToken")?.replace("Bearer ", "");
    if (!reqRefreshToken) {
      throw new ApiError(401, "Unautorised access please login again");
    }
    const decodedrefreshToken = jwt.verify(
      reqRefreshToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (!decodedrefreshToken) {
      throw new ApiError(401, "Token expired, Please login again");
    }
    const { refreshToken, accessToken } = generateAccessAndRefreshToken(
      decodedrefreshToken._id
    );
    res.cookie("accessToken", accessToken).cookie("refreshToken", refreshToken);
     user = await User.findById(decodedrefreshToken._id);
  if (!user) {
    throw new ApiError(404, "Unauthorized access User not found");
  }
  }
   user = await User.findById(decodedToken._id);
  if (!user) {
    throw new ApiError(404, "Unauthorized access User not found");
  }
  req.user=user;
  next();
});

/*
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );
    if (!user) {
      // Client should make a request to /api/v1/users/refresh-token if they have refreshToken present in their cookie
      // Then they will get a new access token which will allow them to refresh the access token without logging out the user
      throw new ApiError(401, "Invalid access token");
    }
    req.user = user;
    next();
  } catch (error) {
    // Client should make a request to /api/v1/users/refresh-token if they have refreshToken present in their cookie
    // Then they will get a new access token which will allow them to refresh the access token without logging out the user
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

/**
 *
 * @description Middleware to check logged in users for unprotected routes. The function will set the logged in user to the request object and, if no user is logged in, it will silently fail.
 *
 * `NOTE: THIS MIDDLEWARE IS ONLY TO BE USED FOR UNPROTECTED ROUTES IN WHICH THE LOGGED IN USER'S INFORMATION IS NEEDED`
 * 
export const getLoggedInUserOrIgnore = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );
    req.user = user;
    next();
  } catch (error) {
    // Fail silently with req.user being falsy
    next();
  }
});
*/
