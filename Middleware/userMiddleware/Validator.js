exports.registerValidator = async (req, res, next) => {
  try {
    const data = req.body;
    let errorMsg = "";
    switch (true) {
      case Object.keys(data).length === 0:
        errorMsg = "You Have Not Entered Any Data";
        break;
      case !data.fullName:
        errorMsg = "Please Enter firstName";
        break;
      case !data.email:
        errorMsg = "Please Enter Your Email";
        break;
      case !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email):
        errorMsg = "Please Enter A Valid Email";
        break;
      case !data.password:
        errorMsg = "Please Enter Password";
        break;
      case !/(?=.*\d)(?=.*[!@#$%^&*()-=_+~])(?=.*[a-zA-Z]).{8,}/.test(
        data.password
      ):
        errorMsg =
          "Password Should Contain 8 Characters, 1 Numeric, and 1 Special Character";
        break;
    }
    if (errorMsg === "") {
      next();
    } else {
      return res.status(200).send({ success: false, msg: errorMsg });
    }
  } catch (err) {
    return res.status(500).send({ success: false, msg: err.message });
  }
};

exports.googleLoginValidator = async (req, res, next) => {
  try {
    const data = req.body;

    let errorMsg = "";

    switch (true) {
      case Object.keys(data).length === 0:
        errorMsg = "You Have Not Entered Any Data";
        break;
      case !data.email:
        errorMsg = "Please Enter Your Email";
        break;
      case !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email):
        errorMsg = "Please Enter A Valid Email";
        break;
    }

    if (errorMsg === "") {
      next();
    } else {
      return res.status(200).send({ success: false, msg: errorMsg });
    }
  } catch (err) {
    return res.status(500).send({ success: false, msg: err.message });
  }
};

exports.loginValidator = async (req, res, next) => {
  try {
    const data = req.body;

    let errorMsg = "";

    switch (true) {
      case Object.keys(data).length === 0:
        errorMsg = "You Have Not Entered Any Data";
        break;
      case !data.email:
        errorMsg = "Please Enter Your Email";
        break;

      case !data.password:
        errorMsg = "Please Enter Password";
        break;
    }

    if (errorMsg === "") {
      next();
    } else {
      return res.status(200).send({ success: false, msg: errorMsg });
    }
  } catch (err) {
    return res.status(500).send({ success: false, msg: err.message });
  }
};

exports.forgetPasswordValidator = async (req, res, next) => {
  try {
    const data = req.body;

    let errorMsg = "";

    switch (true) {
      case Object.keys(data).length === 0:
        errorMsg = "You Have Not Entered Any Data";
        break;
      case !data.email:
        errorMsg = "Please Enter Your Email";
        break;
      case !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email):
        errorMsg = "Please Enter A Valid Email";
        break;
    }

    if (errorMsg === "") {
      next();
    } else {
      return res.status(200).send({ success: false, msg: errorMsg });
    }
  } catch (err) {
    return res.status(500).send({ success: false, msg: err.message });
  }
};

exports.resetPasswordValidator = async (req, res, next) => {
  try {
    const data = req.body;

    let errorMsg = "";

    switch (true) {
      case Object.keys(data).length === 0:
        errorMsg = "You Have Not Entered Any Data";
        break;
      case !data.password:
        errorMsg = "Please Enter Password";
        break;
      case !/(?=.*\d)(?=.*[!@#$%^&*()-=_+~])(?=.*[a-zA-Z]).{8,}/.test(
        data.password
      ):
        errorMsg =
          "Password Should Contain 8 Characters, 1 Numeric, and 1 Special Character";
        break;
      case !data.confirmPassword:
        errorMsg = "Confirm Password Is Required";
        break;
      case data.password !== data.confirmPassword:
        errorMsg = "Confirm Password Does Not Match";
        break;
    }
    if (errorMsg === "") {
      next();
    } else {
      return res.status(200).send({ success: false, msg: errorMsg });
    }
  } catch (err) {
    return res.status(500).send({ success: false, msg: err.message });
  }
};

exports.changePasswordValidator = async (req, res, next) => {
  try {
    const data = req.body;
    let errorMsg = "";

    switch (true) {
      case Object.keys(data).length === 0:
        errorMsg = "You Have Not Entered Any Data";
        break;
      case !data.oldPassword:
        errorMsg = "Old Password Is Required";
        break;
      case !data.newPassword:
        errorMsg = "Please Enter New Password";
        break;
      case !/(?=.*\d)(?=.*[!@#$%^&*()-=_+~])(?=.*[a-zA-Z]).{8,}/.test(
        data.newPassword
      ):
        errorMsg =
          "Password Should Contain 8 Characters, 1 Numeric, and 1 Special Character";
        break;
      case !data.confirmPassword:
        errorMsg = "Confirm Password Is Required";
        break;
      case data.newPassword !== data.confirmPassword:
        errorMsg = "Confirm Password Does Not Match";
        break;
    }

    if (errorMsg === "") {
      next();
    } else {
      return res.status(200).json({ success: false, msg: errorMsg });
    }
  } catch (err) {
    return res.status(500).send({ success: false, msg: err.message });
  }
};

exports.updateUserDetailsValidator = async (req, res, next) => {
  try {
    const data = req.body;
    let errorMsg = "";

    switch (true) {
      case Object.keys(data).length === 0:
        errorMsg = "You Have Not Entered Any Data";
        break;
      case !data.firstName:
        errorMsg = "First Name Is Required";
        break;
      case !data.lastName:
        errorMsg = "Last Name Is Required";
        break;
      case data.phone:
        errorMsg = "Please Enter Your Mobile Number";
        break;
      case data.email:
        errorMsg = "Please Enter Your Email";
        break;
      case !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email):
        errorMsg = "Please Enter A Valid Email";
        break;
      case data.gender:
        errorMsg = "Please Enter Your Gender";
        break;
      case data.DOB:
        errorMsg = "Please Enter Your Date Of Birth";
        break;
    }

    if (errorMsg === "") {
      next();
    } else {
      return res.status(200).json({ success: false, msg: errorMsg });
    }
  } catch (err) {
    return res.status(500).send({ success: false, msg: err.message });
  }
};

exports.insertAddressValidator = async (req, res, next) => {
  try {
    const data = req.body;
    let errorMsg = "";

    switch (true) {
      case Object.keys(data).length === 0:
        errorMsg = "You Have Not Entered Any Data";
        break;
      case !data.fullName:
        errorMsg = "First Name Is Required";
        break;
      case !data.alternateNo:
        errorMsg = "alternateNo Is Required";
        break;
      case !data.address:
        errorMsg = "Address Is Required";
        break;
      case !data.city:
        errorMsg = "City Is Required";
        break;
      case !data.state:
        errorMsg = "State Is Required";
        break;
      case !data.region:
        errorMsg = "Region Is Required";
        break;
      case !data.postalCode:
        errorMsg = "Postal Code Is Required";
        break;
      case !data.countryCode:
        errorMsg = "Country Code Is Required";
        break;
      case !data.phone:
        errorMsg = "Please Enter Your Mobile Number";
        break;
      case !/^\+?[1-9][0-9]{9,14}$/.test(data.phone):
        errorMsg =
          "Please Insert A Valid Mobile Number";
        break;
    }

    if (errorMsg === "") {
      next();
    } else {
      return res.status(200).json({ success: false, msg: errorMsg });
    }
  } catch (err) {
    return res.status(500).send({ success: false, msg: err.message });
  }
};

exports.otpVerificationValidator = async (req, res, next) => {
  try {
    const data = req.body;
    let errorMsg = "";

    switch (true) {
      case Object.keys(data).length === 0:
        errorMsg = "You Have Not Entered Any Data";
        break;
      case !data.email:
        errorMsg = "Please Enter Your Email";
        break;
      case !data.otp:
        errorMsg = "OTP is required";
        break;
    }

    if (errorMsg === "") {
      next();
    } else {
      return res.status(200).send({ success: false, msg: errorMsg });
    }
  } catch (err) {
    return res.status(500).send({ success: false, msg: err.message });
  }
};

exports.updateAddressValidator = async (req, res, next) => {
  try {
    const data = req.body;
    let errorMsg = "";

    switch (true) {
      case Object.keys(data).length === 0:
        errorMsg = "You Have Not Entered Any Data";
        break;
      case !data.firstName:
        errorMsg = "First Name Is Required";
        break;
      case !data.lastName:
        errorMsg = "Last Name Is Required";
        break;
      case !data.address:
        errorMsg = "Address Is Required";
        break;
      case !data.city:
        errorMsg = "City Is Required";
        break;
      case !data.state:
        errorMsg = "State Is Required";
        break;
      case !data.region:
        errorMsg = "Region Is Required";
        break;
      case !data.postalCode:
        errorMsg = "Postal Code Is Required";
        break;
      case !data.countryCode:
        errorMsg = "Country Code Is Required";
        break;
      case !data.phone:
        errorMsg = "Please Enter Your Mobile Number";
        break;
      case !/^\+?[1-9][0-9]{9,14}$/.test(data.phone):
        errorMsg =
          "Please Insert A Valid Mobile Number";
        break;
      case !data.id:
        errorMsg = "ID Is Required";
        break;
    }

    if (errorMsg === "") {
      next();
    } else {
      return res.status(200).json({ success: false, msg: errorMsg });
    }
  } catch (err) {
    return res.status(500).send({ success: false, msg: err.message });
  }
};

exports.deleteUserAddressValidator = async (req, res, next) => {
  try {
    const data = req.body;
    let errorMsg = "";

    switch (true) {
      case !data.id:
        errorMsg = "Id Is Required";
        break;
    }
    if (errorMsg === "") {
      next();
    } else {
      return res.status(200).json({ success: false, msg: errorMsg });
    }
  } catch (err) {
    return res.status(500).send({ success: false, msg: err.message });
  }
};

exports.AddToCartValidator = async (req, res, next) => {
  try {
    const data = req.body;
    let errorMsg = "";

    switch (true) {
      case Object.keys(data).length === 0:
        errorMsg = "You Have Not Entered Any Data";
        break;
      case !data.productId:
        errorMsg = "Product ID Is Required";
        break;
    }

    if (errorMsg === "") {
      next();
    } else {
      return res.status(200).json({ success: false, msg: errorMsg });
    }
  } catch (err) {
    return res.status(500).send({ success: false, msg: err.message });
  }
};

exports.AddToWishlistValidator = async (req, res, next) => {
  try {
    const data = req.body;
    let errorMsg = "";

    switch (true) {
      case Object.keys(data).length === 0:
        errorMsg = "Something went wrong. Please try again!";
        break;
      case !data.productId:
        errorMsg = "Product ID Is Required";
        break;
    }

    if (errorMsg === "") {
      next();
    } else {
      return res.status(200).json({ success: false, msg: errorMsg });
    }
  } catch (err) {
    return res.status(500).send({ success: false, msg: err.message });
  }
};

exports.getProductDetailByIdValidator = async (req, res, next) => {
  try {
    const data = req.body;
    let errorMsg = "";

    switch (true) {
      case !data.productId:
        errorMsg = "id Is Required";
        break;
    }
    if (errorMsg === "") {
      next();
    } else {
      return res.status(200).json({ success: false, msg: errorMsg });
    }
  } catch (err) {
    return res.status(500).send({ success: false, msg: err.message });
  }
};

exports.insertOrderDetailValidator = async (req, res, next) => {
  try {
    const data = req.body;
    const item = req.body.items
    let errorMsg = "";

    switch (true) {
      case Object.keys(data).length === 0:
        errorMsg = "You Have Not Entered Any Data";
        break;
      case !data.deliveryAddress:
        errorMsg = "Delivery Address Is Required";
        break;
      case !data.paymentMethod:
        errorMsg = "Payment Method Is Required";
        break;
      case !data.totalAmount:
        errorMsg = "Total Amount Is Required";
        break;
      case !data.finalPayableAmount:
        errorMsg = "Final Payble Amount Is Required";
        break;
    }
    if (errorMsg === "") {
      next();
    } else {
      return res.status(200).json({ success: false, msg: errorMsg });
    }
  } catch (err) {
    return res.status(500).send({ success: false, msg: err.message });
  }
};

exports.insertContactUsValidator = async (req, res, next) => {
  try {
    const data = req.body;
    let errorMsg = "";

    switch (true) {
      case Object.keys(data).length === 0:
        errorMsg = "You Have Not Entered Any Data";
        break;
      case !data.name:
        errorMsg = "Name Is Required";
        break;
      case !data.email:
        errorMsg = "Email Is Required";
        break;
      case !data.subject:
        errorMsg = "Subject Is Required";
        break;
      case !data.message:
        errorMsg = "Message Is Required";
        break;
    }

    if (errorMsg === "") {
      next();
    } else {
      return res.status(200).json({ success: false, msg: errorMsg });
    }
  } catch (err) {
    return res.status(500).send({ success: false, msg: err.message });
  }
};
