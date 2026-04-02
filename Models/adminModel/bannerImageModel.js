const promisePool = require("../../utils/pool");

class adminModel {
    getImageList = async (data) => {
        let sql = `SELECT * FROM bannerimage order by id desc`;
        const [result, fields] = await promisePool.query(sql);
        return result;
    };


    checkCategory = async (categoryName) => {
        let sql = `SELECT imageName FROM bannerimage WHERE imageName = ?`;
        const [result, fields] = await promisePool.query(sql, [categoryName]);
        return result;
    };

    addImage = async (backgroundImage) => {
        let sql = `INSERT INTO  bannerimage (image) VALUES (?)`;
        const [result] = await promisePool.query(sql, [backgroundImage]);
        return result
    };

    updateCategory = async (data, backgroundImage) => {
        let sql = `update category set categoryName = ?, backgroundImage = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [data.categoryName,backgroundImage, data.id]);
        return result;
      };

    imageStatusUpdate = async (data) => {
        let sql = `update bannerimage set status = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [data.status, data.id]);
        return result;
      };


      imageDelete = async (data) => {
        let sql = `Delete from bannerimage   WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [data.id]);
        return result;
      };
}
module.exports = new adminModel();

