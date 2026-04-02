const nodemailer = require('nodemailer');
const config = require('../../config');
const { default: axios } = require('axios');

exports.PhoneActivity = async function (phone, subject, headerMSG, headerMSG1,template) {

 
   try{
   let AuthKey= "33306164696e6739303773"

     let SenderId ="ATRDNG"

        let TempleteID = "1707172136691092490"



   // data.inputType,
   // "Email Verification OTP",
   // headerMSG,
   // headerMSG1,
   // mailmsg

   let url=` http://sms.ibittechnologies.in/api/sendhttp.php?authkey=${AuthKey}&mobiles=${phone},&message=${headerMSG1}&sender=${SenderId}&route=2&country=0&DLT_TE_ID=${TempleteID}`

   let res =await axios.get(url)

   return res
} catch (error) {
   console.error('Error sending SMS:', error.response ? error.response.data : error.message);
   return res

}

   
}