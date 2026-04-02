const addressModel = require("../../Models/userModel/addressModel");
const { response, message } = require("../../utils/response");


exports.getUserAddressList = async (req, res) => {
    try {
        let address = await addressModel.getUserAddressList(req.userId)
        if (address.length > 0) {
            return res.status(200).send(response(true, "Address List", address));
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.insertUserAddress = async (req, res) => {
    try {
       
        let insertAddress = await addressModel.insertUserAddress(req.body, req.userId)
        if (insertAddress) {
            return res.status(200).send(response(true, "User Address Added Successfully"));
        } else {
            return res.status(200).send(response(true, "Unable to add User Address"));
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.updateUserAddress = async (req, res) => {
    try {

        let address = await addressModel.getUserAddressDetailById(req.body.id)
    
        if(address.length > 0 ) {

        let updateAddress = await addressModel.updateUserAddress(req.body, req.userId)
        if (updateAddress) {

            let address = await addressModel.getUserAddressDetailById(req.body.id)
            return res.status(200).send(response(true, "User Address Updated Successfully",address[0]));
        } else {
            return res.status(400).send(response(true, "Unable to Update User Address"));
        }
    }else{
        return res.status(400).send(response(false, "No address found"));
    }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.deleteUserAddress = async (req, res) => {
    try {
        let deleteAddress = await addressModel.deleteUserAddress(req.body.id, req.userId)
        if (deleteAddress) {
            return res.status(200).send(response(true, "User Address Deleted Successfully"));
        } else {
            return res.status(200).send(response(true, "Unable to Delete User Address"));
        }

    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}




