import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category Already Exists",
      });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "New category created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in category",
    });
  }
};

//update category
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body
    const { id } = req.params
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug:slugify(name)},
      {new:true}
    );
    res.status(200).send({
      success: true,
      message: "Category update successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};

// all category

export const categoryController = async(req,res) =>{
    try{
        const category = await categoryModel.find({});
        res.status(200).send({
            success:true,
            message:"All Categories list",
            category
        })

    }catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting categogy",
          });
    }
}


export const singlecategoryController = async(req,res) =>{
    try{
        const category = await categoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:'get single categories successfully',
            category
        })

    }catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while single category",
          });
    }

}


// delete categogy
export const deletecategoryController = async(req,res) =>{
    try{
        const {id} =req.params
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:'categories  deleted successfully',
            
        })

    }catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while delete category",
          });

    }
}
