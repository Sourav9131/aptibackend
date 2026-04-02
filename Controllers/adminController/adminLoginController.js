const adminModel = require("../../Models/adminModel/adminModel");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const { response, message } = require("../../utils/response");

exports.adminLogin = async (req, res) => {
  
  try {
    let getAdminDetails = await adminModel.getAdminDetails(req.body);
    const passwordHash = CryptoJS.SHA256(req.body.password).toString(
      CryptoJS.enc.Hex
    );
    if (getAdminDetails.length > 0) {
      if (getAdminDetails[0].password == passwordHash) {
        const jwtToken = jwt.sign(
          {
            email: req.body.email,
            id: getAdminDetails[0].id,
            role: "admin",
          },
          process.env.ADMINJWTSECRETKEY,
          {
            expiresIn: process.env.SESSIONEXPIRESIN,
          }
        );
        return res.status(200).send(
          response(true, "Login successfully", {
            id: getAdminDetails[0].id,
            adminUser: getAdminDetails[0].name,
            image: getAdminDetails[0].image,
            authToken: jwtToken,
            
          })
        );
      } else {
        return res.status(200).send(response(false, "Password does not match"));
      }
    } else {
      return res
        .status(200)
        .send(response(false, "Invalid credentials!"));
    }
  } catch (error) {
    console.log(error)
    return res.status(200).send(response(false, message.errorMessage));
  }
};

exports.adminChangePassword = async (req, res) => {
  try {

    let getAdminInfo = await adminModel.getAdminInfo(req.adminId);
   
    if (getAdminInfo.length > 0) {
      let currentPassword = CryptoJS.SHA256(req.body.currentPassword).toString(
        CryptoJS.enc.Hex
      );

      if (currentPassword == getAdminInfo[0].password) {
        let newPassword = CryptoJS.SHA256(req.body.newPassword).toString(
          CryptoJS.enc.Hex
        );

        let confirm = CryptoJS.SHA256(
          req.body.confirmPassword
        ).toString(CryptoJS.enc.Hex);

        if (newPassword == confirm) {
          let response = await adminModel.adminUpdatePassword(
            newPassword,
            getAdminInfo[0].email
          );

          if (response) {
            return res.status(200).send({
              success: true,
              msg: "Password updated successfully",
            });
          } else {
            return res.status(200).send({
              success: false,
              msg: "Unable to update password Please try again!",
            });
          }
        } else {
          return res.status(200).send({
            success: false,
            msg: "New password and confirm password does not match",
          });
        }
      } else {
        return res.status(200).send({
          success: false,
          msg: "Old password does not match",
        });
      }
    } else {
      return res.status(200).send({
        success: false,
        msg: "Invalid user! Please check user credetails",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(200).send({
      success: false,
      msg: "Internal server error",
    });
  }
};


