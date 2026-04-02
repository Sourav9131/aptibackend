const { response, message } = require("../../utils/response");
const cmsModel = require('../../Models/userModel/cmsModel')

exports.getCMSContentByRoute = async(req, res) =>{
    try {
        let getCMS = await cmsModel.getCMSContentByRoute(req.query.route)
        if (getCMS.length > 0) {
            return res.status(200).send({ success: true, msg: "Success", getCMS});
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.getCMSPages = async(req, res) =>{
    try {
        let getCMS = await cmsModel.getCMSPages()
        if (getCMS.length > 0) {
            return res.status(200).send({ success: true, msg: "Success", getCMS});
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.insertContactUs = async (req, res) => {
    try {
        let insertContactUs = await cmsModel.insertContactUs(req.body)
        if (insertContactUs) {
            return res.status(200).send(response(true, "Success"));
        } else {
            return res.status(200).send(response(true, "Unable to add contact us details"));
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send(response(false, message.catchMessage));
    }
}


exports.getTnc = async (req, res) => {
    try {
        let feedbackList = await cmsModel.checkTnC()
        if (feedbackList.length > 0) {
            return res.status(200).send({ success: true, msg: "Success", data: feedbackList });
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(response(false, message.catchMessage));
    }
}





exports.getFaq = async (req, res) => {
    try {
        let feedbackList = await cmsModel.getFaqList()
        if (feedbackList.length > 0) {
            return res.status(200).send({ success: true, msg: "Success", data: feedbackList });
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(response(false, message.catchMessage));
    }
}





exports.getNotification = async (req, res) => {
    try {


        let notificationList = await cmsModel.getNotficationById(req.userId)
        if (notificationList.length > 0) {
            return res.status(200).send({ success: true, msg: "Success", data: notificationList });
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(response(false, message.catchMessage));
    }
}




exports.getPrivacyPolcies = async (req, res) => {
    try {
        let feedbackList = await cmsModel.checkPolicy()
        if (feedbackList.length > 0) {
            return res.status(200).send({ success: true, msg: "Success", data: feedbackList });
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(response(false, message.catchMessage));
    }
}


exports.getAboutUs = async (req, res) => {
    try {
        let aboutUsList = await cmsModel.checkAboutUs()
        if (aboutUsList.length > 0) {
            return res.status(200).send({ success: true, msg: "Success", data: aboutUsList });
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(response(false, message.catchMessage));
    }



    
}


exports.getMasterData = async(req, res) =>{
    try {
        let data = await cmsModel.masterData()
        if (data.length > 0) {
            return res.status(200).send({ success: true, msg: "Success", data});
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(response(false, message.catchMessage));
    }
}




