const axios = require('axios');

exports.fetchDataFromAPI = async (req, res) => {
  try {
    const response = await axios.get('https://espsofttech.org:7979/api/user/getproductListTask ');
	let data = response.data.data
    // const product = {
	// 		brandId: data.brandId,
	// 		productName: data.productName,
	// 		description: data.description,
	// 		color: data.color,
	// 		price: data.price,
	// 		marginPrice: data.marginPrice,
	// 		discount: data.discount,
	// 		composition: data.composition,
	// 		highlights: data.highlights,
	// 		wearing: data.wearing,
	// 		washingInstruction: data.washingInstruction,
	// 		isSizeAvailable: data.isSizeAvailable,
	// 		productQuantity: data.productQuantity !== '' ? data.productQuantity : data.quantity,
	// 		categoryId: data.categoryId,
	// 		subCategoryId: data.subCategoryId,
	// 		innerCategoryId: data.innerCategoryId,
	// 		productTypeId: data.productTypeId,
	// 		colorProductId: data.colorProductId,
	// 	};
	let products = {}
	for(let i=0; i<data.length; i++){
		if(data[i].productName){
			products.productName = data[i].productName
		} 
		if(data[i].id){
			products.id = data[i].id
		}
	}

    // const uniqueIdSlug = Date.now().toString();

	// 	const slug = `${brandSlug}-${productSlug}-${uniqueIdSlug}`;

	// 	product.slug = slug.replace(/-+/g, '-').replace(/-$/, '');

  } catch (error) {
    return console.log(error.message)
  }
};

