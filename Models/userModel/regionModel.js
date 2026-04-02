const promisePool = require("../../utils/pool");

class UserModel {

    getRegionList = async (data) => {
        let sql = `SELECT regionName,currency,flag,countryCode,symbol,status, id FROM region WHERE status = 1`;
        const [result, fields] = await promisePool.query(sql);
        return result;
    };

    getSubCategoryList = async (data) => {
        let sql = `SELECT sc.subCategoryName, sc.categoryId, c.categoryName, sc.status, sc.id FROM subcategory AS sc 
        LEFT JOIN category AS c ON c.id = sc.categoryId`;
        const [result, fields] = await promisePool.query(sql);
        return result;
    };

    getInnerCategoryList = async () => {
        let sql = `SELECT ic.innerCategoryName, c.categoryName, ic.categoryId, sc.subCategoryName, ic.subCategoryId, ic.status, ic.id FROM innercategory AS ic 
        LEFT JOIN category AS c ON c.id = ic.categoryId
        LEFT JOIN subcategory AS sc ON sc.id = ic.subCategoryId`;
        const [result, fields] = await promisePool.query(sql);
        return result;
    };

    getProductTypeList = async () => {
        let sql = `SELECT pt.productTypeName, pt.categoryId, c.categoryName, pt.subCategoryId, sc.subCategoryName, pt.innerCategoryId, ic.innerCategoryName, pt.status, pt.id FROM producttype AS pt 
        LEFT JOIN category AS c ON c.id = pt.categoryId
        LEFT JOIN subcategory AS sc ON sc.id = pt.subCategoryId
        LEFT JOIN innercategory AS ic ON ic.id = pt.innerCategoryId`;
        const [result, fields] = await promisePool.query(sql);
        return result;
    };


}
module.exports = new UserModel();

