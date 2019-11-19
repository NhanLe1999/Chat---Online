import mongoose from 'mongoose';
let Schema = mongoose.Schema;
let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: { type: Boolean, default: false }, 
  createAt: { type: Number, default: Date.now },
  updateAt: { type: Number, default: null },
  deleteAt: { type: Number, default: null },
});
ContactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  //Tìm kiếm người dùng
  findAllByUser(userId) {
    return this.find({
      $or: [
        {"userId": userId},
        {"contactId": userId}
      ]
    }).exec();
  },

  //Kiểm tra xem đã là bạn bè hay chưa
  checkExists(userId, contactId) {
    return this.findOne({
      $or: [
        {$and: [
          //A gửi lời mời kết bạn cho B
          {"userId": userId},
          {"contactId": contactId}
        ]},
        //Nếu A đã gửi lời mời kết bạn cho B, B vẫn tiếp tục gửi lời mời kết bạn cho A
        {$and: [
          {"userId": contactId},
          {"contactId": userId}
        ]}
      ]
    }).exec();
  },
  //xóa bạn bè
  removeContact(userId, contactId) {
    return this.remove({
      $or: [
        {$and: [
          {"userId": userId},
          {"contactId": contactId},
          {"status": true}
        ]},
        {$and: [
          {"userId": contactId},
          {"contactId": userId},
          {"status": true}
        ]}
      ]
    }).exec();
  },

  //hủy yêu cầu đã gửi kết bạn
  removeRequestContactSent(userId, contactId) {
    return this.remove({
      $and: [
        {"userId": userId},
        {"contactId": contactId},
        {"status": false}
      ]
    }).exec();
  },
  //hủy yêu cầu kết bạn đã nhận được
  removeRequestContactReceived(userId, contactId) {
    return this.remove({
      $and: [
        {"userId": contactId},
        {"contactId": userId},
        {"status": false}
      ]
    }).exec();
  },

  //Chấp nhận lời yêu cầu kết bạn
  approveRequestContactReceived(userId, contactId) {
    return this.update({
      $and: [
        {"userId": contactId},
        {"contactId": userId},
        {"status": false}
      ]
    }, {
      "status": true,
      "updateAt": Date.now()
    }).exec();
  },

  //Lưu thông tin và trạng thái bạn bè
  getContacts(userId, limit) {
    return this.find({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).sort({ "updateAt": -1 }).limit(limit).exec();
  },
  //Lưu trạng thái bạn bè sau khi gửi lời yêu cầu kết bạn
  getContactsSent(userId, limit) {
    return this.find({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).sort({ "createAt": -1 }).limit(limit).exec();
  },
  //Lưu trạng thái bạn bè bên người  nhận được lời yêu cầu kết bạn
  getContactsReceived(userId, limit) {
    return this.find({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).sort({ "createAt": -1 }).limit(limit).exec();
  },
  //Đếm tất cả bạn bè
  countAllContacts(userId) {
    return this.count({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).exec();
  },
  //Đếm những lời yêu cầu kết bạn đã gửi
  countAllContactsSent(userId) {
    return this.count({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).exec();
  },
  //đếm nhưnng loi yêu cầu kết bạn đã nhân
  countAllContactsReceived(userId) {
    return this.count({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).exec();
  },
  //Đếm số tin nhắn 
  readMoreContacts(userId, skip, limit) {
    return this.find({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).sort({ "updateAt": -1 }).skip(skip).limit(limit).exec();
  },
  //Đếm số tin nhán đã gửi
  readMoreContactsSent(userId, skip, limit) {
    return this.find({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).sort({ "createAt": -1 }).skip(skip).limit(limit).exec();
  },
  //đếm số tin nhắn đã nhận
  readMoreContactsReceived(userId, skip, limit) {
    return this.find({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).sort({ "createAt": -1 }).skip(skip).limit(limit).exec();
  },
  //thay đổi thông tin khi có tin nhắn mới
  updateWhenHasNewMassage(userId, contactId) {
    return this.update({
      $or: [
        {$and: [
          {"userId": userId},
          {"contactId": contactId}
        ]},
        {$and: [
          {"userId": contactId},
          {"contactId": userId}
        ]}
      ]
    }, {
      "updateAt": Date.now()
    }).exec();
  },

  //Tìm Kiếm bạn bè để tạo nhóm chat
  getFriends(userId) {
    return this.find({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).sort({ "updateAt": -1 }).exec();
  }
};
module.exports = mongoose.model("contact", ContactSchema);