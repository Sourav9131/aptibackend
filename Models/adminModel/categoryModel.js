const promisePool = require("../../utils/pool");

class adminModel {
    getCategoryList = async (data) => {
        let sql = `SELECT * FROM category order by id desc`;
        const [result, fields] = await promisePool.query(sql);
        return result;
    };


    checkCategory = async (categoryName) => {
        let sql = `SELECT categoryName FROM category WHERE categoryName = ?`;
        const [result, fields] = await promisePool.query(sql, [categoryName]);
        return result;
    };

    addCategory = async (data,backgroundImage) => {
        let sql = `INSERT INTO  category (categoryName,backgroundImage) VALUES (?,?)`;
        const [result] = await promisePool.query(sql, [data.categoryName,backgroundImage]);
        return result
    };

    updateCategory = async (data, backgroundImage) => {
        let sql = `update category set categoryName = ?, backgroundImage = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [data.categoryName,backgroundImage, data.id]);
        return result;
      };

    categoryStatusUpdate = async (data) => {

        let sql = `update category set status = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [data.status, data.id]);
        return result;
      };
}
module.exports = new adminModel();
