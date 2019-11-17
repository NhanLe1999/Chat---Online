import multer from "multer";
import fsExtra from "fs-extra";
import { validationResult } from "express-validator/check";
import { app } from "./../config/app";
import { transErrors, transSuccess } from "./../../lang/vi";
import uuidv4 from "uuid/v4";
import {user} from "../services/index";

// Khai báo nơi mà upload ảnh lên ứng dụng
let storageAvatar = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.avatar_directory); //app.avatar_directory là src/public/images/users (đường dẫn tới nơi lưu trữ ảnh)
  },
  filename: (req, file, callback) => {
    //Kiểm tra kiểu file mà người dùng upload leenn server
    let math = app.avatar_type;
    //Chỉ cho phép 3 kiểu file .jpg, .png, .jpeg
    if(math.indexOf(file.mimetype) === -1) {
      return callback(transErrors.avatar_type, null);
    }
    let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    callback(null, avatarName);
  }
});

let avatarUploadFile = multer({
  //Nơi lưu trữ
  storage: storageAvatar,
  //Giới hạn file
  limits: {fieldNameSize: app.avatar_limit_size}
}).single("avatar");//avatar này là formData.append("avatar", fileData)

//Tạo đường dẫn upload ảnh 
let updateAvatar = (req, res) => {
  avatarUploadFile(req, res, async (error) => { 
    if(error) {
      if(error.message) {
        return res.status(500).send(transErrors.avatar_size);
      }
      return res.status(500).send(error);
    }
    try {
      let updateUserItem = {
        avatar: req.file.filename,
        updateAt: Date.now(),

      };
      let userUpdate = await user.updateUser(req.user._id, updateUserItem);
      //await fsExtra.remove(`${app.avatar_directory}/${userUpdate.avatar}`);
      let result = {
        message: transSuccess.user_info_updated,
        imageSrc: `/images/users/${req.file.filename}`
      };
      return res.status(200).send(result);
    } catch (error) {
      return res.status(500).send(error);
    }
  });
};

let updateInfo = async (req, res) => {
  let errorArr = [];
  let validationErrors = validationResult(req)
  if(!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(item => {
      errorArr.push(item.msg);
    });
    return res.status(500).send(errorArr);
  }

  try {
    let updateUserItem = req.body;
    await user.updateUser(req.user._id, updateUserItem);
    let result = {
      message: transSuccess.user_info_updated,
    };
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
};

//Xử lý để server nhận dữ liệu mật khẩu mà vửa sử dụng ajax gửi yêu cầu lên server
let updatePassword = async (req, res, next) => {
  let errorArr = [];
  let validationErrors = validationResult(req)
  if(validationErrors.isEmpty() == false) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach((element) => {
      errorArr.push(element.msg);
    });
    req.flash("errors", errorArr);
    return res.status(500).send(errorArr);
  }
  try {
    let updateUserItem = req.body;
    await user.updatePassword(req.user._id, updateUserItem);

    let result = {
      message: transSuccess.user_password_updated
    };
    return res.status(200).send(result);

  } catch (error) {
    return res.status(500).send(error);
  }
};
module.exports = {
  updateAvatar: updateAvatar,
  updateInfo: updateInfo,
  updatePassword: updatePassword
};