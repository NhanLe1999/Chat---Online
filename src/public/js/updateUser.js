let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};
let userUpdatePassword = {};

function callLogout() {
  let timerInterval;
  Swal.fire({
    position: "top-end",
    title: "Hệ thống sẽ tự động đăng xuất sau 10s",
    html: "Thời gian: <strong>5</strong>",
    timer: 5000,
    onBeforeOpen: () => {
      Swal.showLoading();
      timerInterval = setInterval(() => {
        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
      }, 1000);
    },
    onClose: () => {
      clearInterval(timerInterval);
    }
  }).then(result => {
    $.get("/logout", function() {
      location.reload();
    });
  });
}

function updateUserInfo() {  
  //sử lý sự kiện khi người dùng thay đổi avatar
  $("#input-change-avatar").bind("change", function() {//Cú pháp của jquery
    let fileData = $(this).prop("files")[0];
    //tạo biến dùng để kiểm tra kiểu file của ảnh, chỉ cho phép 3 dạng là.png, .jpeg, .png
    let math = ["image/png", "image/jpg", "image/jpeg"];
    //Giới hạn kích thước file ảnh là 1MB (byte)
    let limit = 1048576;

    //kiểm tra kiểu file của hình ảnh 
    if($.inArray(fileData.type, math) === -1) {
      alertify.notify("Kiểu file ảnh không hợp lệ, chỉ chấp nhận jpg, png & jpeg", "error", 7);
      $(this).val(null);
      return false;
    }
    //Kiểm tra kich thước của file ảnh
    if(fileData.size > limit) {
      alertify.notify("Chỉ cho phép upload ảnh kích thước tối đa 1MB", "error", 7);
      $(this).val(null);
      return false;
    }

    if(typeof (FileReader) != "undefined") {
      //Lấy ảnh của người dùng chọn làm ảnh đại diện (id của thẻ div)
      let imagePreview = $("#image-edit-profile");
      //Làm rỗng thẻ div của ảnh cũ
      imagePreview.empty();
      //Sử lý load file ảnh
      let fileReader = new FileReader();
      //tạo mới thẻ div cho hình ảnh mới mà người dùng chọn làm ảnh đại diện
      fileReader.onload = function(element) {
        $("<img>", {
          "src": element.target.result,
          "class": "avatar img-circle",
          "id": "user-modal-avatar",
          "alt": "avatar"
        }).appendTo(imagePreview);
      }
      //Hiển thị hình ảnh
      imagePreview.show();
      fileReader.readAsDataURL(fileData);

      let formData = new FormData();
      formData.append("avatar", fileData);
      userAvatar = formData;
    } else {
      alertify.notify("Trình duyệt không hỗ trợ việc hiển thị ảnh lập tức", "error", 7);
    }
  });

  //Sử lý khi người dùng thay đổi userName của mình
  $("#input-change-username").bind("change", function() {
    let username = $(this).val();
    let regexUsername = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    
    if(!regexUsername.test(username) || username.length < 3 || username.length > 17) {
      alertify.notify("Username chỉ từ 3-17 ký tự, không được chứa ký tự đặc biệt", "error", 7);
      $(this).val(originUserInfo.username);
      delete userInfo.username;
      return false;
    }
    
    userInfo.username = username;
  });
  //Sử lý khi người thay đổi giới tính 
  $("#input-change-gender-male").bind("click", function() {
    let gender = $(this).val();
    if(gender !== "male") {
      alertify.notify("Dữ liệu giới tính có vấn đề, bạn không được chỉnh sửa", "error", 7);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }
    userInfo.gender = gender;
  });
  $("#input-change-gender-female").bind("click", function() {
    let gender = $(this).val();
    if(gender !== "female") {
      alertify.notify("Dữ liệu giới tính có vấn đề, bạn không được chỉnh sửa", "error", 7);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }

    userInfo.gender = $(this).val();
  });
  //Sử lý khi người dung thay đổi địa chỉ
  $("#input-change-address").bind("change", function() {
    let address = $(this).val();
    if(address.length < 3 || address.length > 50) {
      alertify.notify("Địa chỉ giới hạn trong khoảng 3-30 ký tự", "error", 7);
      $(this).val(originUserInfo.address);
      delete userInfo.address;
      return false;
    }

    userInfo.address = address;
  });
  //Sử lý khi người dùng thay đổi số điện thoại
  $("#input-change-phone").bind("change", function() {
    let phone = $(this).val();
    let regexPhone = new RegExp(/^(0)[0-9]{9,10}$/);
    if(!regexPhone.test(phone)) {
      alertify.notify("Phone phải bắt đầu bằng 0, giới hạn 10-11 số", "error", 7);
      $(this).val(originUserInfo.phone);
      delete userInfo.phone;
      return false;
    }

    userInfo.phone = phone;
  });


  //Sử lý khi người dùng thay đổi mật khẩu
  //xử lý khi người dùng nhập mật khẩu cũ
  $("#input-change-current-password").bind("change", function() {
    let currentPassword = $(this).val();
    let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
    //currentPassword là mật khẩu cũ mà người dùng nhập, regexPassword là điều kiện của password
    if(!regexPassword.test(currentPassword)) {
      alertify.notify("Mật khẩu phải chứa ít nhất 8 ký tự gồm: chữ hoa, chữ thường, chữ số và ký tự đặc biệt", "error", 7);
      //Nếu mật khẩu nhập không hợp lệ thì giá trị của trường mật khẩu đó sẽ đc trả về null
      $(this).val(null);
      delete userUpdatePassword.currentPassword;
      return false;
    }

    //Nếu mật khẩu người dùng là đủ điều kiện thì giá trị của trường  nhập mật khẩu cũ gán bằng mật khẩu vừa nhập
    userUpdatePassword.currentPassword = currentPassword;
  });

  //Xử lý khi người dùng nhập mật khẩu mới
  $("#input-change-new-password").bind("change", function() {
    let newPassword = $(this).val();
    let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

    if(!regexPassword.test(newPassword)) {
      alertify.notify("Mật khẩu phải chứa ít nhất 8 ký tự gồm: chữ hoa, chữ thường, chữ số và ký tự đặc biệt", "error", 7);
      $(this).val(null);
      delete userUpdatePassword.newPassword;
      return false;
    }

    //Nếu mật khẩu người dùng là đủ điều kiện thì giá trị của trường  nhập mật khẩu mới gán bằng mật khẩu vừa nhập
    userUpdatePassword.newPassword = newPassword;
  });

  //Xử lý khi người dùng nhập lại mật khẩu mới
  $("#input-change-confirm-new-password").bind("change", function() {

    //giá trị của trường nhập lại mật khẩu
    let confirmNewPassword = $(this).val();
    //Nếu người dùng chưa nhập mật khẩu mới
    if(!userUpdatePassword.newPassword) {
      alertify.notify("Bạn chưa nhập mật khẩu mới", "error", 7);
      $(this).val(null);
      delete userUpdatePassword.confirmNewPassword;
      return false;
    }
    //Nếu người dùng chưa nhập mật khẩu cũ
    if(!userUpdatePassword.currentPassword) {
      alertify.notify("Bạn chưa nhập mật khẩu cũ", "error", 7);
      $(this).val(null);
      delete userUpdatePassword.confirmNewPassword;
      return false;
    }
    //Nếu người dùng đã nhập mật khẩu mới và mật khẩu cũ mà 2 trường này có giá trị không khớp nhau
    if(confirmNewPassword != userUpdatePassword.newPassword) {
      alertify.notify("Nhập lại mật khẩu chưa đúng", "error", 7);
      $(this).val(null);
      delete userUpdatePassword.confirmNewPassword;
      return false;
    }
    userUpdatePassword.confirmNewPassword = confirmNewPassword;
  });
}

function callUpdateUserAvatar () {
  //Gửi request hình ảnh lên server
  $.ajax({
    type: "put",
    url: "/user/update-avatar",//đc thực hiện trong web.js
    cache: false,
    contentType: false,
    processData: false,
    data: userAvatar,
    success: function(result) {
      $(".user-modal-alert-success").find("span").text(result.message);
      $(".user-modal-alert-success").css("display", "block");
      $("#navbar-avatar").attr("src", result.imageSrc);
      originAvatarSrc = result.imageSrc;
      $("#input-btn-cancel-update-user").click();
    },
    error: function(error) {
      $(".user-modal-alert-error").find("span").text(error.responseText);
      $(".user-modal-alert-error").css("display", "block");
      $("#input-btn-cancel-update-user").click();
    }
  });
}

function callUpdateUserInfo () {
  //Gửi resquest thông tin lên server
  $.ajax({
    type: "put",
    url: "/user/update-info",
    data: userInfo,
    success: function(result) {
      $(".user-modal-alert-success").find("span").text(result.message);
      $(".user-modal-alert-success").css("display", "block");

      originUserInfo = Object.assign(originUserInfo, userInfo);//Là một cú pháp của javascript
      //update usernam trong navbar
      $("#navbar-username").text(originUserInfo.username);
      //Sau khi người dùng click vào hủy bỏ thì reset lại tất cả các giá trị
      $("#input-btn-cancel-update-user").click();
    },
    error: function(error) {
      $(".user-modal-alert-error").find("span").text(error.responseText);
      $(".user-modal-alert-error").css("display", "block");
      $("#input-btn-cancel-update-user").click();
    }
  });
}

function callUpdateUserPassword () {
  $.ajax({
    type: "put",
    url: "/user/update-password",
    data: userUpdatePassword,
    success: function(result) {
      $(".user-modal-password-alert-success").find("span").text(result.message);
      $(".user-modal-password-alert-success").css("display", "block");


      $("#input-btn-cancel-user-password").click();
      callLogout();

    },
    error: function(error) {
      $(".user-modal-password-alert-error").find("span").text(error.responseText);
      $(".user-modal-password-alert-error").css("display", "block");
      $("#input-btn-cancel-user-password").click();
    }
  });
}

//Lắng nghe sự kiện
$(document).ready(function() {
  
  originAvatarSrc = $("#user-modal-avatar").attr("src");
  originUserInfo = {
    username: $("#input-change-username").val(),
    gender: ($("#input-change-gender-male").is(":checked")) ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
    address: $("#input-change-address").val(),
    phone: $("#input-change-phone").val()
  };
  //update thông tin của người dùng sau khi họ thay đổi các trường username giói tính địa chỉ và số điện thoại
  updateUserInfo();

  $("#input-btn-update-user").bind("click", function() {
    //Nếu người dũng chưa thay đổi thông tin mà vẫn click vào button lưu lại thì đưa ra thông báo lỗi
    if($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify("Thông tin chưa được thay đổi", "error", 7);
      return false;
    }
    if(userAvatar) {
      callUpdateUserAvatar();
    }
    if(!$.isEmptyObject(userInfo)) {
      callUpdateUserInfo();
    }
    console.log(userInfo);
  });

  //Sử lý sự kiện khi click chuột vào button Hủy bỏ khi thay đổi thông tin cá nhân
  $("#input-btn-cancel-update-user").bind("click", function() {
    userInfo = {};
    userAvatar = null;
      //Sử lý khi click vào nút hủy bỏ: Sau khi người dùng thay đổi thông tin mà click vào nút hủy bỏ thì tất cả các trường dữ liệu sẽ quay lại về như ban đầu
    $("#input-change-avatar").val(null);
    $("#user-modal-avatar").attr("src", originAvatarSrc);

    $("#input-change-username").val(originUserInfo.username);
    (originUserInfo.gender === "male" ? $("#input-change-gender-male").click() : $("#input-change-gender-female").click());
    $("#input-change-address").val(originUserInfo.address);
    $("#input-change-phone").val(originUserInfo.phone);
  });




  $("#input-btn-update-user-password").bind("click", function() {
    if(!userUpdatePassword.currentPassword || !userUpdatePassword.newPassword || !userUpdatePassword.confirmNewPassword) {
      alertify.notify("Bạn phải điền đủ thông tin", "error", 7);
      return false;
    }
    Swal.fire({
      title: "Bạn có chắc chắn muốn thay đổi mật khẩu?",
      text: "Bạn không thể hoàn tác lại quá trình này!",
      type: "info",
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#FF7675",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy"
    }).then((result) => {
      if(!result.value) {
        $("#input-btn-cancel-user-password").click();
        return false;
      }
      callUpdateUserPassword();
    });
  });
  $("#input-btn-cancel-user-password").bind("click", function() {
    userUpdatePassword = {};
    $("#input-change-current-password").val(null);
    $("#input-change-new-password").val(null);
    $("#input-change-confirm-new-password").val(null);
  });
});