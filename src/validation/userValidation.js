import { check } from "express-validator/check";
import { transValidation } from "./../../lang/vi";

//kiểm tra thông tin của người dùng trước khi lưu vào trong csdl
let updateInfo = [
  //Sử dụng thuộc tính optional(). ví dụ khi người dùng update thông tin mà không update userNam chỉ 
  //update các trường còn lại thì cần thuoock tính optional(), vì lúc đó userName nó sẽ nhận giá trị là Null
  //nên cơ sở dữ liệu nó sẽ ko chấp nhận.Nên cần dùng optional() để cho phép nó update dữ liệu.
  check("username", transValidation.update_username)
    .optional()
    .isLength({min: 3, max: 17})
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),
  check("gender", transValidation.update_gender)    
    .optional()
    .isIn(["male", "female"]),
  check("address", transValidation.update_address)
    .optional()
    .isLength({min: 3, max: 50}),
  check("phone", transValidation.update_phone)
    .optional()
    .matches(/^(0)[0-9]{9,10}$/),
];

let updatePassword = [
  check("currentPassword", transValidation.password_incorrect)
    .isLength({min: 8})
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
  check("newPassword", transValidation.password_incorrect)
    .isLength({min: 8})
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
  check("confirmNewPassword", transValidation.password_confirmation_incorrect)
    .custom((value, {req}) => value === req.body.newPassword)

];
module.exports = {
  updateInfo: updateInfo,
  updatePassword: updatePassword
};