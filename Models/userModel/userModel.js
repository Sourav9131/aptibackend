const mysql = require("mysql2");
const config = require("../../config");
const promisePool = require("../../utils/pool");

class UserModel {
  checkUser = async (data) => {
    let sql = `select * from users where userName = ?`;
    const [result, fields] = await promisePool.query(sql, [data.userName]);
    return result;
  };

  insertData = async (user) => {
    let sql = ` INSERT INTO users( firstName ,lastName,dob,gender,phoneNumber, email , password, userName,passport) VALUES (?,?,?,?,?,?,?,?,?)`;
    const [result, fields] = await promisePool.query(sql, [
      user.firstName,
      user.lastName,
      user.dob,
      user.gender,
      user.phoneNumber,
      user.email,
      user.password,
      user.userName,
      user.passport,
    ]);
    return result;
  };

  checkUserEmailPassword = async (data) => {
    let sql = `select * from users where email = ?`;
    const [result, fields] = await promisePool.query(sql, [data.email]);
    return result;
  };

  insertFeedback = async (userId, data) => {
    
    let sql = `INSERT INTO feedback ( rating, feedback,feedbackImage,userId,productId,status,orderId) VALUES (?,?,?,?,?,?,?)`;
    const [result, fields] = await promisePool.query(sql, [
      data.rating,
      data.feedback,
      data.feedbackImage,
      data.userId,
      data.productId, 
      data.status,
      data.orderId


    ]);
    return result;
  };


  insertContentFeedbackMsg = async (contentFeedbackMsgId) => {
    let sql = `INSERT INTO contentFeedback (contentFeedbackMsgId) VALUES (?)`;
    const [result, fields] = await promisePool.query(sql, [
      contentFeedbackMsgId
    ]);
    return result;
  };

  getContentFeedbackMsg = async (productId) => {
    let sql = `select * from feedback where productId =?`;
    const [result, fields] = await promisePool.query(sql, [productId]);
    return result;
  };

  getFeedback = async (productId) => {
    let sql = `select * from feedback where productId =?`;
    const [result, fields] = await promisePool.query(sql, [productId]);


    result.forEach(product => {
      if (product.feedbackImage) {
          product.feedbackImage = JSON.parse(product.feedbackImage);
      }

    })
    return result;
  };

}   

module.exports = new UserModel();
