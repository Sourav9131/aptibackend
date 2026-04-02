const promisePool = require("../../utils/pool");

class adminModel {

    getProductSizeList = async (data) => {
        let sql = `SELECT ps.sizeName, ps.categoryId, c.categoryName,  ps.id, ps.status FROM sizes AS ps 
        LEFT JOIN category AS c ON c.id = ps.categoryId
        LEFT JOIN region AS r ON r.id = ps.regionId ORDER BY ps.id DESC`;
        const [result, fields] = await promisePool.query(sql);
        return result;
    };

    addProductSize = async (data) => {
        let sql = `INSERT INTO  sizes (sizeName, categoryId ) VALUES (?, ?)`;
        const [result] = await promisePool.query(sql, [data.sizeName, data.categoryId]);
        return result
    };


    updateProductSize = async (sizeName, id) => {
        let sql = `UPDATE sizes  SET sizeName = ? WHERE id = ?`;
        const [result] = await promisePool.query(sql, [sizeName, id]);
        return result
    };

    updateSizeStatus = async (data) => {
        let sql = `UPDATE sizes SET status = ? WHERE id = ?`;
        const [result] = await promisePool.query(sql, [data.status, data.id]);
        return result
    };

    //------------------------|| ADD PRODUCT SIZE WITH REGION ||----------------------------

    // addProductSize = async (data) => {
    //     let sql = `INSERT INTO  sizes (sizeName, categoryId, subCategoryId, regionId) VALUES (?, ?, ?, ?)`;
    //     const [result] = await promisePool.query(sql, [data.sizeName, data.categoryId, data.subCategoryId, data.regionId]);
    //     return result
    // };


}
module.exports = new adminModel();
