const mysql = require("mysql2");
const config = require("../../config");
const promisePool = require("../../utils/pool");

class UserModel {
  checkUser = async (data) => {
    let sql = `select * from users where email = ?`;
    const [result, fields] = await promisePool.query(sql, [data.inputType]);
    return result;
  };

  checkUserToPhone = async (data) => {
    let sql = `select * from users where phoneNo = ?`;
    const [result, fields] = await promisePool.query(sql, [data.inputType]);
    return result;
  };
  checkTempMail = async (data) => {
    // Check if the table exists
    const tableExistsSQL = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
      AND table_name = 'temp_email_otp'
    `;

    const [tables, _] = await promisePool.query(tableExistsSQL);

    if (tables.length === 0) {
      // If the table doesn't exist, create it
      const createTableSQL = `
        CREATE TABLE temp_email_otp (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          otp VARCHAR(10) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await promisePool.query(createTableSQL);
    }

    // Now, execute the SELECT query
    const selectTempMailSQL = `SELECT * FROM temp_email_otp WHERE email = ?`;
    const [result, fields] = await promisePool.query(selectTempMailSQL, [
      data.inputType,
    ]);

    return result;
  };

  addTempEmailOTP = async (data) => {
    let sql = ` INSERT INTO temp_email_otp SET ?`;
    const [result, fields] = await promisePool.query(sql, [data]);
    return result;
  };

  updateTempEmailOTP = async (data, email) => {
    let sql = ` UPDATE temp_email_otp SET ? WHERE email = ?`;
    const [result, fields] = await promisePool.query(sql, [data, email]);
    return result;
  };

  checkUserlogin = async (data) => {
    let sql = `select id, email, password, status, loginType from users where email = ? AND loginType=?`;
    const [result, fields] = await promisePool.query(sql, [
      data.inputType,
      data.loginType,
    ]);
    return result;
  };

  checkUserPhonelogin = async (data) => {
    let sql = `select id, email,phoneNo, password, status, loginType from users where phoneNo = ? AND loginType=?`;
    const [result, fields] = await promisePool.query(sql, [
      data.inputType,
      data.loginType,
    ]);
    return result;
  };

  checkUserFromEmail = async (email) => {
    let sql = `SELECT * FROM users WHERE email = ?`;
    const [result, fields] = await promisePool.query(sql, [email]);
    return result;
  };

  
  checkUserFromPhone = async (phone) => {
    let sql = `SELECT * FROM users WHERE phoneNo = ?`;
    const [result, fields] = await promisePool.query(sql, [phone]);
    return result;
  };




  checkUserFromPhone = async (email) => {
    let sql = `SELECT email, password, id,status FROM users WHERE phoneNo = ?`;
    const [result, fields] = await promisePool.query(sql, [email]);
    return result;
  };

  checkUserOtp = async (email) => {
    let sql = `SELECT email, otp FROM temp_email_otp WHERE email = ?`;
    const [result, fields] = await promisePool.query(sql, [email]);
    return result;
  };
  
  checkUserFromUserId = async (data) => {
    let sql = `select * from users where id = ?`;
    const [result, fields] = await promisePool.query(sql, [data]);
    return result;
  };

  checkUserFromUserIdRef = async (data) => {
    let sql = `select * from users where referralCode = ?`;
    const [result, fields] = await promisePool.query(sql, [data]);
    return result;
  };

  checkUserStatus = async (data) => {
    let sql = `select * from users where email = ? AND status = ?`;
    const [result, fields] = await promisePool.query(sql, [
      data.email,
      data.status,
    ]);
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

  checkpassword = async (email, hash) => {
    let sql = `select password, email from users where email = ? AND password =?`;
    const [result, fields] = await promisePool.query(sql, [email, hash]);
    return result;
  };


  checkPhonepassword = async (email, hash) => {
    let sql = `select password, email from users where phoneNo = ? AND password =?`;
    const [result, fields] = await promisePool.query(sql, [email, hash]);
    return result;
  };

  updateOtp = async (OTP, data) => {
    let sql = `UPDATE users SET otp=? WHERE email=? `;
    const [result, fields] = await promisePool.query(sql, [OTP, data.email]);

    return result;
  };

  updatePassword = async (hash, email) => {
    let sql = `UPDATE users SET password=? WHERE email=?`;
    const [result, fields] = await promisePool.query(sql, [hash, email]);

    return result;
  };

  updatePhonePassword = async (hash, email) => {
    let sql = `UPDATE users SET password=? WHERE phoneNo=?`;
    const [result, fields] = await promisePool.query(sql, [hash, email]);

    return result;
  };



  createNotification= async(data)=>{

    const insertUserSQL = `INSERT INTO notifications SET ?`;
    const [result, fields] = await promisePool.query(insertUserSQL, [data]);

    return result;


  }


  updateEmail = async (userData) => {
    let sql = `UPDATE users SET email=? WHERE id=?`;
    const [result, fields] = await promisePool.query(sql, [
      userData.email,
      userData.userId,
    ]);

    return result;
  };

  updateMobile = async (userData) => {
    let sql = `UPDATE users SET mobileNumber=?,countryCode=? WHERE id=?`;
    const [result, fields] = await promisePool.query(sql, [
      userData.mobileNumber,
      userData.countryCode,
      userData.userId,
    ]);

    return result;
  };

  updatereferBy = async (userData, referralId) => {
    let sql = `UPDATE users SET referBy=?,referralId=? WHERE id=?`;
    const [result, fields] = await promisePool.query(sql, [
      userData.referBy,
      referralId,
      userData.userId,
    ]);

    return result;
  };

  updatepercentPopup = async (userData) => {
    let sql = `UPDATE users SET percentPopup=? WHERE id=?`;
    const [result, fields] = await promisePool.query(sql, [
      userData.percentPopup,
      userData.userId,
    ]);

    return result;
  };

  insertData = async (user) => {

    // Check if the table exists
    const tableExistsSQL = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
      AND table_name = 'users'
    `;

    const [tables, _] = await promisePool.query(tableExistsSQL);

    if (tables.length === 0) {
      // If the table doesn't exist, create it
      const createTableSQL = `
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          fullName VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          phoneNo VARCHAR(255) NOT NULL,
          gstNo  VARCHAR(255) NOT NULL,
          adharFront VARCHAR(255) NOT NULL,
          adharBack VARCHAR(255) NOT NULL,
          panCard VARCHAR(255) NOT NULL,
          shopName VARCHAR(255) NOT NULL,
          loginType VARCHAR(255) NOT NULL,
          referralCode VARCHAR(255),
          status BOOLEAN NOT NULL,

          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await promisePool.query(createTableSQL);
    }

    let sql = `select id, email, password,loginType from users where email = ?`;
    const [result, fields] = await promisePool.query(sql, [user.email]);

    if (result.length > 0) {
      return result;
    } else {

      // Now, execute the INSERT query
      const insertUserSQL = `INSERT INTO users SET ?`;
      const [result, fields] = await promisePool.query(insertUserSQL, [user]);

      return result;
    }
  };

  insertPhoneData = async (user) => {
    // Check if the table exists
    const tableExistsSQL = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
      AND table_name = 'users'
    `;

    const [tables, _] = await promisePool.query(tableExistsSQL);

    if (tables.length === 0) {
      // If the table doesn't exist, create it
      const createTableSQL = `
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          fullName VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          phoneNo VARCHAR(255) NOT NULL,
          gstNo  VARCHAR(255) NOT NULL,
          adharFront VARCHAR(255) NOT NULL,
          adharBack VARCHAR(255) NOT NULL,
          panCard VARCHAR(255) NOT NULL,
          shopName VARCHAR(255) NOT NULL,
          loginType VARCHAR(255) NOT NULL,
          address  VARCHAR(255) NOT NULL,
          referralCode VARCHAR(255),
          status BOOLEAN NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await promisePool.query(createTableSQL);
    }

    let sql = `select id, phoneNo, password,loginType from users where phoneNo = ?`;
    const [result, fields] = await promisePool.query(sql, [user.phoneNo]);

    if (result.length > 0) {
      return result;
    } else {
      // Now, execute the INSERT query
      const insertUserSQL = `INSERT INTO users SET ?`;
      const [result, fields] = await promisePool.query(insertUserSQL, [user]);

      return result;
    }
  };

  checkUserEmailPassword = async (data) => {
    let sql = `select * from users where email = ? `;
    const [result, fields] = await promisePool.query(sql, [data.email]);
    return result;
  };

  getUserDetails = async (userId) => {
    let sql = `SELECT * FROM users where id = ${userId}`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  packageValidationForDays = async (userId) => {
    let sql = `select date_sub(str_to_date(last_day(CURRENT_DATE) - ((7 + weekday(last_day(CURRENT_DATE)) - 4) % 7),"%Y%m%d"),INTERVAL 3 day) as cutOffDate`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  getAdminSetting = async () => {
    let sql = `select * from setting`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  getUserDetailsByRefferalCode = async (referralCode) => {
    let sql = `select * from users where referralCode = ? `;
    const [result, fields] = await promisePool.query(sql, [referralCode]);
    return result;
  };

  updateProfile = async (data) => {
    if (data.profilePic) {
      let sql = `UPDATE users SET fullName = ?, profilePic = ? WHERE id = ?`;
      const [result, fields] = await promisePool.query(sql, [
        data.fullName,
        data.profilePic,
        data.userId,
      ]);
      return result.affectedRows;
    } else {
      let sql = `UPDATE users SET fullName = ? WHERE id = ?`;
      const [result, fields] = await promisePool.query(sql, [
        data.fullName,
        data.userId,
      ]);
      return result.affectedRows;
    }
  };

  UpdateUserDetailOnCheckout = async (data) => {
    let sql = `UPDATE users SET 
        IIN = ?,
        BIN = ?,
        BIC = ?
    WHERE id = ?
    `;
    const [result, fields] = await promisePool.query(sql, [
      data.IIN,
      data.BIN,
      data.BIC,
      data.userId,
    ]);

    return result.affectedRows;
  };

  updateWalletAddress = async (data) => {
    let sql = `UPDATE users SET 
    walletAddress = ?
    WHERE id = ?
    `;
    const [result, fields] = await promisePool.query(sql, [
      data.walletAddress,
      data.userId,
    ]);

    return result.affectedRows;
  };

  getReferralUsersList = async (user_id) => {
    let sql = `SELECT id, email, firstName, referralCode , DATE_FORMAT(datetime, '%Y-%m-%d %H:%i:%s') as datetime FROM users WHERE referralId=? ORDER BY id DESC `;
    const [result, fields] = await promisePool.query(sql, [user_id]);
    return result;
  };

  getReferralLevel = async () => {
    let sql = `SELECT * FROM referralLevel `;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  changePercentPopup = async (userId) => {
    let sql = `update users set percentPopup=1 where id =${userId}`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  getReferralCount = async (user_id) => {
    let sql = `SELECT getReferralCount(?) as referralCount,referralCode FROM users WHERE id=? `;
    const [result, fields] = await promisePool.query(sql, [user_id, user_id]);
    return result;
  };

  getTotalRefIncome = async (user_id) => {
    let sql = `SELECT sum(amount) as refIncome FROM transaction WHERE userId =? AND transactionTypeId = 4 `;
    const [result, fields] = await promisePool.query(sql, [user_id]);

    return result;
  };

  getUsersDetailByID = async (data) => {
    let sql = `SELECT * FROM users where id = '${data.user_id}'`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  updateUserKyc = async (data) => {
    let sql = `UPDATE users SET firstName = '${data.firstName}', lastName = '${
      data.lastName
    }', gender = '${data.gender}',  dob = '${data.date_of_birth}', country = '${
      data.country
    }', city = '${data.city.replace(/'/g, "''")}', id_document_front = '${
      data.id_document_front
    }', id_document_back = '${
      data.id_document_back
    }', kyc_status=1, face_image = '${data.face_image}', applicant_id = '${
      data.applicant_id
    }', check_id = '${data.check_id}' WHERE id = '${data.user_id}'`;
    const [result, fields] = await promisePool.query(sql);
    return result.affectedRows;
  };

  updateUserKycStatus = async (check_id, kyc_status) => {
    let sql = `UPDATE users SET kyc_status = '${kyc_status}' WHERE check_id = '${check_id}'`;
    const [result, fields] = await promisePool.query(sql);
    return result.affectedRows;
  };

  getUserDetailByCheckId = async (check_id) => {
    let sql = `SELECT * FROM users where check_id = '${check_id}'`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  getCountryDetailByName = async (country_name) => {
    let sql = `SELECT * FROM countries where name = '${country_name}'`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  getActivePackagesList = async (user_id) => {
    let sql = `SELECT t.userId,t.packageId,p.name as packageName, p.price,p.id as packageId,count(t.id) as packageCount FROM transaction as t left join packages as p on p.id=t.packageId where t.userId = ? and t.transactionTypeId=1 AND t.trxId=0 group by t.userId,t.packageId,p.price,p.name`;
    const [result, fields] = await promisePool.query(sql, [user_id]);
    return result;
  };

  getuserCount = async (user_id) => {
    let sql = `SELECT group_concat(id)
    as ids,count(id)
    as userCount FROM users where referralId in (${user_id})`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  getUserAddress = async (walletAddress) => {
    let sql = `SELECT id FROM users WHERE walletAddress= "${walletAddress}"`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  insertryptoTransaction = async (dataForCrypto, userId) => {
    let sql = `INSERT INTO  transaction (userId, transactionTypeId,paymentType,currency,amount,fromAddress,toAddress,transactionHash) VALUES (?,?,?,?,?,?,?,?)`;
    const [result, fields] = await promisePool.query(sql, [
      userId,
      6,
      2,
      1,
      dataForCrypto.amount,
      dataForCrypto.fromAddress,
      dataForCrypto.toAddress,
      dataForCrypto.transactionHash,
    ]);
    return result;
  };
}
module.exports = new UserModel();
