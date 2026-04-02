const promisePool = require("../../utils/pool");


class UserModel {



    insertOrderDetail = async (reqData) => {
        let sql = `Insert INTO orders SET ?`;
        const [result, fields] = await promisePool.query(sql, [reqData]);
        return result;
    }



    updateOrderStatus = async(id,reqData)=> {
        let sql = `UPDATE orders SET paymentStatus = ?, paymentOrderId=?, pendingReason=?, status=? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [reqData.paymentStatus, reqData.paymentOrderId, reqData.pendingReason,reqData.status, id]);
        return result;
    }



    updateorderitemStatus = async(id,reqData)=> {
        let sql = `UPDATE orderitem SET status= ?, pendingRemark=?, orderStatus=? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [reqData.status, reqData.pendingRemark,reqData.orderStatus,id]);
        return result;
    }

    
    getCartItem =async (id) =>{
        let sql = `SELECT * FROM orderitem 
         WHERE id = ?
     `;
     const [result, fields] = await promisePool.query(sql,[id]);
     return result;
 
     }


    insertInvoice = async (id, pdfPath) => {
        let sql = `UPDATE orderitem SET invoice = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [pdfPath, id]);
        return result;
    }
    


    checkQuantity =  async (id) => {
        let sql = `SELECT productQuantity FROM products WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [id]);
        return result;
    }

    // insertorderitem = async (orderId, item) => {
    //     let sql = `Insert INTO orderitem (orderId, productId, sizeId, price, quantity) VALUES (?,?,?,?,?)`;
    //     const [result, fields] = await promisePool.query(sql, [
    //         orderId,
    //         item.id,
    //         item.selectedSizeId,
    //         item.buyPrice,
    //         item.quantity
    //     ]);
    //     return result;
    // }

    insertorderitem = async (orderitem) => {

        
        let sql = `Insert INTO orderitem SET ?`;
        const [result, fields] = await promisePool.query(sql, [orderitem]);
        return result;
    }

    clearCartItems = async (userId) => {
        let sql = 'DELETE FROM cartItems WHERE userId = ?';
        const [result, fields1] = await promisePool.query(sql, [userId]);
        return result;
    }

    updateOrderPaymentStatus = async(reqData)=> {
        let sql = `UPDATE orders SET paymentStatus = ?, payment_intend_id=?, paymentResult=? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [reqData.status, reqData.payment_intend_id, reqData.paymentResult, reqData.orderId]);
        return result;
    }


    updateOrderCodStatus = async(reqData)=> {
        let sql = `UPDATE orders SET paymentStatus = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [reqData.status, reqData.orderId]);
        return result;
    }

    cancelAndRemoveOrder = async(reqData) => {
        let sql = 'DELETE FROM orderitem WHERE orderId = ?';
        const [result, fields] = await promisePool.query(sql, [reqData.orderId]);        
        let sql1 = 'DELETE FROM orders WHERE id = ?';
        const [result1, fields1] = await promisePool.query(sql1, [reqData.orderId]);
        return result1;
    }

    getProductById = async (productId) => {
        let sql = `SELECT id, isSizeAvailable, productQuantity from products WHERE id = ? AND status = 1`;
        const [result, fields] = await promisePool.query(sql, [productId]);
        return result;
    }

    getSizeById = async (sizeId, productId) => {
        let sql = `SELECT id, quantity from productsizes WHERE sizeId = ? AND productId = ?`;
        const [result, fields] = await promisePool.query(sql, [sizeId, productId]);
        return result;
    }

    updateQuantityFromProductSizeTable = async (productId, sizeId, quantity) => {
        let sql = 'UPDATE productsizes SET quantity = quantity - ? WHERE productId = ? AND sizeId = ?';
        const [result, fields] = await promisePool.query(sql, [quantity, productId, sizeId]);
        return result;
    }
    
    
    updateQuantityFromProductsTable = async (quantity,productId) => {
        let sql = 'UPDATE products SET productQuantity = productQuantity - ? WHERE id = ?';
        const [result, fields] = await promisePool.query(sql, [quantity,productId]);
        return result;
    }
    
    checkUsedPromocode = async (promocode, userId) => {
        let sql = `SELECT id, promocode from orders WHERE promocode = ? AND userId = ?`;
        const [result, fields] = await promisePool.query(sql, [promocode, userId]);
        return result;
    }


    checkAllPromocode = async (promocode, userId) => {
        let sql = `SELECT id, promocode from orders WHERE promocode = ? AND userId = ?`;
        const [result, fields] = await promisePool.query(sql, [promocode, userId]);
        return result;
    }



    getUserEmailByUserId = async (userId) => {
        let sql = `SELECT email FROM users WHERE id = ? AND status = 1`;
        const [result, fields] = await promisePool.query(sql, [userId]);
        return result;
    }

    checkPromocode = async (promocode) => {
        let sql = `SELECT id, promoCode, discount, validFrom, validTo from promocode WHERE promoCode = ? `;
        const [result, fields] = await promisePool.query(sql, [promocode]);
        return result;
    }

    getPromocodes = async () => {
        let sql = `SELECT id, promoCode, discount, validFrom, validTo from promocode `;
        const [result, fields] = await promisePool.query(sql);
        return result;
    }


    getPrmocodesById =async (id) =>{
       let sql = `SELECT id, promoCode, discount, validFrom, validTo 
        FROM promocode 
        WHERE id = ?
    `;
    const [result, fields] = await promisePool.query(sql,[id]);
    return result;

    }

    getPromocode = async (userId) => {
        

        let sql;
        if (userId) {
            sql = `
                SELECT id, promoCode, discount, validFrom, validTo 
                FROM promocode 
                WHERE (userId = ? OR applyFor = 'all')
            `;
            const [result, fields] = await promisePool.query(sql, [userId]);
            return result;
        } else {
            sql = `
                SELECT id, promoCode, discount, validFrom, validTo 
                FROM promocode 
                WHERE applyFor = 'all'
            `;
            const [result, fields] = await promisePool.query(sql);
            return result;
        }
    };
    


    checkProductQuantity = async (data) => {
        let sql = `SELECT id, isSizeAvailable, productQuantity from products WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [data.productId]);
        return result;
    }

    checkProductSizeQuantity = async (data) => {
        let sql = `SELECT id, sizeId, quantity, productId from productsizes WHERE sizeId = ? AND productId = ?`;
        const [result, fields] = await promisePool.query(sql, [data.productSizeId, data.productId]);
        return result;
    }




    getOrderListByUserId = async (userId) => {

        let sql = `
            SELECT 
                o.*,
                oi.*,
                s.sizeName,
                p.productName,
                b.brandName,
                CONCAT(adr.fullName) AS fullName,
                p.slug,
                getImageArray(p.id) as images,
                IF(feedback.productId IS NOT NULL, 1, 0) AS hasFeedback
            FROM 
                orders AS o
            LEFT JOIN 
                orderitem AS oi ON oi.orderId = o.id AND oi.userId = ?
            LEFT JOIN 
                sizes AS s ON s.id = oi.sizeId
            LEFT JOIN 
                products AS p ON p.id = oi.productId
            LEFT JOIN 
                address AS adr ON adr.id = o.deliveryAddressId AND adr.userId = ?
            LEFT JOIN 
                brands AS b ON b.id = p.brandId
            LEFT JOIN 
                (
                    SELECT productId, orderId
                    FROM feedback 
                    WHERE userId = ?
                ) AS feedback ON feedback.productId = p.id AND feedback.orderId = oi.id
            WHERE 
                o.userId = ?
            ORDER BY 
                o.id DESC;
        `;
        const [result, fields] = await promisePool.query(sql, [userId, userId, userId, userId]);
    
    
        result.forEach(product => {
            // if (product.images) {
            //     product.images = JSON.parse(product.images);
            // }

                if (product.orderStatus) {
                    product.orderStatus= JSON.parse(product.orderStatus);
                }
              
        });
        return result;
    }
    














    // getOrderListByUserId = async (userId) => {
    //     let sql = `
    //         SELECT 
    //             o.*,
    //             oi.*,
    //             s.sizeName,
    //             p.productName,
    //             b.brandName,
    //             CONCAT(adr.fullName) AS fullName,
    //             p.slug,
    //             getImageArray(p.id) as images,
    //             IF(feedback.productId IS NOT NULL, 1, 0) AS hasFeedback
    //         FROM 
    //             orders AS o
    //         LEFT JOIN 
    //             orderitem AS oi ON oi.orderId = o.id AND oi.userId = ?
    //         LEFT JOIN 
    //             sizes AS s ON s.id = oi.sizeId
    //         LEFT JOIN 
    //             products AS p ON p.id = oi.productId
    //         LEFT JOIN 
    //             address AS adr ON adr.id = o.deliveryAddressId AND adr.userId = ?
    //         LEFT JOIN 
    //             brands AS b ON b.id = p.brandId
    //         LEFT JOIN 
    //             (
    //                 SELECT productId 
    //                 FROM feedback 
    //                 WHERE userId = ?
    //             ) AS feedback ON feedback.productId = p.id AND feedback.orderId = oi.id
    //         WHERE 
    //             o.userId = ?
    //         ORDER BY 
    //             o.id DESC;
    //     `;
    //     const [result, fields] = await promisePool.query(sql, [userId, userId, userId, userId]);
    
    //     result.forEach(product => {
    //         if (product.images) {
    //             product.images = JSON.parse(product.images);
    //         }
    //     });
    //     return result;
    // }
    







    // getOrderListByUserId = async (userId) => {
    //     let sql = `
    //         SELECT 
    //             o.*,
    //             oi.*,
    //             s.sizeName,
    //             p.productName,
    //             b.brandName,
    //             CONCAT(adr.fullName) AS fullName,
    //             p.slug,
    //             getImageArray(p.id) as images,
    //             IF(feedback.productId IS NOT NULL, 1, 0) AS hasFeedback
    //         FROM 
    //             orders AS o
    //         LEFT JOIN 
    //             orderitem AS oi ON oi.orderId = o.id
    //         LEFT JOIN 
    //             sizes AS s ON s.id = oi.sizeId
    //         LEFT JOIN 
    //             products AS p ON p.id = oi.productId
    //         LEFT JOIN 
    //             address AS adr ON adr.id = o.deliveryAddressId AND adr.userId = ?
    //         LEFT JOIN 
    //             brands AS b ON b.id = p.brandId
    //         LEFT JOIN 
    //             (
    //                 SELECT productId 
    //                 FROM feedback 
    //                 WHERE userId = ?
    //             ) AS feedback ON feedback.productId = p.id
    //         WHERE 
    //             o.userId = ?
    //         ORDER BY 
    //             o.id DESC;
    //     `;
    //     const [result, fields] = await promisePool.query(sql, [userId, userId, userId]);
    
    //     result.forEach(product => {
    //         if (product.images) {
    //             product.images = JSON.parse(product.images);
    //         }
    //     });
    //     return result;
    // }
    
    

    getOrderDetailById = async (reqData) => {
        let sql = `SELECT orders.*, users.*, oi.*
        FROM orders
        LEFT JOIN orderitem AS oi ON oi.orderId = orders.id
        LEFT JOIN users ON users.id = orders.userId
        WHERE orders.userId = ? AND orders.id = ?;
        `;
        const [result, fields] = await promisePool.query(sql, [reqData.user_id, reqData.orderId]);
        return result;
    }

    getorderitemDetailById = async (reqData) => {
        let sql = `SELECT orderitem.*,  users.fullName, users.email, users.phoneNo
        FROM orderitem
        LEFT JOIN users ON users.id = orderitem.userId
        WHERE orderitem.userId = ? AND orderitem.id = ?;
        `;
        const [result, fields] = await promisePool.query(sql, [reqData.userId, reqData.orderitemId]);

        result.forEach(order => {
            if (order.orderStatus) {
                order.orderStatus= JSON.parse(order.orderStatus);
            }
          });


        return result;
    }


    cancelThisOrder = async (data,orderStatus) => {
        let cancelDate = new Date()
        
        let sql = `UPDATE orderitem SET status = ?, cancelAndReturn_reson = ?,orderStatus=?, cancelDate = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [5, data.cancelAndReturn_reson,orderStatus,cancelDate, data.orderitemId]);
        return result;
    }
    

    insertCancelReason = async(userId, data) =>{
        
        let sql = 'INSERT INTO cancelandreturns (userId, cancelAndReturn_reson, orderitemId, type, updatedBy) VALUES (?,?,?,?,?)'
        const [result, fields] = await promisePool.query(sql, [userId, data.cancelAndReturn_reson, data.orderitemId, '1', 'USER']);
        return result;
    }

    insertReturnReason = async(userId, data) =>{
        let sql = 'INSERT INTO cancelandreturns (userId, orderitemId,cancelAndReturn_reson, deliveryPartner, tracking_Url_Id, expDeliveryDate, type, updatedBy) VALUES (?,?,?,?,?,?,?,?)'
        const [result, fields] = await promisePool.query(sql, [userId, data.orderitemId, data.cancelAndReturn_reson, data.deliveryPartner, data.tracking_Url_Id, data.expDeliveryDate, '2', 'USER']);
        return result;
    }
    
    returnThisOrder = async (data,orderStatus) => {
        let reutrnDate = new Date()
        let sql = `UPDATE orderitem SET status = ?, cancelAndReturn_reson = ?,orderStatus=?, returnDate = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [6, data.cancelAndReturn_reson,orderStatus, reutrnDate, data.orderitemId]);
        return result;
    }
    getOrderDetailsById = async (reqData) => {
        let sql = `SELECT o.*, CONVERT(getorderitemsListById(o.id) USING utf8mb4) COLLATE utf8mb4_unicode_ci as orderitems,u.* FROM orders AS o LEFT JOIN users AS u ON u.id = o.userId WHERE o.id = ? AND userId = ?`;
        const [result, fields] = await promisePool.query(sql, [reqData.orderId, reqData.user_id]);

        result.forEach(order => {
            if (order.orderitems) {
                order.orderitems= JSON.parse(order.orderitems);
            }
          });

        return result;
    }




    
    getdevliverychargesandtexses = async (regionName) => {
        let sql = `SELECT dct.id, dct.regionId, dct.deliveryCharges, dct.tax, r.regionName FROM devliverychargesandtexses AS dct
        LEFT JOIN region AS r ON r.id = dct.regionId
        WHERE r.regionName = ? AND dct.status = 1`;
        const [result, fields] = await promisePool.query(sql, [regionName]);
        return result;
    }

    getcanceandreturnorderByItemId = async (userId, orderitemId) => {
        let sql = `SELECT cr.id, cr.userId, u.firstName, u.lastName, o.currency, u.email, cr.orderitemId, cr.cancelAndReturn_reson, cr.deliveryPartner, cr.tracking_Url_Id, cr.expDeliveryDate, cr.type, cr.updatedBy, cr.dateTime AS cancelAndReturnDate,oi.orderId, oi.productId, oi.updateTime, oi.refundedAmount, oi.deductionDetail, oi.price, oi.quantity, oi.refund_status, oi.dateTime AS orderPlacedOn, p.productName, getImageArray(p.id) AS image FROM cancelandreturns AS cr
        LEFT JOIN users AS u ON u.id = cr.userId
        LEFT JOIN orderitem AS oi ON oi.id = cr.orderitemId
        LEFT JOIN orders AS o ON o.id = oi.orderId
        LEFT JOIN products AS p ON p.id = oi.productId WHERE cr.userId = ? AND cr.orderitemId = ? 
        ORDER BY cr.id DESC`;
        const [result, fields] = await promisePool.query(sql, [userId, orderitemId]);
        return result;
    }

    getSupplierList = async () => {
        let sql = `SELECT * FROM supplierDetails`;
        const [result, fields] = await promisePool.query(sql, []);
        return result;
    }

}

module.exports = new UserModel();




