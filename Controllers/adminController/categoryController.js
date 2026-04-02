const categoryModel = require("../../Models/adminModel/categoryModel");
const { response, message } = require("../../utils/response");


exports.getCategoryList = async (req, res) => {
    try {
        let categoryList = await categoryModel.getCategoryList()
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

exports.addCategory = async (req, res) => {
    try {
        let backgroundImage = !req.files["backgroundImage"]
            ? null
            : req.files["backgroundImage"][0].filename;
        let checkCategory = await categoryModel.checkCategory(req.body.categoryName)
        if (checkCategory.length == 0) {
            let addCategory = await categoryModel.addCategory(req.body,backgroundImage)
            if (addCategory) {
                return res.status(200).send({ success: true, msg: "Category Added Sucessfully" });
            } else {
                return res.status(200).send({ success: false, msg: "Unable to Add Category" })
            }
        }else {
            return res.status(200).send({ success: false, msg: "Category Already Added" })
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.updateCategory = async (req, res) => {
    try {
        let backgroundImage = !req.files["backgroundImage"]
        ? null
        : req.files["backgroundImage"][0].filename;
        if (backgroundImage) {
            req.body.backgroundImage = backgroundImage;
        } else {
            backgroundImage = req.body.oldBackgroundImage;
        }
        let updateCategory = await categoryModel.updateCategory(req.body,backgroundImage)
        if (updateCategory) {
            return res.status(200).send({ success: true, msg: "Category Updated Sucessfully" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Category" })
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}


exports.categoryStatusUpdate = async (req, res) => {
    try {
        let categoryStatusUpdate = await categoryModel.categoryStatusUpdate(req.body)
        if (categoryStatusUpdate) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Category" })
        }
    } catch (error) {
         return res.status(500).send(response(false, message.catchMessage));
    }
}