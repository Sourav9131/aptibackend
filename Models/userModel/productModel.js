const promisePool = require("../../utils/pool");

class UserModel {
  // getProductList = async (data) => {
  //   let sql = `SELECT p.*, b.brandName,c.categoryName, sc.subCategoryName, pt.productTypeName, getImageArray(p.id) AS image FROM products As p
  //       LEFT JOIN brands AS b ON b.id = p.brandId
  //       LEFT JOIN category AS c ON c.id = p.categoryId
  //       LEFT JOIN subcategory AS sc ON sc.id = p.subCategoryId
  //       LEFT JOIN producttype AS pt ON pt.id = p.productTypeId
  //       WHERE p.status = 1 AND`;
  //   if (data.categoryId && data.subCategoryId) {
  //     sql += `  p.categoryId = ? AND p.subCategoryId = ?`;
  //   } else if (
  //     data.categoryId &&
  //     data.subCategoryId &&
  //     data.innerCategoryId &&
  //     data.productTypeId
  //   ) {
  //     sql += `  p.categoryId = ? AND p.subCategoryId = ? AND p.innerCategoryId = ? AND p.productTypeId = ?`;
  //   } else if (data.categoryId) {
  //     sql += `  p.categoryId = ?`;
  //   }
  //   sql += `AND p.productQuantity > 0 ORDER BY p.id DESC`;
  //   const params = [];
  //   if (data.categoryId) {
  //     params.push(data.categoryId);
  //   }
  //   if (data.subCategoryId) {
  //     params.push(data.subCategoryId);
  //   }
  //   if (data.innerCategoryId) {
  //     params.push(data.innerCategoryId);
  //   }
  //   if (data.productTypeId) {
  //     params.push(data.productTypeId);
  //   }

  //   const [result] = await promisePool.query(sql, params);
  //   return result;
  // };

  getProductDetailById = async (id) => {

    //     let sql=`
    // SELECT
    //     p.*,
    //     getImageArray(p.id) AS image,
    //     b.brandName,
    //     c.categoryName,
    //     ci.productId,
    //     fe.id AS feedbackId,
    //     u.id AS userId,
    //     u.fullName AS userFullName,
    //     u.email AS userEmail,
    //     fe.rating,
    //     fe.feedback,
    //     fe.feedbackImage,
    //     fe.status AS feedbackStatus,
    //     fe.dateTime AS feedbackDateTime,
    //     p.productQuantity,
    //     getProductSizes(p.id, p.categoryId) AS sizes,
    //     CASE WHEN ci.productId IS NOT NULL THEN 1 ELSE 0 END AS isAddToCartAdded,
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
    //     getImageArray(sp.id) AS similarproductimage,
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
    // FROM products AS p
    // LEFT JOIN brands AS b ON b.id = p.brandId
    // LEFT JOIN category AS c ON c.id = p.categoryId
    // LEFT JOIN cartItems AS ci ON ci.productId = p.id
    // LEFT JOIN wishlist AS w ON w.productId = p.id
    // LEFT JOIN feedback AS fe ON fe.productId = p.id
    // LEFT JOIN users AS u ON u.id = fe.userId
    // LEFT JOIN products AS sp ON (sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(p.productName, ' ', 1), '%')
    //     OR sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(p.productName, ' ', -1), '%'))
    //     AND sp.id != p.id
    // LEFT JOIN brands AS br ON br.id = sp.brandId
    // LEFT JOIN category AS cat ON cat.id = sp.categoryId
    // LEFT JOIN feedback AS fb ON fb.productId = sp.id
    // LEFT JOIN users AS us ON us.id = fb.userId
    // WHERE p.id = ? AND p.status = 1
    // GROUP BY p.id, fe.id, u.id, sp.id, fb.id, us.id;

    //     `

//     let sql = `
//     SELECT 
//     p.*, 
//     getImageArray(p.id) AS image, 
//     b.brandName, 
//     c.categoryName, 
//     ci.productId,
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
//             WHERE fe.productId = p.id
//         ),
//         JSON_ARRAY()
//     ) AS feedback,
//     p.productQuantity, 
//     getProductSizes(p.id, p.categoryId) AS sizes, 
//     CASE WHEN ci.productId IS NOT NULL THEN 1 ELSE 0 END AS isAddToCartAdded,
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
//                             SELECT IFNULL(
//                                JSON_ARRAYAGG(
//                                   JSON_OBJECT(
//                                      'id', fb.id, 
//                                     'user', JSON_OBJECT(
//                                      'id', us.id, 
//                                   'fullName', IFNULL(us.fullName, ''), 
//                                    'email', IFNULL(us.email, '')
//                 ), 
//                 'rating', IFNULL(fb.rating, 0), 
//                 'feedback', IFNULL(fb.feedback, ''), 
//                 'feedbackImage', IFNULL(fb.feedbackImage, ''), 
//                 'status', IFNULL(fb.status, ''), 
//                 'dateTime', IFNULL(fb.dateTime, '')
//             )
//         ), JSON_ARRAY()
//     )
//     FROM feedback AS fb
//     LEFT JOIN users AS us ON us.id = fb.userId
//     WHERE fb.productId = sp.id
// ),

//                 )
//             ), ']') 
//             FROM products AS sp 
//             LEFT JOIN brands AS br ON br.id = sp.brandId -- Join brand table
//             LEFT JOIN category AS cat ON cat.id = sp.categoryId -- Join category table
//             WHERE (sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(p.productName, ' ', 1), '%') 
//                 OR sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(p.productName, ' ', -1), '%'))
//                 AND sp.id != p.id
//         ),
//         JSON_ARRAY()
//     ) AS similarProducts
// FROM products AS p 
// LEFT JOIN brands AS b ON b.id = p.brandId
// LEFT JOIN category AS c ON c.id = p.categoryId
// LEFT JOIN cartItems AS ci ON ci.productId = p.id
// LEFT JOIN wishlist AS w ON w.productId = p.id
// WHERE p.id = ? AND p.status = 1
// GROUP BY p.id;
// `;

// let sql = `
//     SELECT 
//     p.*, 
//     getImageArray(p.id) AS image, 
//     b.brandName, 
//     c.categoryName, 
//     ci.productId,
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
//             WHERE fe.productId = p.id
//         ),
//         JSON_ARRAY()
//     ) AS feedback,
//     p.productQuantity, 
//     getProductSizes(p.id, p.categoryId) AS sizes, 
//     CASE WHEN ci.productId IS NOT NULL THEN 1 ELSE 0 END AS isAddToCartAdded,
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
//                     'brandName', br.brandName,
//                     'categoryId', sp.categoryId,
//                     'categoryName', cat.categoryName,
//                     'specification', sp.specification,
//                     'highlights', sp.highlights,
//                     'warnings', sp.warnings,
//                     'userManual', sp.userManual,
//                     'isSizeAvailable', sp.isSizeAvailable,
//                     'productQuantity', sp.productQuantity,
//                     'dateTime', sp.dateTime,
//                     'status', sp.status,
//                     'popular', sp.popular,
//                     'bestQuality', sp.bestQuality,
//                     'shippingTime', sp.shippingTime,
//                     'slug', sp.slug,
//                     'image', getImageArray(sp.id),
//                     'averageRating', (
//                         SELECT FORMAT(ROUND(AVG(rating), 1), 1) AS avgRating
//                         FROM feedback
//                         WHERE productId = sp.id
//                     )
//                 )
//             ), ']') 
//             FROM products AS sp 
//             LEFT JOIN brands AS br ON br.id = sp.brandId
//             LEFT JOIN category AS cat ON cat.id = sp.categoryId
//             WHERE (sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(p.productName, ' ', 1), '%') 
//                 OR sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(p.productName, ' ', -1), '%'))
//                 AND sp.id != p.id
//         ),
//         JSON_ARRAY()
//     ) AS similarProducts
// FROM products AS p 
// LEFT JOIN brands AS b ON b.id = p.brandId
// LEFT JOIN category AS c ON c.id = p.categoryId
// LEFT JOIN cartItems AS ci ON ci.productId = p.id
// LEFT JOIN wishlist AS w ON w.productId = p.id
// WHERE p.id = ? AND p.status = 1
// GROUP BY p.id;
// `;

// let sql = `
//     SELECT 
//     p.*, 
//     getImageArray(p.id) AS image, 
//     b.brandName, 
//     c.categoryName, 
//     ci.productId,
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
//             WHERE fe.productId = p.id
//         ),
//         JSON_ARRAY()
//     ) AS feedback,
//     p.productQuantity, 
//     getProductSizes(p.id, p.categoryId) AS sizes, 
//     CASE WHEN ci.productId IS NOT NULL THEN 1 ELSE 0 END AS isAddToCartAdded,
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
//                     'brandName', br.brandName,
//                     'categoryId', sp.categoryId,
//                     'categoryName', cat.categoryName,
//                     'specification', sp.specification,
//                     'highlights', sp.highlights,
//                     'warnings', sp.warnings, 
//                     'userManual', sp.userManual,
//                     'isSizeAvailable', sp.isSizeAvailable,
//                     'productQuantity', sp.productQuantity,
//                     'dateTime', sp.dateTime,
//                     'status', sp.status,
//                     'popular', sp.popular,
//                     'bestQuality', sp.bestQuality,
//                     'shippingTime', sp.shippingTime,
//                     'slug', sp.slug,
//                     'image', getImageArray(sp.id),
//                     'averageRating', (
//                         SELECT FORMAT(ROUND(AVG(rating), 1), 1) AS avgRating
//                         FROM feedback
//                         WHERE productId = sp.id
//                     )
//                 )
//             SEPARATOR ', '), ']') 
//             FROM products AS sp 
//             LEFT JOIN brands AS br ON br.id = sp.brandId
//             LEFT JOIN category AS cat ON cat.id = sp.categoryId
//             WHERE (sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(p.productName, ' ', 1), '%') 
//                 OR sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(p.productName, ' ', -1), '%'))
//                 AND sp.id != p.id
//         ),
//         JSON_ARRAY()
//     ) AS similarProducts
// FROM products AS p 
// LEFT JOIN brands AS b ON b.id = p.brandId
// LEFT JOIN category AS c ON c.id = p.categoryId
// LEFT JOIN cartItems AS ci ON ci.productId = p.id
// LEFT JOIN wishlist AS w ON w.productId = p.id
// WHERE p.id = ? AND p.status = 1
// GROUP BY p.id;
// `;

// let sql = `
//     SELECT 
//     p.*, 
//     getImageArray(p.id) AS image, 
//     b.brandName, 
//     c.categoryName, 
//     ci.productId,
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
//             WHERE fe.productId = p.id
//         ),
//         JSON_ARRAY()
//     ) AS feedback,
//     p.productQuantity, 
//     getProductSizes(p.id, p.categoryId) AS sizes, 
//     CASE WHEN ci.productId IS NOT NULL THEN 1 ELSE 0 END AS isAddToCartAdded,
//     CASE WHEN w.productId IS NOT NULL THEN 1 ELSE 0 END AS isWishlistadded,
//     IFNULL(
//         (
//             SELECT JSON_ARRAYAGG(
//                 JSON_OBJECT(
//                     'id', sp.id,
//                     'productName', sp.productName,
//                     'description', sp.description,
//                     'customerPrice', sp.customerPrice,
//                     'vendorPrice', sp.vendorPrice,
//                     'marginPrice', sp.marginPrice,
//                     'discount', sp.discount,
//                     'brandId', sp.brandId,
//                     'brandName', br.brandName,
//                     'categoryId', sp.categoryId,
//                     'categoryName', cat.categoryName,
//                     'specification', sp.specification,
//                     'highlights', sp.highlights,
//                     'warnings', IFNULL(sp.warnings, ''), -- Handle null warnings
//                     'userManual', sp.userManual,
//                     'isSizeAvailable', sp.isSizeAvailable,
//                     'productQuantity', sp.productQuantity,
//                     'dateTime', sp.dateTime,
//                     'status', sp.status,
//                     'popular', sp.popular,
//                     'bestQuality', sp.bestQuality,
//                     'shippingTime', sp.shippingTime,
//                     'slug', sp.slug,
//                     'image', getImageArray(sp.id),
//                     'averageRating', (
//                         SELECT FORMAT(ROUND(AVG(rating), 1), 1) AS avgRating
//                         FROM feedback
//                         WHERE productId = sp.id
//                     )
//                 )
//             )
//             FROM products AS sp 
//             LEFT JOIN brands AS br ON br.id = sp.brandId
//             LEFT JOIN category AS cat ON cat.id = sp.categoryId
//             WHERE (sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(p.productName, ' ', 1), '%') 
//                 OR sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(p.productName, ' ', -1), '%'))
//                 AND sp.id != p.id
//         ),
//         JSON_ARRAY()
//     ) AS similarProducts
// FROM products AS p 
// LEFT JOIN brands AS b ON b.id = p.brandId
// LEFT JOIN category AS c ON c.id = p.categoryId
// LEFT JOIN cartItems AS ci ON ci.productId = p.id
// LEFT JOIN wishlist AS w ON w.productId = p.id
// WHERE p.id = ? AND p.status = 1
// GROUP BY p.id;
// `;

let sql = `
    SELECT 
    p.*, 
    getImageArray(p.id) AS image, 
    b.brandName, 
    c.categoryName, 
    ci.productId,
    IFNULL(
        (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', fe.id, 
                    'user', JSON_OBJECT('id', u.id, 'fullName', u.fullName, 'email', u.email), 
                    'rating', fe.rating, 
                    'feedback', fe.feedback, 
                    'feedbackImage', fe.feedbackImage, 
                    'status', fe.status, 
                    'dateTime', fe.dateTime
                )
            )
            FROM feedback AS fe
            LEFT JOIN users AS u ON u.id = fe.userId
            WHERE fe.productId = p.id AND fe.status = 1
        ),
        JSON_ARRAY()
    ) AS feedback,
    p.productQuantity, 
    getProductSizes(p.id, p.categoryId) AS sizes, 
    CASE WHEN ci.productId IS NOT NULL THEN 1 ELSE 0 END AS isAddToCartAdded,
    CASE WHEN w.productId IS NOT NULL THEN 1 ELSE 0 END AS isWishlistadded,
    IFNULL(
        (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', sp.id,
                    'productName', sp.productName,
                    'description', sp.description,
                    'customerPrice', sp.customerPrice,
                    'vendorPrice', sp.vendorPrice,
                    'marginPrice', sp.marginPrice,
                    'discount', sp.discount,
                    'brandId', sp.brandId,
                    'brandName', br.brandName,
                    'categoryId', sp.categoryId,
                    'categoryName', cat.categoryName,
                    'specification', sp.specification,
                    'highlights', sp.highlights,
                    'warnings', IFNULL(sp.warnings, ''), -- Handle null warnings
                    'userManual', sp.userManual,
                    'isSizeAvailable', sp.isSizeAvailable,
                    'productQuantity', sp.productQuantity,
                    'dateTime', sp.dateTime,
                    'status', sp.status,
                    'popular', sp.popular,
                    'bestQuality', sp.bestQuality,
                    'shippingTime', sp.shippingTime,
                    'slug', sp.slug,
                    'image', getImageArray(sp.id),
                    'averageRating', (
                        SELECT FORMAT(ROUND(AVG(rating), 1), 1) AS avgRating
                        FROM feedback
                        WHERE productId = sp.id
                    )
                )
            )
            FROM products AS sp 
            LEFT JOIN brands AS br ON br.id = sp.brandId
            LEFT JOIN category AS cat ON cat.id = sp.categoryId
            WHERE (sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(p.productName, ' ', 1), '%') 
                OR sp.productName LIKE CONCAT('%', SUBSTRING_INDEX(p.productName, ' ', -1), '%'))
                AND sp.id != p.id
                AND sp.status = 1 -- Only include products with status = 1
        ),
        JSON_ARRAY()
    ) AS similarProducts
FROM products AS p 
LEFT JOIN brands AS b ON b.id = p.brandId
LEFT JOIN category AS c ON c.id = p.categoryId
LEFT JOIN cartItems AS ci ON ci.productId = p.id
LEFT JOIN wishlist AS w ON w.productId = p.id
WHERE p.id = ? AND p.status = 1
GROUP BY p.id;
`;



    const [result] = await promisePool.query(sql, [id]);

    result.forEach(product => {

       if (product?.feedback) {

        product.feedback .forEach(img => {

          img.feedbackImage = JSON.parse(img.feedbackImage);
        })

      }
    })


    return result;
  };

  getItemCombitnation = async (categoryId) => {
    let sql = `SELECT ic.id, ic.productId, ic.combinationImage, ic.remark, category.categoryName FROM itemcombination as ic LEFT JOIN category ON category.id = ic.categoryId WHERE ic.categoryId = ${categoryId} AND ic.status = 1`;
    const [result] = await promisePool.query(sql);
    return result;
  };

  getWishlist = async (data, userId) => {
    let sql = `SELECT wsh.id,wsh.productId,wsh.userId,wsh.status from wishlist as wsh WHERE productId=? && userId=?`;
    const [result, fields] = await promisePool.query(sql, [
      data.productId,
      userId,
    ]);
    return result;
  };

  getWishlistCount = async (userId) => {
    let sql = `SELECT COUNT(status) AS wishListCount FROM wishlist WHERE userId=?`;
    const [result, fields] = await promisePool.query(sql, [userId]);
    return result;
  };

  AddWishlist = async (data, userId) => {
    let sql = `Insert INTO wishlist (productId, userId) VALUES (?,?)`;
    const [result, fields] = await promisePool.query(sql, [
      data.productId,
      userId,
    ]);
    return result;
  };

  updateWishlistStatus = async (data) => {
    let sql = `DELETE FROM wishlist WHERE id = ?`;
    const [result, fields] = await promisePool.query(sql, [data.id]);
    return result;
  };

  getWishlistList = async (userId, userType) => {

    let sql;
    // if(userType=="vendor")
    // {
    //      sql = `SELECT
    //      DISTINCT wsh.productId as id,
    //      wsh.status,
    //      wsh.selectedSizeId,
    //      pr.productName,
    //      pr.description,
    //      pr.vendorPrice,
    //      pr.marginPrice,
    //      pr.discount,
    //      pr.slug,
    //      pr.productQuantity,
    //      (SELECT getImageArray(wsh.productId)) as images,
    //      (SELECT getProductSizes(wsh.productId, pr.categoryId)) AS allSizes,
    //      LOWER(c.categoryName) as categoryName,
    //      CASE WHEN ci.productId IS NOT NULL THEN 1 ELSE 0 END AS isAddToCartAdded
    //  FROM
    //      wishlist as wsh
    //  LEFT JOIN
    //      products as pr
    //      ON pr.id = wsh.productId
    //  LEFT JOIN
    //      category as c
    //      ON c.id = pr.categoryId
    //  LEFT JOIN
    //      cartItems AS ci
    //      ON ci.productId = pr.id AND ci.userId = ${userId}
    //  WHERE
    //      wsh.userId = ${userId}
    //  ORDER BY
    //      wsh.id DESC;

    //  `;
    // }
    // else{
    sql = `SELECT 
  wsh.productId as id, 
  wsh.status, 
  wsh.selectedSizeId, 
  pr.*,
  IFNULL(feedback.feedback, JSON_ARRAY()) AS feedback, 
  (SELECT getImageArray(wsh.productId)) as images, 
  (SELECT getProductSizes(wsh.productId, pr.categoryId)) AS allSizes, 
  LOWER(c.categoryName) as categoryName, 
  CASE WHEN ci.productId IS NOT NULL THEN 1 ELSE 0 END AS isAddToCartAdded
FROM 
  wishlist as wsh 
LEFT JOIN (
  SELECT 
      productId,
      JSON_ARRAYAGG(
          JSON_OBJECT(
              'id', fe.id, 
              'user', JSON_OBJECT('id', u.id, 'fullName', u.fullName, 'email', u.email), 
              'rating', fe.rating, 
              'feedback', fe.feedback, 
              'feedbackImage', fe.feedbackImage, 
              'status', fe.status, 
              'dateTime', fe.dateTime
          )
      ) AS feedback
  FROM 
      feedback AS fe
  LEFT JOIN 
      users AS u ON u.id = fe.userId
  GROUP BY 
      productId
) AS feedback ON feedback.productId = wsh.productId
LEFT JOIN 
  products as pr ON pr.id = wsh.productId 
LEFT JOIN 
  category as c ON c.id = pr.categoryId 
LEFT JOIN 
  cartItems AS ci ON ci.productId = pr.id AND ci.userId = ${userId}
WHERE 
  wsh.userId = ${userId} 
ORDER BY 
  wsh.id DESC;`;

    // }

    const [result, fields] = await promisePool.query(sql, [userId]);

    result.forEach((product) => {
      //   if (product.images) {
      //       product.images = JSON.parse(product.images);;
      //   }
      //   if (product.allSizes) {
      //     product.allSizes = JSON.parse(product.allSizes);;
      // }

      if (product.feedback) {
        // product.feedback= JSON.parse(product.feedback);

        let review = product?.feedback.filter(
          (data) => data.feedback.length > 0
        );
        let rating = product?.feedback.filter((data) => data.rating > 0);
        let rating5 = product?.feedback.filter((data) => data.rating == 5);
        let rating4 = product?.feedback.filter((data) => data.rating == 4);
        let rating3 = product?.feedback.filter((data) => data.rating == 3);
        let rating2 = product.feedback.filter((data) => data.rating == 2);
        let rating1 = product?.feedback.filter((data) => data.rating == 1);

        let total =
          rating5.length +
          rating4.length +
          rating3.length +
          rating2.length +
          rating1.length;

        let averageRating = 0; // Default to 0
        if (total !== 0) {
          averageRating =
            (5 * rating5.length +
              4 * rating4.length +
              3 * rating3.length +
              2 * rating2.length +
              1 * rating1.length) /
            total;
        }

        product.feedback = averageRating.toFixed(1);
      }
    });

    return result;
  };

  updateWishlistSize = async (data) => {
    let sql = `UPDATE wishlist set shoesSizeId = ?, clothesSizeId = ? WHERE id = ? And productId = ?`;
    const [result, fields] = await promisePool.query(sql, [
      data.shoesSizeId,
      data.clothesSizeId,
      data.id,
      data.productId,
    ]);
    return result;
  };

  getPrductInfoForCombination = async (productId) => {
    let sql = ` SELECT products.*, b.brandName, getImageArray(products.id) as image, getProductSizes(products.id, products.categoryId) AS sizes FROM products
    LEFT JOIN brands AS b ON b.id = products.brandId
    WHERE products.id=?`;
    const [result, fields] = await promisePool.query(sql, [productId]);
    return result;
  };

  getProductImages = async (id) => {
    let sql = `SELECT image FROM productimage 
         WHERE productId = ?`;
    const [result] = await promisePool.query(sql, [id]);
    return result;
  };

  getSubcategoryForHome = async () => {
    let sql = `SELECT sc.id, sc.subCategoryName, sc.categoryId, c.categoryName, (SELECT COUNT(p.id) FROM products as p
        WHERE p.subCategoryId=sc.id) as itemcount FROM subcategory as sc 
        LEFT JOIN category AS c ON c.id = sc.categoryId
        WHERE sc.status = 1 ORDER BY RAND()`;
    const [result] = await promisePool.query(sql, []);
    return result;
  };

  // getSubcategory = async (categoryId) => {
  //   let sql = `SELECT sc.id, sc.subCategoryName, sc.categoryId, c.categoryName, (SELECT COUNT(p.id) FROM products as p
  //       WHERE p.subCategoryId=sc.id) as itemcount FROM subcategory as sc
  //       LEFT JOIN category AS c ON c.id = sc.categoryId
  //       WHERE sc.categoryId = ? AND sc.status = 1 ORDER BY RAND()`;
  //   const [result] = await promisePool.query(sql, [categoryId]);

  //   return result;
  // };.

  getSubcategory = async (categoryId) => {
    let sql = `SELECT sc.id, sc.categoryName, sc.status, c.backgroundImage, (SELECT COUNT(p.id) FROM products as p
        WHERE p.categoryId=sc.id) as itemcount FROM category as sc 
        LEFT JOIN category AS c ON c.id = sc.id
        WHERE sc.id = ? AND sc.status = 1 ORDER BY RAND()`;
    const [result] = await promisePool.query(sql, [categoryId]);

    return result;
  };

  getProductList = async (categoryId) => {
    let sql = `SELECT p.*, b.brandName, getImageArray(p.id) as images, getProductSizes(p.id, p.categoryId) as sizes,  c.categoryName, 
      ps.sizeId, ps.quantity, ps.onSizePrice, p.dateTime FROM products As p 
    LEFT JOIN brands AS b ON b.id = p.brandId
    LEFT JOIN category AS c ON c.id = p.categoryId
    LEFT JOIN productsizes AS ps ON ps.productId = p.id
    LEFT JOIN productimage As pi ON pi.productId = p.id`;

    if (categoryId) {
      sql += ` WHERE p.categoryId = ?`;
    }

    sql += ` GROUP by p.id ORDER BY p.id DESC`;

    const [result] = await promisePool.query(sql, [categoryId]);

    // Convert string representation of sizes to arrays
    result.forEach((product) => {
      if (product.sizes) {
        product.sizes = JSON.parse(product.sizes);
      }
    });

    result.forEach((product) => {
      if (product.images) {
        product.images = JSON.parse(product.images);
      }
    });
    return result;
  };

  getAllProductcategory = async (subCategoryId) => {
    let sql = `SELECT 
    p.*, 
    b.brandName, 
    c.categoryName, 
    getImageArray(p.id) AS image, 
    getProductSizes(p.id, p.categoryId) AS sizes,
    IFNULL(feedback.feedback, JSON_ARRAY()) AS feedback
FROM 
    products AS p
LEFT JOIN 
    brands AS b ON b.id = p.brandId 
LEFT JOIN 
    category AS c ON c.id = ${subCategoryId}
LEFT JOIN (
    SELECT 
        productId,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', fe.id, 
                'user', JSON_OBJECT('id', u.id, 'fullName', u.fullName, 'email', u.email), 
                'rating', fe.rating, 
                'feedback', fe.feedback, 
                'feedbackImage', fe.feedbackImage, 
                'status', fe.status, 
                'dateTime', fe.dateTime
            )
        ) AS feedback
    FROM 
        feedback AS fe
    LEFT JOIN 
        users AS u ON u.id = fe.userId
        WHERE 
        fe.status = 1  
    GROUP BY 
        productId
) AS feedback ON feedback.productId = p.id 
WHERE 
    p.categoryId = ? 
    AND p.status = 1 
ORDER BY 
    p.id DESC 
LIMIT 10;
`;

    const [result] = await promisePool.query(sql, [subCategoryId]);

    //   result.forEach(product => {
    //     if (product.image) {
    //         product.image = JSON.parse(product.image);;
    //     }
    //     if (product.sizes) {
    //       product.sizes = JSON.parse(product.sizes);;
    //   }

    //   if (product.feedback) {
    //     product.feedback= JSON.parse(product.feedback);

    //     let review = product?.feedback.filter((data) => data.feedback.length > 0);
    //     let rating = product?.feedback.filter((data) => data.rating > 0);
    //     let rating5 = product?.feedback.filter((data) => data.rating == 5);
    //     let rating4 = product?.feedback.filter((data) => data.rating == 4);
    //     let rating3 = product?.feedback.filter((data) => data.rating == 3);
    //     let rating2 = product.feedback.filter((data) => data.rating == 2);
    //     let rating1 = product?.feedback.filter((data) => data.rating == 1);

    //     let total = rating5.length + rating4.length + rating3.length + rating2.length + rating1.length;

    //     let averageRating = 0; // Default to 0
    //     if (total !== 0) {
    //         averageRating = (5 * rating5.length + 4 * rating4.length + 3 * rating3.length + 2 * rating2.length + 1 * rating1.length) / total;
    //     }

    //     product.feedback =averageRating.toFixed(1);
    // }

    //   })

    return result;
  };

  getProductBySubCategory = async (subCategoryId) => {
    let sql = `SELECT p.*, b.brandName, c.categoryName, getImageArray(p.id) as image, getProductSizes(p.id, p.categoryId) AS sizes FROM products as p
     LEFT JOIN brands as b ON b.id = p.brandId 
     LEFT JOIN category as c ON c.id = p.categoryId
     WHERE p.categoryId = ? AND p.isSizeAvailable = 1 AND p.productQuantity > 0 ORDER BY p.id DESC LIMIT 10`;
    const [result] = await promisePool.query(sql, [subCategoryId]);
    return result;
  };

  getProductListByCategoryId = async (categoryId) => {
    let sql = `SELECT p.*, b.brandName, getImageArray(p.id) as image,  c.categoryName, sc.subCategoryName, ic.innerCategoryName, pt.productTypeName, getProductSizes(p.id, p.categoryId) AS sizes FROM products As p 
    LEFT JOIN brands AS b ON b.id = p.brandId
    LEFT JOIN category AS c ON c.id = p.categoryId
    LEFT JOIN subcategory AS sc ON sc.id = p.subCategoryId
    LEFT JOIN innercategory AS ic ON ic.id = p.innerCategoryId
    LEFT JOIN producttype AS pt ON pt.id = p.productTypeId
   WHERE p.categoryId = ? AND p.status=1 AND p.productQuantity > 0 ORDER BY p.id DESC`;
    const [result] = await promisePool.query(sql, [categoryId]);
    return result;
  };

  getBrandName = async (brandId) => {
    let sql = `SELECT brandName FROM brands WHERE id = ?`;
    const [result] = await promisePool.query(sql, [brandId]);
    return result;
  };

  // searchProductList = async (keyword, categoryid) => {
  //   let sql = `SELECT p.productName as label, p.id, b.brandName, c.categoryName, sc.subCategoryName, p.slug, ic.innerCategoryName, pt.productTypeName, getImageArray(p.id) as images FROM products AS p LEFT JOIN category AS c ON c.id = p.categoryId
  //       LEFT JOIN subcategory AS sc ON sc.id = p.subcategoryId
  //       LEFT JOIN innercategory AS ic ON ic.id = p.innerCategoryId
  //       LEFT JOIN producttype AS pt ON pt.id = p.productTypeId
  //       LEFT JOIN brands AS b ON b.id = p.brandId
  //       WHERE (p.productName LIKE '%${keyword}%' OR p.description LIKE '%${keyword}%' OR c.categoryName LIKE '%${keyword}%' OR sc.subCategoryName LIKE '%${keyword}%' OR ic.innerCategoryName LIKE '%${keyword}%' OR pt.productTypeName LIKE '%${keyword}%' OR b.brandName LIKE '%${keyword}%' AND p.categoryId = ?)`;

  //   if (categoryid) {
  //     sql += ' AND p.categoryId = ?';
  //   }
  //   sql += ' AND p.status = 1 AND p.productQuantity > 0';

  //   const [result] = await promisePool.query(sql, categoryid ? [keyword, categoryid] : [keyword]);
  //   return result;
  // };

  getAllPopularProducts = async () => {
    let sql = `SELECT * FROM products WHERE popular= 1`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  getAllDealProducts = async () => {
    let sql = `SELECT * FROM products ORDER BY discount DESC LIMIT 6`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };


  //new 
  searchProductList = async (keyword) => {
    // Function to generate substrings of length 2 and 3 from a keyword
    const generateSubstrings = (word) => {
        let substrings = [];
        for (let i = 0; i < word.length; i++) {
            if (i + 1 < word.length) {
                substrings.push(word.substring(i, i + 2)); // 2-letter substring
            }
            if (i + 2 < word.length) {
                substrings.push(word.substring(i, i + 3)); // 3-letter substring
            }
        }
        return substrings;
    };

    // Generate all substrings for the provided keyword
    let allSubstrings = generateSubstrings(keyword);
    
    // Create a dynamic WHERE clause based on these substrings
    let whereClause = allSubstrings.map(sub => `
        p.productName LIKE '%${sub}%'
    `).join(' OR '); // Use OR to allow any substring match

    let sql = `
    SELECT
        p.*,
        getImageArray(p.id) AS image,
        b.brandName,
        c.categoryName,
        ci.productId,
        IFNULL(
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', fe.id,
                        'user', JSON_OBJECT('id', u.id, 'fullName', u.fullName, 'email', u.email),
                        'rating', fe.rating,
                        'feedback', fe.feedback,
                        'feedbackImage', fe.feedbackImage,
                        'status', fe.status,
                        'dateTime', fe.dateTime
                    )
                )
                FROM feedback AS fe
                LEFT JOIN users AS u ON u.id = fe.userId
                WHERE fe.productId = p.id AND fe.status = 1
            ),
            JSON_ARRAY()
        ) AS feedback,
        p.productQuantity,
        getProductSizes(p.id, p.categoryId) AS sizes,
        CASE WHEN ci.productId IS NOT NULL THEN 1 ELSE 0 END AS isAddToCartAdded,
        CASE WHEN w.productId IS NOT NULL THEN 1 ELSE 0 END AS isWishlistadded,
        JSON_ARRAY() AS similarProducts -- Excluded similarProducts search
    FROM products AS p
    LEFT JOIN brands AS b ON b.id = p.brandId 
    LEFT JOIN category AS c ON c.id = p.categoryId
    LEFT JOIN cartItems AS ci ON ci.productId = p.id
    LEFT JOIN wishlist AS w ON w.productId = p.id
    WHERE p.productName LIKE '%${keyword}%' -- Only searching in productName
        AND p.productQuantity >= 0
        AND p.status = 1
    GROUP BY p.id;
`;


    const [result] = await promisePool.query(sql);
    return result;
};





  //old

//   searchProductList = async (keyword) => {
//     let keywords = [keyword, keyword, keyword, keyword]; // Array of keywords to search

// // Generate the dynamic WHERE clause for multiple keywords
// let whereClause = keywords.map(keyword => `
//     (p.productName LIKE '%${keyword}%' OR 
//      p.description LIKE '%${keyword}%' OR 
//      b.brandName LIKE '%${keyword}%' OR 
//      c.categoryName LIKE '%${keyword}%')
// `).join(' AND '); // Combine with AND to ensure all keywords match

// let sql = `
//     SELECT
//         p.*,
//         getImageArray(p.id) AS image,
//         b.brandName,
//         c.categoryName,
//         ci.productId,
//         IFNULL(
//             (
//                 SELECT JSON_ARRAYAGG(
//                     JSON_OBJECT(
//                         'id', fe.id,
//                         'user', JSON_OBJECT('id', u.id, 'fullName', u.fullName, 'email', u.email),
//                         'rating', fe.rating,
//                         'feedback', fe.feedback,
//                         'feedbackImage', fe.feedbackImage,
//                         'status', fe.status,
//                         'dateTime', fe.dateTime
//                     )
//                 )
//                 FROM feedback AS fe
//                 LEFT JOIN users AS u ON u.id = fe.userId
//                 WHERE fe.productId = p.id AND fe.status = 1 -- Filter for feedback with status 1
//             ),
//             JSON_ARRAY()
//         ) AS feedback,
//         p.productQuantity,
//         getProductSizes(p.id, p.categoryId) AS sizes,
//         CASE WHEN ci.productId IS NOT NULL THEN 1 ELSE 0 END AS isAddToCartAdded,
//         CASE WHEN w.productId IS NOT NULL THEN 1 ELSE 0 END AS isWishlistadded,
//         IFNULL(
//             (
//                 SELECT JSON_ARRAYAGG(
//                     JSON_OBJECT(
//                         'id', sp.id,
//                         'productName', sp.productName,
//                         'description', sp.description,
//                         'customerPrice', sp.customerPrice,
//                         'vendorPrice', sp.vendorPrice,
//                         'marginPrice', sp.marginPrice,
//                         'discount', sp.discount,
//                         'brandId', sp.brandId,
//                         'brandName', br.brandName,
//                         'categoryId', sp.categoryId,
//                         'categoryName', cat.categoryName,
//                         'specification', sp.specification,
//                         'highlights', sp.highlights,
//                         'warnings', sp.warnings,
//                         'userManual', sp.userManual,
//                         'isSizeAvailable', sp.isSizeAvailable,
//                         'productQuantity', sp.productQuantity,
//                         'dateTime', sp.dateTime,
//                         'status', sp.status,
//                         'popular', sp.popular,
//                         'bestQuality', sp.bestQuality,
//                         'shippingTime', sp.shippingTime,
//                         'slug', sp.slug,
//                         'image', getImageArray(sp.id),
//                         'feedback', (
//                             SELECT JSON_ARRAYAGG(
//                                 JSON_OBJECT(
//                                     'id', fb.id,
//                                     'user', JSON_OBJECT('id', us.id, 'fullName', us.fullName, 'email', us.email),
//                                     'rating', fb.rating,
//                                     'feedback', fb.feedback,
//                                     'feedbackImage', fb.feedbackImage,
//                                     'status', fb.status,
//                                     'dateTime', fb.dateTime
//                                 )
//                             )
//                             FROM feedback AS fb
//                             LEFT JOIN users AS us ON us.id = fb.userId
//                             WHERE fb.productId = sp.id AND fb.status = 1 -- Filter for feedback with status 1
//                         ),
//                         'averageRating', (
//                             SELECT FORMAT(ROUND(AVG(rating), 1), 1) AS avgRating
//                             FROM feedback
//                             WHERE productId = sp.id
//                         )
//                     )
//                 )
//                 FROM products AS sp
//                 LEFT JOIN brands AS br ON br.id = sp.brandId
//                 LEFT JOIN category AS cat ON cat.id = sp.categoryId
//                 WHERE (sp.productName LIKE '%${keyword}%' OR sp.description LIKE '%${keyword}%')
//                     AND sp.id != p.id
//             ),
//             JSON_ARRAY()
//         ) AS similarProducts
//     FROM products AS p
//     LEFT JOIN brands AS b ON b.id = p.brandId
//     LEFT JOIN category AS c ON c.id = p.categoryId
//     LEFT JOIN cartItems AS ci ON ci.productId = p.id
//     LEFT JOIN wishlist AS w ON w.productId = p.id
//     WHERE ${whereClause} -- Insert dynamic keyword search conditions
//         AND p.productQuantity > 0
//         AND p.status = 1
//     GROUP BY p.id;
// `;

  
// //     let sql = `
// //     SELECT
// //         p.*,
// //         getImageArray(p.id) AS image,
// //         b.brandName,
// //         c.categoryName,
// //         ci.productId,
// //         IFNULL(
// //             (
// //                 SELECT JSON_ARRAYAGG(
// //                     JSON_OBJECT(
// //                         'id', fe.id,
// //                         'user', JSON_OBJECT('id', u.id, 'fullName', u.fullName, 'email', u.email),
// //                         'rating', fe.rating,
// //                         'feedback', fe.feedback,
// //                         'feedbackImage', fe.feedbackImage,
// //                         'status', fe.status,
// //                         'dateTime', fe.dateTime
// //                     )
// //                 )
// //                 FROM feedback AS fe
// //                 LEFT JOIN users AS u ON u.id = fe.userId
// //                 WHERE fe.productId = p.id AND fe.status = 1
// //             ),
// //             JSON_ARRAY()
// //         ) AS feedback,
// //         p.productQuantity,
// //         getProductSizes(p.id, p.categoryId) AS sizes,
// //         CASE WHEN ci.productId IS NOT NULL THEN 1 ELSE 0 END AS isAddToCartAdded,
// //         CASE WHEN w.productId IS NOT NULL THEN 1 ELSE 0 END AS isWishlistadded,
// //         IFNULL(
// //             (
// //                 SELECT JSON_ARRAYAGG(
// //                     JSON_OBJECT(
// //                         'id', sp.id,
// //                         'productName', sp.productName,
// //                         'description', sp.description,
// //                         'customerPrice', sp.customerPrice,
// //                         'vendorPrice', sp.vendorPrice,
// //                         'marginPrice', sp.marginPrice,
// //                         'discount', sp.discount,
// //                         'brandId', sp.brandId,
// //                         'brandName', br.brandName, -- Include brandName
// //                         'categoryId', sp.categoryId,
// //                         'categoryName', cat.categoryName, -- Include categoryName
// //                         'specification', sp.specification,
// //                         'highlights', sp.highlights,
// //                         'warnings', sp.warnings,
// //                         'userManual', sp.userManual,
// //                         'isSizeAvailable', sp.isSizeAvailable,
// //                         'productQuantity', sp.productQuantity,
// //                         'dateTime', sp.dateTime,
// //                         'status', sp.status,
// //                         'popular', sp.popular,
// //                         'bestQuality', sp.bestQuality,
// //                         'shippingTime', sp.shippingTime,
// //                         'slug', sp.slug,
// //                         'image', getImageArray(sp.id),
// //                         'feedback', (
// //                             SELECT JSON_ARRAYAGG(
// //                                 JSON_OBJECT(
// //                                     'id', fb.id,
// //                                     'user', JSON_OBJECT('id', us.id, 'fullName', us.fullName, 'email', us.email),
// //                                     'rating', fb.rating,
// //                                     'feedback', fb.feedback,
// //                                     'feedbackImage', fb.feedbackImage,
// //                                     'status', fb.status,
// //                                     'dateTime', fb.dateTime
// //                                 )
// //                             )
// //                             FROM feedback AS fb
// //                             LEFT JOIN users AS us ON us.id = fb.userId
// //                             WHERE fb.productId = sp.id
// //                         ),
// //                         'averageRating', (
// //                             SELECT FORMAT(ROUND(AVG(rating), 1), 1) AS avgRating
// //                             FROM feedback
// //                             WHERE productId = sp.id
// //                         )
// //                     )
// //                 )
// //                 FROM products AS sp
// //                 LEFT JOIN brands AS br ON br.id = sp.brandId -- Join brand table
// //                 LEFT JOIN category AS cat ON cat.id = sp.categoryId -- Join category table
// //                 WHERE (sp.productName LIKE '%${keyword}%' OR sp.description LIKE '%${keyword}%')
// //                     AND sp.id != p.id
// //             ),
// //             JSON_ARRAY()
// //         ) AS similarProducts 
// //     FROM products AS p
// //     LEFT JOIN brands AS b ON b.id = p.brandId 
// //     LEFT JOIN category AS c ON c.id = p.categoryId
// //     LEFT JOIN cartItems AS ci ON ci.productId = p.id
// //     LEFT JOIN wishlist AS w ON w.productId = p.id
// //     WHERE (p.productName LIKE '%${keyword}%' OR p.description LIKE '%${keyword}%'
// //         OR c.categoryName LIKE '%${keyword}%' OR b.brandName LIKE '%${keyword}%')
// //         AND p.productQuantity > 0
// //         AND p.status = 1
// //     GROUP BY p.id;
// // `;

// //     let sql = `
// //     SELECT
// //         p.*,
// //         getImageArray(p.id) AS image,
// //         b.brandName,
// //         c.categoryName,
// //         ci.productId,
// //         IFNULL(
// //             (
// //                 SELECT JSON_ARRAYAGG(
// //                     JSON_OBJECT(
// //                         'id', fe.id,
// //                         'user', JSON_OBJECT('id', u.id, 'fullName', u.fullName, 'email', u.email),
// //                         'rating', fe.rating,
// //                         'feedback', fe.feedback,
// //                         'feedbackImage', fe.feedbackImage,
// //                         'status', fe.status,
// //                         'dateTime', fe.dateTime
// //                     )
// //                 )
// //                 FROM feedback AS fe
// //                 LEFT JOIN users AS u ON u.id = fe.userId
// //                 WHERE fe.productId = p.id
// //             ),
// //             JSON_ARRAY()
// //         ) AS feedback,
// //         p.productQuantity,
// //         getProductSizes(p.id, p.categoryId) AS sizes,
// //         CASE WHEN ci.productId IS NOT NULL THEN 1 ELSE 0 END AS isAddToCartAdded,
// //         CASE WHEN w.productId IS NOT NULL THEN 1 ELSE 0 END AS isWishlistadded,
// //         IFNULL(
// //             (
// //                 SELECT CONCAT('[', GROUP_CONCAT(
// //                     DISTINCT JSON_OBJECT(
// //                         'id', sp.id,
// //                         'productName', sp.productName,
// //                         'description', sp.description,
// //                         'customerPrice', sp.customerPrice,
// //                         'vendorPrice', sp.vendorPrice,
// //                         'marginPrice', sp.marginPrice,
// //                         'discount', sp.discount,
// //                         'brandId', sp.brandId,
// //                         'brandName', br.brandName, -- Include brandName
// //                         'categoryId', sp.categoryId,
// //                         'categoryName', cat.categoryName, -- Include categoryName
// //                         'specification', sp.specification,
// //                         'highlights', sp.highlights,
// //                         'warnings', sp.warnings,
// //                         'userManual',sp.userManual,
// //                         'isSizeAvailable', sp.isSizeAvailable,
// //                         'productQuantity', sp.productQuantity,
// //                         'dateTime', sp.dateTime,
// //                         'status', sp.status,
// //                         'popular', sp.popular,
// //                         'bestQuality', sp.bestQuality,
// //                         'shippingTime', sp.shippingTime,
// //                         'slug', sp.slug,
// //                         'image', getImageArray(sp.id),
// //                         'feedback', (
// //                             SELECT JSON_ARRAYAGG(
// //                                 JSON_OBJECT(
// //                                     'id', fb.id,
// //                                     'user', JSON_OBJECT('id', us.id, 'fullName', us.fullName, 'email', us.email),
// //                                     'rating', fb.rating,
// //                                     'feedback', fb.feedback,
// //                                     'feedbackImage', fb.feedbackImage,
// //                                     'status', fb.status,
// //                                     'dateTime', fb.dateTime
// //                                 )
// //                             )
// //                             FROM feedback AS fb
// //                             LEFT JOIN users AS us ON us.id = fb.userId
// //                             WHERE fb.productId = sp.id
// //                         ),
// //                         'averageRating', (
// //                             SELECT FORMAT(ROUND(AVG(rating), 1), 1) AS avgRating
// //                             FROM feedback
// //                             WHERE productId = sp.id
// //                         )
// //                     )
// //                 ), ']')
// //                 FROM products AS sp
// //                 LEFT JOIN brands AS br ON br.id = sp.brandId -- Join brand table
// //                 LEFT JOIN category AS cat ON cat.id = sp.categoryId -- Join category table
// //                 WHERE (sp.productName LIKE '%${keyword}%' OR sp.description LIKE '%${keyword}%')
// //                     AND sp.id != p.id
// //             ),
// //             JSON_ARRAY()
// //         ) AS similarProducts
// //     FROM products AS p
// //     LEFT JOIN brands AS b ON b.id = p.brandId
// //     LEFT JOIN category AS c ON c.id = p.categoryId
// //     LEFT JOIN cartItems AS ci ON ci.productId = p.id
// //     LEFT JOIN wishlist AS w ON w.productId = p.id
// //     WHERE (p.productName LIKE '%${keyword}%' OR p.description LIKE '%${keyword}%'
// //         OR c.categoryName LIKE '%${keyword}%' OR b.brandName LIKE '%${keyword}%')
// //         AND p.productQuantity > 0
// //         AND p.status = 1
// //     GROUP BY p.id;
// // `;



//     // let sql = `
//     //     SELECT
//     //         p.*,
//     //         getImageArray(p.id) AS image,
//     //         b.brandName,
//     //         c.categoryName,
//     //         ci.productId,
//     //         IFNULL(
//     //             (
//     //                 SELECT JSON_ARRAYAGG(
//     //                     JSON_OBJECT(
//     //                         'id', fe.id,
//     //                         'user', JSON_OBJECT('id', u.id, 'fullName', u.fullName, 'email', u.email),
//     //                         'rating', fe.rating,
//     //                         'feedback', fe.feedback,
//     //                         'feedbackImage', fe.feedbackImage,
//     //                         'status', fe.status,
//     //                         'dateTime', fe.dateTime
//     //                     )
//     //                 )
//     //                 FROM feedback AS fe
//     //                 LEFT JOIN users AS u ON u.id = fe.userId
//     //                 WHERE fe.productId = p.id
//     //             ),
//     //             JSON_ARRAY()
//     //         ) AS feedback,
//     //         p.productQuantity,
//     //         getProductSizes(p.id, p.categoryId) AS sizes,
//     //         CASE WHEN ci.productId IS NOT NULL THEN 1 ELSE 0 END AS isAddToCartAdded,
//     //         CASE WHEN w.productId IS NOT NULL THEN 1 ELSE 0 END AS isWishlistadded,
//     //         IFNULL(
//     //             (
//     //                 SELECT CONCAT('[', GROUP_CONCAT(
//     //                     DISTINCT JSON_OBJECT(
//     //                         'id', sp.id,
//     //                         'productName', sp.productName,
//     //                         'description', sp.description,
//     //                         'customerPrice', sp.customerPrice,
//     //                         'vendorPrice', sp.vendorPrice,
//     //                         'marginPrice', sp.marginPrice,
//     //                         'discount', sp.discount,
//     //                         'brandId', sp.brandId,
//     //                         'brandName', br.brandName, -- Include brandName
//     //                         'categoryId', sp.categoryId,
//     //                         'categoryName', cat.categoryName, -- Include categoryName
//     //                         'specification', sp.specification,
//     //                         'highlights', sp.highlights,
//     //                         'warnings', sp.warnings,
//     //                         'userManual',sp.userManual,
//     //                         'isSizeAvailable', sp.isSizeAvailable,
//     //                         'productQuantity', sp.productQuantity,
//     //                         'dateTime', sp.dateTime,
//     //                         'status', sp.status,
//     //                         'popular', sp.popular,
//     //                         'bestQuality', sp.bestQuality,
//     //                         'shippingTime', sp.shippingTime,
//     //                         'slug', sp.slug,
//     //                         'image', getImageArray(sp.id),
//     //                         'feedback', (
//     //                             SELECT JSON_ARRAYAGG(
//     //                                 JSON_OBJECT(
//     //                                     'id', fb.id,
//     //                                     'user', JSON_OBJECT('id', us.id, 'fullName', us.fullName, 'email', us.email),
//     //                                     'rating', fb.rating,
//     //                                     'feedback', fb.feedback,
//     //                                     'feedbackImage', fb.feedbackImage,
//     //                                     'status', fb.status,
//     //                                     'dateTime', fb.dateTime
//     //                                 )
//     //                             )
//     //                             FROM feedback AS fb
//     //                             LEFT JOIN users AS us ON us.id = fb.userId
//     //                             WHERE fb.productId = sp.id
//     //                         ),
//     //                         'averageRating', (
//     //                             SELECT FORMAT(ROUND(AVG(rating), 1), 1) AS avgRating
//     //                             FROM feedback
//     //                             WHERE productId = sp.id
//     //                         )
//     //                     )
//     //                 ), ']')
//     //                 FROM products AS sp
//     //                 LEFT JOIN brands AS br ON br.id = sp.brandId -- Join brand table
//     //                 LEFT JOIN category AS cat ON cat.id = sp.categoryId -- Join category table
//     //                 WHERE (sp.productName LIKE '%${keyword}%' OR sp.description LIKE '%${keyword}%'
//     //                     OR cat.categoryName LIKE '%${keyword}%' OR br.brandName LIKE '%${keyword}%')
//     //                     AND sp.id != p.id
//     //             ),
//     //             JSON_ARRAY()
//     //         ) AS similarProducts
//     //     FROM products AS p
//     //     LEFT JOIN brands AS b ON b.id = p.brandId
//     //     LEFT JOIN category AS c ON c.id = p.categoryId
//     //     LEFT JOIN cartItems AS ci ON ci.productId = p.id
//     //     LEFT JOIN wishlist AS w ON w.productId = p.id
//     //     WHERE (p.productName LIKE '%${keyword}%' OR p.description LIKE '%${keyword}%'
//     //         OR c.categoryName LIKE '%${keyword}%' OR b.brandName LIKE '%${keyword}%')
//     //         AND p.productQuantity > 0
//     //         AND p.status = 1
//     //     GROUP BY p.id;
//     // `;

// //     let sql = `
// // SELECT 
// //     p.*, 
// //     getImageArray(p.id) AS image, 
// //     b.brandName, 
// //     c.categoryName, 
// //     ci.productId,
// //     fe.id AS feedbackId,
// //     u.id AS userId, 
// //     u.fullName AS userFullName, 
// //     u.email AS userEmail, 
// //     fe.rating, 
// //     fe.feedback, 
// //     fe.feedbackImage, 
// //     fe.status AS feedbackStatus, 
// //     fe.dateTime AS feedbackDateTime,
// //     p.productQuantity, 
// //     getProductSizes(p.id, p.categoryId) AS sizes, 
// //     CASE WHEN ci.productId IS NOT NULL THEN 1 ELSE 0 END AS isAddToCartAdded,
// //     CASE WHEN w.productId IS NOT NULL THEN 1 ELSE 0 END AS isWishlistadded,
// //     sp.id AS similarProductId,
// //     sp.productName AS similarProductName,
// //     sp.description AS similarProductDescription,
// //     sp.customerPrice AS similarProductCustomerPrice,
// //     sp.vendorPrice AS similarProductVendorPrice,
// //     sp.marginPrice AS similarProductMarginPrice,
// //     sp.discount AS similarProductDiscount,
// //     sp.brandId AS similarProductBrandId,
// //     br.brandName AS similarProductBrandName,
// //     sp.categoryId AS similarProductCategoryId,
// //     cat.categoryName AS similarProductCategoryName,
// //     sp.specification AS similarProductSpecification,
// //     sp.highlights AS similarProductHighlights,
// //     sp.warnings AS similarProductWarnings,
// //     sp.userManual AS similarProductUserManual,
// //     sp.isSizeAvailable AS similarProductIsSizeAvailable,
// //     sp.productQuantity AS similarProductQuantity,
// //     sp.dateTime AS similarProductDateTime,
// //     sp.status AS similarProductStatus,
// //     sp.popular AS similarProductPopular,
// //     sp.bestQuality AS similarProductBestQuality,
// //     sp.shippingTime AS similarProductShippingTime,
// //     sp.slug AS similarProductSlug,
// //     getImageArray(sp.id) AS similarproductimage,
// //     fb.id AS similarProductFeedbackId, 
// //     us.id AS similarProductUserId, 
// //     us.fullName AS similarProductUserFullName, 
// //     us.email AS similarProductUserEmail, 
// //     fb.rating AS similarProductRating, 
// //     fb.feedback AS similarProductFeedback, 
// //     fb.feedbackImage AS similarProductFeedbackImage, 
// //     fb.status AS similarProductFeedbackStatus, 
// //     fb.dateTime AS similarProductFeedbackDateTime,
// //     FORMAT(ROUND(AVG(fb.rating), 1), 1) AS similarProductAverageRating
// // FROM products AS p 
// // LEFT JOIN brands AS b ON b.id = p.brandId
// // LEFT JOIN category AS c ON c.id = p.categoryId
// // LEFT JOIN cartItems AS ci ON ci.productId = p.id
// // LEFT JOIN wishlist AS w ON w.productId = p.id
// // LEFT JOIN feedback AS fe ON fe.productId = p.id
// // LEFT JOIN users AS u ON u.id = fe.userId
// // LEFT JOIN products AS sp ON (sp.productName LIKE '%${keyword}%' OR sp.description LIKE '%${keyword}%'
// //     OR sp.categoryId = c.id OR sp.brandId = b.id)
// //     AND sp.id != p.id
// // LEFT JOIN brands AS br ON br.id = sp.brandId
// // LEFT JOIN category AS cat ON cat.id = sp.categoryId
// // LEFT JOIN feedback AS fb ON fb.productId = sp.id
// // LEFT JOIN users AS us ON us.id = fb.userId
// // WHERE (p.productName LIKE '%${keyword}%' OR p.description LIKE '%${keyword}%'
// //     OR c.categoryName LIKE '%${keyword}%' OR b.brandName LIKE '%${keyword}%')
// //     AND p.productQuantity > 0
// //     AND p.status = 1
// // GROUP BY p.id, fe.id, u.id, sp.id, fb.id, us.id;
// // `;

//     const [result] = await promisePool.query(sql, [keyword]);

//     //   result.forEach(product => {
//     //     if (product.image) {
//     //         product.image = JSON.parse(product.image);;
//     //     }

//     //     if (product.similarProducts) {
//     //       product.similarProducts = JSON.parse(product.similarProducts);
//     //   }

//     //   if (product?.similarProducts) {

//     //     product?.similarProducts.forEach(img => {

//     //     img.image = JSON.parse(img.image);
//     //     })
//     //   }
//     //   if (product?.feedback) {

//     //     product.feedback = JSON.parse(product.feedback);

//     //     product.feedback .forEach(img => {

//     //       img.feedbackImage = JSON.parse(img.feedbackImage);
//     //     })

//     //   }

//     //   if (product?.sizes) {

//     //     product.sizes = JSON.parse(product.sizes);

//     //   }
//     // });
//     return result;
//   };

  getProductByColor = async (data) => {
    let sql = `SELECT id, slug, productName, color, productQuantity, getImageArray(id) as image FROM products WHERE colorProductId = ? AND id != ? AND status = 1 AND productQuantity > 0`;
    const [result] = await promisePool.query(sql, [
      data.colorProductId,
      data.id,
    ]);
    return result;
  };

  filterProducts = async (filterReq) => {
    let subCatId = filterReq.subCatId;
    let categoryId = filterReq.categoryId;
    let productTypeChecked = filterReq.productTypeChecked;
    let productSizeChecked = filterReq.productSizeChecked;
    let brandsChecked = filterReq.brandsChecked;
    let colorsCheckedArr = filterReq.colorsChecked;
    let colorsChecked = "'" + colorsCheckedArr.join("','") + "'";
    let priceRangeCheckedFrom = filterReq.priceRangeCheckedFrom;
    let priceRangeCheckedTo = filterReq.priceRangeCheckedTo;
    let sql = `SELECT p.id, p.productName, p.price, p.slug, p.marginPrice, p.discount, b.brandName, LOWER(c.categoryName) AS categoryName, getImageArray(p.id) AS images FROM products AS p LEFT JOIN category AS c ON c.id = p.categoryId LEFT JOIN brands AS b ON b.id = p.brandId WHERE p.categoryId = ${categoryId} AND p.subCategoryId = ${subCatId}`;
    if (productTypeChecked.length > 0) {
      sql = sql + ` AND p.productTypeId in (${productTypeChecked.toString()})`;
    }
    if (brandsChecked.length > 0) {
      sql = sql + ` AND p.brandId in (${brandsChecked.toString()})`;
    }
    if (colorsCheckedArr.length > 0) {
      sql = sql + ` AND p.color in (${colorsChecked.toString()})`;
    }
    if (priceRangeCheckedFrom.length > 0) {
      let rangeSql = `(p.price BETWEEN ${priceRangeCheckedFrom[0]} AND ${priceRangeCheckedTo[0]}`;
      for (let i = 1; i < priceRangeCheckedFrom.length; i++) {
        rangeSql += ` OR p.price BETWEEN ${priceRangeCheckedFrom[i]} AND ${priceRangeCheckedTo[i]}`;
      }
      rangeSql += `)`;
      sql = sql + ` AND ` + rangeSql;
    }
    if (productSizeChecked.length > 0) {
      sql =
        sql +
        ` AND p.id in (SELECT productId FROM productsizes WHERE sizeId in (${productSizeChecked.toString()}) AND quantity>0)`;
    }
    sql = sql + ` LIMIT 30`;
    const [result] = await promisePool.query(sql);
    return result;
  };

  getColorsList = async (data) => {
    let sql = `SELECT DISTINCT(CONCAT(UPPER(LEFT(color,1)),
    LOWER(RIGHT(color,LENGTH(color)-1)))) as colorName, color as colordbName FROM products WHERE color != ''`;
    const [result] = await promisePool.query(sql, []);
    return result;
  };

  getProductsBySubcategoryId = async (subCategoryId) => {
    let sql = `SELECT p.productTypeId, pt.productTypeName, getImageArray(p.id) as images
               FROM products AS p
               LEFT JOIN producttype AS pt ON pt.id = p.productTypeId
               WHERE p.subcategoryId = ?
               GROUP BY p.productTypeId
               ORDER BY p.id DESC`;

    const [result] = await promisePool.query(sql, [subCategoryId]);
    return result;
  };

  getProductListTask = async () => {
    let sql = `SELECT p.id, p.productName, p.price, getImageArray(p.id) as image FROM products As p 
    LEFT JOIN brands AS b ON b.id = p.brandId
    LEFT JOIN category AS c ON c.id = p.categoryId
    LEFT JOIN subcategory AS sc ON sc.id = p.subCategoryId
    LEFT JOIN innercategory AS ic ON ic.id = p.innerCategoryId
    LEFT JOIN producttype AS pt ON pt.id = p.productTypeId
   WHERE p.status=1 AND p.productQuantity > 0`;
    const [result] = await promisePool.query(sql, []);
    return result;
  };
}
module.exports = new UserModel();



