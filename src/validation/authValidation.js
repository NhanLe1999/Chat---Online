//Kiểm Tra thông tin người dùng trc khi lưu vào cơ sở dữ liệu
import { check } from 'express-validator/check';
import { transValidation } from "./../../lang/vi";

let register = [
  //Kiểm tra emali
  check("email", transValidation.email_incorrect).isEmail().trim(),
  //Kiểm tra giới tính
  check("gender", transValidation.gender_incorrect).isIn(["male", "female"]),
  //Kiểm tra pass word
  check("password", transValidation.password_incorrect)
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
    //Kiểm tra password == password_confirmation, nếu sai trả về giá trị false
  check("password_confirmation", transValidation.password_confirmation_incorrect).custom((value, {req}) => {
    return value === req.body.password
  })
];
module.exports = {
  register: register
};