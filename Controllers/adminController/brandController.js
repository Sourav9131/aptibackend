const brandModel = require("../../Models/adminModel/brandModel");
const { response, message } = require("../../utils/response");


exports.getBrandList = async (req, res) => {
    try {
        let brandList = await brandModel.getBrandList()
        if (brandList.length > 0) {
            return res
                .status(200)
                .send(response(true, "Brand List", brandList));
        }
        return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.insertBrandName = async (req, res) => {
    try {
        let data = req.body
        let checkName = await brandModel.checkBrandName(data.brandName, data.categoryId)
        if(checkName.length != 0){
            return res
                .status(200)
                .send(response(false, "Brand name already added",));
        }
        let insertBrandName = await brandModel.insertBrandName(data.brandName, data.categoryId)
        if(insertBrandName){
            return res.status(200).send({success: true, msg: 'Brand Name Added Successfully'})
        }else{
            return res.status(200).send({success: false, msg: 'Unable to Add Brand Name Please Try Again!'})
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.updateBrandName = async (req, res) => {
    try {
        let data = req.body
        let checkName = await brandModel.checkBrandName(data.brandName, data.categoryId)
        if(checkName.length > 0){
            return res
                .status(200)
                .send(response(true, "Brand Name Already Added",));
        }
        let updateBrandName = await brandModel.updateBrandName(data)
        if(updateBrandName){
            return res.status(200).send({success: true, msg: 'Brand Name Updated Successfully'})
        }else{
            return res.status(200).send({success: false, msg: 'Unable to Update Brand Name Please Try Again!'})
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.updateBrandStatus = async (req, res) => {
    try {
        let updateBrandStatus = await brandModel.updateBrandStatus(req.body)
        if (updateBrandStatus) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Product Status" })
        }
    } catch (error) {
        // return res.status(500).send(response(false, message.catchMessage));
        return res.status(500).send(response(false, error.message));
    }
}