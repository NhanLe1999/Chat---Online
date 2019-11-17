import passport from 'passport';
import passportLocal from 'passport-local';
import UserModel from '../../models/userModel';
import ChatGroupModel from '../../models/chatGroupModel';
import { transErrors, transSuccess } from './../../../lang/vi';

let localStrategy = passportLocal.Strategy;

//Kiểm tra tài khoản theo kiểu local
let initPassportLocal = () => {// Được sử dụng trong file web.js
  passport.use(new localStrategy({
    //Kiểm tra email (biến email là name đăng nhập băng local trong file views/auth/login/login.ejs)
    usernameField: "email",
    //Kiểm tra pass (biến pass là name đăng nhập băng local trong file views/auth/login/login.ejs)
    passwordField: "password",
    //Sau khi xác thực tài khoản thì trả về true trỏ đến callbackfuntion
    passReqToCallback: true 
  }, async (req, email, password, done) => {
    try {
      let user = await UserModel.findByEmail(email);//Tìm kiếm và lấy email của người dùng

      //Nếu user không tồn tại thì trả về thông báo cho người dùng
      if(!user) {
        return done(null, false, req.flash('errors', transErrors.login_failed));
      }

      //Nếu user đã tồn tại mà tài khoản chưa được active thì trả về thông báo cho người dùng
      if(!user.local.isActive) {
        return done(null, false, req.flash('errors', transErrors.account_not_active));
      }

      //Nếu user tồn tại và được active thì kiểm tra đến password
      let checkPassword = await user.comparePassword(password);//Hàm comparePassword() Được tạo trong UserModel.js dùng để tìm kiếm password
      if(!checkPassword) {
        //Nếu mật khẩu nhập bị sai thì trả về thông báo cho người dùng
        return done(null, false, req.flash('errors', transErrors.login_failed));
      }
      return done(null, user, req.flash('success', transSuccess.loginSuccess(user.username)));
    }
    //Nếu server bị lỗi 
    catch (error) {
      console.log(error);
      return done(null, false, req.flash('errors', transErrors.server_error));
    }
  }));

  //Lưu id của user vào trong session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });


  passport.deserializeUser(async (id, done) => {
    try {
      let user  = await UserModel.findUserByIdForSessionToUse(id);
      let getChatGroupIds = await ChatGroupModel.getChatGroupIdsByUser(user._id);
      user = user.toObject();
      user.chatGroupIds = getChatGroupIds;

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
    
  });
};
module.exports = initPassportLocal;