const express = require("express");
const router = express.Router();
let multer = require("multer");

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
      if (file.mimetype == "image/webp") {
        filetype = "webp";
      }
      if (file.mimetype === "application/pdf") {
        filetype = "pdf";
      }
  
      if (!filetype) {
        filetype = "png";
      }
  
      let val = Math.floor(1000 + Math.random() * 9000);
      cb(null, Date.now() +val+ "." + filetype);
    },
  });

  const getFile = require('../Controllers/getFile');
const {profileUpload, documentUpload} = require('../Multer/multer');

router.get("/public/:image", getFile.getImage);
let upload = multer({ storage: storage });

let uploadCombination = upload.fields([
  { name: "combinationImage", maxCount: 1},
]);

let uploadBackgroundImage = upload.fields([
  { name: "backgroundImage", maxCount: 1},
]);

let uploadBannerImages = upload.any();

let productImageUpload = upload.fields([
  { name: "image1", maxCount:1  },
  { name: "image2", maxCount:1  },
  { name: "image3", maxCount:1  },
  { name: "image4", maxCount:1  },
  { name: "image5", maxCount:1  },
]);

//-------------------------------------------------------------------

  let flagStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/flag");
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
      if (file.mimetype == "image/webp") {
        filetype = "webp";
      }
      if (file.mimetype === "application/pdf") {
        filetype = "pdf";
      }
  
      if (!filetype) {
        filetype = "png";
      }
  
      let val = Math.floor(1000 + Math.random() * 9000);
      cb(null, Date.now() +val+ "." + filetype);
    },
  });

  const getFlagFile = require('../Controllers/getFile');

router.get("/public/flag/:image", getFlagFile.getFlagImage);
let uploadFlagImage = multer({ storage: flagStorage });

let uploadFlag = uploadFlagImage.fields([
  { name: "flag", maxCount: 1},
]);

//--------------------------------|| MIDDLEWARE ||-------------------------------------

const {loginValidator, categoryValidator, addCategoryValidator, addProductValidator, addInnerCategoryValidator, 
  updateInnerCategoryValidator, deleteCategoryStatusValidation, insertProductTypeValidator, updateProductTypeValidator, deleteProductTypeStatusValidation, 
  userStatusUpdateValidator, insertRegionNameValidation, updateRegionNameValidation, updateRegionStatusValidation, addSizeValidation, updateSizeValidation,
  insertBrandNameValidation, updateBrandNameValidation, updateBrandStatusValidation, insertPromocodeValidation, changePasswordValidator,
  updatePromocodeValidation, updatePromocodeStatusValidation } = require("../Middleware/adminMiddleware/adminValidator")
const {ensureWebTokenForAdmin}  = require("../Middleware/adminMiddleware/adminAuth")

//--------------------------------|| CONTROLLER ||-------------------------------------

const userController = require("../Controllers/adminController/userController")
const adminController = require('../Controllers/adminController/adminLoginController')
const categoryController = require('../Controllers/adminController/categoryController');
const subCategoryController = require("../Controllers/adminController/subCategoryController");
const productController = require('../Controllers/adminController/productController')
const orderController = require('../Controllers/adminController/orderController')
const innerCategoryController = require('../Controllers/adminController/innerCategoryController')
const productTypeController = require('../Controllers/adminController/productTypeController')
const sizeController = require('../Controllers/adminController/sizes')
const brandController = require('../Controllers/adminController/brandController')
const regionController = require('../Controllers/adminController/regionConrtoller')
const dashboardController = require('../Controllers/adminController/dashboard')
const deliveryAndTaxControllr =  require('../Controllers/adminController/deliveryAndTax')
const cmsController = require('../Controllers/adminController/cmsController')
const bannerVideoController = require('../Controllers/adminController/bannerImageController')



router.get("/gettnc",cmsController.getTnc)
router.get("/getPrivacy",cmsController.getPrivacyPolcies)

//--------------------------------|| ROUTES ||-------------------------------------

router.post('/adminLogin',loginValidator, adminController.adminLogin);

router.use(ensureWebTokenForAdmin)

router.get('/getDashboardStatistics', dashboardController.getDashboardStatistics)

//-----------------------------|| ADMIN PROFILE ||---------------------------

router.put("/adminChangePassword",changePasswordValidator,adminController.adminChangePassword);


//-----------------------------|| BANNER iMAGES ||---------------------------

router.post('/uploadBannerImages',uploadBannerImages,bannerVideoController.addBannerImage);
router.get('/getBannerImages',bannerVideoController.getImage);
router.put("/updateBannerStatus",bannerVideoController.imageStatusUpdate);
router.put("/deleteBannerImage",bannerVideoController.imageDelete)
//-----------------------------|| USER'S ||---------------------------

router.get("/getUserList",userController.getUserList);
router.post("/getUserByName",userController.getUserListByName)
router.post('/addVendor',userController.vendorRegister)
router.get("/getVendorList",userController.getVendorList);
router.put("/updateVendor",userController.vendorUpdate)
router.get("/deleteVendor/:id",userController.deleteVandor);
router.put("/userStatusUpdate",userStatusUpdateValidator, userController.userStatusUpdate);
router.put("/vendorStatusUpdate",userStatusUpdateValidator, userController.vendorStatusUpdate);

//-----------------------------|| Notifiction||---------------------------

router.get('/getnotification', cmsController.getNotification)


//-----------------------------|| CATEGORY ||------------------------------

router.get('/getCategoryList', categoryController.getCategoryList)
router.post("/addCategory",uploadBackgroundImage, categoryController.addCategory);
router.put("/updateCategory",uploadBackgroundImage, categoryController.updateCategory);
router.put('/categoryStatusUpdate', categoryController.categoryStatusUpdate )

//-----------------------------|| SUB CATEGORY ||---------------------------

router.get('/getSubCategoryList', subCategoryController.getSubCategoryList)
router.post("/addSubCategory",uploadBackgroundImage, subCategoryController.addSubCategory);
router.put("/updateSubCategory",uploadBackgroundImage, subCategoryController.updateSubCategory);
router.put('/subCategoryStatusUpdate', subCategoryController.subCategoryStatusUpdate)

//-----------------------------|| INNER CATEGORY ||---------------------------

router.post('/insertInnerCategory',addInnerCategoryValidator, innerCategoryController.insertInnerCategory)
router.get('/getInnerCategoryList', innerCategoryController.getInnerCategoryList)
router.put('/updateInnerCategory',updateInnerCategoryValidator, innerCategoryController.updateInnerCategory)
router.put('/innerCategoryStatusUpdate', deleteCategoryStatusValidation, innerCategoryController.innerCategoryStatusUpdate)

//-----------------------------|| PRODUCT TYPE ||---------------------------

router.post('/insertProductType',  insertProductTypeValidator, productTypeController.insertProductType)
router.get('/getProductTypeList', productTypeController.getProductTypeList)
router.put('/updateProductType', updateProductTypeValidator, productTypeController.updateProductType)
router.put('/updateProductTypeStatus', deleteProductTypeStatusValidation, productTypeController.updateProductTypeStatus)

//-----------------------------|| DELIVERY CHARGES AND TAXES ||---------------------------
router.get('/getDeliverAndTaxList', deliveryAndTaxControllr.getDeliverAndTaxList)
router.post('/insertDeliverAndTax', deliveryAndTaxControllr.insertDeliverAndTax)
router.put('/updateDeliveryAndTax', deliveryAndTaxControllr.updateDeliveryAndTax)
router.put('/updateDeliverAndTaxStatus', deliveryAndTaxControllr.updateDeliverAndTaxStatus)

//-----------------------------|| PRODUCT'S ||------------------  ---------

router.get('/getProductList', productController.getProductList)
router.post('/getProductListByName', productController.getProductListByName)
router.post("/addProduct",productImageUpload, productController.addProduct);
router.put("/updateProduct",productImageUpload, productController.updateProduct)
router.put('/productStatusUpdate', productController.productStatusUpdate)
router.put('/productPopularityUpdate',productController.productPopularStatusUpdate)
router.get('/getProductByIdAndColorProductId', productController.getProductByIdAndColorProductId)

//-----------------------------|| COMBINATION ||---------------------------

router.get('/getCombinationList', productController.getCombinationList)
router.get('/getCombinationListById', productController.getCombinationListById)
router.post("/insertItemCombination",uploadCombination, productController.insertItemCombination);
router.put('/updateItemCombination', uploadCombination, productController.updateItemCombination)
router.put('/combninationStatusUpdate', productController.combninationStatusUpdate)

//-----------------------------|| SIZE'S ||---------------------------

router.post('/addProductSize', sizeController.addProductSize)
router.get('/getProductSizeList', sizeController.getProductSizeList)
router.put('/updateProductSize',updateSizeValidation, sizeController.updateProductSize)
router.put('/updateSizeStatus', sizeController.updateSizeStatus)

//-----------------------------|| BRAND ||---------------------------

router.get('/getBrandList', ensureWebTokenForAdmin, brandController.getBrandList )
router.post('/insertBrandName', insertBrandNameValidation, brandController.insertBrandName )
router.put('/updateBrandName', updateBrandNameValidation, brandController.updateBrandName )
router.put('/updateBrandStatus', updateBrandStatusValidation, brandController.updateBrandStatus )

//-----------------------------|| REGION ||---------------------------

router.get('/getRegionList',regionController.getRegionList)
router.post('/insertRegionName',uploadFlag, insertRegionNameValidation, regionController.insertRegionName)
router.put('/updateRegionName',uploadFlag, updateRegionNameValidation, regionController.updateRegionName)
router.put('/updateRegionStatus',updateRegionStatusValidation, regionController.updateRegionStatus)

//-----------------------------|| ORDER ||---------------------------

router.get('/getPromoCode', orderController.getPromoCode)
router.post('/insertPromoCode',insertPromocodeValidation, orderController.insertPromoCode)
router.put('/updatePromoCode',updatePromocodeValidation, orderController.updatePromoCode)
router.put('/updatePromoCodeStatus',updatePromocodeStatusValidation, orderController.updatePromoCodeStatus)
router.post('/deletePromocode',orderController.removePromocode)
router.get('/getOrderList', orderController.getOrderList)
router.put('/updateOrderStatus', orderController.updateOrderStatus)
router.post('/updateOrderStatusWithComment', orderController.updateOrderStatusWithComment)
router.get('/getOrderDetailsById', orderController.getOrderDetailsById)
router.put('/updateCancelReason', orderController.updateCancelReason)
router.post('/cancelThisOrder', orderController.cancelThisOrder)
router.get('/getSupplierList', orderController.getSupplierList)
router.get('/getSupplierListById', orderController.getSupplierListById)
router.put('/updateSupplierDetail', orderController.updateSupplierDetail)
router.put('/updateOrderStatusToReject', orderController.updateOrderStatusToReject)
router.get('/getCancelAndReturnList', orderController.getCancelAndReturnList)
router.get('/getCancelAndReturnDetailById', orderController.getCancelAndReturnDetailById)
router.put('/updateCancelAndReturnStatus', orderController.updateCancelAndReturnStatus)

//-----------------------------|| CMS ||---------------------------

router.post('/insertCMSPages', cmsController.insertCMSPages)
router.put('/updateCMSPages', cmsController.updateCMSPages) 
router.put('/updatePagesStatus', cmsController.updatePagesStatus)
router.get('/getCMSPages', cmsController.getCMSPages)
router.get('/getContactUsList', cmsController.getContactUsList)
router.get('/getContactUsDetailById', cmsController.getContactUsDetailById)

router.post('/insertCMSContent', cmsController.insertCMSContent)
router.put('/updateCMSContent', cmsController.updateCMSContent)
router.get('/getCMSContentById', cmsController.getCMSContentById)

//-----------------------------|| FEEDBACK ||---------------------------

router.get('/getFeedbackList', cmsController.getFeedbackList);
router.post('/insertFeedback',uploadBannerImages, cmsController.insertFeedback);
router.post("/updateFeedStatus",cmsController.updateFeedBackStatus)
router.post("/deleteFeedStatus",cmsController.deleteFeedBack)
router.post("/updateFeedback",cmsController.updateFeedBack)


//-----------------------------|| About Us ||---------------------------

router.get('/getAboutUs', cmsController.getAboutUs);
router.post('/insertABoutUs',uploadBannerImages, cmsController.insertAboutUs);
// router.post("/updateFeedStatus",cmsController.updateFeedBackStatus)
// router.post("/deleteFeedStatus",cmsController.deleteFeedBack)
// router.post("/updateFeedback",cmsController.updateFeedBack)



//-----------------------------|| FAQ ||---------------------------

router.post("/insertFaq",cmsController.insertFaq);
router.get("/getFaq",cmsController.getFaq)
router.put("/updateFaq",cmsController.updateFaq)
router.post("/deleteFaq",cmsController.deleteFaq)


//-----------------------------|| Terms and Conditions ||---------------------------

router.post("/insertTermsAndConditions",cmsController.insertTermsAndConditions)

router.get("/getTermsAndConditions",cmsController.getTnc)


//-----------------------------|| Privacy Policies ||---------------------------

router.post("/insertPolicy",cmsController.insertPrivacyPolicies)

router.get("/getPolicy",cmsController.getPrivacyPolcies)

//--------------------------------|| VALIDATING ROUTES ||-------------------------------------

router.all("*", function (req, res) {
  return res.status(200).json({
      code: 200,
      data: null,
      msg: "Invalid Request {URL Not Found}",
  });
});


module.exports.adminRoutes = router;