const productModel = require("../../Models/appModel/productModel");
const { response, message } = require("../../utils/response");

exports.recommendedProductListById = async (req, res) => {
    try {
        let productList = await productModel.recommendedProductListById(req.query)
        if (productList.length > 0) {

            return res.status(200).send(response(true, "Product List", productList));
        }
        return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
        console.log(error)
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.getProductListByBrandId = async (req, res) => {
    try {
        let productList = await productModel.getProductListByBrandId(req.query.brandId, req.query.userId)
        if (productList.length > 0) {
            return res.status(200).send(response(true, "Product List", productList));
        }
        return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
      console.log(error.message)
        return res.status(500).send(response(false, message.catchMessage));
    }
}


exports.getProductListForHomeApp = async (req, res) => {
    try {
        let subCategoryData = await productModel.getSubcategoryForHome();
        if (subCategoryData.length > 0 ) {
            for (let i = 0; i < subCategoryData.length; i++) {
                let productData = await productModel.getProductBySubCategory(subCategoryData[i].id, req.query.userId);
                subCategoryData[i].items = productData;
            }

            return res.status(200).send(response(true, "Product List", subCategoryData));
        }
        else {
            return res.statusgetAllProductListForHome(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        return res.status(500).send(response(false, error.message));
    }
}

exports.getActiveOrderListByUserIdApp = async (req, res) => {
    try {
      let orderDetail = await productModel.getActiveOrderListByUserId(req.userId)
      if (orderDetail.length > 0) {
        return res.status(200).send({ success: true, msg: 'Active Order List', orderDetail });
      }
      return res.status(200).send(response(false, message.noDataMessage));
  
    } catch (error) {
      return res.status(500).send(response(false, error.message));
    }
  }

  exports.getOtherOrderHistoryByUserIdApp = async (req, res) => {
    try {
      let orderDetail = await productModel.getOtherOrderHistoryByUserIdApp(req.userId)
      if (orderDetail.length > 0) {
        return res.status(200).send({ success: true, msg: 'Other Order History', orderDetail });
      }
      return res.status(200).send(response(false, message.noDataMessage));
  
    } catch (error) {
      return res.status(500).send(response(false, error.message));
    }
  }

  exports.getProductTypeListBySubCategoryIdApp = async (req, res) => {
    try {
      let productTypeList = await productModel.getProductTypeListBySubCategoryIdApp(req.query.subCategoryId)
      if (productTypeList.length > 0) {
        return res
          .status(200)
          .send(response(true, "Product Type List", productTypeList));
      }
      return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
      console.log(error.message)
      return res.status(500).send(response(false, message.catchMessage));
    }
  }

  exports.productListByProductTypeIdApp = async (req, res) => {
    try {
      let productList = await productModel.productListByProductTypeIdApp(req.query.productTypeId, req.query.userId)
      if (productList.length > 0) {
        return res
          .status(200)
          .send(response(true, "Product List", productList));
      }
      return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
      console.log(error.message)
      return res.status(500).send(response(false, message.catchMessage));
    }
  }



exports.getProductDetailByIdApp = async (req, res) => {
  try {
      let productDetail = await productModel.getProductDetailByIdApp(req.body.slug, req.body.userId)
      if (productDetail.length > 0) {
          return res.status(200).send(response(true, "Product List", productDetail));
      }
      return res.status(200).send(response(false, message.noDataMessage));
  } catch (error) {
      console.log(error)
      return res.status(500).send(response(false, message.catchMessage));
  }
}   

exports.getItemCombinationApp = async (req, res) => {
  try {
      let categoryId = req.body.categoryId;
      let itemCombination = await productModel.getItemCombitnation(categoryId);
      if (itemCombination.length > 0) {

          for (let i = 0; i < itemCombination.length; i++) {
              let productIds = itemCombination[i].productId;
              for (let j = 0; j < productIds.length; j++) {
                  let productData = await productModel.getPrductInfoForCombination(productIds[j].id, req.body.userId);
                  itemCombination[i].productId[j] = productData[0];
              }
          }
          return res.status(200).send(response(true, "Item Combination List", itemCombination));
      } else {
          return res.status(200).send(response(false, message.noDataMessage));
      }
  } catch (error) {
      console.log(error);
      return res.status(500).send(response(false, message.catchMessage));
  }
};

exports.getSizesListBySubCategoryApp = async (req, res) => {
	try {
		let resultData = await productModel.getSizesListBySubCategory(req.body.categoryId, req.body.subCategoryId)
		if (resultData.length > 0) {
			return res
				.status(200)
				.send(response(true, "Sub Category Sizes List", resultData));
		}
		return res.status(200).send({response: true, msg: "No data found", data: []});
	} catch (error) {
		console.log(error)
		return res.status(500).send(response(false, message.catchMessage));
	}
}

exports.searchProductListApp = async (req, res) => {
  try {
      let {keyword, categoryid} = req.body
      let searchKeyWords = await productModel.searchProductList(keyword, categoryid)
      if(searchKeyWords.length > 0){
          return res.status(200).send(response(true, "Product List", searchKeyWords));
      }else{
          return res.status(200).send(response(true, message.noDataMessage));
      }
  } catch (error) {
      return res.status(500).send(response(false, error.message));
  }
}