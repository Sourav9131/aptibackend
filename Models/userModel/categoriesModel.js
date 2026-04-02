const promisePool = require("../../utils/pool");

class UserModel {


    getBannerImageList = async (data) => {
        let sql = `SELECT * FROM bannerimage  WHERE status = 1`;
        const [result, fields] = await promisePool.query(sql);
        return result;
    };
   

    getCategoryList = async (data) => {
        let sql = `SELECT * FROM category WHERE status = 1`;
        const [result, fields] = await promisePool.query(sql);
        return result;
    };

    getSubCategoryList = async () => {
        let sql = `SELECT sc.subCategoryName, sc.categoryId, c.categoryName, sc.backgroundImage, sc.status, sc.id FROM subcategory AS sc 
        LEFT JOIN category AS c ON c.id = sc.categoryId WHERE sc.status = 1`;
        const [result, fields] = await promisePool.query(sql);
        return result;
    };

    getInnerCategoryList = async () => {
        let sql = `SELECT ic.innerCategoryName, c.categoryName, ic.categoryId, sc.subCategoryName, ic.subCategoryId, ic.status, ic.id FROM innercategory AS ic 
        LEFT JOIN category AS c ON c.id = ic.categoryId
        LEFT JOIN subcategory AS sc ON sc.id = ic.subCategoryId WHERE ic.status = 1`;
        const [result, fields] = await promisePool.query(sql);rs
        return result;
    };

    getProductTypeList = async () => {
        let sql = `SELECT pt.productTypeName, pt.categoryId, c.categoryName, pt.subCategoryId, sc.subCategoryName, pt.innerCategoryId, ic.innerCategoryName, pt.status, pt.id FROM producttype AS pt 
        LEFT JOIN category AS c ON c.id = pt.categoryId
        LEFT JOIN subcategory AS sc ON sc.id = pt.subCategoryId
        LEFT JOIN innercategory AS ic ON ic.id = pt.innerCategoryId  WHERE pt.status = 1`;
        const [result, fields] = await promisePool.query(sql);
        return result;
    };

    getProductTypeDropdown = async (subCategoryId) => {
        
        let sql = `SELECT id, innerCategoryName, getProductType(innerCategory.id) AS productType FROM innercategory WHERE subCategoryId=? AND status=1`;
        const [result, fields] = await promisePool.query(sql,[subCategoryId]);
        return result;
    };

    getSubCategoryByCatId = async (catId) => {
        let sql = `SELECT sc.subCategoryName, sc.id, getProductTypeBySubCat(sc.id) as productTypes FROM subcategory as sc WHERE sc.categoryId = ? AND sc.status = 1`;
        const [result, fields] = await promisePool.query(sql,[catId]);
        return result;
    }

    getSizesListBySubCategory = async (categoryId, subCategoryId) => {
        let sql = `SELECT id, sizeName FROM sizes WHERE categoryId = ? AND subCategoryId = ? AND status = 1`;
        const [result, fields] = await promisePool.query(sql,[categoryId, subCategoryId]);
        return result;
    }

    getBannerVideo = async () => {
        let sql = `SELECT * from bannerVideo`;
        const [result, fields] = await promisePool.query(sql,[]);
        return result;
    }


}
module.exports = new UserModel();

