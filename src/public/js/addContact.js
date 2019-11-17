function addContact() {
  $(".user-add-new-contact").bind("click", function() {
    //data-uid trong firl
    let targetId = $(this).data("uid");
    //post dữ liệu lên trên server để tạo bảng ghi contacts mới
    $.post("/contact/add-new", {uid: targetId}, function(data) {
      //Sau khi kết bạn thành công ẩn button thêm vào danh sách liên lạc, và hiện lên button Hủy yêu cầu
      if(data.success) {
        $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).hide();
        $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${targetId}]`).css("display", "inline-block");

        //Xưe lý realtime
        increaseNumberNotification("noti_contact_counter", 1);

        increaseNumberNotifContact("count-request-contact-sent");


        let userInfoHtml = $("#find-user").find(`ul li[data-uid = ${targetId}]`).get(0).outerHTML;
        $("#request-contact-sent").find("ul").prepend(userInfoHtml);

        removeRequestContactSent();
        //Sau khi  gửi lời mời kết bạn thì sẽ gửi sự kiện đó lên server
        socket.emit("add-new-contact", {
          contactId: targetId
        });
      }
    });
  });
};
//Sử lý realtime
//Lắng nghe sự kiện phía server gửi về
socket.on("response-add-new-contact", function(user) {
  //Thông báo phía server gửi về cho người dùng sau khi lắng nghe sự kiện
  let notif = `<div class="notif-readed-false" data-uid="${ user.id }">
                <img class="avatar-small" src="images/users/${ user.avatar }" alt=""> 
                <strong>${ user.username }</strong> đã gửi cho bạn một lời mời kết bạn!
               </div>`;
   
    
  //hiển thị các thông báo ra màn hình.prepend giúp đẩy các thông báo hiển thị trước xuống dưới             
  $(".noti_content").prepend(notif);
  $("ul.list-notifications").prepend(`<li>${notif}</li>`);

  increaseNumberNotifContact("count-request-contact-received");

  increaseNumberNotification("noti_contact_counter", 1);

  increaseNumberNotification("noti_counter", 1);

  let userInfoHtml = `<li class="_contactList" data-uid="${user.id}">
                        <div class="contactPanel">
                            <div class="user-avatar">
                                <img src="images/users/${user.avatar}" alt="">
                            </div>
                            <div class="user-name">
                                <p>
                                  ${user.username}
                                </p>
                            </div>
                            <br>
                            <div class="user-address">
                                <span>&nbsp ${user.address}</span>
                            </div>
                            <div class="user-approve-request-contact-received" data-uid="${user.id}">
                                Chấp nhận
                            </div>
                            <div class="user-remove-request-contact-received action-danger" data-uid="${user.id}">
                                Xóa yêu cầu
                            </div>
                        </div>
                      </li>`;
  $("#request-contact-received").find("ul").prepend(userInfoHtml);

  removeRequestContactReceived();
  approveRequestContactReceived();
});