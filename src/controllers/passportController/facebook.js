import passport from 'passport';
import passportFacebook from 'passport-facebook';
import UserModel from '../../models/userModel';
import ChatGroupModel from '../../models/chatGroupModel';
import { transErrors, transSuccess } from './../../../lang/vi';
require('dotenv').config();

let facebookStrategy = passportFacebook.Strategy;
let fbAppId = process.env.FB_APP_ID;
let fbAppSecret = process.env.FB_APP_SECRET;
let fbAppCallbackUrl = process.env.FB_CALLBACK_URL;

let initPassportFacebook = () => {
  passport.use(new facebookStrategy({
    //Id của ứng dụng tạo ra trên trang facebook deverloper
    clientID: fbAppId,
    //khóa bí mật của ứng dụng
    clientSecret: fbAppSecret,
    //sau khi đăng nhập thành công nó sẽ trả về trang chủ của ứng dụng
    callbackURL: fbAppCallbackUrl,
    passReqToCallback: true,
    profileFields: ["email", "gender", "displayName"]
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      //Tìm kiếm xem tài khoản facebook đã tồn tại trong cơ sở dữ liệu hay chưa
      let user = await UserModel.findByFacebookUseId(profile.id);//Hàm findByFacebookUseId viết trong file userModel.js
      //Nếu đã tồn tại thì đưa về thông báo đã đăng nhập thành công cho người dung
      if(user) {
        return done(null, user, req.flash('success', transSuccess.loginSuccess(user.username)));
      }
      //Nếu tài khoản chưa tồn tại thì tạo một tài khoản mới cho người dùng
      let newUserItem = {
        username: profile.displayName,
        gender: profile.gender,
        local: {isActive: true},
        facebook: {
          uid: profile.id,
          token: accessToken,
          email: profile.emails[0].value
        }
      };
      //Tạo tài khoản
      let newUser = await UserModel.createNew(newUserItem);
      //Đưa ra thông báo đăng nhập thành công cho người dùng sau khi tạo tài khoản thành công 
       return done(null, newUser, req.flash('success', transSuccess.loginSuccess(newUser.username)));


    } catch (error) {
      
    }
  }));

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
module.exports = initPassportFacebook;