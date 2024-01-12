import  JWT  from "jsonwebtoken";
import usermodel from "../models/usermodel.js";

//Protected routes token base
export const requireSignIn = async(req,res,next) =>{
    try{
        const decord = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        req.user = decord;
        next();
    }catch(error){
        console.log(error);
    }
};


//admin access
export const isAdmin = async(req,res,next)=>{
    try{
        const user = await usermodel.findById(req.user._id);
        if(user.role !==1){
            return res.status(401).send({
                success:false,
                message:"UnAuthorized Access",
            });
        }else{
            next();
        }
    }catch(err){
        console.log(err);
    }
};

