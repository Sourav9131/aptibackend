const promisePool = require("../../utils/pool");


class CartModel {

  AddCart = async (reqData) => {
    let sql = `Insert INTO cartItems SET ?`;
    const [result, fields] = await promisePool.query(sql, [reqData]);
    return result;
  }


  updateCartItem = async (reqData,id) => {
    let sql = `UPDATE cartItems SET quantity = ? WHERE productId = ? AND userId = ? AND id =?`;
    let where = [reqData.quantity, reqData.productId, reqData.userId,id];
    if (reqData.selectedSizeId !=="" || reqData.selectedSizeId != null) {
      sql = `UPDATE cartItems SET quantity = ?, selectedSizeId = ? WHERE productId = ? AND userId = ? AND id =?`;
      where = [reqData.quantity, reqData.selectedSizeId, reqData.productId, reqData.userId,id];
    }
    const [result, fields] = await promisePool.query(sql, where);
    return result;
  }

  removeFromCart = async (reqData) => {
    let where;
    let sql;

    if (reqData.selectedSizeId == null || reqData.selectedSizeId === '') {
        sql = `DELETE FROM cartItems WHERE productId = ? AND userId = ? AND selectedSizeId IS NULL`;
        where = [reqData.productId, reqData.userId];
    } else {
        sql = `DELETE FROM cartItems WHERE productId = ? AND userId = ? AND selectedSizeId = ?`;
        where = [reqData.productId, reqData.userId, reqData.selectedSizeId];
    }

    const [result, fields] = await promisePool.query(sql, where);
    return result;
}




  removeCartItemOnOrder = async (reqData) => {
    let sql = `DELETE FROM cartItems WHERE productId = ? AND userId = ?`;
    let where = [reqData.productId, reqData.userId]
    if (reqData.sizeId || reqData.sizeId != null) {
      sql = `DELETE FROM cartItems WHERE productId = ? AND userId = ? AND selectedSizeId = ?`;
      where = [reqData.productId, reqData.userId, reqData.sizeId]
    }
    const [result, fields] = await promisePool.query(sql, where);
    return result;
  }

  checkCartItem = async (reqData, userId) => {
    let sql = `SELECT * FROM cartItems WHERE productId = ? AND userId = ?`;
    let where = [reqData.productId, userId];
    if (reqData.selectedSizeId != null && reqData.selectedSizeId !=="") {
      sql = `SELECT * FROM cartItems WHERE productId = ? AND userId = ? AND selectedSizeId = ?`;
      where = [reqData.productId, userId, reqData.selectedSizeId];
    }
    const [result, fields] = await promisePool.query(sql, where);
    return result;
  }

  getCartItems = async (userId) => {


//     let sql =`
//     SELECT DISTINCT
//     ci.*, 
//     pr.*,
//     IFNULL(b.brandName, '') AS brandName, 
//     IFNULL(c.categoryName, '') AS categoryName, 
//     ci.productId,
//     IFNULL(getImageArray(ci.productId), JSON_ARRAY()) AS images, 
//     IFNULL(getProductSizes(ci.productId, ci.selectedSizeId), JSON_ARRAY()) AS allSizes, 
//     LOWER(IFNULL(c.categoryName, '')) AS categoryName,  
//     IFNULL(s.sizeName, '') AS sizeName,
//     IFNULL(
//         (
//             SELECT JSON_ARRAYAGG(
//                 JSON_OBJECT(
//                     'id', fe.id, 
//                     'user', JSON_OBJECT('id', u.id, 'fullName', IFNULL(u.fullName, ''), 'email', IFNULL(u.email, '')), 
//                     'rating', fe.rating, 
//                     'feedback', IFNULL(fe.feedback, ''), 
//                     'feedbackImage', IFNULL(fe.feedbackImage, ''), 
//                     'status', fe.status, 
//                     'dateTime', fe.dateTime
//                 )
//             )
//             FROM feedback AS fe
//             LEFT JOIN users AS u ON u.id = fe.userId
//             WHERE fe.productId = ci.productId
//         ),
//         JSON_ARRAY()
//     ) AS feedback,
//     CASE WHEN w.productId IS NOT NULL THEN 1 ELSE 0 END AS isWishlistadded,
//     IFNULL(
//         (
//             SELECT JSON_ARRAYAGG(
//                 JSON_OBJECT(
//                     'id', sp.id,
//                     'productName', IFNULL(sp.productName, ''),
//                     'description', IFNULL(sp.description, ''),
//                     'customerPrice', sp.customerPrice,
//                     'vendorPrice', sp.vendorPrice,
//                     'marginPrice', sp.marginPrice,
//                     'discount', sp.discount,
//                     'brandId', sp.brandId,
//                     'brandName', IFNULL(br.brandName, ''),
//                     'categoryId', sp.categoryId,
//                     'categoryName', IFNULL(cat.categoryName, ''),
//                     'specification', IFNULL(sp.specification, ''),
//                     'highlights', IFNULL(sp.highlights, ''),
//                     'warnings', IFNULL(sp.warnings, ''),
//                     'userManual', IFNULL(sp.userManual, ''),
//                     'isSizeAvailable', sp.isSizeAvailable,
//                     'productQuantity', sp.productQuantity,
//                     'dateTime', sp.dateTime,
//                     'status', sp.status,
//                     'popular', sp.popular,
//                     'bestQuality', sp.bestQuality,
//                     'shippingTime', sp.shippingTime,
//                     'slug', sp.slug,
//                     'image', IFNULL(getImageArray(sp.id), JSON_ARRAY()),
//                     'feedback', IFNULL((
//                         SELECT JSON_ARRAYAGG(
//                             JSON_OBJECT(
//                                 'id', fb.id, 
//                                 'user', JSON_OBJECT('id', us.id, 'fullName', IFNULL(us.fullName, ''), 'email', IFNULL(us.email, '')), 
//                                 'rating', fb.rating, 
//                                 'feedback', IFNULL(fb.feedback, ''), 
//                                 'feedbackImage', IFNULL(fb.feedbackImage, ''), 
//                                 'status', fb.status, 
//                                 'dateTime', fb.dateTime
//                             )
//                         )
//                         FROM feedback AS fb
//                         LEFT JOIN users AS us ON us.id = fb.userId
//                         WHERE fb.productId = sp.id
//                     ), JSON_ARRAY()),
//                     'averageRating', IFNULL((
//                         SELECT FORMAT(ROUND(AVG(rating), 1), 1) AS avgRating
//                         FROM feedback
//                         WHERE productId = sp.id
//                     ), '0.0')
//                 )
//             )
//             FROM products AS sp 
//             LEFT JOIN brands AS br ON br.id = sp.brandId 
//             LEFT JOIN category AS cat ON cat.id = sp.categoryId 
//             WHERE (sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(pr.productName, ' ', 1), '%') 
//                 OR sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(pr.productName, ' ', -1), '%'))
//                 AND sp.id != pr.id
//         ),
//         JSON_ARRAY()
//     ) AS similarProducts
// FROM cartItems AS ci 
// LEFT JOIN products AS pr ON pr.id = ci.productId 
// LEFT JOIN brands AS b ON b.id = pr.brandId 
// LEFT JOIN category AS c ON c.id = pr.categoryId 
// LEFT JOIN sizes AS s ON s.id = ci.selectedSizeId 
// LEFT JOIN wishlist AS w ON w.productId = pr.id
// WHERE ci.userId = ${userId}
// ORDER BY ci.id DESC;

// `
// let sql = `
//     SELECT DISTINCT
//     ci.*, 
//     pr.*,
//     IFNULL(b.brandName, '') AS brandName, 
//     IFNULL(c.categoryName, '') AS categoryName, 
//     ci.productId,
//     IFNULL(getImageArray(ci.productId), JSON_ARRAY()) AS images, 
//     IFNULL(
//         (
//             SELECT JSON_ARRAYAGG(
//                 JSON_OBJECT(
//                     'sizeId', ps.sizeId,
//                     'sizeName', IFNULL(s.sizeName, ''),
//                     'productId', ps.productId,
//                     'price', ps.onSizePrice
//                 )
//             )
//             FROM productsizes AS ps
//             LEFT JOIN sizes AS s ON s.id = ps.sizeId
//             WHERE ps.productId = ci.productId AND ps.sizeId = ci.selectedSizeId
//         ),
//         JSON_ARRAY()
//     ) AS allSizes, 
//     LOWER(IFNULL(c.categoryName, '')) AS categoryName,  
//     IFNULL(s.sizeName, '') AS sizeName,
//     IFNULL(
//         (
//             SELECT JSON_ARRAYAGG(
//                 JSON_OBJECT(
//                     'id', fe.id, 
//                     'user', JSON_OBJECT('id', u.id, 'fullName', IFNULL(u.fullName, ''), 'email', IFNULL(u.email, '')), 
//                     'rating', fe.rating, 
//                     'feedback', IFNULL(fe.feedback, ''), 
//                     'feedbackImage', IFNULL(fe.feedbackImage, ''), 
//                     'status', fe.status, 
//                     'dateTime', fe.dateTime
//                 )
//             )
//             FROM feedback AS fe
//             LEFT JOIN users AS u ON u.id = fe.userId
//             WHERE fe.productId = ci.productId
//         ),
//         JSON_ARRAY()
//     ) AS feedback,
//     CASE WHEN w.productId IS NOT NULL THEN 1 ELSE 0 END AS isWishlistadded,
//     IFNULL(
//         (
//             SELECT JSON_ARRAYAGG(
//                 JSON_OBJECT(
//                     'id', sp.id,
//                     'productName', IFNULL(sp.productName, ''),
//                     'description', IFNULL(sp.description, ''),
//                     'customerPrice', sp.customerPrice,
//                     'vendorPrice', sp.vendorPrice,
//                     'marginPrice', sp.marginPrice,
//                     'discount', sp.discount,
//                     'brandId', sp.brandId,
//                     'brandName', IFNULL(br.brandName, ''),
//                     'categoryId', sp.categoryId,
//                     'categoryName', IFNULL(cat.categoryName, ''),
//                     'specification', IFNULL(sp.specification, ''),
//                     'highlights', IFNULL(sp.highlights, ''),
//                     'warnings', IFNULL(sp.warnings, ''),
//                     'userManual', IFNULL(sp.userManual, ''),
//                     'isSizeAvailable', sp.isSizeAvailable,
//                     'productQuantity', sp.productQuantity,
//                     'dateTime', sp.dateTime,
//                     'status', sp.status,
//                     'popular', sp.popular,
//                     'bestQuality', sp.bestQuality,
//                     'shippingTime', sp.shippingTime,
//                     'slug', sp.slug,
//                     'image', IFNULL(getImageArray(sp.id), JSON_ARRAY()),
//                     'feedback', IFNULL((
//                         SELECT JSON_ARRAYAGG(
//                             JSON_OBJECT(
//                                 'id', fb.id, 
//                                 'user', JSON_OBJECT('id', us.id, 'fullName', IFNULL(us.fullName, ''), 'email', IFNULL(us.email, '')), 
//                                 'rating', fb.rating, 
//                                 'feedback', IFNULL(fb.feedback, ''), 
//                                 'feedbackImage', IFNULL(fb.feedbackImage, ''), 
//                                 'status', fb.status, 
//                                 'dateTime', fb.dateTime
//                             )
//                         )
//                         FROM feedback AS fb
//                         LEFT JOIN users AS us ON us.id = fb.userId
//                         WHERE fb.productId = sp.id
//                     ), JSON_ARRAY()),
//                     'averageRating', IFNULL((
//                         SELECT FORMAT(ROUND(AVG(rating), 1), 1) AS avgRating
//                         FROM feedback
//                         WHERE productId = sp.id
//                     ), '0.0')
//                 )
//             )
//             FROM products AS sp 
//             LEFT JOIN brands AS br ON br.id = sp.brandId 
//             LEFT JOIN category AS cat ON cat.id = sp.categoryId 
//             WHERE (sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(pr.productName, ' ', 1), '%') 
//                 OR sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(pr.productName, ' ', -1), '%'))
//                 AND sp.id != pr.id
//         ),
//         JSON_ARRAY()
//     ) AS similarProducts
// FROM cartItems AS ci 
// LEFT JOIN products AS pr ON pr.id = ci.productId 
// LEFT JOIN brands AS b ON b.id = pr.brandId 
// LEFT JOIN category AS c ON c.id = pr.categoryId 
// LEFT JOIN sizes AS s ON s.id = ci.selectedSizeId 
// LEFT JOIN wishlist AS w ON w.productId = pr.id
// WHERE ci.userId = ${userId}
// ORDER BY ci.id DESC;
// `

let sql = `
    SELECT DISTINCT
    ci.*, 
    pr.*,
    IFNULL(b.brandName, '') AS brandName, 
    IFNULL(c.categoryName, '') AS categoryName, 
    ci.productId,
    IFNULL(getImageArray(ci.productId), JSON_ARRAY()) AS images, 
    IFNULL(
        (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'sizeId', ps.sizeId,
                    'sizeName', IFNULL(s.sizeName, ''),
                    'productId', ps.productId,
                    'onSizePrice', ps.onSizePrice
                )
            )
            FROM productsizes AS ps
            LEFT JOIN sizes AS s ON s.id = ps.sizeId
            WHERE ps.productId = ci.productId AND ps.sizeId = ci.selectedSizeId
        ),
        JSON_ARRAY()
    ) AS allSizes, 
    LOWER(IFNULL(c.categoryName, '')) AS categoryName,  
    IFNULL(s.sizeName, '') AS sizeName,
    IFNULL(
        (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', fe.id, 
                    'user', JSON_OBJECT('id', u.id, 'fullName', IFNULL(u.fullName, ''), 'email', IFNULL(u.email, '')), 
                    'rating', fe.rating, 
                    'feedback', IFNULL(fe.feedback, ''), 
                    'feedbackImage', IFNULL(fe.feedbackImage, ''), 
                    'status', fe.status, 
                    'dateTime', fe.dateTime
                )
            )
            FROM feedback AS fe
            LEFT JOIN users AS u ON u.id = fe.userId
            WHERE fe.productId = ci.productId AND fe.status = 1
        ),
        JSON_ARRAY()
    ) AS feedback,
    CASE WHEN w.productId IS NOT NULL THEN 1 ELSE 0 END AS isWishlistadded,
    IFNULL(
        (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', sp.id,
                    'productName', IFNULL(sp.productName, ''),
                    'description', IFNULL(sp.description, ''),
                    'customerPrice', sp.customerPrice,
                    'vendorPrice', sp.vendorPrice,
                    'marginPrice', sp.marginPrice,
                    'discount', sp.discount,
                    'brandId', sp.brandId,
                    'brandName', IFNULL(br.brandName, ''),
                    'categoryId', sp.categoryId,
                    'categoryName', IFNULL(cat.categoryName, ''),
                    'specification', IFNULL(sp.specification, ''),
                    'highlights', IFNULL(sp.highlights, ''),
                    'warnings', IFNULL(sp.warnings, ''),
                    'userManual', IFNULL(sp.userManual, ''),
                    'isSizeAvailable', sp.isSizeAvailable,
                    'productQuantity', sp.productQuantity,
                    'dateTime', sp.dateTime,
                    'status', sp.status,
                    'popular', sp.popular,
                    'bestQuality', sp.bestQuality,
                    'shippingTime', sp.shippingTime,
                    'slug', sp.slug,
                    'image', IFNULL(getImageArray(sp.id), JSON_ARRAY()),
                    'feedback', IFNULL((
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', fb.id, 
                                'user', JSON_OBJECT('id', us.id, 'fullName', IFNULL(us.fullName, ''), 'email', IFNULL(us.email, '')), 
                                'rating', fb.rating, 
                                'feedback', IFNULL(fb.feedback, ''), 
                                'feedbackImage', IFNULL(fb.feedbackImage, ''), 
                                'status', fb.status, 
                                'dateTime', fb.dateTime
                            )
                        )
                        FROM feedback AS fb
                        LEFT JOIN users AS us ON us.id = fb.userId
                        WHERE fb.productId = sp.id
                    ), JSON_ARRAY()),
                    'averageRating', IFNULL((
                        SELECT FORMAT(ROUND(AVG(rating), 1), 1) AS avgRating
                        FROM feedback
                        WHERE productId = sp.id
                    ), '0.0')
                )
            )
            FROM products AS sp 
            LEFT JOIN brands AS br ON br.id = sp.brandId 
            LEFT JOIN category AS cat ON cat.id = sp.categoryId 
            WHERE (sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(pr.productName, ' ', 1), '%') 
                OR sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(pr.productName, ' ', -1), '%'))
                AND sp.id != pr.id
                AND sp.status = 1
        ),
        JSON_ARRAY()
    ) AS similarProducts
FROM cartItems AS ci 
LEFT JOIN products AS pr ON pr.id = ci.productId 
LEFT JOIN brands AS b ON b.id = pr.brandId 
LEFT JOIN category AS c ON c.id = pr.categoryId 
LEFT JOIN sizes AS s ON s.id = ci.selectedSizeId 
LEFT JOIN wishlist AS w ON w.productId = pr.id
WHERE ci.userId = ${userId}
ORDER BY ci.id DESC;
`


// let sql=`
// SELECT DISTINCT
//     ci.*, 
//     pr.*,
//     b.brandName, 
//     c.categoryName, 
//     ci.productId,
//     getImageArray(ci.productId) AS images, 
//     getProductSizes(ci.productId, ci.selectedSizeId) AS allSizes, 
//     b.brandName, 
//     LOWER(c.categoryName) AS categoryName,  
//     s.sizeName,
//     fe.id AS feedbackId,
//     u.id AS userId, 
//     u.fullName AS userFullName, 
//     u.email AS userEmail, 
//     fe.rating, 
//     fe.feedback, 
//     fe.feedbackImage, 
//     fe.status AS feedbackStatus, 
//     fe.dateTime AS feedbackDateTime,
//     CASE WHEN w.productId IS NOT NULL THEN 1 ELSE 0 END AS isWishlistadded,
//     sp.id AS similarProductId,
//     sp.productName AS similarProductName,
//     sp.description AS similarProductDescription,
//     sp.customerPrice AS similarProductCustomerPrice,
//     sp.vendorPrice AS similarProductVendorPrice,
//     sp.marginPrice AS similarProductMarginPrice,
//     sp.discount AS similarProductDiscount,
//     sp.brandId AS similarProductBrandId,
//     br.brandName AS similarProductBrandName,
//     sp.categoryId AS similarProductCategoryId,
//     cat.categoryName AS similarProductCategoryName,
//     sp.specification AS similarProductSpecification,
//     sp.highlights AS similarProductHighlights,
//     sp.warnings AS similarProductWarnings,
//     sp.userManual AS similarProductUserManual,
//     sp.isSizeAvailable AS similarProductIsSizeAvailable,
//     sp.productQuantity AS similarProductQuantity,
//     sp.dateTime AS similarProductDateTime,
//     sp.status AS similarProductStatus,
//     sp.popular AS similarProductPopular,
//     sp.bestQuality AS similarProductBestQuality,
//     sp.shippingTime AS similarProductShippingTime,
//     sp.slug AS similarProductSlug,
//     getImageArray(sp.id) AS similarProductImage,
//     fb.id AS similarProductFeedbackId, 
//     us.id AS similarProductUserId, 
//     us.fullName AS similarProductUserFullName, 
//     us.email AS similarProductUserEmail, 
//     fb.rating AS similarProductRating, 
//     fb.feedback AS similarProductFeedback, 
//     fb.feedbackImage AS similarProductFeedbackImage, 
//     fb.status AS similarProductFeedbackStatus, 
//     fb.dateTime AS similarProductFeedbackDateTime,
//     FORMAT(ROUND(AVG(fb.rating), 1), 1) AS similarProductAverageRating
// FROM cartItems AS ci 
// LEFT JOIN products AS pr ON pr.id = ci.productId 
// LEFT JOIN brands AS b ON b.id = pr.brandId 
// LEFT JOIN category AS c ON c.id = pr.categoryId 
// LEFT JOIN sizes AS s ON s.id = ci.selectedSizeId 
// LEFT JOIN wishlist AS w ON w.productId = pr.id
// LEFT JOIN feedback AS fe ON fe.productId = ci.productId
// LEFT JOIN users AS u ON u.id = fe.userId
// LEFT JOIN products AS sp ON (sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(pr.productName, ' ', 1), '%') 
//     OR sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(pr.productName, ' ', -1), '%'))
//     AND sp.id != pr.id
// LEFT JOIN brands AS br ON br.id = sp.brandId
// LEFT JOIN category AS cat ON cat.id = sp.categoryId
// LEFT JOIN feedback AS fb ON fb.productId = sp.id
// LEFT JOIN users AS us ON us.id = fb.userId
// WHERE ci.userId = ${userId} 
// ORDER BY ci.id DESC;

// `

    // let sql = `
    // SELECT DISTINCT
    //     ci.*, 
    //     pr.*,
    //     b.brandName, 
    //     c.categoryName, 
    //     ci.productId,
    //     getImageArray(ci.productId) AS images, 
    //     getProductSizes(ci.productId, ci.selectedSizeId) AS allSizes, 
    //     b.brandName, 
    //     LOWER(c.categoryName) AS categoryName,  
    //     s.sizeName,
    //     IFNULL(
    //         (
    //             SELECT JSON_ARRAYAGG(
    //                 JSON_OBJECT(
    //                     'id', fe.id, 
    //                     'user', JSON_OBJECT('id', u.id, 'fullName', u.fullName, 'email', u.email), 
    //                     'rating', fe.rating, 
    //                     'feedback', fe.feedback, 
    //                     'feedbackImage', fe.feedbackImage, 
    //                     'status', fe.status, 
    //                     'dateTime', fe.dateTime
    //                 )
    //             )
    //             FROM feedback AS fe
    //             LEFT JOIN users AS u ON u.id = fe.userId
    //             WHERE fe.productId = ci.productId
    //         ),
    //         JSON_ARRAY()
    //     ) AS feedback,
    //     CASE WHEN w.productId IS NOT NULL THEN 1 ELSE 0 END AS isWishlistadded,
    //     IFNULL(
    //         (
    //             SELECT CONCAT('[', GROUP_CONCAT(
    //                 DISTINCT JSON_OBJECT(
    //                     'id', sp.id,
    //                     'productName', sp.productName,
    //                     'description', sp.description,
    //                     'customerPrice', sp.customerPrice,
    //                     'vendorPrice', sp.vendorPrice,
    //                     'marginPrice', sp.marginPrice,
    //                     'discount', sp.discount,
    //                     'brandId', sp.brandId,
    //                     'brandName', br.brandName, -- Include brandName
    //                     'categoryId', sp.categoryId,
    //                     'categoryName', cat.categoryName, -- Include categoryName
    //                     'specification', sp.specification,
    //                     'highlights', sp.highlights,
    //                     'warnings', sp.warnings,
    //                     'userManual',sp.userManual,
    //                     'isSizeAvailable', sp.isSizeAvailable,
    //                     'productQuantity', sp.productQuantity,
    //                     'dateTime', sp.dateTime,
    //                     'status', sp.status,
    //                     'popular', sp.popular,
    //                     'bestQuality', sp.bestQuality,
    //                     'shippingTime', sp.shippingTime,
    //                     'slug', sp.slug,
    //                     'image', getImageArray(sp.id),
    //                     'feedback', (
    //                         SELECT JSON_ARRAYAGG(
    //                             JSON_OBJECT(
    //                                 'id', fb.id, 
    //                                 'user', JSON_OBJECT('id', us.id, 'fullName', us.fullName, 'email', us.email), 
    //                                 'rating', fb.rating, 
    //                                 'feedback', fb.feedback, 
    //                                 'feedbackImage', fb.feedbackImage, 
    //                                 'status', fb.status, 
    //                                 'dateTime', fb.dateTime
    //                             )
    //                         )
    //                         FROM feedback AS fb
    //                         LEFT JOIN users AS us ON us.id = fb.userId
    //                         WHERE fb.productId = sp.id
    //                     ),
    //                     'averageRating', (
    //                         SELECT FORMAT(ROUND(AVG(rating), 1), 1) AS avgRating
    //                         FROM feedback
    //                         WHERE productId = sp.id
    //                     )
    //                 )
    //             ), ']') 
    //             FROM (SELECT DISTINCT 
    //                       sp.id, 
    //                       sp.productName, 
    //                       sp.description, -- Include description column
    //                       sp.customerPrice,
    //                       sp.vendorPrice,
    //                       sp.marginPrice,
    //                       sp.discount,
    //                       sp.brandId,
    //                       sp.categoryId,
    //                       sp.specification,
    //                       sp.highlights,
    //                       sp.warnings,
    //                       sp.userManual,
    //                       sp.isSizeAvailable,
    //                       sp.productQuantity,
    //                       sp.dateTime,
    //                       sp.status,
    //                       sp.popular,
    //                       sp.bestQuality,
    //                       sp.shippingTime,
    //                       sp.slug
    //                   FROM products AS sp) AS sp -- Include necessary columns
    //             LEFT JOIN brands AS br ON br.id = sp.brandId -- Join brand table
    //             LEFT JOIN category AS cat ON cat.id = sp.categoryId -- Join category table
    //             WHERE (sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(pr.productName, ' ', 1), '%') 
    //                 OR sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(pr.productName, ' ', -1), '%'))
    //                 AND sp.id != pr.id
    //         ),
    //         JSON_ARRAY()
    //     ) AS similarProducts
    // FROM cartItems AS ci 
    // LEFT JOIN products AS pr ON pr.id = ci.productId 
    // LEFT JOIN brands AS b ON b.id = pr.brandId 
    // LEFT JOIN category AS c ON c.id = pr.categoryId 
    // LEFT JOIN sizes AS s ON s.id = ci.selectedSizeId 
    // LEFT JOIN wishlist AS w ON w.productId = pr.id
    // WHERE ci.userId=${userId} 
    // ORDER BY ci.id DESC`;













    // let sql = `
    // SELECT DISTINCT
    //     ci.*, 
    //     pr.*,
    //     b.brandName, 
    //     c.categoryName, 
    //     ci.productId,
    //     getImageArray(ci.productId) AS images, 
    //     getProductSizes(ci.productId, ci.selectedSizeId) AS allSizes, 
    //     b.brandName, 
    //     LOWER(c.categoryName) AS categoryName,  
    //     s.sizeName,
    //     IFNULL(
    //         (
    //             SELECT JSON_ARRAYAGG(
    //                 JSON_OBJECT(
    //                     'id', fe.id, 
    //                     'user', JSON_OBJECT('id', u.id, 'fullName', u.fullName, 'email', u.email), 
    //                     'rating', fe.rating, 
    //                     'feedback', fe.feedback, 
    //                     'feedbackImage', fe.feedbackImage, 
    //                     'status', fe.status, 
    //                     'dateTime', fe.dateTime
    //                 )
    //             )
    //             FROM feedback AS fe
    //             LEFT JOIN users AS u ON u.id = fe.userId
    //             WHERE fe.productId = ci.productId
    //         ),
    //         JSON_ARRAY()
    //     ) AS feedback,
    //     CASE WHEN w.productId IS NOT NULL THEN 1 ELSE 0 END AS isWishlistadded,
    //     IFNULL(
    //         (
    //             SELECT CONCAT('[', GROUP_CONCAT(
    //                 DISTINCT JSON_OBJECT(
    //                     'id', sp.id,
    //                     'productName', sp.productName,
    //                     'description', sp.description,
    //                     'customerPrice', sp.customerPrice,
    //                     'vendorPrice', sp.vendorPrice,
    //                     'marginPrice', sp.marginPrice,
    //                     'discount', sp.discount,
    //                     'brandId', sp.brandId,
    //                     'brandName', br.brandName, -- Include brandName
    //                     'categoryId', sp.categoryId,
    //                     'categoryName', cat.categoryName, -- Include categoryName
    //                     'specification', sp.specification,
    //                     'highlights', sp.highlights,
    //                     'warnings', sp.warnings,
    //                     'userManual',sp.userManual,
    //                     'isSizeAvailable', sp.isSizeAvailable,
    //                     'productQuantity', sp.productQuantity,
    //                     'dateTime', sp.dateTime,
    //                     'status', sp.status,
    //                     'popular', sp.popular,
    //                     'bestQuality', sp.bestQuality,
    //                     'shippingTime', sp.shippingTime,
    //                     'slug', sp.slug,
    //                     'image', getImageArray(sp.id),
    //                     'feedback', (
    //                         SELECT JSON_ARRAYAGG(
    //                             JSON_OBJECT(
    //                                 'id', fb.id, 
    //                                 'user', JSON_OBJECT('id', us.id, 'fullName', us.fullName, 'email', us.email), 
    //                                 'rating', fb.rating, 
    //                                 'feedback', fb.feedback, 
    //                                 'feedbackImage', fb.feedbackImage, 
    //                                 'status', fb.status, 
    //                                 'dateTime', fb.dateTime
    //                             )
    //                         )
    //                         FROM feedback AS fb
    //                         LEFT JOIN users AS us ON us.id = fb.userId
    //                         WHERE fb.productId = sp.id
    //                     ),
    //                     'averageRating', (
    //                         SELECT FORMAT(ROUND(AVG(rating), 1), 1) AS avgRating
    //                         FROM feedback
    //                         WHERE productId = sp.id
    //                     )
    //                 )
    //             ), ']') 
    //             FROM products AS sp 
    //             LEFT JOIN brands AS br ON br.id = sp.brandId -- Join brand table
    //             LEFT JOIN category AS cat ON cat.id = sp.categoryId -- Join category table
    //             WHERE (sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(pr.productName, ' ', 1), '%') 
    //                 OR sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(pr.productName, ' ', -1), '%'))
    //                 AND sp.id != pr.id
    //         ),
    //         JSON_ARRAY()
    //     ) AS similarProducts
    // FROM cartItems AS ci 
    // LEFT JOIN products AS pr ON pr.id = ci.productId 
    // LEFT JOIN brands AS b ON b.id = pr.brandId 
    // LEFT JOIN category AS c ON c.id = pr.categoryId 
    // LEFT JOIN sizes AS s ON s.id = ci.selectedSizeId 
    // LEFT JOIN wishlist AS w ON w.productId = pr.id
    // WHERE ci.userId=${userId} 
    // ORDER BY ci.id DESC`;
          
   
    //   sql = `SELECT ci.productId as id, ci.quantity, ci.selectedSizeId, pr.productName, pr.description, pr.customerPrice, pr.marginPrice, pr.productQuantity, pr.discount, pr.slug, getImageArray(ci.productId) as images, getProductSizes(ci.productId, pr.categoryId) AS allSizes, b.brandName, LOWER(c.categoryName) as categoryName,  s.sizeName FROM cartItems as ci 
    //   LEFT JOIN products as pr ON pr.id = ci.productId 
    //   LEFT JOIN brands as b ON b.id = pr.brandId 
    //   LEFT JOIN category as c ON c.id = pr.categoryId 
    //   LEFT JOIN sizes as s ON s.id = ci.selectedSizeId 
    //   WHERE userId=${userId} ORDER BY ci.id DESC`;

    // }

//     let sql =`
//     SELECT DISTINCT
//     ci.*, 
//     pr.*,
//     b.brandName, 
//     c.categoryName, 
//     ci.productId,
//     getImageArray(ci.productId) AS images, 
//     getProductSizes(ci.productId, ci.selectedSizeId) AS allSizes, 
//     b.brandName, 
//     LOWER(c.categoryName) AS categoryName,  
//     s.sizeName,
//     IFNULL((
//         SELECT JSON_ARRAYAGG(
//             JSON_OBJECT(
//                 'id', fe.id, 
//                 'user', JSON_OBJECT('id', u.id, 'fullName', u.fullName, 'email', u.email), 
//                 'rating', fe.rating, 
//                 'feedback', fe.feedback, 
//                 'feedbackImage', fe.feedbackImage, 
//                 'status', fe.status, 
//                 'dateTime', fe.dateTime
//             )
//         )
//         FROM feedback AS fe
//         LEFT JOIN users AS u ON u.id = fe.userId
//         WHERE fe.productId = ci.productId
//     ), JSON_ARRAY()) AS feedback,
//     CASE WHEN w.productId IS NOT NULL THEN 1 ELSE 0 END AS isWishlistadded,
//     IFNULL((
//         SELECT CONCAT('[', GROUP_CONCAT(
//             DISTINCT JSON_OBJECT(
//                 'id', sp.id,
//                 'productName', sp.productName,
//                 'description', sp.description,
//                 'customerPrice', sp.customerPrice,
//                 'vendorPrice', sp.vendorPrice,
//                 'marginPrice', sp.marginPrice,
//                 'discount', sp.discount,
//                 'brandId', sp.brandId,
//                 'brandName', br.brandName,
//                 'categoryId', sp.categoryId,
//                 'categoryName', cat.categoryName,
//                 'specification', sp.specification,
//                 'highlights', sp.highlights,
//                 'warnings', sp.warnings,
//                 'userManual', sp.userManual,
//                 'isSizeAvailable', sp.isSizeAvailable,
//                 'productQuantity', sp.productQuantity,
//                 'dateTime', sp.dateTime,
//                 'status', sp.status,
//                 'popular', sp.popular,
//                 'bestQuality', sp.bestQuality,
//                 'shippingTime', sp.shippingTime,
//                 'slug', sp.slug,
//                 'image', getImageArray(sp.id),
//                 'feedback', (
//                     SELECT JSON_ARRAYAGG(
//                         JSON_OBJECT(
//                             'id', fb.id, 
//                             'user', JSON_OBJECT('id', us.id, 'fullName', us.fullName, 'email', us.email), 
//                             'rating', fb.rating, 
//                             'feedback', fb.feedback, 
//                             'feedbackImage', fb.feedbackImage, 
//                             'status', fb.status, 
//                             'dateTime', fb.dateTime
//                         )
//                     )
//                     FROM feedback AS fb
//                     LEFT JOIN users AS us ON us.id = fb.userId
//                     WHERE fb.productId = sp.id
//                 ),
//                 'averageRating', (
//                     SELECT FORMAT(ROUND(AVG(rating), 1), 1) AS avgRating
//                     FROM feedback
//                     WHERE productId = sp.id
//                 )
//             )
//         ), ']') 
//         FROM products AS sp 
//         LEFT JOIN brands AS br ON br.id = sp.brandId
//         LEFT JOIN category AS cat ON cat.id = sp.categoryId
//         WHERE (sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(pr.productName, ' ', 1), '%') 
//             OR sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(pr.productName, ' ', -1), '%'))
//             AND sp.id != pr.id
//     ), JSON_ARRAY()) AS similarProducts
// FROM cartItems AS ci 
// LEFT JOIN products AS pr ON pr.id = ci.productId 
// LEFT JOIN brands AS b ON b.id = pr.brandId 
// LEFT JOIN category AS c ON c.id = pr.categoryId 
// LEFT JOIN sizes AS s ON s.id = ci.selectedSizeId 
// LEFT JOIN wishlist AS w ON w.productId = pr.id
// WHERE ci.userId=${userId} 
// ORDER BY ci.id DESC `

  
    const [result, fields] = await promisePool.query(sql, [
      userId,
    ]);
   
   
//     result.forEach(product => {
//       if (product.images) {
//           product.images = JSON.parse(product.images);
//       }
//       if (product.allSizes) {
//         product.allSizes = JSON.parse(product.allSizes);
//     }

//     if (product.similarProducts) {
//       product.similarProducts = JSON.parse(product.similarProducts);
//   }

//   if (product?.feedback) {

//     product.feedback = JSON.parse(product.feedback);

//     product.feedback.forEach(img => {

//       img.feedbackImage = JSON.parse(img.feedbackImage);
//     })

  
//   }


 
// if (product?.similarProducts) {

//   product?.similarProducts.forEach(img => {

//   img.image = JSON.parse(img.image);
//   })
// }
//     })

    return result;
  };


  updateWishListItemSize = async (reqData) => {
    let sql = `UPDATE wishlist SET selectedSizeId = ? WHERE productId = ? AND userId = ?`;
    const [result, fields] = await promisePool.query(sql, [
      reqData.selectedSizeId,
      reqData.productId,
      reqData.userId
    ]);
    return result;
  };

  // updateCartStatus = async (data) => {
  //   let sql = `UPDATE cart set status = ? WHERE id = ? And productId = ?`;
  //   const [result, fields] = await promisePool.query(sql, [
  //     data.status,
  //     data.id,
  //     data.productId
  //   ]);
  //   return result;
  // }

  // getCartList = async (userId) => {
  //   let sql = `SELECT c.id, c.status, c.productId, c.productQuantity, p.productName, p.description, p.price, cs.clothesSize, ss.shoesSize, csq.clothesPrice, ssq.shoesPrice, csq.clothesQuantity, ssq.shoesQuantity, pi.image FROM cart As c 
  //   LEFT JOIN products AS p ON p.id = c.productId
  //   LEFT JOIN productimage As pi ON pi.productId = p.id
  //   LEFT JOIN clothesSize As cs ON cs.id = c.clothesSizeId
  //   LEFT JOIN shoesSize As ss ON ss.id = c.shoesSizeId
  //   LEFT JOIN clothesSizesAndQuantity AS csq ON csq.productId = c.productId
  //   LEFT JOIN ShoesSizesAndQuantitiy AS ssq ON ssq.productId = c.productId
  //   WHERE c.userId = ? And c.status = '1' ORDER BY c.id DESC `;
  //   const [result] = await promisePool.query(sql, [userId]);
  //   return result;
  // };

  // updateCartSizeAndQuantity = async (data) => {
  //   let sql = `UPDATE cart set shoesSizeId = ?, clothesSizeId = ?, productQuantity = ? WHERE id = ? And productId = ?`;
  //   const [result, fields] = await promisePool.query(sql, [
  //     data.shoesSizeId,
  //     data.clothesSizeId,
  //     data.productQuantity,
  //     data.id,
  //     data.productId
  //   ]);
  //   return result;
  // }

}

module.exports = new CartModel();


