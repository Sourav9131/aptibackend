const nodemailer = require('nodemailer');
const config = require('../../config');
const { createNotification } = require('../../Models/userModel/registerModel');

exports.NotificationActivity = async function (data) {


 return await createNotification(data)
   
}