const { response, message } = require("../../utils/response");
const orderModel = require('../../Models/userModel/orderModel')
const Razorpay = require('razorpay')
dotenv = require('dotenv');
dotenv.config();
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;


const emailActivity = require("./emailActivity.controller");
// const stripe = require('stripe')(STRIPE_SECRET_KEY);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

  let pendingImage="placed.png";
  let placedImage= "placed.png";
  let outForDeliveryImage="outForDelivery.png";
  let proccesingImage = "returnd.png";
  let shippedImage ="shipped.png";
  let deliverdImage ="returnd.png";
  let returnPlacedImage ="return.png";
  let returnedimage ="returnd.png";
  let cancelPlacedImage = "return.png";
  let cancelledIamge ="returnd.png";
  let deliveyAddressIamge ="returnd.png";

  const date = new Date();
      const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  

const puppeteer = require('puppeteer');
const moment = require('moment');
const { geAddressListById } = require("../../Models/userModel/addressModel");
const cartModel = require("../../Models/userModel/cartModel");
const { NotificationActivity } = require("./notification.controller");
const registerModel = require("../../Models/userModel/registerModel");

async function createPDF(orderId, userId,insertId) {

  let req = {
    user_id: userId,
    orderId: orderId
  }
  let orderDetail = await orderModel.getOrderDetailsById(req)

  let invoiceNo = Date.now().toString() + Math.floor(Math.random() * 90 + 10)


  // let supplierDetail = await orderModel.getSupplierList(); 
  let orderData = orderDetail[0];

  
  
  let addressDataArr = orderData?.deliveryAddress?.split(",");
  let address = addressDataArr[1] + "," + addressDataArr[2] + "," + addressDataArr[3] + "," + addressDataArr[4] + "," + addressDataArr[5] + "," + addressDataArr[6];
  let htmlContent = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Apurva Electiclas Invoice</title>
    </head>
  
    <body>
      <div style="padding: 10px">
        <table style="width: 100%">
          <tr style="width: 100%">
            <td style="width: 50%">
              <label style="font-size: 25px; font-weight: bold"
               >INV-`+ invoiceNo + `</label
              >
            </td>
            <td style="width: 50%; text-align: right">
              <img
                style="max-width: 200px"
                src="../../public/apurvalogo.png"
              />
            </td>
          </tr>
        </table>
        <br />
        <table style="width: 100%; margin: 10px 0px">
          <tr style="width: 100%">
            <td style="width: 33%; line-height: 25px">
              <label>From</label><br />
              <label style="font-weight: bold; font-size: 20px">Apurva Electricals</label>
              <br />
              Indore Madhya Pardesh<br />
              Location is here<br />
             
            </td>
            <td style="width: 33%; line-height: 25px">
              <label>To</label><br />
              <label style="font-weight: bold; font-size: 20px"
                >`+ addressDataArr[0] + `</label
              ><br />
              `+ address + `<br />
              
            </td>
            <td style="width: 33%; margin: auto">
              <span
                style="
                  background: #e1e1e1;
                  font-size: 30px;
                  font-weight: bold;
                  padding: 10px;
                  color: green;
                  float:right
                "
              >
                `+ (orderData?.paymentStatus == 0 ? 'PENDING' : orderData?.paymentStatus == 1 ? 'PAID' : orderData.paymentStatus == 2 ? 'Cancelled' :orderData.paymentStatus == 3 ? 'COD' : '-') + `</span
              >
            </td>
          </tr>
        </table>
        <br />
        <table style="width: 100%;">
          <tr style="background-color: #343a40 !important; color: white">
            <th style="width: 35%; padding:8px">Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
          `;
  let subTotal = 0;
  let deliveryAmount = orderData.deliveryAmount || 0;
  orderData?.orderitems?.map((item) => {
    let itemTotal = Math.trunc(item.price * item.quantity);
    htmlContent += `<tr style="padding: 10px;">
            <td  style="padding: 10px;">`+ item?.itemName + ` ` + (item?.size ? '(' + item?.size + ')' : "") + `</td>
            <td>`+ item?.price + ' ' + item?.currency + `</td>
            <td>`+ item?.quantity + `</td>
            <td>`+ itemTotal + ' ' + item?.currency + `</td>
          </tr>`;
    subTotal = parseInt(subTotal) + parseInt(itemTotal);
  })

  let promoCodeAmount = 0;
  let taxAmount = 0;
  if (orderData.promoCodeDiscount || orderData.promoCodeDiscount > 0) {
    promoCodeAmount = Math.trunc((subTotal * orderData.promoCodeDiscount) / 100);
  }
  if (orderData.tax_per || orderData.tax_per > 0) {
    taxAmount = Math.trunc((subTotal * orderData.tax_per) / 100);
  }
  let totalAmount = (parseInt(subTotal) + parseInt(deliveryAmount) + parseInt(taxAmount)) - promoCodeAmount;

  htmlContent += `</table>
        <br>
        <hr />
        <br>
        <table style="width: 100%; position: fixed;">
          <tr style="width: 100%">
            <td style="width: 50%"></td>
            <td style="width: 25%; padding: 5px;">Sub Total : </td>
            <td style="width: 20%">`+ subTotal + ' ' + orderData?.currency + `</td>
            <td style="width: 5%"></td>
          </tr>
          <tr style="width: 100%">
            <td style="width: 50%"></td>
            <td style="width: 25%; padding: 5px;">Delivery Charge : </td>
            <td style="width: 20%">`+ deliveryAmount + ' ' + orderData?.currency + `</td>
            <td style="width: 5%"></td>
          </tr>
          <tr style="width: 100%">
            <td style="width: 50%"></td>
            <td style="width: 25%; padding: 5px;">Tax(`+ orderData?.tax_per + `%) : </td>
            <td style="width: 20%">`+ taxAmount + ' ' + orderData?.currency + `</td>
            <td style="width: 5%"></td>
          </tr>
          <tr style="width: 100%">
            <td style="width: 50%"></td>
            <td style="width: 25%; padding: 5px;">Discount `+ (orderData?.promoCodeDiscount ? '(' + orderData?.promoCodeDiscount + '%)' : '') + ` : </td>
            <td style="width: 20%">`+ promoCodeAmount + ' ' + orderData?.currency + `</td>
            <td style="width: 5%"></td>
          </tr>
          <tr style="width: 100%; color: green;">
            <td style="width: 50%"></td>
            <td style="width: 25%; padding: 5px;">Total : </td>
            <td style="width: 20%">`+ totalAmount + ' ' + orderData?.currency + `</td>
            <td style="width: 5%"></td>
          </tr>
        </table>
      </div>
    </body>
  </html>
  `;


  generatePDFfromHTML(htmlContent, './public/invoices/' + invoiceNo + '.pdf')

    .then(async () => {
      console.log('PDF generated successfully');
      let attechment = {
        fileName: invoiceNo + '.pdf',
        filePath: './public/invoices/' + invoiceNo + '.pdf'
      }

      let insertPdf = await orderModel.insertInvoice(insertId,attechment.fileName)
      let mailmsg = ``;
      let headerMSG = `Order Placed`;
      let headerMSG1 = `
             <h3>Your Order #${orderData.orderNumber} Placed Successfully!</h3>
             <p>Please find order invoice in attechment!</p>`;
      let mail = await emailActivity.Activity(
        orderData.email,
        "Order #" + orderData.orderNumber + " Placed!",
        headerMSG,
        headerMSG1,
        mailmsg,
        attechment
      );
    })
    .catch(err => console.error('Error generating PDF:', err));
}

async function generatePDFfromHTML(htmlContent, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  await page.pdf({ path: outputPath, format: 'A4' });
  await browser.close();
}


// Payment intend
exports.paymentIntent = async (req, res) => {
  try {
    let amt = req.body.amount;
    let currency = req.body.currency.toLowerCase();
   
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amt * 100,
      currency: currency,
      // payment_method: 'pm_card_visa',
      description: 'For your   order payment',
      shipping: {
        name: 'Jenny Rosen',
        address: {
          line1: '510 Townsend St',
          postal_code: '98140',
          city: 'San Francisco',
          state: 'CA',
          country: 'US',
        },
      },
    });
    let client_secret = Buffer.from(paymentIntent.client_secret).toString('base64');

    return res.status(200).send({
      success: true,
      msg: "Payment Intented!",
      secret: client_secret,
    });
  } catch (err) {
    return res.status(200).send({
      success: false,
      msg: "Error occured! Please try again!",
      error: err,
    });
  }
};


//---------------------------|| INSERT ORDER ||------------------------------------

exports.insertOrderDetail = async (req, res) => {
  try {
    let data = req.body;
  let orderNumber = Date.now().toString() + Math.floor(Math.random() * 90 + 10)
        let orderDetails = await geAddressListById(req.body.deliveryAddressId) 

       let userInfo =  await registerModel.getUserDetails(req.userId);
        let discountAmount;
        let promoCode;

        if( req.body.promoCodeId){

          let promoCodeDetails =  await orderModel.getPrmocodesById ( req.body.promoCodeId);

   

    if(promoCodeDetails[0]?.discount !=undefined){
   
      
      discountAmount = promoCodeDetails[0]?.discount
      promoCode= promoCodeDetails[0]?.promoCode
    }
    else{
      discountAmount=0;
      promoCode=null
    }
    
          
        }
        else{
          discountAmount=0;
          promoCode=null
        }

         // setting up options for razorpay order.
         const options = {
          amount: Math.round(req.body.finalPayableAmount * 100), // Convert to paise if using INR
          currency: "INR",
          receipt: orderNumber,
          payment_capture: 1
      };
      

      const response = await razorpay.orders.create(options)

      const razorPayDetails={
          order_id: response.id,
          currency: response.currency,
          amount: response.amount,
      }


      // Razor pay
    if(data.paymentMethod == "card"){

       let reqData = {
    totalAmount: req.body.totalAmount,
    finalPayableAmount: req.body.finalPayableAmount,
    promoCodeId: req.body.promoCodeId,
    promoCode:promoCode,
    deliveryAddressId: req.body.deliveryAddressId,
    deliveryAddress:orderDetails[0]?.address,
    paymentMethod: req.body.paymentMethod,
    orderNumber: orderNumber,
    userId: req.userId,
    paymentId:razorPayDetails.order_id, 
    paymentAmount:razorPayDetails.amount,
    paymentCurrency:razorPayDetails.currency,
    paymentStatus:0,
    status:7,
    pendingReason:"payment pending",
   
  }

  const insertOrder = await orderModel.insertOrderDetail(reqData);

  const orderId = insertOrder.insertId;

  if (insertOrder) {
    const item = data.item
    let insertId
    let itemId=[]

    for (let i = 0; i < item.length; i++) {

      const date = new Date();
      const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      
      let singleItem = {
        orderId: orderId,
        productId: item[i].productId,
        sizeId: item[i].sizeId,
        quantity: item[i].quantity,
        userId: req.userId,
        cartNumber: Date.now().toString() + Math.floor(Math.random() * 90 + 10),
        status: 7,
        pendingRemark: req.body.reason || "payment pending",
        pendingDate: new Date(),
        orderStatus: JSON.stringify([{status: "Order Pending", date: formattedDate, image: pendingImage, remark: "Payment is Pending"}])
    };
    
    // Now, you can use this object to insert into the database
    
      // Apply discount only to the first item
      if (i === 0) {
     
        
        
          singleItem.price = item[i].buyPrice - discountAmount; // Apply discount
      } else {
          singleItem.price = item[i].buyPrice; // Keep price unchanged for other items
      }

      const insertorderitems = await orderModel.insertorderitem(singleItem);
     insertId = insertorderitems.insertId
      itemId.push(insertId)
      
        if (insertorderitems) {

        let remove=  await cartModel.removeCartItemOnOrder(singleItem)

        }
      }

let dataDto ={
  orderId ,
  razorPayDetails,
  itemId

}

    return res.status(200).send({ success: true, msg: 'Order Created Successfully', dataDto });
  } else {
    return res.status(400).send({ success: false, msg: 'Unable to Place Order. Please Try Again!' });
  }


}


//PHone PAy
if(data.paymentMethod == "upi"){
  let reqData = {
    totalAmount: req.body.totalAmount,
    finalPayableAmount: req.body.finalPayableAmount,
    promoCodeId: req.body.promoCodeId,
    promoCode:promoCode,
    deliveryAddressId: req.body.deliveryAddressId,
    deliveryAddress:orderDetails[0]?.address,
    paymentMethod: req.body.paymentMethod,
    orderNumber: orderNumber,
    userId: req.userId,
    paymentId:req.body.paymentId

    // currency: req.body.currency,
    // tax_per: req.body.tax_per

  }

  const insertOrder = await orderModel.insertOrderDetail(reqData);

  const orderId = insertOrder.insertId;

  if (insertOrder) {
    const item = data.item

    for (let i = 0; i < item.length; i++) {

      let singleItem = {
          orderId: orderId,
          productId: item[i].productId,
          sizeId: item[i].sizeId,
          quantity: item[i].quantity,
          userId:req.userId
      };  
  
      // Apply discount only to the first item
      if (i === 0) {
          singleItem.price = item[i].buyPrice - discountAmount; // Apply discount
      } else {
          singleItem.price = item[i].buyPrice; // Keep price unchanged for other items
      }

  
      const insertorderitems = await orderModel.insertorderitem(singleItem);

    let insertId = insertorderitems.insertId
      
        if (insertorderitems) {

        await createPDF(orderId, req.userId,insertId);


          await orderModel.updateQuantityFromProductsTable(singleItem.quantity,singleItem.productId);

          if (singleItem.sizeId !==null && singleItem.sizeId != "") {
            await orderModel.updateQuantityFromProductSizeTable(singleItem.productId, singleItem.sizeId);
          }
        const remove= await cartModel.removeCartItemOnOrder(singleItem )
        }
      }
    
    return res.status(200).send({ success: true, msg: 'Order Placed Successfully', orderNumber, orderId });
  } else {
    return res.status(400).send({ success: false, msg: 'Unable to Place Order. Please Try Again!' });
  }


  
}

// Cash On Delivery

if(data.paymentMethod == "cod"){

  let reqData = {
    
    totalAmount: req.body.totalAmount,
    finalPayableAmount: req.body.finalPayableAmount,
    promoCodeId: req.body.promoCodeId,
    promoCode:promoCode,
    deliveryAddressId: req.body.deliveryAddressId,
    deliveryAddress:orderDetails[0]?.address,
    paymentMethod: req.body.paymentMethod,
    orderNumber: orderNumber,
    userId: req.userId,
    paymentId:razorPayDetails.order_id,
    paymentAmount:razorPayDetails.amount,
    paymentCurrency:razorPayDetails.currency,
    status:0,
    paymentStatus:0

  }

  const insertOrder = await orderModel.insertOrderDetail(reqData);

  const orderId = insertOrder.insertId;

  if (insertOrder) {
    const item = data.item

    for (let i = 0; i < item.length; i++) {

      const date = new Date();
const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });



      let singleItem = {
          orderId: orderId,
          productId: item[i].productId,
          sizeId: item[i].sizeId,
          quantity: item[i].quantity,
          userId:req.userId,
          cartNumber:Date.now().toString() + Math.floor(Math.random() * 90 + 10),
          orderStatus: JSON.stringify([{status: "Order Placed On", date: formattedDate, image: placedImage}])
      };  
  
      // Apply discount only to the first item
      if (i === 0) {
    
          singleItem.price = item[i].buyPrice - discountAmount; // Apply discount
      } else {
          singleItem.price = item[i].buyPrice; // Keep price unchanged for other items
      }

  
      const insertorderitems = await orderModel.insertorderitem(singleItem);

    let insertId = insertorderitems.insertId
      
        if (insertorderitems) {

        await createPDF(orderId, req.userId,insertId);


          await orderModel.updateQuantityFromProductsTable(singleItem.quantity,singleItem.productId);

          if (singleItem.sizeId && singleItem.sizeId != "") {
            await orderModel.updateQuantityFromProductSizeTable(singleItem.productId, singleItem.sizeId);
          }

          
          await cartModel.removeCartItemOnOrder(singleItem )


        }
      }
 let dateTime = new Date()

 if(userInfo[0].email.length>0){
      let mailmsg = ``;
				let headerMSG = `Your Order has been Placed`;
				let headerMSG1 = `<h3>Your order #${orderNumber} is Placed!</h3>
				<p><strong>Order Placed On: </strong> ${dateTime}</p>`;
				await emailActivity.Activity(
					userInfo[0].email,
					'Order Placed (#' + orderNumber + ')',
					headerMSG,
					headerMSG1,
					mailmsg
				);
      }
      if(userInfo[0].phoneNo >0){
      
      
      }
      
      let notificationDeatils={
        notificationToAdmin:1,
     notificationBy:req.userId,
     notificationTo:req.userId,
     message:"Order Placed Successfully",
     redirect_url:"orders",
     image:placedImage

      }

         await  NotificationActivity(notificationDeatils)
    
    return res.status(200).send({ success: true, msg: 'Order Placed Successfully', orderNumber, orderId });
  } else {
    return res.status(400).send({ success: false, msg: 'Unable to Place Order. Please Try Again!' });
  }

  
}

  } catch (error) {
    console.log(error)
    return res.status(500).send(response(false, error.message));
  }
};


//....................................|| Update Order After payment.................


exports.updateOrderDetailAfterPayment = async (req, res) => {
  try {
    let data = req.body;
    let {orderId,itemId, status,paymentMethod,paymentOrderId}=req.body


    // razor Pay
    if(paymentMethod == "card"){

        if(status == "sucess"){

       let reqData = {
    paymentOrderId: paymentOrderId,
    status:0,
    pendingReason:null,
    paymentStatus:1
  }
    //update Order Table
  const insertOrder = await orderModel.updateOrderStatus(orderId,reqData);

  if (itemId.length>0) {
    const item = itemId

    for (let i = 0; i < item.length; i++) {


      

      let singleItem = {
          status:0,
          pendingRemark:null,
          orderStatus: JSON.stringify([{status: "Order Placed On", date: formattedDate, image: placedImage}])
         
      };  
      

//update orderitem
      const insertorderitems = await orderModel. updateorderitemStatus(item[i],singleItem);

        if (insertorderitems) {

          //get orderitem
      const getorderitems = await orderModel.getCartItem(item[i]);

      //create PDF
        await createPDF(orderId, req.userId,item[i]);

          await orderModel.updateQuantityFromProductsTable(getorderitems[0].quantity,getorderitems[0].productId);

          if ( getorderitems[0].sizeId!==null && getorderitems[0].sizeId != "") {
            await orderModel.updateQuantityFromProductSizeTable(getorderitems[0].productId, getorderitems[0].sizeId);
          }
        }
      }


      let notificationDeatils={
        notificationToAdmin:1,
     notificationBy:req?.userId,
     notificationTo:req?.userId,
     message:"Order Placed Successfully",
     redirect_url:"orders",
     image:placedImage

      }

         await  NotificationActivity(notificationDeatils)
    
    return res.status(200).send({ success: true, msg: 'Order Placed Successfully', orderId });
  } else {
    return res.status(400).send({ success: false, msg: 'Unable to Place Order. Please Try Again!' });
  }
  
  }

  // payemnt is fail
  else{

    let reqData = {
      paymentOrderId: null,
      status:7,
      pendingReason:"payment Fail",
      paymentStatus:0
     
    }
  
    //update Order Table
    const insertOrder = await orderModel.updateOrderStatus(orderId,reqData);

  
    if (itemId.length>0) {
  
      const item = itemId
  
      for (let i = 0; i < item.length; i++) {
  
        let singleItem = {
            status:7,
            pendingRemark:"payment Fail",
          
          //   status:0,
          // pendingRemark:null,
        };  
        
  //update orderitem
  const insertorderitems = await orderModel. updateorderitemStatus(item[i],singleItem);

  let notificationDeatils={
    notificationToAdmin:0,
 notificationBy:req.userId,
 notificationTo:req.userId,
 message:"Payment Fail Order is Not Placed try again.",
 redirect_url:"orders",
 image:placedImage

  }

     await  NotificationActivity(notificationDeatils)
  
      }      
      return res.status(400).send({ success: false, msg: 'Payment Fail Order is Not Placed '});
    } else {
      return res.status(400).send({ success: false, msg: 'Unable to Place Order. Please Try Again!' });
    }
  



  }

}


// for Phone pay
if(data.paymentMethod == "upi"){
  let reqData = {
    totalAmount: req.body.totalAmount,
    finalPayableAmount: req.body.finalPayableAmount,
    promoCodeId: req.body.promoCodeId,
    promoCode:promoCode,
    deliveryAddressId: req.body.deliveryAddressId,
    deliveryAddress:orderDetails[0]?.address,
    paymentMethod: req.body.paymentMethod,
    orderNumber: orderNumber,
    userId: req.userId,
    paymentId:req.body.paymentId

  }

  const insertOrder = await orderModel.insertOrderDetail(reqData);

  const orderId = insertOrder.insertId;

  if (insertOrder) {
    const item = data.item

    for (let i = 0; i < item.length; i++) {

      let singleItem = {
          orderId: orderId,
          productId: item[i].productId,
          sizeId: item[i].sizeId,
          quantity: item[i].quantity,
          userId:req.userId
      };  
  
      // Apply discount only to the first item
      if (i === 0) {
          singleItem.price = item[i].buyPrice - discountAmount; // Apply discount
      } else {
          singleItem.price = item[i].buyPrice; // Keep price unchanged for other items
      }

  
      const insertorderitems = await orderModel.insertorderitem(singleItem);

    let insertId = insertorderitems.insertId
      
        if (insertorderitems) {

        await createPDF(orderId, req.userId,insertId);


          await orderModel.updateQuantityFromProductsTable(singleItem.quantity,singleItem.productId);

          if (singleItem.sizeId !==null && singleItem.sizeId != "") {
            await orderModel.updateQuantityFromProductSizeTable(singleItem.productId, singleItem.sizeId);
          }
        const remove= await cartModel.removeCartItemOnOrder(singleItem )
        }
      }
    
    return res.status(200).send({ success: true, msg: 'Order Placed Successfully', orderNumber, orderId });
  } else {
    return res.status(400).send({ success: false, msg: 'Unable to Place Order. Please Try Again!' });
  }

  
}



  } catch (error) {
    console.log(error)
    return res.status(500).send(response(false, error.message));
  }
};

exports.updateOrderCodStatus = async (req, res) => {
  try {

    let result = await orderModel.updateOrderCodStatus(req.body)
    if (result) {
      createPDF(req.body.orderId, req.userId);
      await orderModel.clearCartItems(req.userId);
      return res.status(200).send({ success: true, msg: 'Order placed successfully!' });
    }
    return res.status(200).send(response(false, 'Internal server error!'));
  } catch (error) {
    return res.status(200).send(response(false, error.message));
  }
}

exports.updateOrderPaymentStatus = async (req, res) => {
  try {
    let result = await orderModel.updateOrderPaymentStatus(req.body)
    if (result) {
      
      createPDF(req.body.orderId, req.userId);
      await orderModel.clearCartItems(req.userId);
      return res.status(200).send({ success: true, msg: 'Order placed successfully!' });
    }
    return res.status(200).send(response(false, 'Internal server error!'));
  } catch (error) {
    return res.status(500).send(response(false, error.message));
  }
}

exports.cancelAndRemoveOrder = async (req, res) => {
  try {
    let result = await orderModel.cancelAndRemoveOrder(req.body)
    if (result) {
      return res.status(200).send({ success: true, msg: 'Order removed !' });
    }
    return res.status(200).send(response(false, 'Internal server error!'));
  } catch (error) {
    return res.status(500).send(response(false, error.message));
  }
}


//---------------------------|| CHECK PROMOCODE ||------------------------------------

exports.checkPromocode = async (req, res) => {
  try {
    let data = req.body;
    let availablePromocodes = await orderModel.getPromocodes();
  
    if (availablePromocodes.length > 0) {
    let promocodeALreadyUse = await orderModel.checkUsedPromocode(data.promocode, req.userId);
    if (promocodeALreadyUse.length > 0) {
      return res.status(200).send({ success: false, msg: 'Promocode Already Used' });
    }
    let checkPromocode = await orderModel.checkPromocode(data.promocode);
    if (checkPromocode.length > 0) {

      const currentDate = new Date();
      
      // Assuming checkPromocode is an array with at least one element
      const validFrom = new Date(checkPromocode[0].validFrom);
      const validTo = new Date(checkPromocode[0].validTo);
      
      // Resetting time parts to 00:00:00
      currentDate.setHours(0, 0, 0, 0);
      validFrom.setHours(0, 0, 0, 0);
      validTo.setHours(0, 0, 0, 0);

      currentDate.setDate(currentDate.getDate() + 1)
      // Adjusting validTo to be inclusive of the entire last day
      if (currentDate >= validFrom && currentDate < validTo) {
        return res.status(200).send({ success: true, msg: 'Promocode Applied Successfully', discount: checkPromocode[0].discount,promocodeId:checkPromocode[0].id });
      } else {
        return res.status(200).send({ success: false, msg: 'Promocode expired' });
      }
      
    } else {
      return res.status(400).send({ success: false, msg: 'Invalid Promocode!' });
    }
  }else{
    return res.status(400).send({ success: false, msg: 'Invalid Promocode!' });
  }
  } catch (error) {
    console.log(error);
    return res.status(500).send(response(false, error.message));
  }
}





exports.AllPromocode = async (req, res) => {
  try {
   
    let availablePromocodes = await orderModel.getPromocodes();
  
    if (availablePromocodes.length > 0) {

    let checkPromocode = await orderModel.getPromocode(req.userId);

    if (checkPromocode.length > 0) {

        return res.status(200).send({ success: true, msg: 'Promocode featch Successfully', promocode:checkPromocode});
      }
      else {
        return res.status(400).send({ success: false, msg: ' No Promocode ' });
      }
    } else {
      return res.status(400).send({ success: false, msg: ' No Promocode ' });
    }
    
  } catch (error) {
    return res.status(500).send(response(false, error.message));
  }
}
//---------------------------|| CHECK PRODUCT QUANTITY ||------------------------------------

exports.checkProductQuantity = async (req, res) => {
  try {
    let data = req.body;
    if (data.productSizeId == '' || data.productSizeId == null) {
      let checkQuantity = await orderModel.checkProductQuantity(data)

      if (checkQuantity[0].productQuantity < data.quantity) {
        return res.status(200).send({ success: false, msg: `Qunatity check1`, availableQty: checkQuantity[0].productQuantity });
      } else {
        return res.status(200).send({ success: true, msg: `Quantity check2`, availableQty: checkQuantity[0].productQuantity });
      }
    } else {
      let checkSizeQuantity = await orderModel.checkProductSizeQuantity(data);
      if (checkSizeQuantity.length > 0 && checkSizeQuantity[0]?.quantity < data.quantity) {
        return res.status(200).send({ success: false, msg: `Qunatity check3`, availableQty: checkSizeQuantity[0].quantity });
      } else {
        return res.status(200).send({ success: true, msg: `Qunatity check4`, availableQty: checkSizeQuantity[0].quantity });
      }
    }
  } catch (error) {
    return res.status(500).send(response(false, error.message));
  }
}


//---------------------------|| ORDER LIST BY USER ID ||------------------------------------

exports.getOrderListByUserId = async (req, res) => {
  try {
    let orderDetail = await orderModel.getOrderListByUserId(req.userId)
    if (orderDetail.length > 0) {
      return res.status(200).send({ success: true, msg: 'User Order List', orderDetail });
    }
    return res.status(200).send(response(false, message.noDataMessage));

  } catch (error) {
    return res.status(500).send(response(false, error.message));
  }
}


exports.cancelThisOrder = async (req, res) => {
  try {
    req.body.user_id = req.userId;

    
    
    let orderDetail = await orderModel.getOrderDetailById(req.body);

    if (orderDetail) {
      let itemDto={
        userId:req.userId,
        orderitemId:req.body.orderitemId
      }

      let orderitemDetail = await orderModel.getorderitemDetailById(itemDto)

      if(orderitemDetail[0]?.status ==0){

        let orderStatus =JSON.stringify([...orderitemDetail[0]?.orderStatus,{status: "Order Cancelled On", date: formattedDate, image: cancelPlacedImage}])


      let result = await orderModel.cancelThisOrder(req.body,orderStatus);
     

      await orderModel.insertCancelReason(req.userId, req.body)

      if (result) {

        if( orderitemDetail[0]?.email>0){
        let mailmsg = ``;
        let headerMSG = `Order Cancelled`;
        let headerMSG1 = `<h3>Your Order #${orderDetail[0].orderNumber} Cancel Request Submitted Successfully!</h3>`;
        await emailActivity.Activity(
          orderDetail[0].email,
          "Order #" + orderDetail[0].orderNumber + " Cancel Request Submitted!",
          headerMSG,
          headerMSG1,
          mailmsg
        );
      }
      if( orderitemDetail[0]?.phoneNo>0){

      }
      let notificationDeatils={
        notificationToAdmin:1,
     notificationBy:req.userId,
     notificationTo:req.userId,
     message:"Order Cancle Successfully",
     redirect_url:"orders",
     image:placedImage

      }

         await  NotificationActivity(notificationDeatils)

        return res.status(200).send({ success: true, msg: 'Order cancel request submitted successfully!' });
      }
      else {
        return res.status(200).send({ success: false, msg: 'Internal server error!' });
      }
    }
    else{
      return res.status(200).send(response(false, 'You cannot cancel this order once it is in the Processing state. Once the order is delivered, you can initiate a return.'));
    }
    }
    else {
      return res.status(200).send(response(false, 'Invalid request!'));
    }
  }
  catch (error) {
    console.log(error)
    return res.status(500).send(response(false, error.message));
  }
}

exports.returnThisOrder = async (req, res) => {
  try {
    req.body.user_id = req.userId;

    let orderDetail = await orderModel.getOrderDetailById(req.body);
    if (orderDetail) {

      let itemDto={
        userId:req.userId,
        orderitemId:req.body.orderitemId
      }
      let orderitemDetail = await orderModel.getorderitemDetailById(itemDto)


      if(orderitemDetail[0]?.status == 4 ){
      let currentDate = new Date();
      let deliveryDate = new Date(orderitemDetail[0].deliveredDate);
      
      // Calculate the difference in milliseconds
      let differenceInMs = currentDate.getTime() - deliveryDate.getTime();
      
      // Convert milliseconds to days
      let daysDifference = differenceInMs / (1000 * 3600 * 24);
      
      if (daysDifference <= 5) {

        let orderStatus =JSON.stringify([...orderitemDetail[0]?.orderStatus,{status: "Return Request Placed On", date: formattedDate, image: returnPlacedImage}])


       
      let result = await orderModel.returnThisOrder(req.body,orderStatus);

      await orderModel.insertReturnReason(req.userId, req.body)

      if (result) {


        if( orderitemDetail[0]?.email>0){
          let mailmsg = ``;
          let headerMSG = `Order Returned`;
          let headerMSG1 = `<h3>Your Order #${orderDetail[0].orderNumber} Return Request Submitted Successfully!</h3>`;
          await emailActivity.Activity(
            orderDetail[0].email,
            "Order #" + orderDetail[0].orderNumber + " Return Request Submitted!",
            headerMSG,
            headerMSG1,
            mailmsg
          );
        }
        if( orderitemDetail[0]?.phoneNo>0){
  
        }

        let notificationDeatils={
          notificationToAdmin:1,
       notificationBy:req.userId,
       notificationTo:req.userId,
       message:"Order Return Request Place Successfully",
       redirect_url:"orders",
       image:returnedimage
  
        }
  
           await  NotificationActivity(notificationDeatils)

      
        return res.status(200).send({ success: true, msg: 'Order return request submitted successfully!' });
      }
      else {
        return res.status(200).send({ success: false, msg: 'Internal server error!' });
      }
      
    }
    else{
      return res.status(200).send({ success: false, msg: 'You can Not Return this Product.After 5 Days' });
    }
  }
    else{
      return res.status(200).send({ success: false, msg: 'You can Not Return this Product.' });

    }
    }
    else {
      return res.status(200).send(response(false, 'Invalid request!'));
    }
  }
  catch (error) {
    console.log(error)
    return res.status(500).send(response(false, error.message));
  }
}

exports.getOrderDetailsById = async (req, res) => {
  try {
    req.body.user_id = req.userId;
    let orderDetail = await orderModel.getOrderDetailsById(req.body)

    
    if (orderDetail.length > 0) {





      return res.status(200).send({ success: true, msg: 'Order detail', data: orderDetail[0] });
    }
    return res.status(200).send(response(false, message.noDataMessage));

  } catch (error) {
    return res.status(500).send(response(false, error.message));
  }
}

exports.getdevliverychargesandtexses = async (req, res) => {
  try {
    let deliveryAndTax = await orderModel.getdevliverychargesandtexses(req.query.regionName)
    if (deliveryAndTax.length > 0) {
      return res.status(200).send({ success: true, msg: 'Order detail', data: deliveryAndTax });
    }
    return res.status(200).send(response(false, message.noDataMessage));
  } catch (error) {
    return res.status(500).send(response(false, error.message));
  }
}

exports.getcanceandreturnorderByItemId = async (req, res) => {
  try {
    let cancelAndReturn = await orderModel.getcanceandreturnorderByItemId(req.userId, req.query.orderitemId)
    if (cancelAndReturn.length > 0) {
      return res.status(200).send({ success: true, msg: 'Order Detail', data: cancelAndReturn[0] });
    }
    return res.status(200).send(response(false, message.noDataMessage));
  } catch (error) {
    return res.status(500).send(response(false, error.message));
  }
}

exports.getSupplierList = async (req, res) => {
  try {
    let supplierList = await orderModel.getSupplierList()
    if (supplierList.length > 0) {
      return res.status(200).send({ success: true, msg: 'Supplier list', supplierList });
    }
    return res.status(200).send(response(false, message.noDataMessage));
  } catch (error) {
    return res.status(500).send(response(false, error.message));
  }
}

// Aliases for backward-compatible route names
exports.getDeliveryChargesAndTaxes = exports.getdevliverychargesandtexses;
exports.getCancelAndReturnOrderByItemId = exports.getcanceandreturnorderByItemId;

