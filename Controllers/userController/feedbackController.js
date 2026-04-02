
const { response, message } = require("../../utils/response");
const userModel = require("../../Models/userModel/userModel");
const { user } = require("../../config");

exports.insertFeedback = async (req, res) => {
  try {
    const data = req.body;


  let bodyData ;

  if(req?.files?.feedbackImage){

     bodyData = {
      userId: req.userId,
      feedback: data.feedback,
      rating: data.rating,
      productId: data.productId,
      orderId:data.orderId,
      status: 0,
      feedbackImage : JSON.stringify(req?.files?.feedbackImage.map(file => file.filename)),
     

    };
  }
  
else{

  bodyData = {
    userId: req.userId,
    feedback: data.feedback,
    rating: data.rating,
    productId: data.productId,
    orderId:data.orderId,
    status: 0,

   

  };  
}

  


    let insertFeedback = await userModel.insertFeedback(req.userId, bodyData);
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

exports.getFeedback = async (req, res) => {
  try {
    const data = req.body;

    let insertFeedback = await userModel.getFeedback(data.productId);
    if (insertFeedback) {
      res
        .status(200)
        .send({
          success: true,
          data: insertFeedback,
          msg: "Feedback fetach Successfully!",
        });
    } else {
      return res
        .status(200)
        .send(response(false, "Something! Went Wrong Please Try Again"));
    }
  } catch (error) {
    return res.status(500).send(response(false, message.catchMessage));
  }
};

exports.getFeedbackList = async (req, res) => {
  try {
    let feedbackLict = await userModel.getFeedbackList();
    if (feedbackLict.length > 0) {
      res.status(200).send({ success: true, msg: "Feedback List" });
    }
    return res.status(200).send(response(false, message.noDataMessage));
  } catch (error) {
    return res.status(500).send(response(false, message.catchMessage));
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    let deleteFeedback = await userModel.deleteFeedback(req.body.id);
    if (deleteFeedback) {
      return res.status(200).send({
        success: true,
        msg: "Feedback deleted",
      });
    } else {
      return res.status(200).send(response(false, message.noDataMessage));
    }
  } catch (error) {
    return res.status(500).send(response(false, error.message));
  }
};

exports.insertContentFeedbackMsg = async (req, res) => {
  try {
    let contentFeedback = await userModel.insertContentFeedbackMsg(
      req.body.contentFeedbackMsgId
    );
    if (contentFeedback) {
      res
        .status(200)
        .send({ success: true, msg: "Feedback Added Successfully!" });
    } else {
      return res
        .status(200)
        .send(response(false, "Something! Went Wrong Please Try Again"));
    }
  } catch (error) {
    return res.status(500).send(response(false, message.catchMessage));
  }
};

exports.getContentFeedbackMsg = async (req, res) => {
  try {
    let feedbackMsgList = await userModel.getContentFeedbackMsg();
    if (feedbackMsgList.length > 0) {
      res
        .status(200)
        .send({ success: true, msg: "Feedback List", feedbackMsgList });
    }
    return res.status(200).send(response(false, message.noDataMessage));
  } catch (error) {
    console.log(error);
    return res.status(500).send(response(false, message.catchMessage));
  }
};
