const mysql = require("mysql2");
const config = require("../../config");
const promisePool = require("../../utils/pool");

class UserModel {
  checkUser = async (data) => {
    let sql = `select * from users where userName = ?`;
    const [result, fields] = await promisePool.query(sql, [data.userName]);
    return result;
  };

  checkUserFromEmail = async (data) => {
    let sql = `select * from users where email = ?`;
    const [result, fields] = await promisePool.query(sql, [data.email]);
    return result;
  };

  checkUserStatus = async (data) => {
    let sql = `select * from users where email = ? AND status = ?`;
    const [result, fields] = await promisePool.query(sql, [data.email,data.status]);
    return result;
  };

  checkOtp = async (data) => {
    let sql = `SELECT * FROM users WHERE email=? AND otp=?`;
    const [result, fields] = await promisePool.query(sql, [
      data.email,
      data.otp,
    ]);
    return result;
  };

  checkpassword = async (data, hash) => {
    let sql = `select * from users where email = ? AND password =?`;
    const [result, fields] = await promisePool.query(sql, [data.email, hash]);
    return result;
  };

  updateOtp = async (OTP, data) => {
    let sql = `UPDATE users SET otp=? WHERE email=?`;
    const [result, fields] = await promisePool.query(sql, [OTP, data.email]);

    return result;
  };

  updatePassword = async (hash, data) => {
    let sql = `UPDATE users SET password=? WHERE email=?`;
    const [result, fields] = await promisePool.query(sql, [hash, data.email]);

    return result;
  };

  insertData = async (user) => {
    let sql = ` INSERT INTO users( firstName ,lastName,dob,gender,phoneNumber, email , password,userName,passport) VALUES (?,?,?,?,?,?,?,?,?)`;
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
    let sql = `select * from users where email = ? `;
    const [result, fields] = await promisePool.query(sql, [data.email]);
    return result;
  };
}

module.exports = new UserModel();
