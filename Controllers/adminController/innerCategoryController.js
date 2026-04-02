const { response, message } = require("../../utils/response");
let innerCategoryModel = require('../../Models/adminModel/innerCategoryModel')


exports.insertInnerCategory = async (req, res) => {
    try {
        let { innerCategoryName, categoryId, subCategoryId } = req.body
        let checkInnerCategory = await innerCategoryModel.checkInnerCategory(req.body)
        if (checkInnerCategory.length == 0) {
            innerCategoryName = req.body.innerCategoryName.toUpperCase()
            let addInnerCategory = await innerCategoryModel.insertInnerCategory(innerCategoryName, categoryId, subCategoryId)
            if (addInnerCategory) {
                return res.status(200).send({ success: true, msg: "Inner Category Added Sucessfully" });
            } else {
                return res.status(200).send({ success: false, msg: "Unable to Add Inner Category" })
            }
        } else {
            return res.status(200).send({ success: false, msg: "Inner Category Already Added" })
        }
    } catch (error) {
        
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.getInnerCategoryList = async (req, res) => {
    try {
        let innerCategoryList = await innerCategoryModel.getInnerCategoryList()
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

exports.getInnerCategoryById = async (req, res) => {
    try {
        let innerCategory = await innerCategoryModel.getInnerCategoryById(req.query)
        if (innerCategory.length > 0) {
            return res
                .status(200)
                .send(response(true, "Inner Category Detail", innerCategory));
        }
        return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.updateInnerCategory = async (req, res) => {
    try {
        let { innerCategoryName, id } = req.body
        innerCategoryName = innerCategoryName.toUpperCase()
        let updateInnerCategory = await innerCategoryModel.updateInnerCategory(req.body, id)
        if (updateInnerCategory) {
            return res.status(200).send({ success: true, msg: "Inner Category Updated Sucessfully" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Inner Category" })
        }
    } catch (error) {
         return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.innerCategoryStatusUpdate = async (req, res) => {
    try {
        let innerCategoryStatusUpdate = await innerCategoryModel.innerCategoryStatusUpdate(req.body)
        if (innerCategoryStatusUpdate) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Inner Category" })
        }
    } catch (error) {
         return res.status(500).send(response(false, message.catchMessage));
    }
}