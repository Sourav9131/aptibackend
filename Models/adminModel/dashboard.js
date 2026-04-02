const promisePool = require("../../utils/pool");

exports.getDashboardStatistics = async() => {
    let sql = `
        SELECT
            (SELECT COUNT(id) FROM users) AS totalUser,
            (SELECT COUNT(id) FROM users WHERE status = 1) AS totalActiveUser,
            (SELECT COUNT(id) FROM products) AS totalProducts,
            (SELECT COUNT(id) FROM orders) AS totalOrders,
            (SELECT COUNT(id) FROM orders WHERE DATE(dateTime) = CURDATE()) AS todayPlaceOrder,
            (SELECT COUNT(id) FROM brands) AS totalBrands,
            (SELECT COUNT(id) FROM orderitem WHERE status = 5) AS totalCancelOrders,
            (SELECT COUNT(id) FROM orderitem WHERE status = 6) AS totalReturnOrders,
            (SELECT COUNT(id) FROM promocode) AS totalPromocodes,
            (SELECT COUNT(id) FROM users WHERE loginType = 'vendor') AS totalVendors
    `;
    const [result] = await promisePool.query(sql);
    return result;
}

