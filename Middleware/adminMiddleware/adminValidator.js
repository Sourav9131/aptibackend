exports.loginValidator = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.email
        ? "email is empty"
        : typeof data.email != "string"
          ? "email is not string"
          : !data.email.match(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/)
            ? "Please enter a valid email"
            : !data.password
              ? "password is empty"
              : // !data.password.match('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})') ? "Please enter a valid password with 1  UpperCase 1 lowerCase 1 Special and 1 numeric and Minimum 8 Length" :
              "";
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};


exports.changePasswordValidator = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.newPassword.match(/^(?=.*\d)(?=.*[!@#$%^&*()-=_+~])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
        ? "Please enter a valid password with 1 Uppercase, 1 lowercase, 1 special character, 1 numeric, and minimum 8 characters in length"
        : !data.confirmPassword
          ? "Confirm Password Is Required"
          : !data.newPassword !== !data.confirmPassword
            ? "Confirm password does not match with New Password"
            : "";

  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

exports.addCategoryValidator = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.categoryName
        ? "Category Name Is Required"
        : !data.categoryName.match(/^[a-zA-Z]*$/)
          ? "Please enter a valid Category Name"
          :
          "";
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

exports.categoryValidator = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.categoryName
        ? "Category Name Is Required"
        : !data.categoryName.match(/^[a-zA-Z]*$/)
          ? "Please enter a valid Category Name"
          : !data.id
            ? "Id Is Required"
            :
            "";
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

//-------------------------------|| SUB CATEGORY VALIDATION ||-------------------------------

exports.addSubCategoryValidator = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.subCategoryName
        ? "Sub Category Name Is Required"
        : !data.subCategoryName
          ? "Please enter a valid Sub Category Name"
          :
          "";
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

exports.subCategoryValidator = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.subCategoryName
        ? "Sub Category Name Is Required"
        : !data.subCategoryName
          ? "Please enter a valid Sub Category Name"
          : !data.id
            ? "Id Is Required"
            :
            "";
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

exports.addProductValidator = async (req, res, next) => {
  try {
    const data = req.body;
    let errorMsg = "";

    switch (true) {
      case Object.keys(data).length === 0:
        errorMsg = "You Have Not Entered Any Data";
        break;
      case !data.productName:
        errorMsg = "Product Name Is Required";
        break;
      case !data.price:
        errorMsg = "Price Is Required";
        break;
      case !/^[0-9]/.test(data.price):
        errorMsg = "Price Should be In Number";
        break;
      case data.image:
        errorMsg = "Product Image Is Required";
        break;
      case data.categoryId:
        errorMsg = "categoryId Is Required";
        break;
      case data.subCategoryId:
        errorMsg = "subCategoryId Is Required";
        break;
    }

    if (errorMsg === "") {
      next();
    } else {
      return res.status(200).json({ success: false, error: errorMsg });
    }
  } catch (err) {
    return res.status(500).send({ success: false, error: err.message });
  }
};

//-------------------------------|| INNER CATEGORY VALIDATION ||-------------------------------

exports.addInnerCategoryValidator = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.innerCategoryName
        ? "Inner Category Name is Required"
        : !data.innerCategoryName
          ? "Please enter a valid Inner Category Name"
          : !data.categoryId
            ? "Category Id is Required"
            : !data.subCategoryId
              ? "Sub Category Id is Required"
              :
              ""
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

exports.getInnerCategoryByIdValidation = async (req, res, next) => {
  const data = req.query;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.categoryId
        ? "Category Id is Required"
        : !data.subCategoryId
          ? "Sub Category Id is Required"
          :
          ""
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

exports.updateInnerCategoryValidator = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.innerCategoryName
        ? "Inner Category Name is Required"
        : !data.innerCategoryName
          ? "Please enter a valid Inner Category Name"
          : !data.id
            ? "Id is Required"
            : ""
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

exports.deleteCategoryStatusValidation = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.status
        ? "Status is Required"
        : !data.id
          ? "Id is Required"
          :
          ""
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

//-------------------------------|| PRODUCT TYPE VALIDATION ||-------------------------------

exports.insertProductTypeValidator = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.productTypeName
        ? "Product Type Name is Required"
        : !data.productTypeName
          ? "Please enter a valid Product Type Name"
          : !data.categoryId
            ? "Category Id is Required"
            : !data.subCategoryId
              ? "Sub Category Id is Required"
              : !data.innerCategoryId
                ? "Inner Category Id is Required"
                : ""
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

exports.getProductTypeByIdValidation = async (req, res, next) => {
  const data = req.query;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.categoryId
        ? "Category Id is Required"
        : !data.subCategoryId
          ? "Sub Category Id is Required"
          : !data.innerCategoryId
            ? "Inner Category Id is Required"
            : ""

  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

exports.updateProductTypeValidator = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.productTypeName
        ? "Product Type Name is Required"
        : !data.productTypeName
          ? "Please enter a valid Product Type Name"
          : !data.id
            ? "Id is Required"
            : ""
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

exports.deleteProductTypeStatusValidation = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.status
        ? "Status is Required"
        : !data.id
          ? "Id is Required"
          :
          ""
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};


exports.userStatusUpdateValidator = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.status
        ? "Status is Required"
        : !data.id
          ? "Id is Required"
          :
          ""
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

exports.insertRegionNameValidation = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.regionName
        ? "Region Name is Required"
        : !data.currency
          ? "Currency is Required"
          :
          ""
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

exports.updateRegionNameValidation = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.regionName
        ? "Region Name is Required"
        : !data.currency
          ? "Currency is Required"
          : !data.id
            ? "Id is Required"
            :
            ""
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

exports.updateRegionStatusValidation = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.status
        ? "Status is Required"
        : !data.id
          ? "Id is Required"
          :
          ""
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

exports.insertBrandNameValidation = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    !data.brandName
      ? "Brand Name is Required"
      :
      ""
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

exports.updateBrandNameValidation = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.brandName
        ? "Brand Name is Required"
        : !data.id
          ? "Id is Required"
          :
          ""
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

exports.updateBrandStatusValidation = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.status
        ? "Status is Required"
        : !data.id
          ? "Id is Required"
          :
          ""
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

exports.insertPromocodeValidation = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.promoCode
        ? "Promo Code is Required"
        : !data.discount
          ? "Discount is Required"
          : !data.validFrom
            ? "Valid From is Required"
            : !data.validTo
              ? "Valid To is Required"
              :
              ""
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

exports.updatePromocodeValidation = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.promoCode
        ? "Promo Code is Required"
        : !data.discount
          ? "Discount is Required"
          : !data.validFrom
            ? "Valid From is Required"
            : !data.validTo
              ? "Valid To is Required"
              : !data.id
                ? "Id is Required"
                :
                ""
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

exports.updatePromocodeStatusValidation = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.status
        ? "status Code is Required"
        : !data.id
          ? "Id is Required"
          :
          ""
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

//-----------------------|| SIZE VALIDATION ||---------------------------

exports.addSizeValidation = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.sizeName
        ? "Size Name is Required"
        : !data.categoryId
          ? "CategoryId is Required"
          : !data.subCategoryId
            ? "Sub CategoryId is Required"
            :
            ""
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

exports.updateSizeValidation = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "You have not entered any data"
      : !data.sizeName
        ? "Size Name is Required"
        : !data.id
          ? "id is Required"
          :
          ""
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
      break;
  }
};

exports.updateCancelAndReturnSchema = async (req, res, next) => {
  const data = req.body;
  let errorMsg = "";
  errorMsg =
    Object.keys(data).length === 0
      ? "Invalid request"
      : !data.id
        ? "Id is Required"
        : !data.orderId
          ? "Order Id is Required"
          : !data.status
            ? "Status is Required"
            :
            ""
  switch (errorMsg) {
    case "":
      next();
      break;

    default:
      return res.status(200).send({ success: false, msg: errorMsg });
  }

}