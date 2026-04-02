const config = require('../../config');
const promisePool = require("../../utils/pool");

exports.getUserAddressList = async (userId) => {
    let sql = `SELECT * FROM address WHERE userId = ? AND status = 1`;
    const [result] = await promisePool.query(sql, [userId]);

    return result;
};

exports.geAddressListById = async (id) => {
    let sql = `SELECT * FROM address WHERE id = ? AND status = 1`;
    const [result] = await promisePool.query(sql, [id]);
    const modifiedResult = result.map((address) => {
        // Check if region is null or undefinedz
        const region = address.region || '';
        const match = region.match(/^(.*?)\s*\([^)]*\)$/);
        const regionName = match ? match[1] : region;
        return { ...address, regionName };
    });
    

    return modifiedResult;
};

exports.checkOldBillingAddress = async (userId) => {
    let sql = `SELECT billingAddress, userId, id FROM address WHERE userId = ? AND status = 1`;
    const [result] = await promisePool.query(sql, [userId]);
    return result;
};

exports.updateBillingStatus = async (userId) => {
    let sql = `UPDATE address set billingAddress = 0 WHERE userId = ?`;
    const [result, fields] = await promisePool.query(sql, [
        userId
    ]);
    return result;
}

exports.insertUserAddress = async (data, userId) => {
    let sql = 'INSERT INTO address (fullName, address, city, state, region, postalCode, countryCode, phone, alternateNo, userId) VALUES (?,?,?,?,?,?,?,?,?,?)';
    const [result] = await promisePool.query(sql, [
        data.fullName || null,
        data.address || null,
        data.city || null,
        data.state || null,
        data.region || null,
        data.postalCode || null,
        data.countryCode || null,
        data.phone || null,
        data.alternateNo || null,
        userId
    ]);
    return result;
}





exports.getUserAddressDetailById = async (id) => {
    let sql = `SELECT * FROM address WHERE id = ? AND status = 1`;
    const [result] = await promisePool.query(sql, [id]);
    return result;
};

// let sql = `SELECT * FROM product_name WHERE price => 100`;


exports.updateBillingStatusById = async (userId, id) => {
    let sql = `UPDATE address set billingAddress = 0 WHERE userId = ? AND id != ?`;
    const [result, fields] = await promisePool.query(sql, [
        userId,
        id
    ]);
    return result;
}

exports.updateUserAddress = async (data, userId) => {
    let sql = `UPDATE address set fullName = ?, address = ?, city = ?, state = ?, region = ?, postalCode = ?, countryCode = ?, phone = ?,alternateNo=? WHERE id = ? AND userId = ?`;
    const [result, fields] = await promisePool.query(sql, [
        data.fullName|| null,
        data.address|| null,
        data.city|| null,
        data.state|| null,
        data.region|| null,
        data.postalCode|| null,
        data.countryCode|| null,
        data.phone|| null,
        data.alternateNo|| null,
        data.id,
        userId

    ]);
    return result;
}

exports.deleteUserAddress = async (id, userId) => {
    let sql = `UPDATE address SET status = 0 WHERE id = ? And userId = ?`;
    const [result] = await promisePool.query(sql, [id, userId]);
    return result;
}