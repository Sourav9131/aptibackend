const bannerImageModel = require("../../Models/adminModel/bannerImageModel");
const categoryModel = require("../../Models/adminModel/categoryModel");
const { response, message } = require("../../utils/response");
const fs = require('fs');
const path = require('path');

exports.getImage = async (req, res) => {
    try {
        let categoryList = await bannerImageModel.getImageList()
        if (categoryList.length > 0) {
            return res
                .status(200)
                .send(response(true, "Image  list", categoryList));
        }
        return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.addBannerImage = async (req, res) => {
    try {
        let backgroundImage = !req.files
            ? null
            : req.files;

            let bannerImage;
            if(backgroundImage.length>0){
                backgroundImage.map(async(img)=>{
                     bannerImage = await bannerImageModel.addImage(img.filename);
                })
            }
            if(backgroundImage){
                return res.status(200).send({ success: true, msg: "Images Added Sucessfully" });
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


exports. imageStatusUpdate = async (req, res) => {
    try {
        let categoryStatusUpdate = await bannerImageModel.imageStatusUpdate(req.body);
        if (categoryStatusUpdate) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Category" })
        }
    } catch (error) {
         return res.status(500).send(response(false, message.catchMessage));
    }
}


exports. imageDelete = async (req, res) => {
    try {

        let categoryStatusUpdate = await bannerImageModel.imageDelete(req.body);
        if (categoryStatusUpdate) {
            // Assuming req.body contains the image filename or path
            const imagePath = path.join(__dirname,'..','..', 'public', req.body.image);
            // Check if the file exists
            if (fs.existsSync(imagePath)) {
                // Delete the file
                fs.unlinkSync(imagePath);
            }

            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Category" });
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}