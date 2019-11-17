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
  removeRequestContactReceived(userId, contactId) {
    return this.remove({
      $and: [
        {"userId": contactId},
        {"contactId": userId},
        {"status": false}
      ]
    }).exec();
  },

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
  getContactsSent(userId, limit) {
    return this.find({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).sort({ "createAt": -1 }).limit(limit).exec();
  },
  getContactsReceived(userId, limit) {
    return this.find({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).sort({ "createAt": -1 }).limit(limit).exec();
  },
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
  countAllContactsSent(userId) {
    return this.count({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).exec();
  },
  countAllContactsReceived(userId) {
    return this.count({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).exec();
  },
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
  readMoreContactsSent(userId, skip, limit) {
    return this.find({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).sort({ "createAt": -1 }).skip(skip).limit(limit).exec();
  },
  readMoreContactsReceived(userId, skip, limit) {
    return this.find({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).sort({ "createAt": -1 }).skip(skip).limit(limit).exec();
  },
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