const { response, message } = require("../../utils/response");
const orderModel = require("../../Models/adminModel/orderModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const emailActivity = require("../userController/emailActivity.controller");
const productModel = require("../../Models/adminModel/productModel");
const { NotificationActivity } = require("./notificationController");

let pendingImage = "placed.png";
    let placedImage = "placed.png";
    let outForDeliveryImage = "outForDelivery.png";
    let proccesingImage = "returnd.png";
    let shippedImage = "shipped.png";
    let deliverdImage = "returnd.png";
    let returnPlacedImage = "return.png";
    let returnedimage = "returnd.png";
    let cancelPlacedImage = "return.png";
    let cancelledIamge = "returnd.png";
    let deliveyAddressIamge = "returnd.png";

    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

exports.getPromoCode = async (req, res) => {
  try {
    let promoCode = await orderModel.getPromoCodeList();
    if (promoCode.length > 0) {
      return res
        .status(200)
        .send({ success: true, msg: "Promo Code List", promoCode });
    }
    return res.status(200).send(response(false, message.noDataMessage));
  } catch (error) {
    console.log(error);
    return res.status(500).send(response(false, message.catchMessage));
  }
};

exports.insertPromoCode = async (req, res) => {
  try {
    let checkName = await orderModel.checkPromoCodeName(req.body.promoCode);
    if (checkName.length > 0) {
      return res.status(200).send(response(false, "Promocode already added"));
    }
    req.body.promoCode = req.body.promoCode.toUpperCase();
    let insertPromoCode = await orderModel.insertPromoCode(req.body);
    if (insertPromoCode) {
      return res
        .status(200)
        .send({ success: true, msg: "Promocode Added Successfully" });
    } else {
      return res
        .status(200)
        .send({
          success: false,
          msg: "Unable to Add Promocode Please Try Again!",
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(response(false, message.catchMessage));
  }
};

exports.updatePromoCode = async (req, res) => {
  try {
    let updatePromo = await orderModel.updatePromoCode(req.body);
    if (updatePromo) {
      return res
        .status(200)
        .send({ success: true, msg: "Promocode Updated Successfully" });
    } else {
      return res
        .status(200)
        .send({
          success: false,
          msg: "Unable to Update Promocode Please Try Again!",
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(response(false, message.catchMessage));
  }
};

exports.updatePromoCodeStatus = async (req, res) => {
  try {
    let updatePromoCodeStatus = await orderModel.updatePromoCodeStatus(
      req.body
    );
    if (updatePromoCodeStatus) {
      return res.status(200).send({ success: true, msg: "Success" });
    } else {
      return res
        .status(200)
        .send({
          success: false,
          msg: "Unable to Update Promocode Status, Please Try Again!",
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(response(false, message.catchMessage));
  }
};

exports.removePromocode = async (req, res) => {
  try {
    let updatePromoCodeStatus = await orderModel.deletePromocode(req.body.id);
    if (updatePromoCodeStatus) {
      return res.status(200).send({ success: true, msg: "Success" });
    } else {
      return res
        .status(200)
        .send({
          success: false,
          msg: "Unable to delete Promocode Status, Please Try Again!",
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(response(false, message.catchMessage));
  }
};
//-------------------------------|| ORDER ||-----------------------------------

exports.getOrderList = async (req, res) => {
  try {
    let orderList = await orderModel.getOrderList();
    if (orderList.length > 0) {
      return res
        .status(200)
        .send({ success: true, msg: "Order List", orderList: orderList.slice().reverse()  });
    }
    return res.status(200).send(response(false, message.noDataMessage));
  } catch (error) {
    return res.status(500).send(response(false, error.message));
  } 
};

exports.updateOrderStatusWithComment = async (req, res) => {
  try {
    let updateOrderStatusComment = await orderModel.updateOrderStatusComment(
      req.body
    );

    if (updateOrderStatusComment) {
      return res
        .status(200)
        .send({
          success: true,
          msg: "Success",
          data: updateOrderStatusComment,
        });
    } else {
      return res
        .status(200)
        .send({
          success: false,
          msg: "Unable to Update order Status, Please Try Again!",
        });
    }
  } catch (error) {
    return res.status(500).send(response(false, message.catchMessage));
  }
};



exports.updateOrderStatus = async (req, res) => {
  try {

  
    

    let orderInfo = await orderModel.getOrderDetailById(req.body.id);
    
    let userInfo = await orderModel.getUserDetailById(orderInfo[0]?.userId);
    let currency = orderInfo[0]?.currency;
    
    const deliveryDate = new Date(orderInfo[0].expDeliveryDate);

    const expDeliveryDate = deliveryDate.toLocaleDateString();
    
    const placedOn = new Date(orderInfo[0].dateTime);
    const dateTime = placedOn.toLocaleDateString();

    let processingDate = new Date();    


	

    if (orderInfo[0]?.status ==  7) {
      return res
			.status(200)
			.send({
			  success: false,
			  message: "Order in Pending Wait till Order Is Once Placed By User",
			});

    }



      if (req.body.status == 1 ) {

        
		if (orderInfo[0]?.status == req.body.status ) {
			return res
			.status(200)
			.send({
			  success: false,
			  message: "Order alredy in procecess",
			});
		}
    
    if (orderInfo[0]?.status ==  0) {

		let orderStatus = JSON.stringify([...orderInfo[0]?.orderStatus,{ status: "Order Processed On", date: formattedDate, image: proccesingImage}]);

        await orderModel.updateProcessingDate(req.body, processingDate,orderStatus);
		let updateOrderStatus = await orderModel.updateOrderStatus(req.body);

        if (userInfo[0]?.email.length > 0) {
          let mailmsg = ``;
          let headerMSG = `Your Order has been Proceed!`;
          let headerMSG1 = `<h3>Your order #${orderInfo[0].orderNumber} is under proceed!</h3>
			<p><strong>Order Placed On: </strong> ${dateTime}</p>`;

          let ans = await emailActivity.Activity(
            userInfo[0]?.email,
            "Order proceed (#" + orderInfo[0].orderNumber + ")",
            headerMSG,
            headerMSG1,
            mailmsg
          );

          let notificationDeatils = {
            notificationToAdmin: 0,
            notificationBy: req.userId,
            notificationTo: userInfo[0].id,
            message: "Your Order has been Proceed!",
            redirect_url: "orders",
            image:proccesingImage
          };
  
          await NotificationActivity(notificationDeatils);
        } else {
        }
        let notificationDeatils = {
          notificationToAdmin: 0,
          notificationBy: req.userId,
          notificationTo: userInfo[0].id,
          message: "Your Order has been Proceed!",
          redirect_url: "orders",
          image:proccesingImage
        };

        await NotificationActivity(notificationDeatils);
        return res
        .status(200)
        .send({
          success: true,
          message: "Your Order has been Proceed!",
        });

      }
     else {
        return res
        .status(200)
        .send({
          success: false,
          message: "You cannot process order once order is Proceesed Before",
        });
      }
     
    
    } 



	  else if (req.body.status == 2) {

      


        if (orderInfo[0]?.status == req.body.status) {
			return res
			.status(200)
			.send({
			  success: false,
			  message: "Order alredy shipped",
			});
		}

    if (orderInfo[0]?.status == 1) {
		
		 const shipDate = new Date(req.body?.data?.expDeliveryDate);
    const formattedshipDate = shipDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

		let orderStatus =JSON.stringify([...orderInfo[0]?.orderStatus,{status: "Order Shipped On", date: formattedshipDate, image: shippedImage}])
        await orderModel.updateShippedDate(req.body, processingDate,orderStatus);
		let updateOrderStatus = await orderModel.updateOrderStatus(req.body);

        if (userInfo[0].email.length > 0) {
          let mailmsg = ``;
          let headerMSG = `Your Order has been Shipped!`;
          let headerMSG1 = `<h3>Your order #${orderInfo[0].orderNumber} is shipped!</h3>
				<p><strong>Order Placed On: </strong> ${dateTime}</p>`;
          await emailActivity.Activity(
            userInfo[0].email,
            "Order Shipped (#" + orderInfo[0].orderNumber + ")",
            headerMSG,
            headerMSG1,
            mailmsg
          );
        } 
        else {
        }

        let notificationDeatils = {
          notificationToAdmin: 0,
          notificationBy: req.userId,
          notificationTo: userInfo[0].id,
          message: "Your Order has been Shipped!",
          redirect_url: "orders",
          image:shippedImage
        };

        await NotificationActivity(notificationDeatils);

        return res
        .status(200)
        .send({
          success: true,
          message: "Your Order has been Shipped!",
        });
      }

      else {
        return res
        .status(200)
        .send({
          success: false,
          message: "Order is not Prcocceed yet",
        });
      }
      } 
	  
	  else if (req.body.status == 3) {
	
		if (orderInfo[0]?.status == req.body.status) {
			return res
			.status(200)
			.send({
			  success: false,
			  message: "Order alredy in out for delivery",
			});
		}
		
    if (orderInfo[0]?.status == 2 ) {
      const expDate = new Date(req.body?.data?.expDeliveryDate);
      const formattedExpDate = expDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
			
		let orderStatus =JSON.stringify([...orderInfo[0]?.orderStatus,{status: "Order Out for delivery On", date: formattedExpDate, image: outForDeliveryImage}])
      
    
    await orderModel.outFordelivaryDate(req.body, processingDate,orderStatus);
		let updateOrderStatus = await orderModel.updateOrderStatus(req.body);

        if (userInfo[0].email.length > 0) {
          let mailmsg = ``;
          let headerMSG = `Your Order has been Out For Delivery`;
          let headerMSG1 = `<h3>Your order #${orderInfo[0].orderNumber} is out for delivery!</h3>
			    <p><strong>Tracking ID/URL: </strong><a href=${orderInfo[0].tracking_Url_Id} target="_blank"> ${orderInfo[0].tracking_Url_Id}<a/></p>
				<p><strong>Delivery Partner: </strong> ${orderInfo[0].deliveryPartner}</p>
			    <p><strong>Expected Delivery Date: </strong> ${expDeliveryDate}</p>
				<p><strong>Order Placed On: </strong> ${dateTime}</p>`;
          await emailActivity.Activity(
            userInfo[0].email,
            "Order out for delivery (#" + orderInfo[0].orderNumber + ")",
            headerMSG,
            headerMSG1,
            mailmsg
          );

          let notificationDeatils = {
            notificationToAdmin: 0,
            notificationBy: req.userId,
            notificationTo: userInfo[0].id,
            message: "Your Order has been Out For Delivery!",
            redirect_url: "orders",
            image:outForDeliveryImage
          };
  
          await NotificationActivity(notificationDeatils);
          return res
          .status(200)
          .send({
            success: true,
            message: "Your Order has been Out For Delivery!",
          });
        } else {

        }

        let notificationDeatils = {
          notificationToAdmin: 0,
          notificationBy: req.userId,
          notificationTo: userInfo[0].id,
          message: "Your Order has been Out For Delivery!",
          redirect_url: "orders",
          image:outForDeliveryImage
        };

        await NotificationActivity(notificationDeatils);
        return res
        .status(200)
        .send({
          success: true,
          message: "Your Order has been Out For Delivery!",
        });
        
      }
        else {
          return res
        .status(200)
        .send({
          success: false,
          message: "Order is not shipped yet",
        });
      }
      } 
	  
	  else if (req.body.status == 4) {
	
		if (orderInfo[0]?.status == req.body.status) {
			return res
			.status(200)
			.send({
			  success: false,
			  message: "Order alredy delivered",
			});
		}


    if (orderInfo[0]?.status == 3) {
      
		
		let updateOrderStatus = await orderModel.updateOrderStatus(req.body);

		let orderStatus =JSON.stringify([...orderInfo[0]?.orderStatus,{status: "Order Delivered On", date: formattedDate, image: deliverdImage}])
      
   
    await orderModel.deliveredDate(req.body, processingDate,orderStatus);

        if (userInfo[0].email.length > 0) {
          let mailmsg = ``;
          let headerMSG = `Your Order has been Delivered`;
          let headerMSG1 = `<h3>Your order #${orderInfo[0].orderNumber} is Delivered!</h3>
			    <p><strong>Tracking ID/URL: </strong><a href=${orderInfo[0].tracking_Url_Id} target="_blank"> ${orderInfo[0].tracking_Url_Id}<a/></p>
				<p><strong>Delivery Partner: </strong> ${orderInfo[0].deliveryPartner}</p>
				<p><strong>Order Placed On: </strong> ${dateTime}</p>`;
          await emailActivity.Activity(
            userInfo[0].email,
            "Order Delivered (#" + orderInfo[0].orderNumber + ")",
            headerMSG,
            headerMSG1,
            mailmsg
          );
          let notificationDeatils = {
            notificationToAdmin: 0,
            notificationBy: req.userId,
            notificationTo: userInfo[0].id,
            message: "Your Order has been Delivered!",
            redirect_url: "orders",
            image:deliverdImage
          };
  
          await NotificationActivity(notificationDeatils);
        } else {
        }
        let notificationDeatils = {
          notificationToAdmin: 0,
          notificationBy: req.userId,
          notificationTo: userInfo[0].id,
          message: "Your Order has been Delivered!",
          redirect_url: "orders",
          image:deliverdImage
        };

        await NotificationActivity(notificationDeatils);
        return res
        .status(200)
        .send({
          success: true,
          message: "Your Order has been Delivered!",
        });
        
      }
      else	
      {
        return res
			.status(200)
			.send({
			  success: false,
			  message: "Order is not out for delivery yet",
			});
		}
      }


      return res.status(200).send({ success: true, msg: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(response(false, message.catchMessage));
  }
};

exports.getCancelAndReturnList = async (req, res) => {
  try {
    let orderList = await orderModel.getCancelAndReturnList();
    if (orderList.length > 0) {
      return res
        .status(200)
        .send({
          success: true,
          msg: "Cancel and return Order List",
          orderList,
        });
    }
    return res.status(200).send(response(false, message.noDataMessage));
  } catch (error) {
    console.log(error);
    
    return res.status(500).send(response(false, message.catchMessage));
  }
};

exports.getCancelAndReturnDetailById = async (req, res) => {
  try {
    let orderList = await orderModel.getCancelAndReturnDetailById(req.query.id);
    
    if (orderList.length > 0) {
      return res
        .status(200)
        .send({
          success: true,
          msg: "Cancel and return Order List",
          orderList,
        });
    }
    return res.status(200).send(response(false, message.noDataMessage));
  } catch (error) {
    console.log(error,"from error");
    
    return res.status(500).send(response(false, error.message));
    return res.status(500).send(response(false, message.catchMessage));
  }
};

// exports.updateCancelAndReturnStatus = async (req, res) => {
//   try {

//     let orderInfo = await orderModel.getOrderDetailById(req.body.id);
   
    
//     if (orderInfo[0].paymentStatus == 0) {

//       let orderItemInfo = await orderModel.getOrderItemDetailById(req.body.id);
//       let userInfo = await orderModel.getUserDetailById(orderInfo[0].userId);
  
//       let currency = orderInfo[0].currency;
//       let msg = "";
//       let refundedAmount = req.body.refundedAmount;
//       let deductionDetail = req.body.deductionDetail;

//         if (req.body.status == 1) {
  
//            if (orderItemInfo[0].sizeId) {
//             let productSizeInfo = await productModel.getProductSizeInfo(
//               orderItemInfo[0].productId,
//               orderItemInfo[0].sizeId
//             );
//             let reqData = {
//               quantity: productSizeInfo[0].quantity + orderItemInfo[0].quantity,
//             };
//             await productModel.updateProductQuantityOnSize(
//               reqData,
//               orderItemInfo[0].productId,
//               orderItemInfo[0].sizeId
//             );
//           }



//           let reqData = {
//             productQuantity:
//               orderItemInfo[0].productQuantity + orderItemInfo[0].quantity,
//           };

//           await productModel.updateProductQuantity(
//             reqData,
//             orderItemInfo[0].productId
//           );


//        if(userInfo[0].email){
//           let mailmsg = ``;
//           let headerMSG = `Refund Initiated successfully `;
//           let headerMSG1 = `<h3>Your Return Request for Order #${orderInfo[0].orderNumber} is Approved and a refund has been initiated!</h3>
//           <p> The Refund amount will be transferred to your same payment method within 5 to 10 business days!</p>
//           <p><strong>Refund order details:</strong></p>
//              <p><strong>Product Name: </strong> ${orderItemInfo[0].productName}</p>
//              <p><strong>Amount: </strong> ${refundedAmount} ${currency}</p>
//          <p><strong>Deduction: </strong> ${deductionDetail}</p>
  
//              <p><strong>Your Reason: </strong> ${orderItemInfo[0].cancelAndReturn_reson}</p>`;
//           await emailActivity.Activity(
//             userInfo[0].email,
//             "Refund Initiated Successfully (#" + orderInfo[0].orderNumber + ")",
//             headerMSG,
//             headerMSG1,
//             mailmsg
//           );
//         }

//         else{

//         }


//       }
//          else {
//           return res
//             .status(200)
//             .send({
//               success: false,
//               msg: "Refund failed due to server error. Please try again!",
//             });
//         }

//         msg = "Refund request has been approved!";
//       }
    
//        else if (req.body.status == 2) {
//         let mailmsg = ``;
//         let headerMSG = `Refund Rejected`;
//         let headerMSG1 = `<h3>Your Return Request for Order #${orderInfo[0].orderNumber} is Rejected!</h3>
//           <p><strong>Refund reject order details:</strong></p>
//              <p><strong>Product Name: </strong> ${orderItemInfo[0].productName}</p>
//              <p><strong>Amount: </strong> ${refundedAmount} ${currency}</p>
//              <p><strong>Your Reason: </strong> ${orderItemInfo[0].cancelAndReturn_reson}</p>`;
//         await emailActivity.Activity(
//           userInfo[0].email,
//           "Refund Rejected (#" + orderInfo[0].orderNumber + ")",
//           headerMSG,
//           headerMSG1,
//           mailmsg
//         );
//         msg = "Refund request has been rejected!";
//       } 
//       else {
//         return res
//           .status(200)
//           .send({ success: false, msg: "Invalid request. Please try again!" });
//       }


  
//       let updateStatus = await orderModel.updateCancelAndReturnStatus(req.body);
  
//       if (updateStatus) {
//         return res.status(200).send({ success: true, msg: msg });
//       } 
      
//       else {
//         return res
//           .status(200)
//           .send({
//             success: false,
//             msg: "Unable to Update order cancel and return Status, Please Try Again!",
//           });
//       }
  
//     }
  
//     else{


//     let orderItemInfo = await orderModel.getOrderItemDetailById(req.body.id);
//     let userInfo = await orderModel.getUserDetailById(orderInfo[0].userId);

//     let currency = orderInfo[0].currency;
//     let msg = "";
//     let refundedAmount = req.body.refundedAmount;
//     let deductionDetail = req.body.deductionDetail;
//     if (req.body.status == 1) {

//       if (!orderInfo[0].payment_intend_id) {
//         return res
//           .status(400)
//           .send({
//             success: false,
//             msg: "Payment intent is missing for the order!",
//           });
//       }

//       const refund = await stripe.refunds.create({
//         payment_intent: orderInfo[0].payment_intend_id,
//         amount: refundedAmount * 100,
//         // amount: orderItemInfo[0].price * 100,
//       });

//       if (refund.status == "succeeded") {
//         if (orderItemInfo[0].sizeId) {
//           let productSizeInfo = await productModel.getProductSizeInfo(
//             orderItemInfo[0].productId,
//             orderItemInfo[0].sizeId
//           );
//           let reqData = {
//             quantity: productSizeInfo[0].quantity + orderItemInfo[0].quantity,
//           };
//           await productModel.updateProductQuantityOnSize(
//             reqData,
//             orderItemInfo[0].productId,
//             orderItemInfo[0].sizeId
//           );
//         }
//         let reqData = {
//           productQuantity:
//             orderItemInfo[0].productQuantity + orderItemInfo[0].quantity,
//         };
//         await productModel.updateProductQuantity(
//           reqData,
//           orderItemInfo[0].productId
//         );
//         let mailmsg = ``;
//         let headerMSG = `Refund Initiated successfully `;
//         let headerMSG1 = `<h3>Your Return Request for Order #${orderInfo[0].orderNumber} is Approved and a refund has been initiated!</h3>
// 				<p> The Refund amount will be transferred to your same payment method within 5 to 10 business days!</p>
// 				<p><strong>Refund order details:</strong></p>
//            <p><strong>Product Name: </strong> ${orderItemInfo[0].productName}</p>
//            <p><strong>Amount: </strong> ${refundedAmount} ${currency}</p>
// 		   <p><strong>Deduction: </strong> ${deductionDetail}</p>

// 					 <p><strong>Your Reason: </strong> ${orderItemInfo[0].cancelAndReturn_reson}</p>`;
//         await emailActivity.Activity(
//           userInfo[0].email,
//           "Refund Initiated Successfully (#" + orderInfo[0].orderNumber + ")",
//           headerMSG,
//           headerMSG1,
//           mailmsg
//         );

//       } else {
//         return res
//           .status(200)
//           .send({
//             success: false,
//             msg: "Refund failed due to server error. Please try again!",
//           });
//       }
//       msg = "Refund request has been approved!";
//     }
//      else if (req.body.status == 2) {
//       let mailmsg = ``;
//       let headerMSG = `Refund Rejected`;
//       let headerMSG1 = `<h3>Your Return Request for Order #${orderInfo[0].orderNumber} is Rejected!</h3>
// 				<p><strong>Refund reject order details:</strong></p>
//            <p><strong>Product Name: </strong> ${orderItemInfo[0].productName}</p>
//            <p><strong>Amount: </strong> ${refundedAmount} ${currency}</p>
// 					 <p><strong>Your Reason: </strong> ${orderItemInfo[0].cancelAndReturn_reson}</p>`;
//       await emailActivity.Activity(
//         userInfo[0].email,
//         "Refund Rejected (#" + orderInfo[0].orderNumber + ")",
//         headerMSG,
//         headerMSG1,
//         mailmsg
//       );
//       msg = "Refund request has been rejected!";
//     } else {
//       return res
//         .status(200)
//         .send({ success: false, msg: "Invalid request. Please try again!" });
//     }

//     let updateStatus = await orderModel.updateCancelAndReturnStatus(req.body);

//     if (updateStatus) {
//       return res.status(200).send({ success: true, msg: msg });
//     } 
    
//     else {
//       return res
//         .status(200)
//         .send({
//           success: false,
//           msg: "Unable to Update order cancel and return Status, Please Try Again!",
//         });
//     }

//   }

//   } catch (error) {
//     console.log(error.message);
//     return res.status(500).send(response(false, message.catchMessage));
//   }
// };


exports.updateCancelAndReturnStatus = async (req, res) => {
  try {
    const orderInfo = await orderModel.getOrderDetailById(req.body.id);


    const paymentStatus = orderInfo[0]?.paymentStatus;

    if (paymentStatus == 0) {
      await processRefundWithoutPayment(req, res, orderInfo);
    } else {
      await processRefundWithPayment(req, res, orderInfo);
    }

  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      success: false,
      msg: "An error occurred. Please try again."
    });
  }
};

const processRefundWithoutPayment = async (req, res, orderInfo) => {
  const orderItemInfo = await orderModel.getOrderItemDetailById(req.body.id);
  const userInfo = await orderModel.getUserDetailById(orderInfo[0].userId);

  const currency = orderInfo[0].currency;
  const refundedAmount = req.body.refundedAmount;
  const deductionDetail = req.body.deductionDetail;

  if (req.body.status == 1) {
    await handleRefundApproval(req, res, orderInfo, orderItemInfo, userInfo, refundedAmount, deductionDetail, currency);
  } else if (req.body.status == 2) {
    await handleRefundRejection(req, res, orderInfo, orderItemInfo, userInfo, refundedAmount, deductionDetail, currency);
  } else {
    return res.status(400).send({ success: false, msg: "Invalid request. Please try again!" });
  }
};

const processRefundWithPayment = async (req, res, orderInfo) => {
  const orderItemInfo = await orderModel.getOrderItemDetailById(req.body.id);
  const userInfo = await orderModel.getUserDetailById(orderInfo[0].userId);

  const refundedAmount = req.body.refundedAmount;
  const deductionDetail = req.body.deductionDetail;
  const currency = orderInfo[0].currency;

  if (req.body.status == 1) {
    if (!orderInfo[0].payment_intend_id) {
      return res.status(400).send({ success: false, msg: "Payment intent is missing for the order!" });
    }

    const refund = await stripe.refunds.create({
      payment_intent: orderInfo[0].payment_intend_id,
      amount: refundedAmount * 100,
    });

    if (refund.status == "succeeded") {
      await updateProductQuantities(orderItemInfo);
      await sendRefundApprovalEmail(orderInfo, orderItemInfo, userInfo, refundedAmount, deductionDetail, currency);
    } else {
      return res.status(500).send({ success: false, msg: "Refund failed. Please try again." });
    }

    let msg = "Refund proccesed succesfully!";
    await finalizeStatusUpdate(req, res, msg,orderInfo);
  } else if (req.body.status == 2) {
    await handleRefundRejection(req, res, orderInfo, orderItemInfo, userInfo, refundedAmount, deductionDetail, currency);
  } else {
    return res.status(400).send({ success: false, msg: "Invalid request. Please try again!" });
  }
};

const updateProductQuantities = async (orderItemInfo) => {
  if (orderItemInfo[0].sizeId) {
    const productSizeInfo = await productModel.getProductSizeInfo(orderItemInfo[0].productId, orderItemInfo[0].sizeId);
    let reqData = { quantity: productSizeInfo[0].quantity + orderItemInfo[0].quantity };
    await productModel.updateProductQuantityOnSize(reqData, orderItemInfo[0].productId, orderItemInfo[0].sizeId);
  }

  let reqData = { productQuantity: orderItemInfo[0].productQuantity + orderItemInfo[0].quantity };
  await productModel.updateProductQuantity(reqData, orderItemInfo[0].productId);
};

const handleRefundApproval = async (req, res, orderInfo, orderItemInfo, userInfo, refundedAmount, deductionDetail, currency) => {
  await updateProductQuantities(orderItemInfo);


  await sendRefundApprovalEmail(orderInfo, orderItemInfo, userInfo, refundedAmount, deductionDetail, currency);

  let msg = "Refund proccesed succesfully!!";
  await finalizeStatusUpdate(req, res, msg,orderInfo);
};

const handleRefundRejection = async (req, res, orderInfo, orderItemInfo, userInfo, refundedAmount, deductionDetail, currency) => {
 
  let headerMSG1 = `<h3>Your Return Request for Order #${orderInfo[0].orderNumber} is Rejected!</h3>
    <p><strong>Refund reject order details:</strong></p>
    <p><strong>Product Name: </strong> ${orderItemInfo[0].productName}</p>
    <p><strong>Amount: </strong> ${refundedAmount} ${currency}</p>
    <p><strong>Your Reason: </strong> ${orderItemInfo[0].cancelAndReturn_reson}</p>`;



  await emailActivity.Activity(
    userInfo[0].email,
    `Refund Rejected (#${orderInfo[0].orderNumber})`,
    "Refund Rejected",
    headerMSG1,
    ""
  );


  let msg = "Refund request has been rejected!";
  await finalizeStatusUpdate(req, res, msg,orderInfo);
};

const sendRefundApprovalEmail = async (orderInfo, orderItemInfo, userInfo, refundedAmount, deductionDetail, currency) => {
  let headerMSG1 = `<h3>Your Return Request for Order #${orderInfo[0].orderNumber} is Approved and a refund has been initiated!</h3>
    <p>The refund amount will be transferred to your payment method within 5 to 10 business days.</p>
    <p><strong>Refund order details:</strong></p>
    <p><strong>Product Name: </strong> ${orderItemInfo[0].productName}</p>
    <p><strong>Amount: </strong> ${refundedAmount} ${currency}</p>
    <p><strong>Deduction: </strong> ${deductionDetail}</p>
    <p><strong>Your Reason: </strong> ${orderItemInfo[0].cancelAndReturn_reson}</p>`;

if(userInfo[0].email){
  await emailActivity.Activity(
    userInfo[0].email,
    `Refund Initiated Successfully (#${orderInfo[0].orderNumber})`,
    "Refund Initiated Successfully",
    headerMSG1,
    ""
  );
}
else{

}
};

const finalizeStatusUpdate = async (req, res, msg,orderInfo) => {

  let orderFor;
  if(orderInfo[0].status ==5){orderFor ="Cancel"}
    else{orderFor ="Return"}
     
      let orderStatus = JSON.stringify([...orderInfo[0]?.orderStatus,{ status: `Order ${orderFor } successfully`, date: formattedDate, image: proccesingImage}]);
  

  const updateStatus = await orderModel.updateCancelAndReturnStatus(req.body,orderStatus);

  if (updateStatus) {
    return res.status(200).send({ success: true, msg });
  } else {
    return res.status(500).send({
      success: false,
      msg: "Unable to update order cancel and return status. Please try again!"
    });
  }
};



exports.updateOrderStatusToReject = async (req, res) => {
  try {

    let orderInfo = await orderModel.getOrderDetailById(req.body.id);

    let orderFor;
if(orderInfo[0].status ==5){orderFor ="Cancel"}
  else{orderFor ="Return"}
   
    let orderStatus = JSON.stringify([...orderInfo[0]?.orderStatus,{ status: `${orderFor } Request Rejected`, date: formattedDate, image: proccesingImage}]);

    // let updateCancelReason = await orderModel.updateOrderStatusByAdmin(
    //   req.body,orderStatus
    // );
    let updateCancelReason = await orderModel.updateOrderStatusToReject(
      req.body,orderStatus
    );
    if (updateCancelReason) {
      return res.status(200).send({ success: true, msg: "Success" });
    } else {
      return res
        .status(200)
        .send({
          success: false,
          msg: "Unable to reject order, Please Try Again!",
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(response(false, message.catchMessage));
  }
};


exports.updateOrderStatusByAdmin = async (req, res) => {
  try {

    
    let orderInfo = await orderModel.getOrderDetailById(req.body.id);

    let orderFor;
if(orderInfo[0].status ==5){orderFor ="Cancel"}
  else{orderFor ="Return"}
   
    let orderStatus = JSON.stringify([...orderInfo[0]?.orderStatus,{ status: `${orderFor } Request Accepted`, date: formattedDate, image: proccesingImage}]);

    let updateCancelReason = await orderModel.updateOrderStatusByAdmin(
      req.body,orderStatus
    );

    if (updateCancelReason) {
      return res.status(200).send({ success: true, msg: "Success" });
    } else {
      return res
        .status(200)
        .send({
          success: false,
          msg: "Unable to reject order, Please Try Again!",
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(response(false, message.catchMessage));
  }
};

exports.getOrderDetailsById = async (req, res) => {
  try {

    let orderId = req.query.orderId;

    let id = parseInt(orderId);
    let orderDetail = await orderModel.getOrderDetailsById(id);


    if (orderDetail.length > 0) {
      return res
        .status(200)
        .send({ success: true, msg: "Order detail", data: orderDetail });
    }
    return res.status(200).send(response(false, message.noDataMessage));
  } catch (error) {
    console.log(error);
    return res.status(500).send(response(false, error.message));
  }
};

exports.updateCancelReason = async (req, res) => {
  try {
    let updateCancelReason = await orderModel.updateCancelReason(req.body);
    if (updateCancelReason) {
      return res.status(200).send({ success: true, msg: "Success" });
    } else {
      return res
        .status(200)
        .send({
          success: false,
          msg: "Unable to update cancel reason, Please Try Again!",
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(response(false, message.catchMessage));
  }
};

exports.cancelThisOrder = async (req, res) => {
  try {

    let orderDetail = await orderModel.getOrderDetailByOrderId(
      req.body.orderId
    );

    if (orderDetail) {
      let itemDto={
        userId:orderDetail[0].userId,
        orderItemId:req.body.orderItemId
      }

      let orderItemDetail = await orderModel.getOrderItemDetailByItemId(itemDto)

        let orderStatus =JSON.stringify([...orderItemDetail[0]?.orderStatus,{status: "Order Cancelled On", date: formattedDate, image: cancelPlacedImage}])


      // let result = await orderModel.cancelThisOrder(req.body,orderStatus);

    let userInfo = await orderModel.getUserDetailById(orderDetail[0].userId);

    if (orderDetail) {

      let dataDto={
        orderItemId:req.body.orderItemId,
        cancelAndReturn_reson:req.body.cancelAndReturn_reson
      }
      let result = await orderModel.cancelThisOrder(dataDto,orderStatus);

      await orderModel.insertCancelReason(orderDetail[0].userId, req.body);

      if (result) {
        let mailmsg = ``;
        let headerMSG = `Order Cancelled`;
        let headerMSG1 = `<h3>Your Order #${orderDetail[0].orderNumber} has been Cancelled</h3>`;

        if(userInfo[0].email){
        await emailActivity.Activity(
          userInfo[0].email,
          "Order #" + orderDetail[0].orderNumber + " Cancel Request Submitted!",
          headerMSG,
          headerMSG1,
          mailmsg
        );
      } 

        return res
          .status(200)
          .send({
            success: true,
            msg: "Order cancel request submitted successfully!",
          });
      } else {
        return res
          .status(200)
          .send({ success: false, msg: "Internal server error!" });
      }
    } else {
      return res.status(200).send(response(false, "Invalid request!"));
    }
  }
  } catch (error) {
    console.log(error);
    return res.status(500).send(response(false, error.message));
  }
};

exports.getSupplierList = async (req, res) => {
  try {
    let supplierList = await orderModel.getSupplierList();
    if (supplierList.length > 0) {
      return res
        .status(200)
        .send({ success: true, msg: "Supplier list", supplierList });
    }
    return res.status(200).send(response(false, message.noDataMessage));
  } catch (error) {
    return res.status(500).send(response(false, error.message));
  }
};

exports.getSupplierListById = async (req, res) => {
  try {
    let supplierList = await orderModel.getSupplierListById(req.query.id);
    if (supplierList.length > 0) {
      return res
        .status(200)
        .send({ success: true, msg: "Supplier list", supplierList });
    }
    return res.status(200).send(response(false, message.noDataMessage));
  } catch (error) {
    return res.status(500).send(response(false, error.message));
  }
};

exports.updateSupplierDetail = async (req, res) => {
  try {
    let updateSupplier = await orderModel.updateSupplierDetail(req.body);
    if (updateSupplier) {
      return res.status(200).send({ success: true, msg: "Success" });
    } else {
      return res
        .status(200)
        .send({
          success: false,
          msg: "Unable to update supplier detail Please Try Again!",
        });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(response(false, message.catchMessage));
  }
};
