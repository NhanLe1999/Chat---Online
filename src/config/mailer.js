//Cấu hình email gửi tin nhắn active tài khoản
import nodeMailer from 'nodemailer';
require('dotenv').config();
let adminEmail = process.env.MAIL_USER;
let adminPassword = process.env.MAIL_PASSWORD;
let mailHost = process.env.MAIL_HOST;
let mailPort = process.env.MAIL_PORT;

let sendMail = (to, subject, htmlContent) => { //(email đăng ký, chủ đề email, nội dung email )
  let transporter = nodeMailer.createTransport({
    host: mailHost,
    port: mailPort,
    //use cấu hình SSL-TLS; Vì ứng sụng chỉ đang chạy ở localhost nên chưa cần bảo mật giao thức tryền tải đường
    //truyền nên để giá trị false. Sau này khi đẩy code lên server thì để giá trị true để tăng bảo mật đường truyền
    secure: false, 
    auth: {
      user: adminEmail,
      pass: adminPassword
    }
  });
  let options = {
    from: adminEmail,
    to: to,
    subject: subject,
    html: htmlContent
  };

  return transporter.sendMail(options); //Trả về một promise
};
module.exports = sendMail;