//Thực hiện các điều hướng đường link của ứng dụng và được sử dụng trong web.js
import { validationResult } from 'express-validator/check';
import { auth } from './../services/index';
import { transSuccess } from './../../lang/vi';

let getLoginRegister = (req, res, next) => {
  return res.render('auth/master', {
    errors: req.flash('errors'),
    success: req.flash('success')
  });
};

let postRegister = async (req, res, next) => {
  let errorArr = [];
  let successArr = [];
  let validationErrors = validationResult(req)
  if(validationErrors.isEmpty() == false) {
    let errors = Object.values(validationErrors.mapped()); 
    errors.forEach((element) => { //Lấy các thông báo lỗi của các trường: emali, password, giới tính để r, lo0nhóm cho vào một mảng
      errorArr.push(element.msg);
    });
    req.flash('errors', errorArr);// lấy ra mảng lỗi rồi gửi về cho người dùng
    return res.redirect('/login-register');// Khi có lỗi thì chuyển hướng về trang đăng nhập (loginRegister)
  }
  try {
    let createUserSuccess = await auth.register(
      req.body.email,
      req.body.gender,
      req.body.password,
      req.protocol,
      req.get("host")
    );
    successArr.push(createUserSuccess);
    req.flash("success", successArr);
    return res.redirect('/login-register');
  } catch (error) {
    errorArr.push(error);
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
  }
};

//Kiểm tra tài khoản email của người dùng trước khi thực hiện việc gửi email acitive tài khoản
let getVerifyAccount = async (req, res, next) => {
  let errorArr = [];
  let successArr = [];
  try {
    let verifySuccess = await auth.verifyAccount(req.params.token);
    successArr.push(verifySuccess);
    req.flash("success", successArr);
    return res.redirect('/login-register');
  } catch (error) {
    errorArr.push(error);
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
  }
};

//Đăng xuất tài khoản
let getLogout = (req, res,next) => {
  //Xóa passport user được lưu trong session
  req.logout();
  //Sau khi đăng xuất thành công thì gửi thông báo về cho người dùng
  req.flash('success', transSuccess.logout_success);
  //Đăng xuất thành công thì quay về trang đăng ký đăng nhập
  return res.redirect('/login-register');
};

//Kiêm ra đã đăng nhập hay chưa
let checkLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) {//isAuthenticated là một phương thức của passport để kiểm tra xem người dùng đã đăng nhập hay chưa
    return res.redirect('/login-register');
  }
  next();
};

//Kiểm tra đã đăng xuất hay chưa
let checkLoggedOut = (req, res, next) => {
  if(req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
};

module.exports = {
  getLoginRegister: getLoginRegister,
  postRegister: postRegister,
  getVerifyAccount: getVerifyAccount,
  getLogout: getLogout,
  checkLoggedIn: checkLoggedIn,
  checkLoggedOut: checkLoggedOut
};