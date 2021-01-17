const mysqlConnection = require('../config/dbConnection.js')
const Category = require('../modules/categoriesModule')



module.exports = {
    addCategory: async(req, res) => {
        try {
            if (typeof req.body.CategoryName != 'undefined') {
                let category = new Category;
                let addCategoryResponsed = await category.addCategory(req.body.CategoryName)
                res.status(200).send({value: addCategoryResponsed})
            } else {
                throw 'no category name has been sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    getAllCategories: async (req, res) => {
        try {
            let category = new Category;
            let getAllCategoriesResponsed = await category.getAllCategories()
            res.status(200).send({value: getAllCategoriesResponsed})
        } catch (error) {
            res.status(500).send({value: error.toString()})

        }
    },
    updateCategory: async(req, res) => {
        if (req.body.categoryName != 'undefined' && req.body.categoryId != 'undefined') {
            try {
                let category = new Category;
                let updateCategoryResponsed = await category.updateCategory(req.body.categoryName, req.body.categoryId)
                res.status(200).send({value: updateCategoryResponsed})
            } catch (error) {
                res.status(500).send({value: error.toString()})
            }
        } else {
            res.status(500).send({value: 'no category name or category id'})
        }
    },
    deleteCategory: async(req, res) => {
        if (req.body.categoryId != 'undefined') {
            try {
                let category = new Category;
                let deleteCategoryResponsed = await category.deleteCategory(req.body.categoryId)
                res.status(200).send({value: deleteCategoryResponsed})
            } catch (error) {
                res.status(500).send({value: error.toString()})
            }
        } else {
            res.status(500).send({value: 'no category id'})
        }

    },
    getUseRrankCategories: async (req, res) => {
        if (req.body.email != 'undefined') {
            try {
                let category = new Category;
                let getUseRrankCategoriesResponsed = await category.getUseRrankCategories(req.body.email)
                res.status(200).send({value: getUseRrankCategoriesResponsed})
            } catch (error) {
                res.status(500).send({value: error.toString()})
            }
        } else {
            res.status(500).send({value: 'no category id'})
        }
    },
    getPictureForCategory: async (req, res) => {
        if (req.body.categoryId != 'undefined') {
            try {
                let category = new Category;
                let getPictureForCategoryResponsed = await category.getPictureForCategory(req.body.categoryId)
                res.status(200).send({value: getPictureForCategoryResponsed})
            } catch (error) {
                res.status(500).send({value: error.toString()})
            }
        } else {
            res.status(500).send({value: 'no category id'})
        }
    }
}