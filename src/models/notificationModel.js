import mongoose from 'mongoose';
let Shema = mongoose.Schema;
let NotificationSchema = new Shema({
  senderId: String,
  receiverId: String,
  type: String,
  isRead: { type: Boolean, default: false },
  createAt: { type: Number, default: Date.now }
});

NotificationSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  //Xóa thông báo bên người gửi lời mời kết bạn
  removeRequestContactSentNotification(senderId, receiverId, type) {
    return this.remove({
      $and: [
        {"senderId": senderId},
        {"receiverId": receiverId},
        {"type": type}
      ]
    }).exec();
  },
  //Xóa thông báo bên người nhận lời mời kết bạn
  removeRequestContactReceivedNotification(receiverId, senderId, type) {
    return this.remove({
      $and: [
        {"senderId": senderId},
        {"receiverId": receiverId},
        {"type": type}
      ]
    }).exec();
  },

  getByUserIdAndLimit(userId, limit) {
    return this.find({
      "receiverId": userId
    }).sort({ "createAt": -1 }).limit(limit).exec();
  },
  countNotifUnread(userId) {
    return this.count({
      $and: [
        {"receiverId": userId},
        {"isRead": false}
      ]
    }).exec();
  },
  readMore(userId, skip, limit) {
    return this.find({
      "receiverId": userId
    }).sort({ "createAt": -1 }).skip(skip).limit(limit).exec();
  },
  markAllAsRead(userId, targetUsers) {
    return this.updateMany({
      $and: [
        {"receiverId": userId},
        {"senderId": {$in: targetUsers}}
      ]
    }, { "isRead": true }).exec();
  }
}

const NOTIFICATION_TYPES = {
  ADD_CONTACT: 'add_contact',
  APPROVE_CONTACT: 'approve_contact'
};

const NOTIFICATION_CONTENTS = {
  getContent: (notificationType, isRead, userId, userName, userAvatar) => {
    if(notificationType === NOTIFICATION_TYPES.ADD_CONTACT) {
      if(!isRead) {
        return `<div class="notif-readed-false" data-uid="${ userId }">
                <img class="avatar-small" src="images/users/${ userAvatar }" alt=""> 
                <strong>${ userName }</strong> đã gửi cho bạn một lời mời kết bạn!
              </div>`;
      }

      return `<div data-uid="${ userId }">
                <img class="avatar-small" src="images/users/${ userAvatar }" alt=""> 
                <strong>${ userName }</strong> đã gửi cho bạn một lời mời kết bạn!
              </div>`;
    }
    if(notificationType === NOTIFICATION_TYPES.APPROVE_CONTACT) {
      if(!isRead) {
        return `<div class="notif-readed-false" data-uid="${ userId }">
                <img class="avatar-small" src="images/users/${ userAvatar }" alt=""> 
                <strong>${ userName }</strong> đã chấp nhận lời mời kết bạn!
              </div>`;
      }

      return `<div data-uid="${ userId }">
                <img class="avatar-small" src="images/users/${ userAvatar }" alt=""> 
                <strong>${ userName }</strong> đã chấp nhận lời mời kết bạn!
              </div>`;
    }

    return "No matching with any notification type";
  }
};
module.exports = {
  model: mongoose.model("notification", NotificationSchema),
  types: NOTIFICATION_TYPES,
  contents: NOTIFICATION_CONTENTS
};