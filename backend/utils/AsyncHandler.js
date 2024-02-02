/**
 * 
 * @param {(req:import("express").Request),res:import("express").Response,next:import("express").NextFunction} fn 
 * @returns {Higher order function}
 */
export const asyncHandler=(fn)=>(req,res,next)=>{
    Promise.resolve(fn(req,res,next)).catch(err=>next(err));
};