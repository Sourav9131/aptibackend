const promisePool = require("../../utils/pool");

class UserModel {

AddWishlist = async (data, userId) => {
    let sql = `Insert INTO wishlist (status, productId, userId) VALUES (?,?,?)`;
const [result, fields] = await promisePool.query(sql, [
  data.status,
  data.productId,
  userId,
  data.id,
]);
return result;
}

updateWishlistStatus = async (data) => {
    let sql = `UPDATE wishlist set status = ? WHERE id = ? And productId = ?`;
const [result, fields] = await promisePool.query(sql, [
  data.status,
  data.id,
  data.productId
]);
return result;
}

getWishlistList = async (userId) => {
    let sql = `SELECT w.id, w.status, w.productId, p.productName, p.description, p.price, cs.clothesSize, ss.shoesSize, csq.clothesPrice, ssq.shoesPrice, pi.image FROM wishlist As w 
    LEFT JOIN products AS p ON p.id = w.productId
    LEFT JOIN productimage As pi ON pi.productId = p.id
    LEFT JOIN clothesSize As cs ON cs.id = w.clothesSizeId
    LEFT JOIN shoesSize As ss ON ss.id = w.shoesSizeId
    LEFT JOIN clothesSizesAndQuantity AS csq ON csq.productId = w.productId
    LEFT JOIN ShoesSizesAndQuantitiy AS ssq ON ssq.productId = w.productId
    WHERE w.userId = ? And w.status = '1' ORDER BY w.id DESC `; 
    const [result] = await promisePool.query(sql, [userId]);
    return result;
};

updateWishlistSize = async (data) => {
    let sql = `UPDATE wishlist set shoesSizeId = ?, clothesSizeId = ? WHERE id = ? And productId = ?`;
const [result, fields] = await promisePool.query(sql, [
  data.shoesSizeId,
  data.clothesSizeId,
  data.id,
  data.productId

]);
return result;
}

}

module.exports = new UserModel();

