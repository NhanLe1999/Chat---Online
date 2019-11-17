//Sử lý logic để lưu dữ liệu của người dùng khi đăng ký tài khoản local
import UserModel from '../models/userModel';
import bcrypt from 'bcrypt';
import uuidv4 from 'uuid/v4';
import {transErrors, transSuccess, transMail} from './../../lang/vi';
import sendMail from '../config/mailer';

//Tạo muối dùng để băm mật khẩu
let saltRounds = 7;

let register = (email, gender, password, protocol, host) => {
  return new Promise( async (resolve, reject) => {

    let userByEmail = await UserModel.findByEmail(email);
    //Kiểm tra nếu đã tồn tại email thì không cho tạo tài khoản; Mỗi email chỉ đc tạo một tài khoản
    if(userByEmail) {
      if(userByEmail.deletedAt != null) {
        return reject(transErrors.account_removed);
      }
      if(!userByEmail.local.isActive) {
        return reject(transErrors.account_not_active);
      }
      return reject(transErrors.account_in_use);
    }    
    let salt = bcrypt.genSaltSync(saltRounds);
    let userItem = {
      username: email.split("@")[0],//lấy abc trong định dạng abc@gmail.com là têm của người dùng
      gender: gender,
      local: {
        email: email,
        password: bcrypt.hashSync(password, salt),//băn mật khẩu
        verifyToken: uuidv4() // tạo id cho người dùng
      }
    };
    let user = await UserModel.createNew(userItem);

    //http://localhost:8011/verify/c9cdc09a-7ec9-477e-a2aa-3001b21e9296
    let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`;//Link liên kết để cho ng dùng active tài khoản
    sendMail(email, transMail.subject, transMail.template(linkVerify))
        .then(success => {
          resolve(transSuccess.userCreated(user.local.email));
        })
        .catch( async (error) => {
          await UserModel.removeById(user._id);
          reject(transMail.send_failed);
        });
    
  });
};

////Kiểm tra tài khoản email của người dùng trước khi thực hiện việc gửi email acitive tài khoản
let verifyAccount = (token) => {
  return new Promise(async (resolve, reject) => {
    let userByToken = await UserModel.findByToken(token);
    if(!userByToken) {
      return reject(transErrors.token_undefined);//gửi về thông báo nếu người dùng đã active tài khoản thành công mà
                                                //người dùng vẫn click vào link active tài khoản
    }
    
    await UserModel.verify(token);
    resolve(transSuccess.account_active)//Thông báo đã acitive tài khoản thành công
  }); 
};
module.exports = {
  register: register,
  verifyAccount: verifyAccount
};