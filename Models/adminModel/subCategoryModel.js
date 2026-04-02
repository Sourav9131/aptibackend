const promisePool = require("../../utils/pool");

class adminModel {
    createSubCategoryTable = async () => {
        let sql = `
        CREATE TABLE subcategory (
            id INT AUTO_INCREMENT PRIMARY KEY,
            subCategoryName VARCHAR(255) NOT NULL,
            categoryId INT,
            backgroundImage VARCHAR(255) NOT NULL,
            status INT DEFAULT 0,
            FOREIGN KEY (categoryId) REFERENCES category(id)
        );
        `;
        // Additional statements or code for executing this SQL query in your database can be added here
await promisePool.query(sql)
}

    getSubCategoryList = async (data) => {
        let sql = `SELECT sc.subCategoryName, sc.categoryId, c.categoryName, sc.status, sc.backgroundImage, sc.id FROM subcategory AS sc 
        LEFT JOIN category AS c ON c.id = sc.categoryId
        order by sc.id desc`;
        const [result, fields] = await promisePool.query(sql);
        return result;
    };

    checkSubCategory  = async (data) => {

        let sql = `SELECT subCategoryName, categoryId FROM subcategory WHERE subCategoryName = ? AND categoryId = ?`;
        const [result, fields] = await promisePool.query(sql, [data.subCategoryName, data.categoryId]);
        return result;
    };

    addSubCategory = async (data, backgroundImage) => {
        let sql = `INSERT INTO  subcategory (subCategoryName, categoryId, backgroundImage) VALUES (?,?,?)`;
        const [result] = await promisePool.query(sql, [data.subCategoryName, data.categoryId, backgroundImage]);
        return result
    };

    updateSubCategory = async (data, backgroundImage) => {
        let sql = `update subcategory set subCategoryName = ?, categoryId = ?, backgroundImage = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [data.subCategoryName, data.categoryId, backgroundImage, data.id]);
        return result;
      };

    subCategoryStatusUpdate = async (data) => {
        let sql = `update subcategory set status = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [data.status, data.id]);
        return result;
      };
}
module.exports = new adminModel();

