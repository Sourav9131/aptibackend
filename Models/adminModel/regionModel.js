const promisePool = require("../../utils/pool");

class adminModel {

    getRegionList = async (data) => {
        let sql = `SELECT regionName, id, currency, symbol, countryCode, flag, status FROM region ORDER BY id DESC`;
        const [result, fields] = await promisePool.query(sql);
        return result;
    };

    checkRegionName = async (regionName) => {
        let sql = `SELECT regionName FROM region WHERE regionName = ?`;
        const [result, fields] = await promisePool.query(sql,[regionName]);
        return result;
    };

    insertRegionName = async (data, flag) => {
        let sql = `INSERT INTO  region (regionName, currency, symbol, flag, countryCode) VALUES (?,?,?,?,?)`;
        const [result] = await promisePool.query(sql, [data.regionName, data.currency, data.symbol, flag, data.countryCode]);
        return result
    };

    updateRegionName = async (data, flag) => {
        let sql = `UPDATE region SET regionName = ?, currency = ?, symbol = ?, countryCode = ?, flag= ? WHERE id = ?`;
        const [result] = await promisePool.query(sql, [data.regionName, data.currency, data.symbol, data.countryCode, flag, data.id]);
        return result
    };

    updateRegionStatus = async (data) => {
        let sql = `UPDATE region SET status = ? WHERE id = ?`;
        const [result] = await promisePool.query(sql, [data.status, data.id]);
        return result
    };


}
module.exports = new adminModel();
