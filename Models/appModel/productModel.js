const { CostExplorer } = require("aws-sdk");
const { user } = require("../../config");
const promisePool = require("../../utils/pool");

class UserModel {

  recommendedProductListById = async (data) => {
    let sql = `SELECT p.*, b.brandName, getImageArray(p.id) as images,  c.categoryName, sc.subCategoryName, ic.innerCategoryName, pt.productTypeName, getProductSizes(p.id, p.categoryId) AS sizes FROM products As p 
    LEFT JOIN brands AS b ON b.id = p.brandId
    LEFT JOIN category AS c ON c.id = p.categoryId
    LEFT JOIN subcategory AS sc ON sc.id = p.subCategoryId
    LEFT JOIN innercategory AS ic ON ic.id = p.innerCategoryId
    LEFT JOIN producttype AS pt ON pt.id = p.productTypeId
   WHERE p.categoryId = ? AND p.subCategoryId = ? AND p.status=1 AND p.productQuantity > 0 ORDER BY p.id DESC`;
    const [result] = await promisePool.query(sql, [data.categoryId, data.subCategoryId]);
    return result;
  };

  getProductListByBrandId = async (brandId, userId) => {
    let sql;
    let params;

    if (userId !== undefined) {
        sql = `SELECT p.*, b.brandName, getImageArray(p.id) as images,  c.categoryName, 
        sc.subCategoryName, ic.innerCategoryName, pt.productTypeName, 
        getProductSizes(p.id, p.categoryId) AS sizes,
        CASE WHEN ci.productId IS NOT NULL THEN 1 ELSE 0 END AS isAddToCartAdded,
        CASE WHEN w.productId IS NOT NULL THEN 1 ELSE 0 END AS isWishlistadded 
        FROM products As p 
        LEFT JOIN brands AS b ON b.id = p.brandId
        LEFT JOIN category AS c ON c.id = p.categoryId
        LEFT JOIN subcategory AS sc ON sc.id = p.subCategoryId
        LEFT JOIN innercategory AS ic ON ic.id = p.innerCategoryId
        LEFT JOIN producttype AS pt ON pt.id = p.productTypeId
        LEFT JOIN cartItems AS ci ON ci.productId = p.id AND ci.userId = ?
        LEFT JOIN wishlist AS w ON w.productId = p.id AND w.userId = ?
        WHERE p.brandId = ? AND p.status = 1 AND p.productQuantity > 0 ORDER BY p.id DESC`;

        params = [userId, userId, brandId];
    } else {
        sql = `SELECT p.*, b.brandName, getImageArray(p.id) as images,  c.categoryName, 
        sc.subCategoryName, ic.innerCategoryName, pt.productTypeName, 
        getProductSizes(p.id, p.categoryId) AS sizes,
        CASE WHEN ci.productId IS NOT NULL THEN 1 ELSE 0 END AS isAddToCartAdded,
        CASE WHEN w.productId IS NOT NULL THEN 1 ELSE 0 END AS isWishlistadded 
        FROM products As p 
        LEFT JOIN brands AS b ON b.id = p.brandId
        LEFT JOIN category AS c ON c.id = p.categoryId
        LEFT JOIN subcategory AS sc ON sc.id = p.subCategoryId
        LEFT JOIN innercategory AS ic ON ic.id = p.innerCategoryId
        LEFT JOIN producttype AS pt ON pt.id = p.productTypeId
        LEFT JOIN cartItems AS ci ON ci.productId = p.id AND ci.userId = NULL
        LEFT JOIN wishlist AS w ON w.productId = p.id AND w.userId = NULL
        WHERE p.brandId = ? AND p.status = 1 AND p.productQuantity > 0 ORDER BY p.id DESC`;

        params = [brandId];
    }

    const [result] = await promisePool.query(sql, params);
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

  getProductBySubCategory = async (subCategoryId, userId) => {
    let sql;
    let params;
    if (userId !== undefined) {
      sql = `SELECT  p.*, b.brandName, c.categoryName, getImageArray(p.id) as image, getProductSizes(p.id, p.categoryId) AS sizes,
      CASE WHEN w.productId IS NOT NULL THEN 1 ELSE 0 END AS isWishlistadded 
      FROM products as p
      LEFT JOIN brands as b ON b.id = p.brandId 
      LEFT JOIN category as c ON c.id = p.categoryId
      LEFT JOIN wishlist AS w ON w.productId = p.id AND w.userId = ?
      WHERE p.subCategoryId = ? AND p.status = 1 AND p.productQuantity > 0 ORDER BY p.id DESC LIMIT 4`;
  
      params = [userId, subCategoryId];
    } else {
      sql = `SELECT p.*, b.brandName, c.categoryName, getImageArray(p.id) as image, getProductSizes(p.id, p.categoryId) AS sizes
      FROM products as p
      LEFT JOIN brands as b ON b.id = p.brandId 
      LEFT JOIN category as c ON c.id = p.categoryId
      WHERE p.subCategoryId = ? AND p.status = 1 AND p.productQuantity > 0 ORDER BY p.id DESC LIMIT 4`;
  
      params = [subCategoryId];
    }
  
    const [result] = await promisePool.query(sql, params);
    return result;
  };
  

  getActiveOrderListByUserId = async (userId) => {
    let sql = `SELECT o.id, o.userId, o.currency, o.totalAmount, o.deliveryAmount, o.paymentMethod, o.deliveryAddress, o.billingAddress, o.finalPayableAmount, o.orderNumber, o.deliveryPartner, o.tracking_Url_Id, o.expDeliveryDate, o.datetime as orderDate, ADDDATE(o.datetime, INTERVAL 7 DAY) as cancelAllowDate, o.status, o.statusDatetime, oi.cancelAndReturn_reson, oi.deliveryPartner,oi.tracking_Url_Id, oi.expDeliveryDate, oi.status as orderItemStatus, oi.updateTime as orderItemUpdateTime, oi.quantity, oi.id as orderItemId, oi.price, s.sizeName, p.productName, b.brandName, CONCAT(adr.firstName, ' ', adr.lastName) AS fullName, p.slug, getImageArray(p.id) as images from orders AS o
    LEFT JOIN orderitem AS oi ON oi.orderId = o.id
    LEFT JOIN sizes AS s ON s.id = oi.sizeId
    LEFT JOIN products AS p ON p.id = oi.productId
    LEFT JOIN address AS adr ON adr.id = o.deliveryAddressId
    LEFT JOIN brands AS b ON b.id = p.brandId
    WHERE o.userId = ? AND oi.status < 4 ORDER BY o.id DESC`;
    const [result, fields] = await promisePool.query(sql, [userId]);
    return result;
  }

  getOtherOrderHistoryByUserIdApp = async (userId) => {
    let sql = `SELECT o.id, o.userId, o.currency, o.totalAmount, o.deliveryAmount, o.paymentMethod, o.deliveryAddress, o.billingAddress, o.finalPayableAmount, o.orderNumber, o.deliveryPartner, o.tracking_Url_Id, o.expDeliveryDate, o.datetime as orderDate, ADDDATE(o.datetime, INTERVAL 7 DAY) as cancelAllowDate, o.status, o.statusDatetime, oi.cancelAndReturn_reson, oi.deliveryPartner,oi.tracking_Url_Id, oi.expDeliveryDate, oi.status as orderItemStatus, oi.updateTime as orderItemUpdateTime, oi.quantity, oi.id as orderItemId, oi.price, s.sizeName, p.productName, b.brandName, CONCAT(adr.firstName, ' ', adr.lastName) AS fullName, p.slug, getImageArray(p.id) as images from orders AS o
  LEFT JOIN orderitem AS oi ON oi.orderId = o.id
  LEFT JOIN sizes AS s ON s.id = oi.sizeId
  LEFT JOIN products AS p ON p.id = oi.productId
  LEFT JOIN address AS adr ON adr.id = o.deliveryAddressId
  LEFT JOIN brands AS b ON b.id = p.brandId
  WHERE o.userId = ? AND oi.status > 3 ORDER BY o.id DESC`;
    const [result, fields] = await promisePool.query(sql, [userId]);
    return result;
  }

  getProductTypeListBySubCategoryIdApp = async (subCategoryId) => {
    let sql = `SELECT pt.id, pt.productTypeName, getImageArray(p.id) as images 
               FROM producttype AS pt
               LEFT JOIN products AS p ON p.productTypeId = pt.id
               WHERE pt.subCategoryId = ? AND pt.status = 1
               GROUP BY pt.id`;

    const [result, fields] = await promisePool.query(sql, [subCategoryId]);
    return result;
}

productListByProductTypeIdApp = async (productTypeId, userId) => {
  let sql;
  let params;
  if (userId !== undefined) {
    sql = `SELECT DISTINCT p.*, b.brandName, getImageArray(p.id) as images, c.categoryName, sc.subCategoryName, ic.innerCategoryName, pt.productTypeName, getProductSizes(p.id, p.categoryId) AS sizes,
    CASE WHEN ci.productId IS NOT NULL AND ci.userId = ${userId} THEN 1 ELSE 0 END AS isAddToCartAdded,
    CASE WHEN w.productId IS NOT NULL AND w.userId = ${userId} THEN 1 ELSE 0 END AS isWishlistadded 
    FROM products As p 
    LEFT JOIN brands AS b ON b.id = p.brandId
    LEFT JOIN category AS c ON c.id = p.categoryId
    LEFT JOIN subcategory AS sc ON sc.id = p.subCategoryId
    LEFT JOIN innercategory AS ic ON ic.id = p.innerCategoryId
    LEFT JOIN producttype AS pt ON pt.id = p.productTypeId
    LEFT JOIN cartItems AS ci ON ci.productId = p.id AND ci.userId = ${userId}
    LEFT JOIN wishlist AS w ON w.productId = p.id AND w.userId = ${userId}
    WHERE p.productTypeId = ${productTypeId} AND p.status=1 AND p.productQuantity > 0
    ORDER BY p.id DESC`;

    params = [userId, productTypeId];
  } else {
    sql = `SELECT DISTINCT p.*, b.brandName, getImageArray(p.id) as images, c.categoryName, sc.subCategoryName, ic.innerCategoryName, pt.productTypeName, getProductSizes(p.id, p.categoryId) AS sizes
    FROM products As p 
    LEFT JOIN brands AS b ON b.id = p.brandId
    LEFT JOIN category AS c ON c.id = p.categoryId
    LEFT JOIN subcategory AS sc ON sc.id = p.subCategoryId
    LEFT JOIN innercategory AS ic ON ic.id = p.innerCategoryId
    LEFT JOIN producttype AS pt ON pt.id = p.productTypeId
    WHERE p.productTypeId = ? AND p.status=1 AND p.productQuantity > 0
    ORDER BY p.id DESC`;
    params = [productTypeId];
  }

  const [result] = await promisePool.query(sql, params);
  return result;
};


getProductDetailByIdApp = async (slug, userId) => {
  let sql;
  let params;
  if (userId !== undefined) {
    sql = `SELECT p.*, 
                  getImageArray(p.id) as image, 
                  b.brandName, 
                  c.categoryName, 
                  ci.productId, 
                  sc.subCategoryName, 
                  pt.productTypeName,
                  p.productQuantity, 
                  getProductSizes(p.id, p.categoryId) AS sizes, 
                  CASE WHEN ci.productId IS NOT NULL AND ci.userId = ? THEN 1 ELSE 0 END AS isAddToCartAdded,
                  CASE WHEN w.productId IS NOT NULL AND w.userId = ${userId} THEN 1 ELSE 0 END AS isWishlistadded 
              FROM products AS p 
              LEFT JOIN brands AS b ON b.id = p.brandId
              LEFT JOIN category AS c ON c.id = p.categoryId
              LEFT JOIN subcategory AS sc ON sc.id = p.subCategoryId
              LEFT JOIN producttype AS pt ON pt.id = p.productTypeId
              LEFT JOIN cartItems AS ci ON ci.productId = p.id AND ci.userId = ${userId}
              LEFT JOIN wishlist AS w ON w.productId = p.id AND  w.userId = ${userId}
              WHERE p.slug = ? AND p.status = 1`;
    params = [userId, slug];
  } else {
    sql = `SELECT p.*, 
                  getImageArray(p.id) as image, 
                  b.brandName, 
                  c.categoryName, 
                  sc.subCategoryName, 
                  pt.productTypeName,
                  p.productQuantity, 
                  getProductSizes(p.id, p.categoryId) AS sizes
              FROM products AS p 
              LEFT JOIN brands AS b ON b.id = p.brandId
              LEFT JOIN category AS c ON c.id = p.categoryId
              LEFT JOIN subcategory AS sc ON sc.id = p.subCategoryId
              LEFT JOIN producttype AS pt ON pt.id = p.productTypeId
              WHERE p.slug = ? AND p.status = 1`;
    params = [slug];
  }
  const [result] = await promisePool.query(sql, params);
  return result;
};

getItemCombitnation = async (categoryId) => {
  let sql = `SELECT ic.id, ic.productId, ic.combinationImage, ic.remark, category.categoryName FROM itemcombination as ic LEFT JOIN category ON category.id = ic.categoryId WHERE ic.categoryId = ${categoryId} AND ic.status = 1`;
  const [result] = await promisePool.query(sql);
  return result;
};

getPrductInfoForCombination = async (productId, userId) => {
  let sql;
  let params;
  if (userId !== undefined) {
    sql = `SELECT p.*, 
                  b.brandName, 
                  getImageArray(p.id) as image, 
                  getProductSizes(p.id, p.categoryId) AS sizes, 
                  CASE WHEN w.productId IS NOT NULL THEN 1 ELSE 0 END AS isWishlistadded 
              FROM products AS p 
              LEFT JOIN brands AS b ON b.id = p.brandId
              LEFT JOIN wishlist AS w ON w.productId = p.id AND w.userId = ?
              WHERE p.id = ?`;
    params = [userId, productId];
  } else {
    sql = `SELECT p.*, 
                  b.brandName, 
                  getImageArray(p.id) as image, 
                  getProductSizes(p.id, p.categoryId) AS sizes
              FROM products AS p 
              LEFT JOIN brands AS b ON b.id = p.brandId
              WHERE p.id = ?`;
    params = [productId];
  }
  
  const [result, fields] = await promisePool.query(sql, params);
  return result;
};

getSizesListBySubCategory = async (categoryId, subCategoryId) => {
  let sql = `SELECT id, sizeName FROM sizes WHERE categoryId = ? AND subCategoryId = ? AND status = 1`;
  const [result, fields] = await promisePool.query(sql,[categoryId, subCategoryId]);
  return result;
}

searchProductList = async (keyword, categoryid) => {
  let sql = `SELECT p.productName as label, p.id, b.brandName, c.categoryName, sc.subCategoryName, p.slug, ic.innerCategoryName, pt.productTypeName, getImageArray(p.id) as images FROM products AS p LEFT JOIN category AS c ON c.id = p.categoryId
      LEFT JOIN subcategory AS sc ON sc.id = p.subcategoryId
      LEFT JOIN innercategory AS ic ON ic.id = p.innerCategoryId
      LEFT JOIN producttype AS pt ON pt.id = p.productTypeId
      LEFT JOIN brands AS b ON b.id = p.brandId
      WHERE (p.productName LIKE '%${keyword}%' OR p.description LIKE '%${keyword}%' OR c.categoryName LIKE '%${keyword}%' OR sc.subCategoryName LIKE '%${keyword}%' OR ic.innerCategoryName LIKE '%${keyword}%' OR pt.productTypeName LIKE '%${keyword}%' OR b.brandName LIKE '%${keyword}%' AND p.categoryId = ?)`;

  if (categoryid) {
    sql += ' AND p.categoryId = ?';
  }
  sql += ' AND p.status = 1 AND p.productQuantity > 0';

  const [result] = await promisePool.query(sql, categoryid ? [keyword, categoryid] : [keyword]);
  return result;
};


}

module.exports = new UserModel();


