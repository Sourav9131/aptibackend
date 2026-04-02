const deliveryAndTaxModel = require("../../Models/adminModel/deliveryAndTaxModel");
const { response, message } = require("../../utils/response");


exports.getDeliverAndTaxList = async (req, res) => {
    try {
        let deliveryAndTaxList = await deliveryAndTaxModel.getDeliverAndTaxList()
        if (deliveryAndTaxList.length > 0) {
            return res
                .status(200)
                .send(response(true, "Delivery charges and taxes List", deliveryAndTaxList));
        }
        return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.insertDeliverAndTax = async (req, res) => {
    try {
        let checkName = await deliveryAndTaxModel.checkDeliveryName(req.body.regionId)
        if(checkName.length > 0){
            return res
                .status(200)
                .send(response(false, "Delivery charges and taxes already added",));
        }
        let insertData = await deliveryAndTaxModel.insertDeliverAndTax(req.body)
        if(insertData){
            return res.status(200).send({success: true, msg: 'Delivery charges and taxes Added Successfully'})
        }else{
            return res.status(200).send({success: false, msg: 'Unable to Delivery charges and taxes Please Try Again!'})
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.updateDeliveryAndTax = async (req, res) => {
    try {
        let updateDeliverAndTax = await deliveryAndTaxModel.updateDeliverAndTax(req.body)
        if(updateDeliverAndTax){
            return res.status(200).send({success: true, msg: 'Delivery charges and taxes updated Successfully'})
        }else{
            return res.status(200).send({success: false, msg: 'Unable to update delivery charges and taxes Please Try Again!'})
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.updateDeliverAndTaxStatus = async (req, res) => {
    try {
        let updateDeliverAndTaxStatus = await deliveryAndTaxModel.updateDeliverAndTaxStatus(req.body)
        if (updateDeliverAndTaxStatus) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to update delivery and tax status" })
        }
    } catch (error) {
        console.log(error)
         return res.status(500).send(response(false, message.catchMessage));
    }
}