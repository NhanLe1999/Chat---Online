import UserModel from '../models/userModel';
import { transErrors } from '../../lang/vi';
import bcrypt from 'bcrypt';

const saltRounds = 7;

let updateUser = (id, item) => {
  return UserModel.updateUser(id, item);
};
//update mật khẩu
let updatePassword = (id, dataUpdate) => {
  return new Promise(async (resolve, reject) => {
    //Tìm kiếm người dùng thông qua id
    let currentUser = await UserModel.findUserByIdToUpdatePassword(id);
    //Nếu người dùng không tồn tại
    if(!currentUser) {
      return reject(transErrors.account_undefined);
    }
    //Nếu người dùng tồn tại thì bắt đầu kiểm tra mật khẩu
    let checkCurrentPassword = await currentUser.comparePassword(dataUpdate.currentPassword);
    if(!checkCurrentPassword) {
      return reject(transErrors.user_current_password_failed);
    }
    //Băm mật khẩu vừa thay đổi để lưu vào trong cơ ds[r dữ liệu]
    let salt  =bcrypt.genSaltSync(saltRounds);
    await UserModel.updatePassword(id, bcrypt.hashSync(dataUpdate.newPassword, salt));
    resolve(true);

  });
};

module.exports = {
  updateUser: updateUser,
  updatePassword: updatePassword
}