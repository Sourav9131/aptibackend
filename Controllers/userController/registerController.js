const registerModel = require("../../Models/userModel/registerModel");
const config = require("../../config");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const emailActivity = require("./emailActivity.controller");
const smsActivity = require("./smsActivity.controller");
const { NotificationActivity } = require("./notification.controller");

const { message, response } = require("../../utils/response");
const CryptoJS = require("crypto-js");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
const path = require("path");
const fs = require("fs");


let pendingImage="placed.png";
let placedImage = "placed.png";
let outForDeliveryImage="outForDelivery.png";
let proccesingImage = "returnd.png";
let shippedImage ="shipped.png";
let deliverdImage ="returnd.png";
let returnPlacedImage ="return.png";
let returnedimage ="returnd.png";
let cancelPlacedImage = "return.png";
let cancelledIamge ="returnd.png";
let deliveyAddressIamge ="returnd.png";

//-----------------------------|| NORMAL REGISTRATION ||---------------------------

function validateEmail(email) {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhoneNumber(phoneNumber) {
  // Regular expression for phone number validation
  const phoneRegex = /^[0-9]{10}$/; // Assuming a 10-digit phone number
  return phoneRegex.test(phoneNumber);
}

exports.sendOtp = async (req, res) => {
  try {
    let data = req.body;


    if (validateEmail(data.inputType)) {
      // Perform your signup process for email
      let checkUser = await registerModel.checkUser(data);
      if (checkUser.length > 0) {
        return res
          .status(400)
          .send({ success: false, msg: "Email already registered!" });
      }

      var OTP = Math.floor(100000 + Math.random() * 900000);
      let mailmsg = ``;
      let headerMSG = `Email Verification OTP`;
      let headerMSG1 = `<h3>Your email verification OTP is - ${OTP}</h3>`;
      let mailRes = await emailActivity.Activity(
        data.inputType,
        "Email Verification OTP",
        headerMSG,
        headerMSG1,
        mailmsg
      );

      let postData = {
        email: data.inputType,
        otp: OTP,
      };
      let checkMail = await registerModel.checkTempMail(data);
      let tempRes;
      if (checkMail.length > 0) {
        tempRes = await registerModel.updateTempEmailOTP(
          postData,
          postData.email
        );
      } else {
        tempRes = await registerModel.addTempEmailOTP(postData);
      }
      if (tempRes) {
        return res.status(200).send({
          success: true,
          data: data,
          msg: "We have sent you an OTP for email verification!",
        });
      } else {
        return res
          .status(400)
          .send({ success: false, msg: "Internal server error!" });
      }
    }

    // for mobile
    else if (validatePhoneNumber(data.inputType)) {
      // Perform your signup process for phone number
      let checkUser = await registerModel.checkUserToPhone(data);
      if (checkUser.length > 0) {
        return res
          .status(400)
          .send({ success: false, msg: "Phone No already registered!" });
      }

      
      var OTP = Math.floor(100000 + Math.random() * 900000);
      // var OTP = Math.floor(100000 + Math.random() * 900000);
      let mailmsg = ``;
      let headerMSG = `Mobile No Verification OTP`;
      let headerMSG1 = `Your Otp for Apti Trading account registration is ${OTP}`;

      let mailRes = await smsActivity.PhoneActivity(
        data.inputType,
        "Phone No Verification OTP",
        headerMSG,
        headerMSG1,
        mailmsg
      );

      let postData = {
        email: data.inputType,
        otp: OTP,
      };

      let checkMail = await registerModel.checkTempMail(data);

      let tempRes;
      if (checkMail.length > 0) {
        tempRes = await registerModel.updateTempEmailOTP(
          postData,
          postData.email
        );
      } else {
        tempRes = await registerModel.addTempEmailOTP(postData);
      }
      if (tempRes) {
        return res.status(200).send({
          success: true,
          data: data,
          msg: "We have sent you an OTP for mobile no verification!",
        });
      } else {
        return res
          .status(400)
          .send({ success: false, msg: "Internal server error!" });
      }
    } else {
      return res.status(200).send(response(false, "Invalid input!"));
    }
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .send({ success: false, msg: "Something went wrong please try agian!" });
  }
};



exports.sendMobileOtp = async (req, res) => {
  try {
    let data1 = req.body;
    // let checkUser = await registerModel.checkUser(data1);
    // if (checkUser.length > 0) {
    //   return res.status(200).send(response(false, "Email already registered!"));
    // }
    var OTP = Math.floor(1000 + Math.random() * 9000);

    const options = {
      method: "POST",
      url: "https://control.msg91.com/api/v5/flow/",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authkey: "416307AFDTJT4vS965cf40b3P1",
      },
      data: {
        template_id: "65cf53f9d6fc05020a0e4462",
        short_url: "1 (On) or 0 (Off)",
        recipients: [
          {
            mobiles: data1.mobileNo,
            VAR1: `Apurva Electric Registration Process Otp:${OTP}`,
          },
        ],
      },
    };

    let response = await axios.request(options);

   
  } catch (err) {
    console.log(err);
    return res
      .status(200)
      .send({ success: false, msg: "Something went wrong please try agian!" });
  }
};

exports.userRegister = async (req, res) => {
  try {
    let data = req.body;

    let checkMailOtp = await registerModel.checkTempMail(data);

    if (checkMailOtp[0]?.otp != data.otp) {
      return res.status(400).send({
        msg: "Incorrect OTP! Please enter correct OTP!",
        success: false,
      });
    } else {
      const hash = CryptoJS.SHA256(req.body.password).toString(
        CryptoJS.enc.Hex
      );

      let referralCode = randomString(
        10,
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
      );

      let loginStatus;
      if (data.role == "user") {
        loginStatus = true;
      } else {
        loginStatus = false;
      }

      if (validateEmail(data.inputType)) {
        // Perform your signup process for email

        let user = {
          fullName: data.fullName,
          email: data.inputType,
          password: hash,
          loginType: data.role,
          status: loginStatus,
          referralCode: referralCode,
        };

        let insert = await registerModel.insertData(user);

        if (insert[0]) {
          return res.status(400).send({
            success: false,
            msg: "This Email Already Registered!!",
          });

          // .send(response(false, "This Email Already Registered!!"));
        } else {
          let uerData = {
            inputType: data.inputType,
            loginType: data.role,
          };

          let mailmsg = ``;
          let headerMSG = `Registered Successfully`;
          let headerMSG1 = `<h3>You are Registered successfully with Hardware Application</h3>`;
          await emailActivity.Activity(
            data.inputType,
            "Registered Successfully",
            headerMSG,
            headerMSG1,
            mailmsg
          );

          let getUser = await registerModel.checkUserlogin(uerData);

          let notificationDeatils = {
            notificationToAdmin: 1,
            notificationBy: getUser[0]?.id,
            message: "New User Signup",
            redirect_url: "users",
           

          };

          await NotificationActivity(notificationDeatils);

          return res.status(200).send({
            success: true,
            data: data,
            msg: "Registered Successsfully!!",
          });

          // .send(response(true, "Registered Successsfully!!"));
        }
      }

      // for mobile
      else if (validatePhoneNumber(data.inputType)) {
        // Perform your signup process for phone number

        let user = {
          fullName: data.fullName,
          phoneNo: data.inputType,
          password: hash,
          loginType: data.role,
          status: loginStatus,
          referralCode: referralCode,
        };

        let insert = await registerModel.insertPhoneData(user);

        if (insert[0]) {
          return res.status(200).send(
            {
              success: false,
              msg: "This Phone No Already Registered!!",
            }
          );
          // .send(response(false, "This Phone No Already Registered!!"));
        } else {
          let mailmsg = ``;
          let headerMSG = `Registered Successfully`;
          let headerMSG1 = `<h3>You are Registered successfully with Hardware Application</h3>`;

          // await smsActivity.PhoneActivity(
          //   data.inputType,
          //   'Registered Successfully',
          //   headerMSG,
          //   headerMSG1,
          //   mailmsg
          // );

          return res.status(200).send({
            success: true,
            data: data,
            msg: "Registered Successsfully!!",
          });

          // .send(response(true, "Registered Successsfully!!"));
        }
      } else {
        // Handle the case where neither email nor phone number is valid
        return res
          .status(400)
          .send(
          { success: false, data: data, msg: "Invalid input!!" }
          );
        
      }
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, msg: message.catchMessage });
  }
};

// Vendor Register

exports.vendorOtpVerify = async (req, res) => {
  try {
    let data = req.body;
    let checkMailOtp = await registerModel.checkTempMail(data);
    if (checkMailOtp[0].otp != data.otp) {
      return res.status(400).send({
        success: false,
        msg: "Incorrect OTP! Please enter correct OTP!",
      });
    } else {
      return res.status(200).send({
        success: true,
        data: data,
        msg: "OTP verfied Successsfully!!",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(response(false, message.catchMessage));
  }
};

// Vendor Register

exports.vendorRegister = async (req, res) => {
  try {
    let data = req.body;
    let files = req.files;

    let password = data.password;
    const hash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

    let referralCode = randomString(
      10,
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    );

    let loginStatus;
    if (data.role == "user") {
      loginStatus = true;
    } else {
      loginStatus = false;
    }

    if (validateEmail(data.inputType)) {
      // Perform your signup process for email

      let vendor = {
        fullName: data.fullName,
        email: data.inputType,
        password: hash,
        loginType: data.role,
        status: loginStatus,
        referralCode: referralCode,
        gstNo: data.gstNo,
        shopName: data.shopName,
        adharFront: files?.adharFront[0]?.filename,
        adharBack: files?.adharback[0]?.filename,
        panCard: files?.panCard[0]?.filename,
      };

      let insert = await registerModel.insertData(vendor);

      if (insert[0]) {
        return res
          .status(400)
          .send(response(false, "This Email Already Registered!!"));
      } else {
        let mailmsg = ``;
        let headerMSG = `Registered Successfully`;
        let headerMSG1 = `<h3>You are Registered successfully with Hardware Application</h3>`;
        await emailActivity.Activity(
          data.inputType,
          "Registered Successfully",
          headerMSG,
          headerMSG1,
          mailmsg
        );

        let uerData = {
          inputType: data.inputType,
          loginType: data.role,
        };

        let getUser = await registerModel.checkUserlogin(uerData);

        let notificationDeatils = {
          notificationToAdmin: 1,
          notificationBy: getUser[0]?.id,
          message: "New vendor Signup",
          redirect_url: "vendors",
        };

        await NotificationActivity(notificationDeatils);
        return res
          .status(200)
          .send({
            success: true,
            data: data,
            msg: "Registered Successsfully!!",
          });
      }
    }

    // for mobile
    else if (validatePhoneNumber(data.inputType)) {
      // Perform your signup process for phone number

      let vendor = {
        fullName: data.fullName,
        phoneNo: data.inputType,
        password: hash,
        loginType: data.role,
        status: loginStatus,
        referralCode: referralCode,
        gstNo: data.gstNo,
        shopName: data.shopName,
        adharFront: files?.adharFront[0]?.filename,
        adharBack: files?.adharback[0]?.filename,
        panCard: files?.panCard[0]?.filename,
      };

      let insert = await registerModel.insertPhoneData(vendor);
      if (insert[0]) {
        return res
          .status(200)
          .send(response(false, "This Phone No Already Registered!!"));
      } else {
        let mailmsg = `Registered successfully`;
        let headerMSG = `Registered Successfully`;
        let headerMSG1 = `<h3>You are Registered successfully with Hardware Application</h3>`;

        // await smsActivity.PhoneActivity(
        //   data.inputType,
        //   'Registered Successfully',
        //   headerMSG,
        //   headerMSG1,
        //   mailmsg
        // );
        let uerData = {
          inputType: data.inputType,
          loginType: data.role,
        };

        let getUser = await registerModel.checkUserPhonelogin(uerData);

        // return res.status(200).send(
        //   response({
        //     staus: true,
        //     data: getUser,
        //     msg: "Registered Successsfully!!",
        //   })
        // );
        return res
        .status(200)
        .send({
          success: true,
          data: data,
          msg: "Registered Successsfully!!",
        });
      }
    } else {
      return res.status(200).send(response(true, "Invalid input!!"));
      // Handle the case where neither email nor phone number is valid
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(response(false, message.catchMessage));
  }
};

// exports.vendorRegister = async (req, res) => {
//   try {
//     let data = req.body;
//     let checkMailOtp = await registerModel.checkTempMail(data);
//     if (checkMailOtp[0].otp != data.otp) {
//       return res.status(200).send(response(false, "Incorrect OTP! Please enter correct OTP!"));
//     } else {

// let password= `${data.firstName}@123`
//       const hash = CryptoJS.SHA256(password).toString(
//         CryptoJS.enc.Hex
//       );

//       let referralCode = randomString(
//         10,
//         "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
//       );

//       let loginStatus;
//       if(data.role == "user"){
//       loginStatus=true;
//       }
//       else{
//         loginStatus=false;
//       }

//       let user = {
//         firstName: data.firstName,
//         lastName: data.lastName,
//         email: data.email,
//         password: hash,
//         loginType: "vendor",
//         status:loginStatus,
//         referralCode: referralCode,
//         gstNo: data.gstNo

//       };

//       let insert = await registerModel.insertData(user);

//       if (insert[0]) {

//         return res
//         .status(200)
//         .send(response(false, "This Email Already Registered!!"));

//       }
//       else{
//         let mailmsg = ` your email and password for login in the Apurva Application is

//                email: ${data.email} and Password:${password} `;
//         let headerMSG = `Registered Successfully`;
//         let headerMSG1 = `<h3>You are Registered successfully with Hardware Application</h3>`;
//         await emailActivity.Activity(
//           data.email,
//           'Registered Successfully',
//           headerMSG,
//           headerMSG1,
//           mailmsg
//         );
//         return res
//           .status(200)
//           .send(response(true, "Registered Successsfully!!"));
//       }

//   }

//   } catch (err) {
//     console.log(err);
//     return res.status(200).send(response(false, message.catchMessage));
//   }
// };

//-----------------------------|| NORMAL LOGIN ||---------------------------

exports.userLogin = async (req, res) => {
  try {
    let data = req.body;

    if (validateEmail(data.inputType)) {
      // Perform your signup process for email

      let checkUserEmailPassword = await registerModel.checkUserlogin(data);

      if (checkUserEmailPassword.length > 0) {
        let hash = CryptoJS.SHA256(req.body.password).toString(
          CryptoJS.enc.Hex
        );
        if (checkUserEmailPassword[0].password !== hash) {
          return res
            .status(400)
            .send({ success: false, msg: "Password Does Not Match !!" });
        }

        if (checkUserEmailPassword[0].status === 1) {
          const jwtToken = jwt.sign(
            {
              email: data.inputType,
              id: checkUserEmailPassword[0].id,
            },
            process.env.JWTSECRETKEY
          );

          if (jwtToken) {
            return res.status(200).send(
              response(true, "Login Successfully", {
                jwt: jwtToken,
                userId: checkUserEmailPassword[0].id,
                email: checkUserEmailPassword[0].email,
                status: checkUserEmailPassword[0].status,
                loginType: checkUserEmailPassword[0].loginType,
              })
            );
          } else {
            return res
              .status(400)
              .send(response(false, "Something Went Wrong "));
          }
        } else {
          return res
            .status(400)
            .send({ success: false, msg: "account approval is pending. Once approved by the admin, you will be able to login." });
        }
      }
      return res.status(400).send({ success: false, msg: "No User Found" });
    }

    // for mobile
    else if (validatePhoneNumber(data.inputType)) {
      // Perform your signup process for phone number

      let checkUserEmailPassword = await registerModel.checkUserPhonelogin(
        data
      );

      if (checkUserEmailPassword.length > 0) {
        let hash = CryptoJS.SHA256(req.body.password).toString(
          CryptoJS.enc.Hex
        );
        if (checkUserEmailPassword[0].password !== hash) {
          return res
          .status(400)
          .send({ success: false, msg: "Password Does Not Match !!" });
        }

        if (checkUserEmailPassword[0].status === 1) {
          const jwtToken = jwt.sign(
            {
              email: data.inputType,
              id: checkUserEmailPassword[0].id,
            },
            process.env.JWTSECRETKEY
          );

          if (jwtToken) {
            return res.status(200).send(
              response(true, "Login Successfully", {
                jwt: jwtToken,
                userId: checkUserEmailPassword[0].id,
                phoneNo: checkUserEmailPassword[0].phoneNo,
                status: checkUserEmailPassword[0].status,
                loginType: checkUserEmailPassword[0].loginType,
              })
            );
          } else {
            return res
              .status(200)
              .send(response(false, "Something Went Wrong "));
          }
        } else {
          return res
          .status(400)
          .send({ success: false, msg: "account approval is pending. Once approved by the admin, you will be able to login." });
        }
      }
      // return res.status(200).send(response(false, "No User Found"));
      return res.status(400).send({ success: false, msg: "No User Found" });
    } else {
      // return res.status(200).send(response(true, "Invalid input!!"));
      return res.status(400).send({ success: false, msg: "Invalid input!!" });
      // Handle the case where neither email nor phone number is valid
    }
  } catch (err) {
    console.log(err.message);
    // return res.status(200).send(response(false, message.catchMessage));
    return res.status(500).send({ success: false, msg: catchMessage });
  }
};

function randomString(length, chars) {
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

exports.forgotPassword = async (req, res) => {
  try {
    let data = req.body;

    if (validateEmail(data.inputType)) {
      let getUserDetails = await registerModel.checkUserFromEmail(
        data.inputType
      );

      if (getUserDetails.length > 0) {
        var OTP = Math.floor(100000 + Math.random() * 900000);

        let postData = {
          email: data.inputType,
          otp: OTP,
        };
        let checkMail = await registerModel.checkTempMail(data);

        let tempRes;
        if (checkMail.length > 0) {
          tempRes = await registerModel.updateTempEmailOTP(
            postData,
            postData.email
          );
        } else {
          tempRes = await registerModel.addTempEmailOTP(postData);
        }
        if (tempRes) {
          // let updateOtp = await registerModel.checkTempMail(OTP, data);

          let mailmsg = ``;
          let headerMSG = `Reset Password OTP`;
          let headerMSG1 = `<h3>Your OTP to reset password is - ${OTP}</h3>`;
          let mailMsg1 = emailActivity.Activity(
            data.inputType,
            "Reset Password OTP",
            headerMSG,
            headerMSG1,
            mailmsg
          );
          if (mailMsg1) {
            return res.status(200).send({
              success: true,
              msg: "We have sent an OTP to your registered email ID.",
              data: data,
            });
          } else {
            return res
              .status(400)
              .send(response(false, "Something went wrong please try again."));
          }
        } else {
          return res
            .status(400)
            .send(response(false, "No Email Found Try With Other"));
        }
      } else {
        return res
          .status(400)
          .send({ success: false, msg: "No Email Found Try With Other" });
      }
    } 
    else if (validatePhoneNumber(data.inputType)) {
     
      
      let getUserDetails = await registerModel.checkUserFromPhone(data.inputType);

      if (getUserDetails.length > 0) {
        // var OTP = Math.floor(1000 + Math.random() * 9000);
        var OTP = Math.floor(100000 + Math.random() * 900000);

        let postData = {
          email: data.inputType,
          otp: OTP,
        };

        let checkMail = await registerModel.checkTempMail(data);

        let tempRes;
        if (checkMail.length > 0) {
          tempRes = await registerModel.updateTempEmailOTP(
            postData,
            postData.email
          );
        } else {
          tempRes = await registerModel.addTempEmailOTP(postData);
        }
        if (tempRes) {
          // 
          
          
          let updateOtp = await registerModel.checkTempMail(OTP, data);


          // let mailmsg = ``;
          // let headerMSG = `Reset Password OTP`;
          // let headerMSG1 = `<h3>Your OTP to reset password is - ${OTP}</h3>`;
          // let mailMsg1 = emailActivity.Activity(
          //   req.body.email,
          //   "Reset Password OTP",
          //   headerMSG,
          //   headerMSG1,
          //   mailmsg
          // );
      // var OTP = Math.floor(100000 + Math.random() * 900000);
      let mailmsg = ``;
      let headerMSG = `Mobile No Verification OTP`;
      let headerMSG1 = `Your Otp for Apti Trading account registration is ${OTP}`;

      let mailRes = await smsActivity.PhoneActivity(
        data.inputType,
        "Phone No Verification OTP",
        headerMSG,
        headerMSG1,
        mailmsg
      );


          if (mailRes ) {
            return res
              .status(200)
              .send(
                response(
                  true,
                  "We have sent an OTP to your registered phone No.",
                  { OTP }
                )
              );
          } else {
            return res
              .status(200)
              .send(response(false, "Something went wrong please try again."));
          }
        } else {
          return res
            .status(200)
            .send(response(false, "No Email Found Try With Other"));
        }
      } else {
        return res
          .status(400)
          .send({ success: false, msg: "No Phone No Found Try With Other" });
      }
    } else {
      return res.status(400).send(response(true, "Invalid input!!"));
      // Handle the case where neither email nor phone number is valid
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(response(false, message.catchMessage));
  }
};

exports.otpVerification = async (req, res) => {
  try {
    let data = req.body;

    if (validateEmail(data.inputType)) {
      let getUserDetails = await registerModel.checkUserOtp(data.inputType);

      if (data.otp != getUserDetails[0].otp) {
        return res.status(400).send({ success: false, msg: "Invalid OTP" });
      } else {
        return res
          .status(200)
          .send({ success: true, data: data, msg: "Otp Verfiy Successfully" });
      }
    } else if (validatePhoneNumber(data.inputType)) {
      let getUserDetails = await registerModel.checkUserOtp(data.inputType);
  
      

      if (data.otp != getUserDetails[0].otp) {
        return res.status(400).send({ success: false, msg: "Invalid OTP" });
      } else {
        return res
          .status(200)
          .send({ success: true, data: data, msg: "Otp Verfiy Successfully" });
      }
    } else {
      return res.status(400).send({ success: false, msg: "Invalid input!!" });
      // Handle the case where neither email nor phone number is valid
    }
  } catch (err) {
    return res.status(400).send(response(false, message.catchMessage));
  }
};

exports.resetpassword = async (req, res) => {
  try {
    let data = req.body;
    if (validateEmail(data.inputType)) {

      const hash = CryptoJS.SHA256(data.password).toString(CryptoJS.enc.Hex);
      let getUserDetails = await registerModel.checkUserFromEmail(
        data.inputType
      );

      if (getUserDetails.length > 0) {
        let updatePassword = await registerModel.updatePassword(
          hash,
          data.inputType
        );
        if (updatePassword) {
          let mailmsg = ``;
          let headerMSG = `Password Update Successfully`;
          let headerMSG1 = `<h3>Your Password Update Successfully!</h3>`;
          await emailActivity.Activity(
            data.inputType,
            `Password Update`,
            headerMSG,
            headerMSG1,
            mailmsg
          );
          return res
            .status(200)
            .send(response(true, "Password updated successfully", data));
        } else {
          return res
            .status(400)
            .send(response(false, "Something went wrong please try again."));
        }
      } else {
        return res
          .status(400)
          .send(response(false, "No Email Found Try With Other"));
      }
    } 
    else if (validatePhoneNumber(data.inputType)) {

      const hash = CryptoJS.SHA256(data.password).toString(CryptoJS.enc.Hex);
      let getUserDetails = await registerModel.checkUserFromPhone(
        data.inputType
      );

      if (getUserDetails.length > 0) {
        let updatePassword = await registerModel.updatePhonePassword (
          hash,
          data.inputType
        );

        if (updatePassword) {
        //   let mailmsg = ``;
        //   let headerMSG = `Password Update Successfully`;
        //   let headerMSG1 = `<h3>Your Password Update Successfully!</h3>`;
        //   await emailActivity.Activity(
        //     data.inputType,
        //     `Password Update`,
        //     headerMSG,
        //     headerMSG1,
        //     mailmsg
        //   );
          return res
            .status(200)
            .send(response(true, "Password updated successfully", data));
        } else {
          return res
            .status(400)
            .send(response(false, "Something went wrong please try again."));
        }
      } else {
        return res
          .status(400)
          .send(response(false, "No Email Found Try With Other"));
      }

    } else {
      return res.status(400).send(response(false, "Invalid input!!"));
      // Handle the case where neither email nor phone number is valid
    }
  } catch (err) {
    //return res.status(200).send(response(false, message.catchMessage));
    return res.status(400).send(response(false, err.message));
  }
};
exports.changepassword = async (req, res) => {
  try {
    let data = req.body;
    let inputType;
    let getUserDetails = await registerModel.getUserDetails(req.userId);

    if (getUserDetails.length > 0) {
      if (getUserDetails[0]?.email) {
        inputType = getUserDetails[0]?.email;
      } else if (getUserDetails[0]?.phoneNo) {
        inputType = getUserDetails[0]?.phoneNo;
      } else {
        return res
          .status(400)
          .send({ success: false, msg: "something went wrong" });
      }
    } else {
      return res
        .status(400)
        .send({ success: false, msg: "something went wrong" });
    }

    if (validateEmail(inputType)) {
      const hash = CryptoJS.SHA256(req.body.oldPassword).toString(
        CryptoJS.enc.Hex
      );
      const newPassword = CryptoJS.SHA256(req.body.newPassword).toString(
        CryptoJS.enc.Hex
      );

      let getUserDetails = await registerModel.checkUserFromEmail(inputType);

      if (getUserDetails.length > 0) {
        if (getUserDetails[0].password !== hash) {
          return res.status(400).send(response(false, "Old password is wrong"));
        }

        if (getUserDetails[0].password === newPassword) {
          return res
            .status(400)
            .send({
              success: false,
              msg: "Old password and New Password Are Same",
            });
        }

        let checkpassword = await registerModel.checkpassword(inputType, hash);

        if (checkpassword.length > 0) {
          let updatePassword = await registerModel.updatePassword(
            newPassword,
            inputType
          );
          let mailmsg = ``;
          let headerMSG = `Change password`;
          let headerMSG1 = `<h3>Your Password Changed Successfully!</h3>`;
          await emailActivity.Activity(
            inputType,
            `Change password`,
            headerMSG,
            headerMSG1,
            mailmsg
          );
          if (updatePassword) {
            return res
              .status(200)
              .send(response(true, "Password updated successfully"));
          } else {
            return res
              .status(400)
              .send(response(false, "Password updation failed"));
          }
        } else {
          return res.status(400).send(response(false, "Old password is wrong"));
        }
      } else {
        return res
          .status(400)
          .send(response(false, "No Email Found Try With Other"));
      }
    } else if (validatePhoneNumber(inputType)) {
      const hash = CryptoJS.SHA256(req.body.oldPassword).toString(
        CryptoJS.enc.Hex
      );
      const newPassword = CryptoJS.SHA256(req.body.newPassword).toString(
        CryptoJS.enc.Hex
      );

      let getUserDetails = await registerModel.checkUserFromPhone(inputType);

      if (getUserDetails.length > 0) {
        if (getUserDetails[0].password !== hash) {
          return res.status(400).send(response(false, "Old password is wrong"));
        }

        if (getUserDetails[0].password === newPassword) {
          return res
            .status(400)
            .send({
              success: false,
              msg: "Old password and New Password Are Same",
            });
        }

        let checkpassword = await registerModel.checkPhonepassword(
          inputType,
          hash
        );

        if (checkpassword.length > 0) {
          let updatePassword = await registerModel.updatePhonePassword(
            newPassword,
            inputType
          );

          let mailmsg = ``;
          let headerMSG = `Change password`;
          let headerMSG1 = `<h3>Your Password Changed Successfully!</h3>`;

          // await smsActivity.Activity(
          //   inputType,
          //   `Change password`,
          //   headerMSG,
          //   headerMSG1,
          //   mailmsg
          // );
          if (updatePassword) {
            return res
              .status(200)
              .send(response(true, "Password updated successfully"));
          } else {
            return res
              .status(400)
              .send(response(false, "Password updation failed"));
          }
        } else {
          return res.status(400).send(response(false, "Old password is wrong"));
        }
      } else {
        return res
          .status(400)
          .send(response(false, "No Email Found Try With Other"));
      }
    } else {
      return res.status(400).send(response(false, "Invalid input!!"));
      // Handle the case where neither email nor phone number is valid
    }
  } catch (err) {
    return res.status(500).send(response(false, message.catchMessage));
  }
};

//-----------------------------|| SOCIAL MEDIA REGISTRATION ||---------------------------

exports.socialLogin = async (req, res) => {
  try {
    let data = req.body;

    const client = new OAuth2Client(config.googleClientId);

    // Call the verifyIdToken to
    // varify and decode it
    const ticket = await client.verifyIdToken({
      idToken: data.credential,
      audience: config.googleClientId,
    });

    // Get the JSON with all the user info
    const payload = ticket.getPayload();
    let checkUser = await registerModel.checkUserFromEmail(payload.email);
    if (checkUser.length > 0) {
      if (checkUser[0].status === 1) {
        const jwtToken = jwt.sign(
          {
            email: checkUser[0].email,
            id: checkUser[0].id,
          },
          process.env.JWTSECRETKEY
        );
        return res.status(200).send(
          response(true, "Login Successfully", {
            jwt: jwtToken,
            userId: checkUser[0].id,
            email: checkUser[0].email,
            status: checkUser[0].status,
            loginType: checkUser[0].loginType,
          })
        );
      } else {
        return res
          .status(200)
          .send(response(false, "User is blocked by Admin"));
      }
    } else {
      let referralCode = randomString(
        10,
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
      );
      let user = {
        firstName: payload.name,
        email: payload.email,
        referralCode: referralCode,
        loginType: 1,
      };
      let insert = await registerModel.insertData(user);
      if (insert) {
        const jwtToken = jwt.sign(
          {
            email: data.email,
            id: insert.insertId,
          },
          process.env.JWTSECRETKEY
        );
        return res.status(200).send(
          response(true, "Login Successfully", {
            jwt: jwtToken,
            userId: insert.insertId,
            email: payload.email,
            status: 1,
            loginType: 1,
          })
        );
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(200).send(response(false, message.catchMessage));
  }
};

//-----------------------------|| GET USER DETAIL BY ID ||---------------------------

exports.getUserDetails = async (req, res) => {
  try {
    let getUserDetails = await registerModel.getUserDetails(req.userId);
    if (getUserDetails.length > 0) {
      return res
        .status(200)
        .send(response(true, "Get User Details", getUserDetails[0]));
    }
    return res.status(400).send(response(false, "No Data Found"));
  } catch (Err) {
    return res.status(400).send(response(false, message.catchMessage));
  }
};

//-----------------------------|| UPDATE USER ||---------------------------

exports.UpdateUserDetails = async (req, res) => {
  try {
    let data = req.body;
    let file = req?.files;

    let newData;

    if (file?.profilePic) {
      newData = {
        userId: req.userId,
        fullName: data.fullName,
        profilePic: file?.profilePic[0]?.filename,
      };
    } else {
      newData = {
        userId: req.userId,
        fullName: data.fullName,
      };
    }

    let updateProfile = await registerModel.updateProfile(newData);
    if (updateProfile) {
      return res.status(200).send(response(true, "Profile updated!!!"));
    } else {
      return res.status(400).send(response(false, "No Data Found"));
    }
  } catch (error) {
    return res.status(400).send(response(false, message.catchMessage));
  }
};

exports.UpdateUserDetailOnCheckout = async (req, res) => {
  try {
    let data = req.body;
    let newData = {
      userId: req.userId,
    };
    let updateProfile = await registerModel.UpdateUserDetailOnCheckout(newData);
    if (updateProfile) {
      return res.status(200).send(response(true, "Profile updated!!!"));
    } else {
      return res.status(400).send(response(false, ""));
    }
  } catch (error) {
    return res.status(400).send(response(false, message.catchMessage));
  }
};


//................Login With Gooogle Check Login Status..........................//

exports.getGoogleLoginDetail = async (req, res) => {
  try {
    // let data = req.body;
    const { email, displayName, photoURL, uid, role, gstNo,shopName} = req.body;


    const data ={
      email, displayName, photoURL, uid, role,gstNo,
      shopName
    }
    let files = req.files;

    if (role == "vendor") {
      if (email.length > 0) {
        let checkUser = await registerModel.checkUserFromEmail(email);

        if (checkUser.length > 0) {

          if (checkUser[0].status === 1) {
            const jwtToken = jwt.sign(
              {
                email: checkUser[0].email,
                id: checkUser[0].id,
              },
              process.env.JWTSECRETKEY
            );
            return res.status(200).send(
              response(true, "Login Successfully", {
                jwt: jwtToken,
                userId: checkUser[0].id,
                email: checkUser[0].email,
                status: checkUser[0].status,
                loginType: checkUser[0].loginType,
              })
            );
          } else {
            return res
              .status(200)
              .send(response(false, "Login Successfully account approval is pending. Once approved by the admin, you will be able to login."));
          }
        } else {

           
          let image;
          if (photoURL.length > 0) {
            let imageUrl = photoURL;
            const response = await axios.get(imageUrl, {
              responseType: "arraybuffer",
            });
            // Determine file extension
            const extension = path.extname(imageUrl);
            // Generate a unique filename
            const filename = `image_${Date.now()}${extension}`;
            // Save image to public folder

            const imagePath = path.join(
              __dirname,
              "..",
              "..",
              "public",
              filename
            );

            // Save image to public folder
            fs.writeFileSync(imagePath, response.data);
            // Save image path to database
            image = `public/${filename}`;
          }

          let pass = 123456789;
          const hash = CryptoJS.SHA256(pass).toString(CryptoJS.enc.Hex);

          let loginStatus;
          if (role == "user") {
            loginStatus = true;
          } else {
            loginStatus = false;
          }
          let referralCode = randomString(
            10,
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
          );
          // email, displayName, photoURL, uid

          let user;
          if (photoURL.length > 0) {
            user = {
              fullName: displayName,
              email:data.email,
              password: hash,
              loginType: role,
              status: loginStatus,
              referralCode: referralCode,
              uuId: data.uid,
              profilePic: image,
              gstNo: data.gstNo,
              shopName:  data.shopName,
              adharFront: files?.adharFront[0]?.filename,
              adharBack: files?.adharback[0]?.filename,
              panCard: files?.panCard[0]?.filename,
            };
          } else {
            user = {
              fullName: displayName,
              email: email,
              password: hash,
              loginType: role,
              status: loginStatus,
              referralCode: referralCode,
              uuId: data.uid,
              gstNo: data.gstNo,
              shopName: data.shopName,
              adharFront: files?.adharFront[0]?.filename,
              adharBack: files?.adharback[0]?.filename,
              panCard: files?.panCard[0]?.filename,
            };
          }

          let insert = await registerModel.insertData(user);

          if (insert[0]) {
            return res.status(400).send({
              success: false,
              msg: "This Email Already Registered!!",
            });

            // .send(response(false, "This Email Already Registered!!"));
          } else {

            let uerData = {
              inputType: email,
              loginType: role,
            };


            let mailmsg = ``;
            let headerMSG = `Registered Successfully`;
            let headerMSG1 = `<h3>You are Registered successfully with Hardware Application</h3>`;
            
            await emailActivity.Activity(
              data.email,
              "Registered Successfully",
              headerMSG,
              headerMSG1,
              mailmsg
            );

            let getUser = await registerModel.checkUserlogin(uerData);

            let notificationDeatils = {
              notificationToAdmin: 1,
              notificationBy: getUser[0]?.id,
              message: "New Vendor Signup",
              redirect_url: "vendor",
            };

            await NotificationActivity(notificationDeatils);

            const jwtToken = jwt.sign(
              {
                email: email,
                id: insert.insertId,
              },
              process.env.JWTSECRETKEY
            );
            return res.status(200).send(
              response(true, "Login Successfully account approval is pending. Once approved by the admin, you will be able to login.", {
                jwt: jwtToken,
                userId: insert.insertId,
                email: email,
                loginType: role,
                status: 0,
              })
            );
          }
        }

        
      } else {
        return res.status(400).send(response(false, "email is not found "));
      }
    }

  } catch (err) {
    console.log(err);
    return res.status(200).send(response(false, message.catchMessage));
  }
};







//................Login With Gooogle..........................//
exports.googleLogin = async (req, res) => {
  try {
    let data = req.body;
    let files = req.files;

    const { email, displayName, photoURL, uid, role } = data;

    if (role == "user") {
      if (email.length > 0) {
        let checkUser = await registerModel.checkUserFromEmail(email);

        if (checkUser.length > 0) {
          if (checkUser[0].status === 1) {
            const jwtToken = jwt.sign(
              {
                email: checkUser[0].email,
                id: checkUser[0].id,
              },
              process.env.JWTSECRETKEY
            );
            return res.status(200).send(
              response(true, "Login Successfully", {
                jwt: jwtToken,
                userId: checkUser[0].id,
                email: checkUser[0].email,
                status: checkUser[0].status,
                loginType: checkUser[0].loginType,
              })
            );
          } else {
            return res
              .status(200)
              .send(response(false, "Login Successfully account approval is pending. Once approved by the admin, you will be able to login."));
          }
        } else {
          let pass = 123456789;
          const hash = CryptoJS.SHA256(pass).toString(CryptoJS.enc.Hex);

          let loginStatus;
          if (role == "user") {
            loginStatus = true;
          } else {
            loginStatus = false;
          }
          let referralCode = randomString(
            10,
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
          );
          // email, displayName, photoURL, uid

          let image;
          let user;

          if (photoURL.length > 0) {
            let imageUrl = photoURL;
            const response = await axios.get(imageUrl, {
              responseType: "arraybuffer",
            });
            // Determine file extension
            const extension = path.extname(imageUrl);
            // Generate a unique filename
            const filename = `${Date.now()}${extension}`;
            // Save image to public folder
            const imagePath = path.join(
              __dirname,
              "..",
              "..",
              "public",
              filename
            );

            // Save image to public folder
            fs.writeFileSync(imagePath, response.data);
            // Save image path to database
            image = `${filename}`;

            user = {
              fullName: displayName,
              email: email,
              password: hash,
              loginType: role,
              status: loginStatus,
              referralCode: referralCode,
              uuId: uid,
              profilePic: image,
            };
          } else {
            user = {
              fullName: displayName,
              email: email,
              password: hash,
              loginType: role,
              status: loginStatus,
              referralCode: referralCode,
              uuId: uid,
            };
          }

          let insert = await registerModel.insertData(user);

          if (insert[0]) {
            return res.status(400).send({
              success: false,
              msg: "This Email Already Registered!!",
            });

          } else {
            let uerData = {
              inputType: email,
              loginType: role,
            };

            let mailmsg = ``;
            let headerMSG = `Registered Successfully`;
            let headerMSG1 = `<h3>You are Registered successfully with Hardware Application</h3>`;
            await emailActivity.Activity(
              email,
              "Registered Successfully",
              headerMSG,
              headerMSG1,
              mailmsg
            );

            let getUser = await registerModel.checkUserlogin(uerData);

            let notificationDeatils = {
              notificationToAdmin: 1,
              notificationBy: getUser[0]?.id,
              message: "New User Signup",
              redirect_url: "users",
            };

            await NotificationActivity(notificationDeatils);

            const jwtToken = jwt.sign(
              {
                email: email,
                id: insert.insertId,
              },
              process.env.JWTSECRETKEY
            );
            return res.status(200).send(
              response(true, "Login Successfully", {
                jwt: jwtToken,
                userId: insert.insertId,
                email: email,
                loginType: role,
                status: 1,
              })
            );
          }
        }
      } else {
        return res.status(400).send(response(false, "email is not found "));
      }
    }


    if (role == "vendor") {
      if (email.length > 0) {
        let checkUser = await registerModel.checkUserFromEmail(email);

        if (checkUser.length > 0) {
          if (checkUser[0].status === 1) {
            const jwtToken = jwt.sign(
              {
                email: checkUser[0].email,
                id: checkUser[0].id,
              },
              process.env.JWTSECRETKEY
            );
            return res.status(200).send(
              response(true, "Login Successfully", {
                jwt: jwtToken,
                userId: checkUser[0].id,
                email: checkUser[0].email,
                status: checkUser[0].status,
                loginType: checkUser[0].loginType,
              })
            );
          } else {
            return res
              .status(200)
              .send(response(true, "Login Successfully account approval is pending. Once approved by the admin, you will be able to login."));
          }
        } else {

          return res.status(400).send(
            response(false, "New Retailer Please Upload full documents ", data)
          );
        }
      }

      else {
        return res.status(400).send(response(false, "email is not found "));
      }
    }
    
  } catch (err) {
    console.log(err);
    return res.status(200).send(response(false, message.catchMessage));
  }
};
