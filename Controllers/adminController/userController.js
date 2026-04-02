const adminModel = require("../../Models/adminModel/adminModel");
const regionModel = require("../../Models/adminModel/regionModel");
const { response, message } = require("../../utils/response");
const CryptoJS = require("crypto-js");
const emailActivity = require("../userController/emailActivity.controller");
const registerModel = require('../../Models/userModel/registerModel')
// =============================== get User ===============================
exports.getUserList = async (req, res) => {
  try {
    let userList = await adminModel.getUserList();
    if (userList.length > 0) {
      return res
        .status(200)
        .send(response(true, "User List", userList));
    }
    return res.status(200).send(response(false, message.noDataMessage));
  } catch (Err) {
    return res.status(200).send(response(false, message.catchMessage));
  }
};


// =============================== get User by Name ===============================
exports.getUserListByName = async (req, res) => {
  try {
        let userList = await adminModel.getCustomerByName(req.body.data);
    if (userList.length > 0) {
      return res
        .status(200)
        .send(response(true, "User List", userList));
    }
    return res.status(200).send(response(false, message.noDataMessage));
  } catch (Err) {
    return res.status(200).send(response(false, message.catchMessage));
  }
};

// =============================== get Vanor ===============================
function randomString(length, chars) {
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

exports.getVendorList = async (req, res) => {
  try {
    let userList = await adminModel.getVendorList();
    if (userList.length > 0) {
      return res
        .status(200)
        .send(response(true, "Vendor List", userList));
    }
    return res.status(200).send(response(false, message.noDataMessage));
  } catch (Err) {
    return res.status(200).send(response(false, message.catchMessage));
  }
};

// =============================== add Vanor ===============================



exports.vendorRegister = async (req, res) => {
  try {
    let data = req.body;
let password= `${data.firstName}@123`
      const hash = CryptoJS.SHA256(password).toString(
        CryptoJS.enc.Hex
      );

      let referralCode = randomString(
        10,
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
      );

    
        loginStatus=0;
      let user = {
        fullName: data.fullName,
        email: data.email,
        password: hash,
        loginType: "vendor",
        status:loginStatus,
        referralCode: referralCode,
        gstNo: data.gstNo,
        phoneNo:data.phoneNo,
        shopName:data.companyName,
        address:data.address,
        adharFront: data.adharFront || "",
        adharBack: data.adharBack || "",
        panCard: data.panCard || ""
      };
     
      let insert = await registerModel.insertData(user);
     
      if (insert[0]) {

        return res
        .status(200)
        .send(response(false, "This Email Already Registered!!"));

        
      }
      else{
        let mailmsg = ` your email and password for login in the Apurva Application is
        
               email: ${data.email} and Password:${password} `;
        let headerMSG = `Registered Successfully`;
        let headerMSG1 = `<h3>You are Registered successfully with Hardware Application</h3>`;
        await emailActivity.Activity(
          data.email,
          'Registered Successfully',
          headerMSG,
          headerMSG1,
          mailmsg
        );
        return res
          .status(200)
          .send(response(true, "Registered Successsfully!!"));
      }
    
  

  } catch (err) {
    console.log(err);
    return res.status(200).send(response(false, message.catchMessage));
  }
};


// ================================  updateVandor =======================\

exports.vendorUpdate = async (req, res) => {
  try {
    let data = req.body;

        loginStatus=0;
      let user = {
        fullName: data.fullName,
        email: data.email,
        loginType: "vendor",
        gstNo: data.gstNo,
        phoneNo:data.phoneNo,
        shopName:data.shopName,
        address:data.address
      };
     
      let insert = await adminModel.updateVendorDetails(user,data.id);
     
      if (insert) {
        return res.status(200).send({ success: true, msg: "Size Updated Sucessfully" });
    } else {
        return res.status(200).send({ success: false, msg: "Unable to Update Product Size" })
    }
} catch (error) {
     return res.status(500).send(response(false, message.catchMessage));
}
    
}

// ============================== deleteVandor ===========================

exports.deleteVandor = async (req, res) => {
  try {
    let data = req.params.id
  
    let userList = await adminModel.deleteVendor(parseInt(data));
    return res.status(200).send(response(true, "Success"));
  } catch (Err) {
    return res.status(200).send(response(false, message.catchMessage));
  }
};

// =============================== User satusUpadate ===============================


exports.userStatusUpdate = async (req, res) => {
  try {
    let checkUser = await adminModel.checkUser(req.body);
    if (checkUser.length > 0) {
      let userStatusUpdateAction = await adminModel.userStatusUpdate(
        req.body, checkUser[0].id
      );
      if (userStatusUpdateAction) {
        return res.status(200).send(response(true, "Success"));
      } else {
        return res.status(200).send(response(false, message.noDataMessage));
      }
    } else {
      return res.status(200).send(response(false, message.noDataMessage));
    }
  } catch (Err) {
    return res.status(200).send(response(false, message.catchMessage));
  }
};


// =============================== vendorstatusUpodate ===============================


exports.vendorStatusUpdate = async (req, res) => {
  try {
    let checkUser = await adminModel.checkVendor(req.body);
    if (checkUser.length > 0) {
      let userStatusUpdateAction = await adminModel.vendorStatusUpdate(
        req.body, checkUser[0].id
      );
      if (userStatusUpdateAction) {
        return res.status(200).send(response(true, "Success"));
      } else {
        return res.status(200).send(response(false, message.noDataMessage));
      }
    } else {
      return res.status(200).send(response(false, message.noDataMessage));
    }
  } catch (Err) {
    return res.status(200).send(response(false, message.catchMessage));
  }
};


