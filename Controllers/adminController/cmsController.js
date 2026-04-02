const { response, message } = require("../../utils/response");
const cmsModel = require('../../Models/adminModel/cmsModel')

exports.insertCMSPages = async (req, res) => {
    try {
        let name = req.body.name
        route = name.toLowerCase().split(' ').join('').trim()
        let insertCMS = await cmsModel.insertCMSPages(req.body, route)
        if (insertCMS) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to add CMS pages" })
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.updateCMSPages = async (req, res) => {
    try {
        let name = req.body.name
        route = name.toLowerCase().split(' ').join('').trim()
        let updateCms = await cmsModel.updateCMSPages(req.body, route)
        if (updateCms) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to update CMS pages! Please try again" })
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.updatePagesStatus = async (req, res) => {
    try {
        let updatePagesStatus = await cmsModel.updatePagesStatus(req.body)
        if (updatePagesStatus) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Page Status" })
        }
    } catch (error) {
         return res.status(500).send(response(false, message.catchMessage));
    }
}


exports.getCMSPages = async (req, res) => {
    try {
        let getCMS = await cmsModel.getCMSPages()
        if (getCMS.length > 0) {
            return res.status(200).send({ success: true, msg: "Success", data: getCMS });
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.insertCMSContent = async (req, res) => {
    try {
        let insertCMSContent = await cmsModel.insertCMSContent(req.body)
        if (insertCMSContent) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to add CMS pages" })
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.getCMSContentById = async (req, res) => {
    try {
        let getCMS = await cmsModel.getCMSContentById()
        if (getCMS.length > 0) {
            return res.status(200).send({ success: true, msg: "Success", data: getCMS });
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.updateCMSContent = async (req, res) => {
    try {
        let updateCMSContent = await cmsModel.updateCMSContent(req.body)
        if (updateCMSContent) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to update CMS pages! Please try again " })
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

//========================================= contact6 us ==================================

exports.getContactUsList = async (req, res) => {
    try {
        let contactList = await cmsModel.getContactUsList()
        if (contactList.length > 0) {
            return res.status(200).send({ success: true, msg: "Success", data: contactList });
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.getContactUsDetailById = async (req, res) => {
    try {
        let contactList = await cmsModel.getContactUsDetailById(req.query.id)
        if (contactList.length > 0) {
            return res.status(200).send({ success: true, msg: "Success", data: contactList });
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}


//===================================== feedback ========================================

exports.getFeedbackList = async (req, res) => {
    try {
        let feedbackList = await cmsModel.getFeedbackList()
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

exports.deleteFeedBack = async (req, res) => {
    try {
        let updateRegionStatus = await cmsModel.deleteFeedback(req.body.id)
        if (updateRegionStatus) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Product Status" })
        }
    } catch (error) {
         return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.updateFeedBack = async (req, res) => {
    try {
        let updateRegionStatus = await cmsModel.updateFeedback(req.body)
        if (updateRegionStatus) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Product Status" })
        }
    } catch (error) {
        console.log(error);
         return res.status(500).send(response(false, message.catchMessage));
    }
}


exports.updateFeedBackStatus = async (req, res) => {
    try {
        let updateRegionStatus = await cmsModel.updateFeedStatus(req.body)
        if (updateRegionStatus) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Product Status" })
        }
    } catch (error) {
         return res.status(500).send(response(false, message.catchMessage));
    }
}


exports.insertFeedback = async (req, res) => {
    try {
      const data = req.body;
      if (!data.productId) {
        return res
          .status(400)
          .send(response(false, "productId is required"));
      }
      if (!data.userId) {
        return res
          .status(400)
          .send(response(false, "userId is required"));
      }
      const bodyData = {
        userId: req.body.userId,
        feedback: data.feedback,
        rating: data.rating,
        productId: data.productId,
        status: 0,
        feedbackImage:  JSON.stringify(req?.files?.map(file => file.filename)),
      };
  
      let insertFeedback = await cmsModel.insertFeedback( bodyData);
      if (insertFeedback) {
        res
          .status(200)
          .send({ success: true, msg: "Feedback Added Successfully!" });
      } else {
        return res
          .status(200)
          .send(response(false, "Something! Went Wrong Please Try Again"));
      }
    } catch (error) {
        console.log(error);
      return res.status(500).send(response(false, message.catchMessage));
    }
  };
  

  //===========================================  FAQ ================================


  exports.insertFaq = async (req, res) => {
    try {
      const data = req.body;
      const bodyData = {
        question:data.question,
        answer:data.answer
      };
  
      let insertFeedback = await cmsModel.insertFaq( bodyData);
      if (insertFeedback) {
        res
          .status(200)
          .send({ success: true, msg: "Faq Added Successfully!" });
      } else {
        return res
          .status(200)
          .send(response(false, "Something! Went Wrong Please Try Again"));
      }
    } catch (error) {
        console.log(error);
      return res.status(500).send(response(false, message.catchMessage));
    }
  };



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


exports.updateFaq = async (req, res) => {
    try {
        let updateRegionStatus = await cmsModel.updateFaq(req.body)
        if (updateRegionStatus) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Product Status" })
        }
    } catch (error) {
        console.log(error);
         return res.status(500).send(response(false, message.catchMessage));
    }
}


exports.deleteFaq = async (req, res) => {
    try {
        let updateRegionStatus = await cmsModel.deleteFaq(req.body.id)
        if (updateRegionStatus) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to delete item" })
        }
    } catch (error) {
         return res.status(500).send(response(false, message.catchMessage));
    }
}




  //===========================================  Terms and conditions ================================

  exports.inserttermsandcondtions = async (req, res) => {

    try {
      const data = req.body.accessibility;

      
     let checkData = await cmsModel.checkTnC();

     
     if(checkData.length>0){

        await cmsModel.updateTnC(data)
        res
        .status(200)
        .send({ success: true, msg: "Item updated!" });
     }else{
        let insertFeedback = await cmsModel.insertTnC( data);
        res
        .status(200)
        .send({ success: true, msg: "Item added" });
  }

    } catch (error) {
        console.log(error);
      return res.status(500).send(response(false, message.catchMessage));
    }
  };

  // Alias for backward-compatible route naming
  exports.insertTermsAndConditions = exports.inserttermsandcondtions;


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

//======================================= notification ===============================

exports.getNotification= async (req, res) => {
    try {
        let notification = await cmsModel.getNotificationList()
        if (notification.length > 0) {
            return res.status(200).send({ success: true, msg: "Success", data: notification });
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}


//===================================== Privacy Policies ====================================


exports.insertPrivacyPolicies = async (req, res) => {
    try {
      const data = req.body.accessibility;

     let checkData = await cmsModel.checkPolicy();
     if(checkData.length>0){

        await cmsModel.updatePolicy(data)
        res
        .status(200)
        .send({ success: true, msg: "Item updated!" });
     }else{
        let insertFeedback = await cmsModel.insertPolicies(data);
        res
        .status(200)
        .send({ success: true, msg: "Item added" });
     }
    
    } catch (error) {
        console.log(error);
      return res.status(500).send(response(false, message.catchMessage));
    }
  };


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



//============================================ about us =================================


exports.insertAboutUs = async (req, res) => {


    try {
      const data = req.body;
      let bodyData;
      if(req.files.length>0){
         bodyData = {
            imageTagline: data.imageTagline,
            description: data.description,
            ourValues: data.ourValues,
            mainImage: req?.files[0]?.filename,
          };
      }else{
        bodyData = {
            imageTagline: data.imageTagline,
            description: data.description,
            ourValues: data.ourValues,
            mainImage: req?.body.mainImage,
          };
      }

      
  
      let checkData = await cmsModel.checkAboutUs()
      if(checkData.length>0){
        await cmsModel.updateAboutUs(bodyData)
        res
        .status(200)
        .send({ success: true, msg: "Item updated Successfully!" });
      }
      else{
        let insertFeedback = await cmsModel.insertAboutUs( bodyData);
        res
        .status(200)
        .send({ success: true, msg: "Item added Successfully!" });
 
      }

      
      
    } catch (error) {
        console.log(error);
      return res.status(500).send(response(false, message.catchMessage));
    }
  };
  

  exports.getAboutUs = async (req, res) => {
    try {
        let feedbackList = await cmsModel.checkAboutUs()
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

