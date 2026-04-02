const promisePool = require("../../utils/pool");

exports.getPromoCodeList = async () => {
    let sql = `
        SELECT promocode.*, users.fullName 
        FROM promocode 
        LEFT JOIN users ON promocode.userId = users.id 
        ORDER BY promocode.id DESC
    `;
    const [result, fields] = await promisePool.query(sql);
    return result;
}


exports.insertPromoCode = async (data) => {
    let sql = 'INSERT INTO promocode (promoCode, discount, validFrom, validTo, userId, applyFor) VALUES (?,?,?,?,?,?) ';
    const [result] = await promisePool.query(sql, [
        data.promoCode,
        parseInt(data.discount),
        data.validFrom,
        data.validTo,
        data.userId,
        data.applyFor 
    ]);
    return result;
};

exports.checkPromoCodeName = async (promoCode) => {
    let sql = `SELECT promoCode FROM promocode WHERE promoCode = ?`;
    const [result, fields] = await promisePool.query(sql, [promoCode]);
    return result;
};


exports.updatePromoCode = async (data) => {
    let sql = 'UPDATE promocode SET promoCode = ?, discount = ?, validFrom = ?, validTo = ? WHERE id = ?'
    const [result] = await promisePool.query(sql, [
        data.promoCode,
        data.discount,
        data.validFrom,
        data.validTo,
        data.id
    ]);
    return result;
}

exports.updatePromoCodeStatus = async (data) => {
    let sql = `UPDATE promocode SET status = ? WHERE id = ?`
    const [result] = await promisePool.query(sql, [
        data.status,
        data.id
    ])
    return result
}



exports.deletePromocode = async (data) => {
    let sql = `DELETE FROM promocode WHERE id = ?`;
    const [result] = await promisePool.query(sql, [data])
    return result
}

//---------------------------------|| ORDER ||---------------------------------
exports.getOrderList = async () => {
    let sql = `SELECT orders.*, users.fullName AS fullName
    FROM orders
    LEFT JOIN users ON orders.userId = users.id
    WHERE orders.userId IS NOT NULL;`;

    const [result, fields] = await promisePool.query(sql);
   
    return result;
}


exports.updateOrderStatus = async (data) => {

    let sql = `UPDATE orderitem SET status = ?, updateTime = CURRENT_TIMESTAMP WHERE id = ?`
    const [result] = await promisePool.query(sql, [
        data.status,
        data.id
    ])
    return result
}

exports.updateProcessingDate = async (data,date,orderStatus) => {
    let sql = `UPDATE orderitem SET status = ?, processingDate=?,orderStatus=?, updateTime = CURRENT_TIMESTAMP WHERE id = ?`
    const [result] = await promisePool.query(sql, [
        data.status,
        date,
        orderStatus,
        data.id
    ])
    return result
}

exports.updateShippedDate = async (data,date,orderStatus) => {
    let sql = `UPDATE orderitem SET status = ?, shippedDate=?, orderStatus=?, updateTime = CURRENT_TIMESTAMP WHERE id = ?`
    const [result] = await promisePool.query(sql, [
        data.status,
        date,
        orderStatus,
        data.id
    ])
    return result
}


exports.outFordelivaryDate = async (data,date,orderStatus) => {


    
    let sql = `UPDATE orderitem SET status = ?, outForDeliveryDate=?,orderStatus=?, updateTime = CURRENT_TIMESTAMP WHERE id = ?`
    const [result] = await promisePool.query(sql, [
        data.status,
        date,
        orderStatus,
        data.id
    ])
    return result
}

exports.deliveredDate = async (data,date,orderStatus) => {
    let sql = `UPDATE orderitem SET status = ?, deliveredDate=?, orderStatus=?, updateTime = CURRENT_TIMESTAMP WHERE id = ?`
    const [result] = await promisePool.query(sql, [
        data.status,
        date,
        orderStatus,
        data.id
    ])
    return result
}

exports.updateOrderStatusComment = async (data) => {
    let sql = `UPDATE orderitem SET deliveryPartner = ?, tracking_Url_Id = ?, expDeliveryDate=? WHERE id = ?`
    const [result] = await promisePool.query(sql, [
        data.deliveryPartner,
        data.tracking_Url_Id,
        data.expDeliveryDate,
        data.id
    ])
    return result
}

exports.getCancelAndReturnList = async () => {
    let sql = `SELECT cr.id, cr.userId, u.fullName, u.email, cr.orderItemId, cr.cancelAndReturn_reson, cr.deliveryPartner, cr.tracking_Url_Id, cr.expDeliveryDate, cr.type, cr.updatedBy, cr.dateTime AS cancelAndReturnDate, oi.productId, oi.price, o.currency,o.orderNumber, oi.quantity,oi.cartNumber,oi.AdminStatus, oi.refund_status, p.productName,
    (
        SELECT JSON_ARRAYAGG(pi.image)
        FROM productimage AS pi
        WHERE pi.productId = p.id
    ) AS image
    FROM cancelandreturns AS cr
    LEFT JOIN users AS u ON u.id = cr.userId
    LEFT JOIN orderitem AS oi ON oi.id = cr.orderItemId
    LEFT JOIN products AS p ON p.id = oi.productId
    LEFT JOIN orders AS o ON o.id = oi.orderId
    ORDER BY cr.id DESC`
    const [result, fields] = await promisePool.query(sql);
    return result;
}

exports.getCancelAndReturnDetailById = async (id) => {
    let sql = `SELECT cr.id, cr.userId, u.fullName, o.currency,o.orderNumber,o.paymentMethod, u.email, u.phoneNo, cr.orderItemId, cr.cancelAndReturn_reson, cr.deliveryPartner, cr.tracking_Url_Id, cr.expDeliveryDate, cr.type, cr.updatedBy, cr.dateTime AS cancelAndReturnDate,oi.orderId,oi.cartNumber,oi.status, oi.productId, oi.updateTime, oi.price, oi.quantity,oi.adminStatus, oi.refund_status, oi.dateTime AS orderPlacedOn, p.productName,
    (
        SELECT JSON_ARRAYAGG(pi.image)
        FROM productimage AS pi
        WHERE pi.productId = p.id
    ) AS image
    FROM cancelandreturns AS cr
    LEFT JOIN orderitem AS oi ON oi.id = cr.orderItemId
    LEFT JOIN users AS u ON u.id = cr.userId
    LEFT JOIN orders AS o ON o.id = oi.orderId
    LEFT JOIN products AS p ON p.id = oi.productId
    WHERE cr.id = ?
    ORDER BY cr.id DESC`;
    const [result, fields] = await promisePool.query(sql, [id]);
    

    // Parse image string into an array of objects
    // result.forEach(item => {
  
    //     item.image = JSON.parse(item.image);
    // });


    return result;
}


exports.updateCancelAndReturnStatus = async (data,status) => {
    let sql = `UPDATE orderitem SET refund_status = ?,orderStatus=?, refundedAmount = refundedAmount + ?, deductionDetail = ?, updateTime = CURRENT_TIMESTAMP WHERE id = ?`
    const [result] = await promisePool.query(sql, [
        data.status,
        status,
        data.refundedAmount,
        data.deductionDetail,
        data.id
    ])
    return result
}

exports.updateOrderStatusToReject = async (data,status) =>{
    let sql = `UPDATE orderitem SET refund_status = ?,AdminStatus = ?,orderStatus=?,  updateTime = CURRENT_TIMESTAMP WHERE id = ?`
    const [result] = await promisePool.query(sql, [
        2,
        2,status,
        data.id
    ])
    return result
}

exports.updateOrderStatusByAdmin = async (data,status) =>{



    let sql = `UPDATE orderitem SET AdminStatus = ?,orderStatus=?, updateTime = CURRENT_TIMESTAMP WHERE id = ?`
    const [result] = await promisePool.query(sql, [
        1,
        status,
        data.id
    ])
    return result
}

exports.getOrderDetailById = async (orderId) => {
    let sql = `SELECT o.dateTime, o.currency, oi.*, o.userId, o.orderNumber, o.paymentStatus FROM orderitem AS oi
    LEFT JOIN orders AS o ON o.id = oi.orderId 
    WHERE oi.id = ?`;
    const [result, fields] = await promisePool.query(sql, [orderId]);

    
    
    result.forEach(order => {
        if (order.orderStatus) {
            order.orderStatus= JSON.parse(order.orderStatus);
        }
      });
    return result;
}




exports.getOrderItemDetailByItemId = async (reqData) => {
    let sql = `SELECT orderitem.*,  users.fullName, users.email, users.phoneNo
    FROM orderitem
    LEFT JOIN users ON users.id = orderitem.userId
    WHERE orderitem.userId = ? AND orderitem.id = ?;
    `;
    const [result, fields] = await promisePool.query(sql, [reqData.userId, reqData.orderItemId]);

    result.forEach(order => {
        if (order.orderStatus) {
            order.orderStatus= JSON.parse(order.orderStatus);
        }
      });


    return result;
}


exports.getOrderItemDetailById = async (id) => {
    let sql = `SELECT oi.*, cr.cancelAndReturn_reson, p.productName, p.productQuantity FROM orderitem as oi 
    LEFT JOIN products as p ON p.id = oi.productId 
    LEFT JOIN cancelandreturns AS cr ON cr.orderItemId = oi.id
    WHERE oi.id = ? AND oi.refund_status = ?`;
    const [result, fields] = await promisePool.query(sql, [id, '0']);
    return result;
}

exports.getUserDetailById = async (userId) => {
    let sql = `SELECT * FROM users WHERE id = ?`;
    const [result, fields] = await promisePool.query(sql, [userId]);
    return result;
}

exports.getOrderDetailsById = async (orderId) => {
    // let sql = `
    // SELECT o.*, oi.*, JSON_ARRAYAGG(p.image) AS image
    // FROM orders AS o 
    // LEFT JOIN orderitem AS oi ON oi.orderId = o.id
    // LEFT JOIN productimage AS p ON p.productId = oi.productId
    // WHERE o.id = ?
    // GROUP BY o.id, oi.id;
    //    `;

       let sql =`SELECT 
    o.*, 
    oi.*, 
    pr.productName,
    JSON_ARRAYAGG(p.image) AS images
FROM 
    orders AS o
LEFT JOIN 
    orderitem AS oi ON oi.orderId = o.id
LEFT JOIN 
    productimage AS p ON p.productId = oi.productId
LEFT JOIN 
    products AS pr ON pr.id = oi.productId
WHERE 
    o.id = ?
GROUP BY 
    o.id, oi.id, pr.productName;

       `
//     let sql=`
//     SELECT 
//     o.*, 
//     oi.*, 
//     p.image, 
//     pr.productName, 
//     JSON_ARRAYAGG(p.image) OVER (PARTITION BY o.id) AS images
// FROM 
//     orders AS o
// LEFT JOIN 
//     orderItem AS oi ON oi.orderId = o.id
// LEFT JOIN 
//     productimage AS p ON p.productId = oi.productId
// LEFT JOIN 
//     products AS pr ON pr.id = oi.productId
// WHERE 
//     o.id = ?
// GROUP BY 
//     o.id, oi.id, pr.productName, p.image;
//     `

//     let sql = `
//     SELECT 
//         o.*, 
//         oi.*, 
//         p.image AS image
//     FROM 
//         orders AS o 
//     LEFT JOIN 
//         orderItem AS oi ON oi.orderId = o.id
//     LEFT JOIN 
//         productimage AS p ON p.productId = oi.productId
//     WHERE 
//         o.id = ?
// `;

    const [result, fields] = await promisePool.query(sql, [orderId]);
    
    // // Parse orderItems field from string to array
    // if (result.length > 0) {
    //     result[0].orderItems = JSON.parse(result[0].orderItems);

    //     // Parse images field within each orderItem to array
    //     result.forEach(order => {
    //         if (order.image) {
    //             order.image= JSON.parse(order.image);
    //         }
    //       });
    // }
    
    return result;
};






exports.updateCancelReason = async (data) => {
    let sql = `INSERT INTO orderitem (cancelAndReturn_reson), status = ? WHERE id = ?`
    const [result] = await promisePool.query(sql, [
        data.cancelAndReturn_reson,
        5,
        data.id
    ])
    return result
}

exports.updateStatusToCancelInOrderItem = async (orderId) => {
    let sql = `UPDATE orderitem SET status = ? WHERE orderId = ?`
    const [result] = await promisePool.query(sql, [
        1,
        orderId
    ])
    return result
}

exports.getOrderDetailByOrderId = async (orderId) => {
    let sql = `SELECT o.userId, o.orderNumber, o.paymentStatus FROM orders AS o
    WHERE o.id = ?`;
    const [result, fields] = await promisePool.query(sql, [orderId]);
    return result;
}

exports.cancelThisOrder = async (data,orderStatus) => {

    let cancelDate = new Date()
    let sql = `UPDATE orderitem SET status = ?, cancelAndReturn_reson = ?,orderStatus=?, cancelDate = ? WHERE id = ?`;
    const [result, fields] = await promisePool.query(sql, [5, data.cancelAndReturn_reson,orderStatus,cancelDate, data.orderItemId]);
    return result;
}

// cancelThisOrder = async (data,orderStatus) => {
//     let cancelDate = new Date()
//     let sql = `UPDATE orderitem SET status = ?, cancelAndReturn_reson = ?,orderStatus=?, cancelDate = ? WHERE id = ?`;
//     const [result, fields] = await promisePool.query(sql, [5, data.cancelAndReturn_reson,orderStatus,cancelDate, data.orderItemId]);
//     return result;
// }



exports.insertCancelReason = async (userId, data) => {
    let sql = 'INSERT INTO cancelandreturns (userId, cancelAndReturn_reson, orderItemId, type, updatedBy) VALUES (?,?,?,?,?)'
    const [result, fields] = await promisePool.query(sql, [userId, data.cancelAndReturn_reson, data.orderItemId, '1', 'ADMIN']);
    return result;
}

exports.getSupplierList = async () => {
    let sql = `SELECT * FROM supplierDetails`;
    const [result, fields] = await promisePool.query(sql, []);
    return result;
}

exports.getSupplierListById = async (id) => {
    let sql = `SELECT * FROM supplierDetails WHERE id = ? `;
    const [result, fields] = await promisePool.query(sql, [id]);
    return result;
}

exports.updateSupplierDetail = async(data) =>{
    let sql = `UPDATE supplierDetails SET IIN = ?, BIN = ? , BIC = ?, address = ? WHERE id = ?`;
    const [result, fields] = await promisePool.query(sql, [data.IIN, data.BIN, data.BIC, data.address, data.id]);
    return result;
}



