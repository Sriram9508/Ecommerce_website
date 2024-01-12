
import  express  from "express";
import formidable from "express-formidable";
import { brainTreePaymentController, braintreeTokenController, createProductController, deleteProductController, 
    getProductController, getSingleProductController, 
    productCategoryController, 
    productCountController, productFilterController, 
    productListController, 
    productPhotoController, relatedProductController, searchProductController, updateProductController } from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";



const router = express.Router();

//router
router.post("/create-product",requireSignIn,isAdmin,formidable(), createProductController)

// getall product
router.get('/get-product',getProductController);

// get single product
router.get('/get-product/:slug',getSingleProductController);

//get photo
router.get('/get-photo/:pid',productPhotoController);

//get delete
router.delete("/delete-product/:pid", deleteProductController);



//update
router.put("/update-product/:pid",requireSignIn,isAdmin,formidable(), updateProductController)

//  filter product
router.post('/product-filters',productFilterController)

// product count
router.get('/product-count',productCountController)

// product per page
router.get('/product-list/:page',productListController)

// search product
router.get('/search/:keyword',searchProductController);

// similar product
router.get('/related-product/:pid/:cid', relatedProductController);

//categories wise product
router.get('/product-category/:slug',productCategoryController);

//payment routes 
//token
router.get("/braintree/token",braintreeTokenController)

//payment
router.post('/braintree/payment',requireSignIn, brainTreePaymentController)



export default router