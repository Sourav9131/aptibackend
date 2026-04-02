const { response, message } = require("../../utils/response");
let productTypeModel = require('../../Models/adminModel/productTypeModel')


exports.insertProductType = async (req, res) => {
    try {
        let { productTypeName, categoryId, subCategoryId, innerCategoryId } = req.body

        let checkInnerCategory = await productTypeModel.checkProductType(productTypeName, categoryId, subCategoryId, innerCategoryId)
        
        if (checkInnerCategory.length == 0) {
            let addProductType = await productTypeModel.insertProductType(productTypeName, categoryId, subCategoryId, innerCategoryId)
            if (addProductType) {
                return res.status(200).send({ success: true, msg: "Product Type Added Sucessfully" });
            } else {
                return res.status(200).send({ success: false, msg: "Unable to Add Product Type" })
            }
        } else {
            return res.status(200).send({ success: false, msg: "Product Type Already Added" })
        }
    } catch (error) {
        console.log(error);
        //return res.status(500).send(response(false, message.catchMessage));
        return res.status(500).send(response(false, error.message));

    }
}


exports.getProductTypeList = async (req, res) => {
    try {
        let productTypeList = await productTypeModel.getProductTypeList()
        if (productTypeList.length > 0) {
            return res
                .status(200)
                .send(response(true, "Product Type List", productTypeList));
        }
        return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
        //return res.status(500).send(response(false, message.catchMessage));
        return res.status(500).send(response(false, error.message));

    }
}

exports.getProductTypeListById = async (req, res) => {
    try {
        let productTypeById = await productTypeModel.getProductTypeListById(req.query)
        if (productTypeById.length > 0) {
            return res
                .status(200)
                .send(response(true, "Product Type ", productTypeById));
        }
        return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
        //return res.status(500).send(response(false, error.message));

    }
}

exports.updateProductType = async (req, res) => {
    try {
        let { productTypeName, id } = req.body
        let updateProductType = await productTypeModel.updateProductType(req.body, id)
        if (updateProductType) {
            return res.status(200).send({ success: true, msg: "Product Type Updated Sucessfully" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Product Type" })
        }
    } catch (error) {
        // return res.status(500).send(response(false, message.catchMessage));
        return res.status(500).send(response(false, error.message));

    }
}

exports.updateProductTypeStatus = async (req, res) => {
    try {
        let updateProductTypeStatus = await productTypeModel.updateProductTypeStatus(req.body)
        if (updateProductTypeStatus) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Product Type" })
        }
    } catch (error) {
        // return res.status(500).send(response(false, message.catchMessage));
        return res.status(500).send(response(false, error.message));
    }
}