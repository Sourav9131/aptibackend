const subCategoryModel = require("../../Models/adminModel/subCategoryModel");
const { response, message } = require("../../utils/response");


exports.getSubCategoryList = async (req, res) => {
    try {
        let subCategoryList = await subCategoryModel.getSubCategoryList()
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

exports.addSubCategory = async (req, res) => {
    try {
        let backgroundImage = !req.files["backgroundImage"]
            ? null
            : req.files["backgroundImage"][0].filename;

        let checkSubCategory = await subCategoryModel.checkSubCategory(req.body)
        if (checkSubCategory.length == 0) {
            let addSubCategory = await subCategoryModel.addSubCategory(req.body, backgroundImage)
            if (addSubCategory) {
                return res.status(200).send({ success: true, msg: "Sub Category Added Sucessfully" });
            } else {
                return res.status(200).send({ success: false, msg: "Unable to Add Sub Category" })
            }
        } else {
            return res.status(200).send({ success: false, msg: "Sub Category Already Added" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.updateSubCategory = async (req, res) => {
    try {
        let backgroundImage = !req.files["backgroundImage"]
            ? null
            : req.files["backgroundImage"][0].filename;
            if (backgroundImage) {
                req.body.backgroundImage = backgroundImage;
            } else {
                backgroundImage = req.body.oldBackgroundImage;
            }
        let updateSubCategory = await subCategoryModel.updateSubCategory(req.body, backgroundImage)
        if (updateSubCategory) {
            return res.status(200).send({ success: true, msg: "Sub Category Updated Sucessfully" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Sub Category" })
        }
    } catch (error) {
         return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.subCategoryStatusUpdate = async (req, res) => {
    try {
        let subCategoryStatusUpdate = await subCategoryModel.subCategoryStatusUpdate(req.body)
        if (subCategoryStatusUpdate) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Inner Category" })
        }
    } catch (error) {
         return res.status(500).send(response(false, message.catchMessage));
    }
}