const brandModel = require("../../Models/userModel/brandModel");
const { response, message } = require("../../utils/response");


exports.getBrandList = async (req, res) => {
    try {
        let brands = await brandModel.getBrandList(req.query.categoryId)
        if (brands.length > 0) {
            return res
                .status(200)
                .send(response(true, "Brand List", brands));
        }
        return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
        console.log(error)
        return res.status(500).send(response(false, message.catchMessage));
    }
}