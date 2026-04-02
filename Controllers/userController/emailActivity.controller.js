const nodemailer = require('nodemailer');
const config = require('../../config')

exports.Activity = async function (email, subject, headerMSG, headerMSG1, text, invoiceData = {}) {

   let transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
         user: "norepalyitspark@gmail.com",
         pass: "tkihrkkccqjgcdol",
      },
      tls: {
         rejectUnauthorized: false
      }
   });
   let attachment = [];
   if (invoiceData.fileName) {
      attachment = [   
         {
            filename: invoiceData.fileName,
            path:invoiceData.filePath,
         }
      ]
   }
   let mailOptions = {
      from: 'norepalyitspark@gmail.com"',
      to: `${email}`,
      subject: subject,
      html: ` <body>
         <table cellspacing="0" cellpadding="0" width="100%" class="silkyexchangeemail" style=" max-width: 600px;;margin: auto;font-family: Inter,sans-serif;font-size: 14px;box-shadow: 0px 0px 10px 0px #ddd;">
            <tbody>
               <tr>
                  <td style="padding:20px 35px; text-align: center; background-color: #fff;">
                     <a href="#" style="display:inline-block;margin:0 15px" target="_blank" ><img src="https://itspark.host/image" width="70" class="CToWUd" data-bit="iit"></a>
                     
                  </td>
               </tr>
               <tr>
                <td style="padding:25px 36px 0px 36px;font: 500 0.9rem 'Lato', sans-serif;" align="left"><h1>${headerMSG}</h1></td>
               </tr>
               <tr>
                  <td style="padding:15px 36px;font: 500 0.9rem 'Lato', sans-serif;" align="left" >
                     <p style="margin:0 0 18px;color:#212529;line-height:28px;font-size:16px">Dear ${email},</p>
                     <p style="margin:0px;color:#212529;line-height:28px;font-size:16px;word-wrap:break-word">${headerMSG1}</p>
                  </td>
               </tr>
               <tr>
               <td style="padding:20px 15px 30px 15px;font: 500 0.9rem 'Lato', sans-serif;" align="center">
               ${text}
               </td>
               </tr>
              
               <tr>
                  <td style="padding:15px 36px; font: 500 0.9rem 'Lato', sans-serif;border-top: 1px solid #ddd;" align="left">
                     <p style="margin-top:10px;color:#212529;line-height:25px;font-size:16px;font-weight:500;text-align:justify">Regards,<br>Team Apurva</p>
                  </td>
               </tr>
          
               <tr>
                  <td style="background:#000;padding:15px;font: 500 0.9rem 'Lato', sans-serif;" align="center">
                     <p style="margin:0;color:#fff">Please reach out to <a href="#" style="text-decoration:none;color:#bd8320" target="_blank">norepalyitspark@gmail.com"</a> for any queries</p>
                     <font color="#888888">
                     </font>
                  </td>
               </tr>
            </tbody>
         </table>
         </body>
`,

      attachments: attachment
   };
   transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
         console.log(error)
         return false;
      } else {
         console.log('Email sent: ' + info.response);
         return true;
      }
   });
}