import express from 'express';
import { registerController,loginController, testController, forgotpasswordController, updateProfileController, getOrderController, getAllOrderController, orderStatusController } from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
const router = express.Router()

// routing register|| post
router.post('/register',registerController)

//LOGIN||POST
router.post('/login',loginController);

//Forgot password
router.post('/forgot-password',forgotpasswordController);

//test route
router.get('/test',requireSignIn,isAdmin, testController)


//Protected route auth
router.get("/user-auth", requireSignIn, (req,res)=>{
    res.status(200).send({ok: true });
})

//Admin route auth
router.get("/admin-auth", requireSignIn,isAdmin, (req,res)=>{
    res.status(200).send({ok: true });
})

// update profile
router.put('/profile', requireSignIn,updateProfileController)


// orders
router.get("/orders",requireSignIn,getOrderController)


//  all- orders
router.get("/all-orders",requireSignIn,isAdmin, getAllOrderController)

//order status update
router.put("/order-status/:orderId",requireSignIn,isAdmin,orderStatusController)



export default router