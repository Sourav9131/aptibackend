const promisePool = require("../../utils/pool");

class adminModel {
   
    insertCMSPages = async (data, route) => {
        let sql = `INSERT INTO  pages (name, heading, route ) VALUES (?,?,?)`;
        const [result] = await promisePool.query(sql, [data.name, data.heading, route]);
        return result
    };

    updateCMSPages = async (data, route) => {
        let sql = `UPDATE pages SET name = ?, heading = ?, route = ? WHERE id = ?`;
        const [result] = await promisePool.query(sql, [data.name, data.heading, route, data.id]);
        return result
    };

    updatePagesStatus = async (data) => {
        let sql = `UPDATE pages SET status = ? WHERE id = ?`;
        const [result] = await promisePool.query(sql, [data.status, data.id]);
        return result
    };


    getCMSPages  = async () => {
        let sql = `SELECT * FROM pages ORDER BY id DESC`;
        const [result] = await promisePool.query(sql, []);
        return result
    };

    insertCMSContent = async (data) => {
        let sql = `INSERT INTO  pagescontent (pageId, title, description) VALUES (?,?,?)`;
        const [result] = await promisePool.query(sql, [data.pageId, data.title, data.description]);
        return result
    };

    updateCMSContent = async (data) => {
        let sql = `UPDATE pagescontent SET title = ?, description = ? WHERE id = ?`;
        const [result] = await promisePool.query(sql, [data.title, data.description, data.id]);
        return result
    };

    getCMSContentById  = async () => {
        let sql = `SELECT * FROM pagescontent `;
        const [result] = await promisePool.query(sql, []);
        return result
    };

    getContactUsList = async () => {
        let sql = `SELECT * FROM contactUs ORDER BY id DESC `;
        const [result] = await promisePool.query(sql, []);
        return result
    };

    getContactUsDetailById = async (id) => {
        let sql = `SELECT * FROM contactUs WHERE id = ?`;
        const [result] = await promisePool.query(sql, [id]);
        return result
    };

    getFeedbackList  = async () => {
        let sql = `SELECT feedback.*, products.productName
        FROM feedback
        INNER JOIN products ON feedback.productId = products.id
        ORDER BY feedback.id DESC; `;
        const [result] = await promisePool.query(sql, []);

        

        result.forEach(product => {
            if (product.feedbackImage) {
                product.feedbackImage = JSON.parse(product.feedbackImage);
            }
      
          })
          
        return result
    };

    updateFeedStatus = async (data) => {
        let sql = `UPDATE feedback SET status = ? WHERE id = ?`;
        const [result] = await promisePool.query(sql, [data.status, data.id]);
        return result
    };

    updateFeedback = async (data) => {
        let sql = `UPDATE feedback SET feedback = ?, rating = ? WHERE id = ?`;
        const [result] = await promisePool.query(sql, [data.feedback, data.rating, data.id]);
        return result;
    };
    

    deleteFeedback = async (feedbackId) => {
        let sql = `DELETE FROM feedback WHERE id = ?`;
        const [result] = await promisePool.query(sql, [feedbackId]);
        return result;
    }


    insertFeedback = async (data) => {
        let sql = `INSERT INTO feedback ( rating, feedback,feedbackImage,userId,productId,status) VALUES (?,?,?,?,?,?)`;
        const [result, fields] = await promisePool.query(sql, [
          data.rating,
          data.feedback,
          data.feedbackImage,
          data.userId,
          data.productId, 
          data.status
    
    
        ]);
        return result;
      };


      insertFaq = async (data) => {
        const sql = "INSERT INTO faq (question, answer) VALUES (?, ?)";
        const [result] = await promisePool.query(sql, [data.question, data.answer]);
        return result;
      };


      getFaqList  = async () => {
        let sql = `SELECT * from faq
        ORDER BY faq.id DESC; `;
        const [result] = await promisePool.query(sql, []);
        return result
    };


    updateFaq = async (data) => {
        let sql = `UPDATE faq SET question = ?, answer = ? WHERE id = ?;`;
        const [result] = await promisePool.query(sql, [data.question, data.answer, data.id]);
        return result;
    };

    deleteFaq = async (feedbackId) => {
        let sql = `DELETE FROM faq WHERE id = ?`;
        const [result] = await promisePool.query(sql, [feedbackId]);
        return result;
    }


    insertTnC = async (data) => {
        const sql = "INSERT INTO termsandconditions (termsandconditions) VALUES (?)";
        const [result] = await promisePool.query(sql, [data]);
        return result;
      };

      checkTnC = async (data) => {
        const sql = "Select * from termsandconditions";
        const [result] = await promisePool.query(sql);
        return result;
      };


     updateTnC = async ( termsandconditions,id=1) => {
          const sql = "UPDATE termsandconditions SET termsandconditions = ? WHERE id = ?";
          const [result] = await promisePool.query(sql, [termsandconditions, id]);
          return result;
     }


     insertPolicies = async (data) => {
        const sql = "INSERT INTO privacypolicy (privacypolicy) VALUES (?)";
        const [result] = await promisePool.query(sql, [data]);
        return result;
      };

      checkPolicy = async (data) => {
        const sql = "Select * from privacypolicy";
        const [result] = await promisePool.query(sql);
        return result;
      };


     updatePolicy = async ( termsandconditions,id=1) => {
          const sql = "UPDATE privacypolicy SET privacypolicy = ? WHERE id = ?";
          const [result] = await promisePool.query(sql, [termsandconditions, id]);
          return result;
     }

     getNotificationList  = async () => {
        let sql = `SELECT * FROM  notifications WHERE notificationToAdmin = 1 `;
        const [result] = await promisePool.query(sql, []);
        return result
    };


    insertAboutUs = async (data) => {
        let sql = `INSERT INTO aboutus (imageTagline, description, ourValues, mainImage) VALUES (?,?,?,?);`;
        const [result, fields] = await promisePool.query(sql,[
          data.imageTagline,
          data.description,
          data.ourValues,
          data.mainImage
        ]);
        return result;
      };

      updateAboutUs = async (data) => {
        let sql = `UPDATE aboutus SET imageTagline = ?, description = ?, ourValues = ?, mainImage = ?;`;
        const [result, fields] = await promisePool.query(sql, [
            data.imageTagline,
            data.description,
            data.ourValues,
            data.mainImage
        ]);
        return result;
    };
    

      checkAboutUs = async (data) => {
        const sql = "Select * from aboutus";
        const [result] = await promisePool.query(sql);
        return result;
      };

}
module.exports = new adminModel();





