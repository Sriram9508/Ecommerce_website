import express from 'express'
import { categoryController,
     createCategoryController,
     deletecategoryController,
     singlecategoryController, 
    updateCategoryController } from '../controllers/categoryController.js'
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/create-category', requireSignIn,isAdmin,createCategoryController);

router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController);

// getall cat
router.get('/get-category',categoryController);

//single category
router.get('/single-category/:slug',singlecategoryController);

//detele category
router.delete('/delete-category/:id',requireSignIn,isAdmin, deletecategoryController);





export default router