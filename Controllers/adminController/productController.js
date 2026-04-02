const { json } = require("body-parser");
const productModel = require("../../Models/adminModel/productModel");
const { response, message } = require("../../utils/response");

exports.addProduct = async (req, res) => {
	try {
		const data = req.body;

		const image1 = req.files['image1'];
		const image2 = req.files['image2'] ? req.files['image2'] : [];
		const image3 = req.files['image3'] ? req.files['image3'] : [];
		const image4 = req.files['image4'] ? req.files['image4'] : [];
		const image5 = req.files['image5'] ? req.files['image5'] : [];
		const isSizeAvailable = data.isSizeAvailable
		const productImage = [
			image1[0].filename,
			image2[0] ? image2[0].filename : '',
			image3[0] ? image3[0].filename : '',
			image4[0] ? image4[0].filename : '',
			image5[0] ? image5[0].filename : '',
		]

		const product = {
			brandId: data.brandId,
			productName: data.productName,
			description: data.description,
			// color: data.color,
			customerPrice: data.customerPrice,
			vendorPrice: data.vendorPrice,
			marginPrice: data.marginPrice ||0,
			discount: data.discount,
			specification: data.specification,
			highlights: data.highlights,
			warnings: data.warnings,
			userManual: data.userManual,
			isSizeAvailable: data.isSizeAvailable,
			productQuantity: data.productQuantity !== '' ? data.productQuantity : data.quantity,
			categoryId: data.categoryId,
			bestQuality:data.bestQuality,
			shippingTime :data.shippingTime 
			// subCategoryId: data.subCategoryId,
			// innerCategoryId: data.innerCategoryId,
			// productTypeId: data.productTypeId,
			// colorProductId: data.colorProductId,
		};


		let brandName = await productModel.getBrandName(req.body.brandId)
		const brandSlug = brandName[0]?.brandName.toString().replace(/[^a-zA-Z0-9]/g, '-').replace(/\s+/g, '-').toLowerCase();
		const productSlug = data.productName.toString().replace(/[^a-zA-Z0-9]/g, '-').replace(/\s+/g, '-').toLowerCase();

		const uniqueIdSlug = Date.now().toString();

		const slug = `${brandSlug}-${productSlug}-${uniqueIdSlug}`;

		product.slug = slug.replace(/-+/g, '-').replace(/-$/, '');

		const insertProduct = await productModel.insertProduct(product);
		const productId = insertProduct.insertId

		// if (product.colorProductId == '' || product.colorProductId == null) {
		// 	await productModel.insertColorProductId(productId)
		// }

		if (insertProduct) {
			for (let i = 0; i < productImage.length; i++) {
				if (productImage[i] != "") {
					await productModel.insertProductImage(productImage[i], productId);
				}
			}
			if (isSizeAvailable == 1) {
				await productModel.insertProductSizesAndQuantity(JSON.parse(req.body.qtySizeObj), productId);
			}
			return res
				.status(200)
				.send(response(true, "Product Added Successfully!"));
		} else {
			return res
				.status(200)
				.send(response(true, "Something Went Wrong. Please Try Again!"));
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send(response(false, error.message));
	}
};

//-------------------------|| UPDATE PRODUCT ||-----------------------------------

exports.updateProduct = async (req, res) => {
	try {
		const data = req.body;

		
		

		
		const image1 = req.files['image1'] ? req.files['image1'] : [];
		const image2 = req.files['image2'] ? req.files['image2'] : [];
		const image3 = req.files['image3'] ? req.files['image3'] : [];
		const image4 = req.files['image4'] ? req.files['image4'] : [];
		const image5 = req.files['image5'] ? req.files['image5'] : [];
		const isSizeAvailable = data.isSizeAvailable
		let getProductImages = await productModel.getProductImages(req.body.id);

		const productImage = [
			image1[0] ? image1[0].filename : getProductImages[0].image,
			image2[0] ? image2[0].filename : getProductImages[1] ? getProductImages[1]?.image : '',
			image3[0] ? image3[0].filename : getProductImages[2] ? getProductImages[2]?.image : '',
			image4[0] ? image4[0].filename : getProductImages[3] ? getProductImages[3]?.image : '',
			image5[0] ? image5[0].filename : getProductImages[4] ? getProductImages[4]?.image : '',
		]

		const product = {
			brandId: data.brandId,
			productName: data.productName,
			description: data.description,
			// color: data.color,
			vendorPrice: data.vendorPrice,
			customerPrice: data.customerPrice,
			marginPrice: data.marginPrice || 0,
			discount: data.discount,
			specification: data.specification,
			highlights: data.highlights,
			warnings: data.warnings,
			userManual: data.userManual,
			isSizeAvailable: data.isSizeAvailable,
			categoryId: data.categoryId,
			// subCategoryId: data.subCategoryId,
			// innerCategoryId: data.innerCategoryId,
			// productTypeId: data.productTypeId,
			sizeId: data.sizeId,
			onSizePrice: data.onSizePrice,
			productId: data.productId,
			bestQuality:data.bestQuality,
			shippingTime:data.shippingTime
			// colorProductId: data.colorProductId,
		};


		let brandName = await productModel.getBrandName(req.body.brandId)
		const brandSlug = brandName[0]?.brandName.toString().replace(/[^a-zA-Z0-9]/g, '-').replace(/\s+/g, '-').toLowerCase();
		const productSlug = data.productName.toString().replace(/[^a-zA-Z0-9]/g, '-').replace(/\s+/g, '-').toLowerCase();

		const uniqueIdSlug = Date.now().toString();

		const slug = `${brandSlug}-${productSlug}-${uniqueIdSlug}`;

		product.slug = slug.replace(/-+/g, '-').replace(/-$/, '');

		if (data.isSizeAvailable == 0) {

			await productModel.deleteQuantityBasedOnSize(data.productId)
			product.productQuantity = data.productQuantity
		} 
		else if (data.isSizeAvailable == 1) {

			product.productQuantity = data.quantity

		}


		const updateProduct = await productModel.updateProduct(product);

		const productId = req.body.id

		if (updateProduct) {

			let deleteImages = await productModel.deleteProductImages(productId);
			for (let i = 0; i < productImage.length; i++) {
				if (productImage[i] != "") {
					await productModel.insertProductImage(productImage[i], productId);
				}
			}

			if (isSizeAvailable == 1) {

				let isSizeAddedBefore = await productModel.checkIsSizeAvailable(productId)

				if (isSizeAddedBefore.length > 0) {
					await productModel.updateProductSizesAndQuantity(JSON.parse(req.body.qtySizeObj), productId);
				} else {
					await productModel.insertProductSizesAndQuantity(JSON.parse(req.body.qtySizeObj), productId);
				}
			}
			return res
				.status(200)
				.send(response(true, "Product Updated Successfully!"));
		} else {
			return res
				.status(200)
				.send(response(true, "Something Went Wrong. Please Try Again!"));
		}
		
	} catch (error) {
		console.log(error)
		return res.status(500).send(response(false, error.message));
	}
};



exports.getProductList = async (req, res) => {
	try {
		let productList = await productModel.getProductList()
		
		if (productList.length > 0) {
			productList = productList.map((p) => {
				const images = Array.isArray(p.images)
					? p.images
					: (p.image ? [p.image] : []);
				const normalizedImages = images
					.filter((img) => !!img)
					.map((img) => {
						if (img.startsWith("/public/")) return img;
						return `/public/${img}`;
					});
				return { ...p, images: normalizedImages };
			});

			return res.status(200).send(response(true, "Product List", productList));
		}
		return res.status(200).send(response(false, message.noDataMessage));
	} catch (error) {
		console.log(error)
		return res.status(500).send(response(false, message.catchMessage));
	}
}


exports.getProductListByName = async (req, res) => {
	try {
		
		let productList = await productModel.getProductByName(req.body.data)
		if (productList.length > 0) {
			productList = productList.map((p) => {
				const images = Array.isArray(p.images)
					? p.images
					: (p.image ? [p.image] : []);
				const normalizedImages = images
					.filter((img) => !!img)
					.map((img) => {
						if (img.startsWith("/public/")) return img;
						return `/public/${img}`;
					});
				return { ...p, images: normalizedImages };
			});

			return res.status(200).send(response(true, "Product List", productList));
		}
		return res.status(200).send(response(false, message.noDataMessage));
	} catch (error) {
		console.log(error)
		return res.status(500).send(response(false, message.catchMessage));
	}
}

exports.productStatusUpdate = async (req, res) => {
	try {
		let innerCategoryStatusUpdate = await productModel.productStatusUpdate(req.body)
		if (innerCategoryStatusUpdate) {
			return res.status(200).send({ success: true, msg: "Success" });
		} else {
			return res.status(200).send({ success: false, msg: "Failed!" })
		}
	} catch (error) {
		return res.status(500).send(response(false, message.catchMessage));
	}
}


exports.productPopularStatusUpdate = async (req, res) => {
	try {
		let innerCategoryStatusUpdate = await productModel.productSPoularudate(req.body);
		if (innerCategoryStatusUpdate) {
			return res.status(200).send({ success: true, msg: "Success" });
		} else {
			return res.status(200).send({ success: false, msg: "Failed!" })
		}
	} catch (error) {
		return res.status(500).send(response(false, message.catchMessage));
	}
}

//---------------------------------|| PRODUCT COMBINATION ||------------------------------------

exports.insertItemCombination = async (req, res) => {
	try {
		const data = req.body;
		let combinationImage = !req.files["combinationImage"]
			? null
			: req.files["combinationImage"][0].filename;

		const productIdArray = Array.isArray(data.productId) ? data.productId : [data.productId];
		const numberArray = productIdArray[0].split(',').map(Number);

		const customizedProductId = numberArray.map(id => ({ id }));

		const item = {
			categoryId: data.categoryId,
			productId: JSON.stringify(customizedProductId),
			combinationName: data.combinationName
		};
		let itemCombination = await productModel.insertItemCombination(item, combinationImage);

		if (itemCombination) {
			return res
				.status(200)
				.send(response(true, "Item Combination Added Successfully!"));
		} else {
			return res
				.status(200)
				.send(response(true, "Something Went Wrong. Please Try Again."));
		}
	} catch (error) {
		return res.status(500).send(response(false, error.message));
	}
}


exports.updateItemCombination = async (req, res) => {
	try {
		const data = req.body;
		let combinationImage = !req.files["combinationImage"]
			? null
			: req.files["combinationImage"][0].filename;
		if (combinationImage) {
			req.body.combinationImage = combinationImage;
		} else {
			combinationImage = req.body.oldCombinationImage;
		}

		const productIdArray = Array.isArray(data.productId) ? data.productId : [data.productId];
		const numberArray = productIdArray[0].split(',').map(Number);

		const customizedProductId = numberArray.map(id => ({ id }));

		const item = {
			categoryId: data.categoryId,
			productId: JSON.stringify(customizedProductId),
			combinationName: data.combinationName,
		};

		let itemCombination = await productModel.updateItemCombination(item, combinationImage, req.body.id);

		if (itemCombination) {
			return res
				.status(200)
				.send(response(true, "Item Combination Updated Successfully!"));
		} else {
			return res
				.status(200)
				.send(response(true, "Something! Went Wrong Please Try Again"));
		}
	} catch (error) {
		return res.status(500).send(response(false, error.message));
	}
}

exports.getCombinationList = async (req, res) => {
	try {
		let combinationLIst = await productModel.getCombinationList()
		if (combinationLIst.length > 0) {
			return res.status(200).send(response(true, "Product List", combinationLIst));
		}
		return res.status(200).send(response(false, message.noDataMessage));
	} catch (error) {
		console.log(error)
		return res.status(500).send(response(false, message.catchMessage));
	}
}

exports.combninationStatusUpdate = async (req, res) => {
	try {
		let productStatusUpdate = await productModel.combninationStatusUpdate(req.body)
		if (productStatusUpdate) {
			return res.status(200).send({ success: true, msg: "Success" });
		} else {
			return res.status(200).send({ success: false, msg: "Failed!" })
		}
	} catch (error) {
		return res.status(500).send(response(false, message.catchMessage));
	}
}

exports.getCombinationListById = async (req, res) => {
	try {
		let combinationList = await productModel.getCombinationListById(req.query.id);

		if (combinationList.length > 0) {
			const combinedList = [];

			for (let i = 0; i < combinationList.length; i++) {
				let productIdList = combinationList[i].productId;
				const productNameList = [];

				for (let j = 0; j < productIdList.length; j++) {
					const productId = productIdList[j].id;
					let product = await productModel.getProductNameById(productId);

					if (product) {
						productNameList.push({ value: productId, label: product[i].productName, image: product[i].image });
					}
				}
				const combinedItem = {
					...combinationList[i],
					products: productNameList,
				};

				combinedList.push(combinedItem);
			}
			return res.status(200).send(response(true, "Product List", combinedList[0]));
		}

		return res.status(200).send(response(false, message.noDataMessage));
	} catch (error) {
		console.log(error);
		return res.status(500).send(response(false, message.catchMessage));
	}
};

exports.getProductByIdAndColorProductId = async (req, res) => {
	try {
		let productList = await productModel.getProductByIdAndColorProductId()
		if (productList.length > 0) {

			return res.status(200).send(response(true, "Product List", productList));
		}
		return res.status(200).send(response(false, message.noDataMessage));
	} catch (error) {
		console.log(error)
		return res.status(500).send(response(false, message.catchMessage));
	}
}
