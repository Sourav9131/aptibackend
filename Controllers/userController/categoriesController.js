const categoriesModel = require("../../Models/userModel/categoriesModel");
const { response, message } = require("../../utils/response");




exports.getBannerImage = async (req, res) => {
	try {
		let bannerList = await categoriesModel.getBannerImageList()
		if (bannerList.length > 0) {
			return res
				.status(200)
				.send(response(true, "Banner Image", bannerList));
		}
		return res.status(200).send(response(false, message.noDataMessage));
	} catch (error) {
		return res.status(200).send(response(false, message.catchMessage));
	}
}

exports.getCategoryList = async (req, res) => {
	try {
		let categoryList = await categoriesModel.getCategoryList()
		if (categoryList.length > 0) {
			return res
				.status(200)
				.send(response(true, "Category List", categoryList));
		}
		return res.status(200).send(response(false,""));
	} catch (error) {
		return res.status(200).send(response(false, message.catchMessage));
	}
}


exports.getSubCategoryList = async (req, res) => {
	try {
		let subCategoryList = await categoriesModel.getSubCategoryList()
		if (subCategoryList.length > 0) {

			for (let i = 0; i < subCategoryList.length; i++) {
				let result = await categoriesModel.getProductTypeDropdown(subCategoryList[i].id)
				result.filter(item => {
					item.productType = JSON.parse(item.productType)
				})
				subCategoryList[i].innerCategory = result;
			}
			return res
				.status(200)
				.send(response(true, "Sub Category List", subCategoryList));
		}
		return res.status(200).send(response(false, message.noDataMessage));
	} catch (error) {
		console.log(error)
		return res.status(200).send(response(false, message.catchMessage));
	}
}

exports.getInnerCategoryList = async (req, res) => {
	try {
		let innerCategoryList = await categoriesModel.getInnerCategoryList()
		if (innerCategoryList.length > 0) {
			return res
				.status(200)
				.send(response(true, "Inner Category List", innerCategoryList));
		}
		return res.status(200).send(response(false, message.noDataMessage));
	} catch (error) {
		return res.status(500).send(response(false, message.catchMessage));
	}
}

exports.getProductTypeList = async (req, res) => {
	try {
		let productTypeList = await categoriesModel.getProductTypeList()
		if (productTypeList.length > 0) {
			return res
				.status(200)
				.send(response(true, "Product Type List", productTypeList));
		}
		return res.status(200).send(response(false, message.noDataMessage));
	} catch (error) {
		return res.status(500).send(response(false, message.catchMessage));
	}
}

exports.getProductTypeDropdown = async (req, res) => {
	try {
		let { subCategoryId } = req.query
		let result = await categoriesModel.getProductTypeDropdown(subCategoryId)
		result.filter(item => {
			item.productType = JSON.parse(item.productType)
		})
		if (result.length > 0) {
			return res
				.status(200)
				.send(response(true, "Product Type List", result));
		}
		return res.status(200).send(response(false, message.noDataMessage));
	} catch (error) {
		return res.status(500).send(response(false, message.catchMessage));
	}
}

exports.getCategoryListForMobile = async (req, res) => {
	try {
		let categoryList = await categoriesModel.getCategoryList()
		if (categoryList.length > 0) {

			// for (let i = 0; i < categoryList.length; i++) {
			// 	let subCatresult = await categoriesModel.getSubCategoryByCatId(categoryList[i].id)
			// 	categoryList[i].categoryName = subCatresult;
			// }


			return res.status(200).send(response(true, "Category List", categoryList));
		}
		// return res.status(200).send(response(false, message.noDataMessage));
	} catch (error) {
		return res.status(200).send(response(false, message.catchMessage));
	}
}

exports.getSizesListBySubCategory = async (req, res) => {
	try {
		let resultData = await categoriesModel.getSizesListBySubCategory(req.body.categoryId, req.body.subCategoryId)
		if (resultData.length > 0) {
			return res
				.status(200)
				.send(response(true, "Sub Category Sizes List", resultData));
		}
		return res.status(200).send(response(false, message.noDataMessage));
	} catch (error) {
		console.log(error)
		return res.status(500).send(response(false, message.catchMessage));
	}
}

exports.getBannerVideo = async (req, res) => {
	try {
		let bannerVideo = await categoriesModel.getBannerVideo()
		if (bannerVideo.length > 0) {
			return res
				.status(200)
				.send(response(true, "video", bannerVideo));
		}
		return res.status(200).send(response(false, message.noDataMessage));
	} catch (error) {
		return res.status(500).send(response(false, message.catchMessage));
	}
}
