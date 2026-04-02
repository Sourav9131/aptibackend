const regionModel = require("../../Models/userModel/regionModel");
const { response, message } = require("../../utils/response");


exports.getRegionList = async (req, res) => {
    try {
        let categoryList = await regionModel.getRegionList()
        if (categoryList.length > 0) {
            return res
                .status(200)
                .send(response(true, "Category List", categoryList));
        }
        return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}


exports.getSubCategoryList = async (req, res) => {
    try {
        let subCategoryList = await categoriesModel.getSubCategoryList()
        if (subCategoryList.length > 0) {
            return res
                .status(200)
                .send(response(true, "Sub Category List", subCategoryList));
        }
        return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
         return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.getInnerCategoryList = async (req, res) => {
    try {
        let innerCategoryList = await categoriesModel.getInnerCategoryList()
        if (innerCategoryList.length > 0) {
            return res
                .status(200)
                .send(response(true, "Inner Category List", innerCategoryList));
        }
        return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.getProductTypeList = async (req, res) => {
    try {
        let productTypeList = await categoriesModel.getProductTypeList()
        if (productTypeList.length > 0) {
            return res
                .status(200)
                .send(response(true, "Product Type List", productTypeList));
        }
        return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}