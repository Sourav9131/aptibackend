const promisePool = require("../../utils/pool");



class adminModel {

      createBrandName = async()=>{
        let sql =`
        CREATE TABLE brands (
            id INT PRIMARY KEY AUTO_INCREMENT,
            brandName VARCHAR(255) NOT NULL,
            categoryId INT,
            status INT DEFAULT 0
        );        
        `
        await promisePool.query(sql)
      }

    getBrandList = async (data) => {
        let sql = `SELECT b.brandName, b.categoryId, c.categoryName,  b.status, b.id FROM brands AS b
        LEFT JOIN category AS c ON c.id = b.categoryId
        order by b.id desc`;
        const [result, fields] = await promisePool.query(sql);
        return result;
    };
    
    checkBrandName = async (brandName, categoryId) => {
        let sql = `SELECT brandName, categoryId FROM brands WHERE brandName = ? AND categoryId = ?`;
        const [result, fields] = await promisePool.query(sql,[brandName, categoryId]);
        return result;
    };

    insertBrandName = async (brandName, categoryId) => {
        let sql = `INSERT INTO  brands (brandName, categoryId) VALUES (?,?)`;
        const [result] = await promisePool.query(sql, [brandName, categoryId]);
        return result
    };

    updateBrandName = async (data) => {
        let sql = `UPDATE brands SET brandName = ?, categoryId = ? WHERE id = ?`;
        const [result] = await promisePool.query(sql, [data.brandName, data.categoryId, data.id]);
        return result
    };

    updateBrandStatus = async (data) => {
        let sql = `UPDATE brands SET status = ? WHERE id = ?`;
        const [result] = await promisePool.query(sql, [data.status, data.id]);
        return result
    };


}
module.exports = new adminModel();
