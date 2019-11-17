//Chứa các thông báo gửi về cho người dùng
export const transValidation = {
  email_incorrect: "Email phải có dạng example@gmail.com",
  gender_incorrect: "Không được sửa trường giới tính",
  password_incorrect: "Mật khẩu phải chứa ít nhất 8 ký tự gồm: chữ hoa, chữ thường, chữ số và ký tự đặc biệt",
  password_confirmation_incorrect: "Mật khẩu nhập lại không đúng",
  update_username: "Username chỉ từ 3-17 ký tự, không được chứa ký tự đặc biệt",
  update_gender : "Dữ liệu giới tính có vấn đề, bạn không được chỉnh sửa",
  update_address: "Address chỉ từ 3-30 ký tự",
  update_phone: "Phone phải bắt đầu bằng 0, giới hạn 10-11 số",
  keyword_find_user: "Lỗi từ khóa tìm kiếm, chỉ cho phép nhập chữ cái, số, khoảng cách và không quá 17 ký tự",
  message_text_emoji_incorrect: "Tin nhắn phải có tối thiểu 1 ký tự và tối đa 400 ký tự",  
  group_chat_name_error: "Tên nhóm phải từ 5-30 ký tự, chỉ chứa chữ cái, chữ số"
};
export const transErrors = {
  account_in_use: "Email này đã được sử dụng",
  account_removed: "Tài khoản này đã bị gỡ khỏi hệ thống, bạn có thể liên hệ phía bộ phận hỗ trợ để được giải đáp",
  account_not_active: "Email này đã được đăng ký nhưng chưa active, vui lòng active tài khoản bằng cách vào email và làm theo hướng dẫn",
  account_undefined: "Tài khoản này không tồn tại",
  user_current_password_failed: "Mật khẩu hiện tại không đúng",
  token_undefined: "Email này đã được kích hoạt rồi!",
  login_failed: "Sai tài khoản hoặc mật khẩu",
  server_error: "Có lỗi ở phía máy chủ. Vui lòng liên hệ bộ phận hỗ trợ của chúng tôi",
  avatar_type: "Kiểu file ảnh không hợp lệ, chỉ chấp nhận jpg, png & jpeg",
  avatar_size: "Chỉ cho phép upload ảnh kích thước tối đa 1MB",
  conversation_not_found: "Cuộc trò chuyện không tồn tại",
  image_message_type: "Kiểu file ảnh không hợp lệ, chỉ chấp nhận jpg, png & jpeg",
  image_message_size: "Chỉ cho phép upload ảnh kích thước tối đa 20MB",
  attachment_message_type: "Kiểu file ảnh không hợp lệ, chỉ chấp nhận jpg, png & jpeg",
  attachment_message_size: "Chỉ cho phép upload tệp tin kích thước tối đa 1MB",
  group_chat_name_dulicate_error: "Tên nhóm phải khác với tên các nhóm đã có trước đó mà bạn tham gia",
  group_chat_name_error: "Tên nhóm phải từ 5-30 ký tự, chỉ chứa chữ cái, chữ số"
}
export const transSuccess = {
  userCreated: (userEmail) => {
    return `Tài khoản <strong>${userEmail}</strong> đã được tạo, vui lòng kiểm tra email của bạn để kích hoạt tài khoản. Xin cảm ơn!`;
  },
  account_active: "Kích hoạt tài khoản thành công. Bạn có thể đăng nhập ứng dụng",
  loginSuccess: (username) => {
    return `Hello ${username}, welcome to my application!`;
  },
  logout_success: "Đăng xuất thành công",
  avatar_updated: "Cập nhật ảnh đại diện thành công",
  user_info_updated: "Cập nhật thông tin người dùng thành công",
  user_password_updated: "Cập nhật mật khẩu thành công"
};

//gửi email active tài khoản
export const transMail = {
  subject: "Chat-Online: Xác nhận kích hoạt tài khoản",
  template: (linkVerify) => {
    return `
      <h2>Bạn nhận được thư này do đăng ký tài khoản trên ứng dụng Chat-Online</h2>
      <h3>Vui lòng kích hoạt tài khoản bằng cách click vào liên kết dưới đây</h3>
      <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
      <h4>Nếu email này nhầm lẫn hãy bỏ qua nó. Trân trọng!</h4>
    `;
  },
  send_failed: "Có lỗi trong quá trình gửi email, vui lòng liên hệ bộ phận hỗ trợ của chúng tôi!"
}