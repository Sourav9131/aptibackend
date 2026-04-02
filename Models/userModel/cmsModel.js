const promisePool = require("../../utils/pool");

class UserModel {

    getCMSContentByRoute  = async (route) => {
        let sql = `SELECT p.*, pc.pageId, pc.title, pc.description FROM pages AS p
        LEFT JOIN pagescontent AS pc ON pc.pageId = p.id
        WHERE p.route = ? AND p.status = 1`;
        const [result] = await promisePool.query(sql, [route]);
        return result
    };

    getCMSPages  = async (route) => {
        let sql = `SELECT * FROM pages WHERE status = 1`;
        const [result] = await promisePool.query(sql, [route]);
        return result
    };

    insertContactUs = async (data) => {
        let sql = 'INSERT INTO contactUs (name, email, subject, message) VALUES (?,?,?,?) '
        const [result] = await promisePool.query(sql, [
            data.name,
            data.email,
            data.subject,
            data.message
        ]);
        return result;
    }


    getFaqList  = async () => {
        let sql = `SELECT * from faq
        ORDER BY faq.id DESC; `;
        const [result] = await promisePool.query(sql, []);
        return result
    };

 checkTnC = async (data) => {
        const sql = "Select * from termsandconditions";
        const [result] = await promisePool.query(sql);
        return result;
      };

  getNotficationById= async (id) => {
        let sql = `SELECT * FROM notifications WHERE notificationTo = ?`;
        const [result] = await promisePool.query(sql, [id]);
       
        return result;
      };





checkPolicy = async (data) => {
    const sql = "Select * from privacypolicy";
    const [result] = await promisePool.query(sql);
    return result;
  };




checkAboutUs = async (data) => {
    const sql = "Select * from aboutus";
    const [result] = await promisePool.query(sql);
    return result;
  };

 masterData = async (route) => {
    let sql = `SELECT * FROM masterData `;
    const [result] = await promisePool.query(sql, [route]);
    return result
};








}

module.exports = new UserModel();






