// Các đường dẫn của ứng dụng 
import express from 'express';
import { home, auth, user , contact, notification, message } from '../controllers/index';
import { authValid, userValid, contactValid, messageValid } from './../validation/index';
import passport from 'passport';
import initPassportLocal from './../controllers/passportController/local';
import initPassportFacebook from './../controllers/passportController/facebook';
import initPassportGoogle from './../controllers/passportController/google';

initPassportLocal();
initPassportFacebook();
initPassportGoogle();
let router = express.Router();
/**
 * init all routers
 * @param app from express module 
 */
let initRoutes = (app) => {// được sử dụng trong file sever.js
  router.get('/login-register', auth.checkLoggedOut, auth.getLoginRegister);
  router.post('/register', auth.checkLoggedOut, authValid.register, auth.postRegister);
  router.get('/verify/:token', auth.checkLoggedOut, auth.getVerifyAccount);

  //"/login" là action trong file views/login/login.ejs
  router.post('/login', auth.checkLoggedOut,  passport.authenticate("local", {
    //Sau khi xác thực thành công nó sẽ chuyển hướng về router home
    successRedirect: '/',
    //nếu bị lỗi sẽ chuyển hướng về router /login-register trang đăng nhập 
    failureRedirect: '/login-register',
    successFlash: true,
    failureFlash: true
  }));
  router.get('/', auth.checkLoggedIn, home.getHome);

  //router đăng xuất tài khoản
  router.get('/logout', auth.getLogout);
  
  //route đăng nhập bằng facebook (/auth/facebook là href trong file views/auth/alert/login.ejs)
  //Kiểm tra xác thực đăng nhập bằng facebook 
  router.get('/auth/facebook', auth.checkLoggedOut, passport.authenticate("facebook", {scope: ["email"]}));
  router.get('/auth/facebook/callback', auth.checkLoggedOut, passport.authenticate("facebook", {
    successRedirect: '/',
    failureRedirect: '/login-register'
  }));
  router.get('/auth/google', auth.checkLoggedOut, passport.authenticate("google", {scope: ["email"]}));
  router.get('/auth/google/callback', auth.checkLoggedOut, passport.authenticate("google", {
    successRedirect: '/', 
    failureRedirect: '/login-register'
  }));
  //router cập nhật ảnh đaiạ diện
  router.put('/user/update-avatar', auth.checkLoggedIn, user.updateAvatar);
  //router cập nhật thông tin của người dùng
  router.put('/user/update-info', auth.checkLoggedIn, userValid.updateInfo, user.updateInfo);
  //cập nhật password
  router.put('/user/update-password', auth.checkLoggedIn, userValid.updatePassword,user.updatePassword);

  
  router.get('/contact/find-users', auth.checkLoggedIn,
      contactValid.findUsersContact, 
      contact.findUsersContact
  );
  router.post('/contact/add-new', auth.checkLoggedIn, contact.addNew);
  router.delete('/contact/remove-request-contact-sent', auth.checkLoggedIn, contact.removeRequestContactSent);
  router.delete('/contact/remove-request-contact-received', auth.checkLoggedIn, contact.removeRequestContactReceived);
  router.put('/contact/approve-request-contact-received', auth.checkLoggedIn, contact.approveRequestContactReceived);
  router.delete('/contact/remove-contact', auth.checkLoggedIn, contact.removeContact);
  router.get('/contact/read-more-contacts', auth.checkLoggedIn, contact.readMoreContacts);
  router.get('/contact/read-more-contacts-sent', auth.checkLoggedIn, contact.readMoreContactsSent);
  router.get('/contact/read-more-contacts-received', auth.checkLoggedIn, contact.readMoreContactsReceived);

  router.get('/notification/read-more', auth.checkLoggedIn, notification.readMore);
  router.put('/notification/mark-all-as-read', auth.checkLoggedIn, notification.markAllAsRead);
  router.post('/message/add-new-text-emoji', auth.checkLoggedIn, messageValid.checkMessageLength, message.addNewTextEmoji);
  router.post('/message/add-new-image', auth.checkLoggedIn, message.addNewImage);
  router.get('/message/read-more-all-chat', auth.checkLoggedIn, message.readMoreAllChat);
  router.post('/message/add-new-attachment', auth.checkLoggedIn, message.addNewAttachment);
  router.get('/contact/search-friends/:keyword', 
      auth.checkLoggedIn,
      contactValid.findUsersContact,
      contact.searchFriends
      );
  router.post('/group-chat/add-new', auth.checkLoggedIn, contactValid.addNewGroup, contact.addNewGroup);
  router.get('/message/read-more', auth.checkLoggedIn, message.readMore);
  router.get('/conversation/find-conversations', auth.checkLoggedIn,
      contactValid.findUsersContact, 
      message.findConversations
  );
  router.get('/contact/show-member-group', auth.checkLoggedIn, contact.showMemberInGroup);
  
  return app.use("/", router);
};

module.exports = initRoutes;