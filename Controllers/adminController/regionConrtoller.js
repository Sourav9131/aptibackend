const regionModel = require("../../Models/adminModel/regionModel");
const { response, message } = require("../../utils/response");


exports.getRegionList = async (req, res) => {
    try {
        let categoryList = await regionModel.getRegionList()
        if (categoryList.length > 0) {
            return res
                .status(200)
                .send(response(true, "Region List", categoryList));
        }
        return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}


exports.insertRegionName = async (req, res) => {
    try {
		let flag = !req.files["flag"]
			? null
			: req.files["flag"][0].filename;
        let checkName = await regionModel.checkRegionName(req.body.regionName)
        if(checkName.length > 0){
            return res
                .status(200)
                .send(response(true, "Region Name Already Added",));
        }
        let regionName = await regionModel.insertRegionName(req.body, flag)
        if(regionName){
            return res.status(200).send({success: true, msg: 'Region Added Successfully'})
        }else{
            return res.status(200).send({success: false, msg: 'Unable to Add Region Please Try Again!'})
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.updateRegionName = async (req, res) => {
    try {
        // let checkName = await regionModel.checkRegionName(req.body.regionName)
        // if(checkName.length > 0){
        //     return res
        //         .status(200)
        //         .send(response(true, "Region Name Already Added",));
        // }
        let flag = !req.files["flag"]
        ? null
        : req.files["flag"][0].filename;
        if (flag) {
            req.body.flag = flag;
        } else {
            flag = req.body.oldflag;
        }
        req.body.currency = req.body.currency.toUpperCase()
        let updateRegionName = await regionModel.updateRegionName(req.body, flag)
        if(updateRegionName){
            return res.status(200).send({success: true, msg: 'Region Name Updated Successfully'})
        }else{
            return res.status(200).send({success: false, msg: 'Unable to Update Region Name Please Try Again!'})
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.updateRegionStatus = async (req, res) => {
    try {
        let updateRegionStatus = await regionModel.updateRegionStatus(req.body)
        if (updateRegionStatus) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Product Status" })
        }
    } catch (error) {
         return res.status(500).send(response(false, message.catchMessage));
    }
}