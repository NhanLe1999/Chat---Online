import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from "../../helpers/socketHelper.js"

/**
 * 
 * @param  io  là một biến của thư viện socket.io
 */
let addNewContact = (io) => {
  //Mối khi load trang web hay có nhiều tab mở khác nhau trên một trình duyệt thì sẽ có 1 soketid khác nhau,
  //Cần một đối tượng để lưu các socketid đó.
  let clients = {};

  //Lắng nghe sự kiện khi trang web load(ấn f5 trang web)
  io.on("connection", (socket) => {
    let currentUserId = socket.request.user._id;

    //Hàm pushSocketIdToArray được viết trong file src/helpers/socketHelper.js
    //push socketid vào trong mảng
    clients = pushSocketIdToArray(clients, currentUserId, socket.id);
    //Sẽ lắng nghe sự kiện khi người dùng tạo ra (gửi lời mời kết bạn)
    socket.on("add-new-contact", (data) => {
      let currentUser = {
        id: socket.request.user._id,
        username: socket.request.user.username,
        avatar: socket.request.user.avatar,
        address: (socket.request.user.address !== null) ? socket.request.user.address : ""
      };
      //Gửi thông báo về cho người được nhận lời mời kết bạn
      //Khi người dùng mở nhiều tab, mỗi tab sẽ có 1 socketid riêng, thì sẽ gửi thông báo về các trang web 
      //đó thông qua các socket id
      if(clients[data.contactId]) {
        emitNotifyToArray(clients, data.contactId, io, "response-add-new-contact", currentUser);
      }
      
    });

    //Khi người dùng không còn kết nối thì xóa socketID 
    //Hàm removeSocketIdFromArray được viết trong file src/helpers/socketHelper.js
    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, currentUserId, socket);
    });
  });
};

module.exports = addNewContact; 