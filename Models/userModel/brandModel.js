const promisePool = require("../../utils/pool");

class UserModel {

    getBrandList = async (categoryId) => {
        let sql = `SELECT brandName, id, categoryId FROM brands WHERE status = 1 AND categoryId = ? ORDER BY brandName ASC`;
        const [result, fields] = await promisePool.query(sql,[categoryId]);
        return result;
    };

}
module.exports = new UserModel();
