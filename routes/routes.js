const express = require("express");
let multer = require("multer");
const router = express.Router();
const cron = require("node-cron");
const path = require("path");
const fs = require("fs");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {

    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    let filetype = "";
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    }
    if (file.mimetype === "image/jpg") {
      filetype = "jpg";
    }
    if (file.mimetype === "video/mp4") {
      filetype = "mp4";
    }
    if (file.mimetype == "image/webp") {
      filetype = "webp";
    }
    if (file.mimetype === "application/pdf") {
      filetype = "pdf";
    }

    if (!filetype) {
      filetype = "png";
    }

    cb(null, Date.now() + "." + filetype);
  },
});
const getFile = require("../Controllers/getFile");

router.get("/public/:image", getFile.getImage);
router.get("/public/invoices:image", getFile.getImage);




router.get("/uploads/:image", getFile.getImage);
router.get("/uploads/flag/:image", getFile.getFlagImage);

let upload = multer({ storage: storage });

let profileUplaod = upload.fields([
  { name: "passport", maxCount: 1 },
  { name: "profilePic", maxCount: 1 },
  { name: "adharFront", maxCount: 1 },
  { name: "adharback", maxCount: 1 },
  { name: "panCard", maxCount: 1 },
  { name: "feedbackImage", maxCount:10 },


]);

//-------------------------------------------------------------------

const getBanner = require('../Controllers/getFile');
router.get("/uploads/bannerVideo/:video", getBanner.getBannerVideo);

//-----------------------------|| VALIDATION'S ||---------------------------

const {
  registerValidator,
  loginValidator,
  forgetPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
  googleLoginValidator,
  updateUserDetailsValidator,
  insertAddressValidator,
  otpVerificationValidator,
  updateAddressValidator,
  AddToCartValidator,
  AddToWishlistValidator,
  deleteUserAddressValidator,
  getProductDetailByIdValidator,
  insertOrderDetailValidator,
  insertContactUsValidator
} = require("../Middleware/userMiddleware/Validator");

const { ensureWebToken, ima } = require("../Middleware/userMiddleware/Auth");

//-----------------------------|| CONTROLLER'S ||---------------------------

const registerController = require("../Controllers/userController/registerController");
const productController = require("../Controllers/userController/productController");
const cartController = require("../Controllers/userController/cartController");
const wishlistController = require("../Controllers/userController/wishlistController");
const addressController = require("../Controllers/userController/addressController");
const feedbackController = require("../Controllers/userController/feedbackController");
const categoriesController = require("../Controllers/userController/categoriesController");
const regionController = require("../Controllers/userController/regionController");
const brandController = require('../Controllers/userController/brandController')
const orderController = require('../Controllers/userController/orderController')
const cmsController = require('../Controllers/userController/cmsController')

//-----------------------------|| APPLICATION CONTROLLER'S ||---------------------------

const productControllerApp = require('../Controllers/appController/productController')

//-----------------------------|| ROUTER ||---------------------------


router.post("/sendOtp", registerController.sendOtp);//done  signup for both vendor and user

router.post("/userRegister", profileUplaod,  registerController.userRegister); //done 

router.post("/vendor-otp-verify", profileUplaod,  registerController.vendorOtpVerify);//done
 
router.post("/vendorRegister", profileUplaod,  registerController.vendorRegister); //done 

router.post("/userLogin",  registerController.userLogin); //done  for both user and vendor

router.post("/socialLogin", registerController.socialLogin);//pending 


//-----------------------------|| Login with Google ||---------------------------
router.post("/CheckgoogleLogin",profileUplaod, registerController.getGoogleLoginDetail);// google

router.post("/googleLogin",profileUplaod, registerController.googleLogin);// google


//-----------------------------|| USER DETAILS AND PASSWORD ||---------------------------

router.post("/forgotPassword", registerController.forgotPassword); //1 done

router.post('/otpVerification',registerController.otpVerification)//2 done

router.post("/resetpassword", registerController.resetpassword);//3 done

router.post("/changepassword", ensureWebToken, registerController.changepassword); // done

router.get("/getUserDetails", ensureWebToken, registerController.getUserDetails); // done

router.post("/UpdateUserDetails",profileUplaod, ensureWebToken, registerController.UpdateUserDetails); //done

router.put('/UpdateUserDetailOnCheckout', ensureWebToken, registerController.UpdateUserDetailOnCheckout) //pending



//-----------------------------|| CATEGORIES ||---------------------------

router.get("/getCategoryList", categoriesController.getCategoryList); //done

router.get("/getSubCategoryList", categoriesController.getSubCategoryList);
router.get("/getInnerCategoryList", categoriesController.getInnerCategoryList);
router.get("/getProductTypeList", categoriesController.getProductTypeList);
router.get("/getCategoryListForMobile", categoriesController.getCategoryListForMobile);
router.post("/getSizesListBySubCategory", categoriesController.getSizesListBySubCategory);
router.get('/getBannerVideo', categoriesController.getBannerVideo)


//-----------------------------|| banner Image ||---------------------------

router.get("/getBannerImage", categoriesController.getBannerImage); //done

//-----------------------------|| Search  ||---------------------------

router.post("/searchProductList",ensureWebToken,  productController.searchProductList);//done..

//-----------------------------|| PRODUCTS ||---------------------------

router.get("/getProductList", productController.getProductList);//done

router.post("/getcategoryById",ensureWebToken,  productController.getInnerProductList);//done

router.get("/getdealOfTheDay", productController.getDealProducts);//done

router.post("/getsearchListForHome", productController.getSerachProductList);//done

router.get("/getpopularproduct", productController.getPopularProducts );//done

router.post("/getProductDetailById",ensureWebToken,  getProductDetailByIdValidator, productController.getProductDetailById);

router.get('/getAllProductListForHome', productController.getAllProductListForHome)
router.post('/fatchAllProductData', productController.fatchAllProductData)
router.get('/getProductTypeDropdown', categoriesController.getProductTypeDropdown)
router.get('/getProductFinalProductList', productController.getProductFinalProductList)
router.post("/filterProducts", productController.filterProducts);
router.get('/getProductByColor', productController.getProductByColor)
router.post("/getItemCombination", productController.getItemCombination);
router.get("/getRegionList", regionController.getRegionList);
router.get('/getBrandList', brandController.getBrandList)
router.get('/getColorsList', productController.getColorsList);



//------------------------------------|| Coupouns ||-------------------------------------

router.post('/checkPromocode', ensureWebToken, orderController.checkPromocode)

router.get('/allPromocode', ensureWebToken, orderController.AllPromocode)

//------------------------------------|| CART ||-------------------------------------


router.post("/AddToCart", AddToCartValidator, ensureWebToken, cartController.AddToCart);//done
router.post("/updateCartItem", ensureWebToken, cartController.updateCartItem);


// router.put("/updateCartStatus", ensureWebToken, cartController.updateCartStatus);
router.get("/getCartItems", ensureWebToken, cartController.getCartItems);//done
router.post("/removeFromCart", ensureWebToken, cartController.removeFromCart);//done

 //router.put("/updateCartSizeAndQuantity", ensureWebToken, cartController.updateCartSizeAndQuantity);


//-----------------------------|| ORDER ||---------------------------

router.post('/insertOrderDetail',ensureWebToken, orderController.insertOrderDetail)
router.post('/updateOrderafterPayment',ensureWebToken, orderController.updateOrderDetailAfterPayment)


router.get('/getOrderListByUserId', ensureWebToken, orderController.getOrderListByUserId)

router.post('/cancelAndRemoveOrder', ensureWebToken, orderController.cancelAndRemoveOrder)

router.post('/cancelThisOrder', ensureWebToken, orderController.cancelThisOrder)
router.post('/returnThisOrder', ensureWebToken, orderController.returnThisOrder)
router.post('/getOrderDetailsById', ensureWebToken, orderController.getOrderDetailsById)
router.get('/getDeliveryChargesAndTaxes', orderController.getDeliveryChargesAndTaxes)
router.get('/getCancelAndReturnOrderByItemId', ensureWebToken, orderController.getCancelAndReturnOrderByItemId)
router.get('/getSupplierList', orderController.getSupplierList)
router.post('/checkProductQuantity', orderController.checkProductQuantity)

router.post('/paymentIntent', ensureWebToken, orderController.paymentIntent);
router.post('/updateOrderPaymentStatus', ensureWebToken, orderController.updateOrderPaymentStatus)
router.post('/updateOrderCodStatus', ensureWebToken, orderController.updateOrderCodStatus);


//-----------------------------|| WISHLIST ||---------------------------

router.post("/AddToWishlist", AddToWishlistValidator, ensureWebToken, wishlistController.AddToWishlist);//done 
// router.put("/updateWishlistStatus", ensureWebToken, wishlistController.updateWishlistStatus);
router.get("/getWishlistList", ensureWebToken, wishlistController.getWishlistList);//done
// router.get("/getWishlistCount", ensureWebToken, wishlistController.getWishlistCount);  
router.put("/updateWishlistSize", ensureWebToken, wishlistController.updateWishlistSize);

//-----------------------------|| ADDRESS ||---------------------------

router.get("/getUserAddressList",ensureWebToken, addressController.getUserAddressList);
router.post("/insertUserAddress",  ensureWebToken, addressController.insertUserAddress);
router.post("/updateAddressList", ensureWebToken, addressController.updateUserAddress);
router.post("/deleteUserAddress",deleteUserAddressValidator, ensureWebToken, addressController.deleteUserAddress
);


//-----------------------------||Notification ||---------------------------

router.get("/get-notification",ensureWebToken, cmsController.getNotification);

//-----------------------------|| terms & condtion  ||---------------------------
router.get('/get-terms-and-condtion', cmsController.getTnc)

//-----------------------------|| FAQ  ||---------------------------
router.get('/get-faq', cmsController.getFaq)


//-----------------------------|| Privacy Policy  ||---------------------------


router.get("/get-Policy",cmsController.getPrivacyPolcies)


//-----------------------------|| About US  ||---------------------------


router.get("/aboutus",cmsController.getAboutUs)


//-----------------------------|| CMS ||---------------------------

router.get('/getCMSContentByRoute', cmsController.getCMSContentByRoute)
router.get('/getCMSPages', cmsController.getCMSPages)
//router.get('/insertContactUs',insertContactUsValidator, cmsController.insertContactUs)
router.post('/insertContactUs',insertContactUsValidator, cmsController.insertContactUs)



//-----------------------------|| master Data ||---------------------------

router.get('/get-master-data', cmsController.getMasterData)
//-----------------------------|| FEEDBACK ||---------------------------

router.post("/insertFeedback", profileUplaod, ensureWebToken, feedbackController.insertFeedback); //done
router.get("/getFeedback",feedbackController.getFeedback); //done


router.post('/insertContentFeedbackMsg', feedbackController.insertContentFeedbackMsg)

router.get('/getContentFeedbackMsg', feedbackController.getContentFeedbackMsg)

//---------------------------------------|| APPLICATION API'S ||----------------------------------------

router.get('/recommendedProductListById', productControllerApp.recommendedProductListById)
router.get('/getProductListByBrandId', productControllerApp.getProductListByBrandId)
router.get('/getProductListForHomeApp', productControllerApp.getProductListForHomeApp)
router.get('/getActiveOrderListByUserIdApp',ensureWebToken, productControllerApp.getActiveOrderListByUserIdApp)
router.get('/getOtherOrderHistoryByUserIdApp', ensureWebToken, productControllerApp.getOtherOrderHistoryByUserIdApp)
router.get('/getProductTypeListBySubCategoryIdApp', productControllerApp.getProductTypeListBySubCategoryIdApp)
router.get('/productListByProductTypeIdApp', productControllerApp.productListByProductTypeIdApp)
router.post("/getProductDetailByIdApp", getProductDetailByIdValidator, productControllerApp.getProductDetailByIdApp);
router.post("/getItemCombinationApp", productControllerApp.getItemCombinationApp);
router.post("/getSizesListBySubCategoryApp", productControllerApp.getSizesListBySubCategoryApp);
router.post("/searchProductListApp", productControllerApp.searchProductListApp);




//-----------------------------|| TASK API ||---------------------------

router.get("/getproductListTask", productController.getProductListTask);

//--------------------------------|| VALIDATING ROUTES ||-------------------------------------

router.all("*", function (req, res) {
  return res.status(200).json({
    code: 200,
    data: null,
    msg: "Invalid Request {URL Not Found}",
  });
});

module.exports.routes = router;
