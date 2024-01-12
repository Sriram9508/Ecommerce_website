import { comparePassword, hashPassword } from "../helpers/authhelper.js";
import orderModel from "../models/orderModel.js";
import usermodel from "../models/usermodel.js";
import JWT from 'jsonwebtoken';


export const registerController = async(req,res) =>{
    try{
        const {name,email,password,phone,address,answer} = req.body
        //validation
        if(!name){
            return res.send({message:"Name is required"});
        }
        if(!email){
            return res.send({message:"Email is required"});
        }
        if(!password){
            return res.send({message:"Psaaword is required"});
        }
        if(!phone){
            return res.send({message:"Phone no is required"});
        }
        if(!address){
            return res.send({message:"Address is required"});
        }
        if(!answer){
            return res.send({message:"Answer is required"});
        }

        // check user
        const existingUser =await usermodel.findOne({email});
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:'Already register please login',
            })
        }

        const hashedPassword = await hashPassword(password)
        //save
        const user = await new usermodel({
            name,
            email,
            phone,
            address,
            password:hashedPassword,
            answer
        }).save()

        res.status(201).send({
            success:true,
            message: "User register successfully",
            user
        });

    }catch(error){
        console.log(error);
        res.stauts(500).send({
            success:false,
            message:"Error in Registration",
            error,
        });
    }
};


// LOGIN    
export const loginController = async(req,res) =>{
    try{
        const {email,password} = req.body
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:'Invalid email or Password'
            })
        }
        // check user
        const user  = await usermodel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Email is not register'
            })
        }
        const match =await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:'Invalid Password'
            })
        }
        //token
        const token = await JWT.sign({ _id: user._id}, process.env.JWT_SECRET,{
            expiresIn: "7d",
        })
        res.status(200).send({
            success:true,
            message:"login Successfully",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role: user.role,
            },
            token,
        });


    }catch(error){
        console.log(error);
        res.stauts(500).send({
            success:false,
            message:"Error in Login",
            error,
        });

    }
};

//forgot password
export const forgotpasswordController =async(req,res)=>{
    try{
        const {email,answer,newPassword} =req.body
        if(!email){
            res.status(400).send({message:'Email is required'})
        }
        if(!answer){
            res.status(400).send({message:'Answer is required'})
        }
        if(!newPassword){
            res.status(400).send({message:'NewPassword is required'})
        }
        // check
        const user = await usermodel.findOne({email,answer})
        //validate
        if(!user){
            return res.status(404).send({
                success:false,
                message:'wrong email or answer'
            })
        }
        const hashed = await hashPassword(newPassword);
        await usermodel.findByIdAndUpdate(user._id,{password:hashed});
        res.status(200).send({
            success:true,
            message:"Password reset successfully",
        });
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Somethings went wrong',
            error
        })
    }
}



//test controller
export const testController = (req,res)=>{
    res.send("protected route");
};


// update profile
export const updateProfileController = async(req,res) =>{
    try{
        const {name,email,password,address,phone} = req.body;
        const user = await usermodel.findById(req.user._id)
        //password
        if(password && password.length < 6){
            return res.json({error : "Password is requiored and 6 character long"})
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await usermodel.findByIdAndUpdate(
            req.user._id,
            {
                name : name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
            },
            {new: true}
        );
        res.status(200).send({
            success:true,
            message:"profile updated successfully",
            updatedUser,
        });
    }catch(error){
        console.log(error)
        res.status(400).send({
            success:false,
            message:"Error in updating profile",
            error
        })
    }
}


//orders
export const getOrderController = async(req,res) =>{
    try{
        const orders = await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name");
        res.json(orders)
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while getting order",
            error
        })
    }

}


// all order 

export const getAllOrderController = async(req,res) =>{
    try{
        const orders = await orderModel.find({}).populate("products","-photo").populate("buyer","name").sort({createdAt: "-1"});
        res.json(orders)
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while getting order",
            error
        })
    }

}

//order ststus
export const orderStatusController = async(req,res) =>{
    try{
        const {orderId} = req.params
        const {status}  = req.body
        const orders = await orderModel.findByIdAndUpdate(orderId,{status},{new:true})
        res.json(orders)
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error while updating order",
            error,
        })
    }
}