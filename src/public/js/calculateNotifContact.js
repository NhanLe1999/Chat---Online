//Đếm số yêu cầu đang chờ xác nhận kết bạn 

function deIncreaseNumberNotifContact(className) {
  let currentValue = +$(`.${className}`).find('em').text(); 
  currentValue -= 1;

  if(currentValue == 0) {
    $(`.${className}`).html("");
  }else {
    $(`.${className}`).html(`(<em>${currentValue}</em>)`);
  }
};

function increaseNumberNotifContact(className) {
  let currentValue = +$(`.${className}`).find('em').text(); //Thẻ <em> chứa class số thông báo
  currentValue += 1;

  if(currentValue == 0) {
    $(`.${className}`).html("");
  }else {
    $(`.${className}`).html(`(<em>${currentValue}</em>)`);
  }
};