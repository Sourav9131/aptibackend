const sizeModel = require("../../Models/adminModel/sizeModel");
const { response, message } = require("../../utils/response");


exports.getProductSizeList = async (req, res) => {
    try {
        let sizeList = await sizeModel.getProductSizeList()
        if (sizeList.length > 0) {
            return res
                .status(200)
                .send(response(true, "Sizes List", sizeList));
        }
        return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.addProductSize = async (req, res) => {
    try {
        let {sizeName} = req.body
        req.body.sizeName = sizeName.toUpperCase();
        let addSize = await sizeModel.addProductSize(req.body)
        if (addSize) {
            return res.status(200).send({ success: true, msg: "Size Added Sucessfully" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Add Product Size" })
        }
    } catch (error) {
         return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.updateProductSize = async (req, res) => {
    try {
        let { sizeName, id } = req.body
        sizeName = sizeName.toUpperCase();
        let updateSize = await sizeModel.updateProductSize(sizeName, id)
        if (updateSize) {
            return res.status(200).send({ success: true, msg: "Size Updated Sucessfully" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Product Size" })
        }
    } catch (error) {
         return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.updateSizeStatus = async (req, res) => {
    try {
        let updateSizeStatus = await sizeModel.updateSizeStatus(req.body)
        if (updateSizeStatus) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Product Status" })
        }
    } catch (error) {
         return res.status(500).send(response(false, message.catchMessage));
    }
}


//-----------------------------------|| CODE WITH REGION LIST ||--------------------------------

// exports.addProductSize = async (req, res) => {
//     try {
//         let { regionId, sizeName } = req.body;

//         if (!regionId || !Array.isArray(regionId) || regionId.length === 0) {
//             return res.status(400).send({ success: false, msg: "Invalid or missing regionId" });
//         }
//         sizeName = sizeName.toUpperCase();

//         let successCount = 0;

//         for (let i = 0; i < regionId.length; i++) {
//             let id = regionId[i];
//             let productSizeData = { ...req.body, regionId: id };

//             if (await sizeModel.addProductSize(productSizeData)) {
//                 successCount++;
//             }
//         }

//         let success = successCount === regionId.length;
//         let msg = success ? "Product Sizes Added Successfully" : "Unable to Add Product Sizes";

//         return res.status(200).send({ success, msg });
//     } catch (error) {
//         return res.status(500).send({ success: false, msg: error.message });
//         return res.status(500).send({ success: false, msg: "Internal Server Error" });
//     }
// };

// exports.updateProductSize = async (req, res) => {
//     try {
//         let { regionId, sizeName } = req.body;

//         if (!regionId || !Array.isArray(regionId) || regionId.length === 0) {
//             return res.status(400).send({ success: false, msg: "Invalid or missing regionId" });
//         }
//         sizeName = sizeName.toUpperCase();

//         let successCount = 0;

//         for (let i = 0; i < regionId.length; i++) {
//             let id = regionId[i];
//             let productSizeData = { ...req.body, regionId: id };

//             if (await sizeModel.updateProductSize(productSizeData)) {
//                 successCount++;
//             }
//         }

//         let success = successCount === regionId.length;
//         let msg = success ? "Product Sizes Added Successfully" : "Unable to Add Product Sizes";

//         return res.status(200).send({ success, msg });
//     } catch (error) {
//         return res.status(500).send({ success: false, msg: "Internal Server Error" });
//     }
// };