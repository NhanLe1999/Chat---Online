import UserModel from '../models/userModel';
import ContactModel from '../models/contactModel';
import NotificationModel from '../models/notificationModel';
import ChatGroupModel from '../models/chatGroupModel';
import _ from 'lodash';
import { transErrors } from '../../lang/vi';
const LIMIT_NUMBER_TAKEN = 1;

//Hàm tìm kiếm bạn bè
let findUsersContact = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let deprecatedUserIds = [currentUserId];
    let contactByUser = await ContactModel.findAllByUser(currentUserId);
    contactByUser.forEach(contact => {
      deprecatedUserIds.push(contact.userId);
      deprecatedUserIds.push(contact.contactId);
    });
    
    deprecatedUserIds = _.uniqBy(deprecatedUserIds); 
    //console.log(deprecatedUserIds); 
    let users = await UserModel.findAllForAddContact(deprecatedUserIds, keyword);
    resolve(users);
  });
};

//Thêm bạn bè
let addNew = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let contactExists = await ContactModel.checkExists(currentUserId, contactId);
    if(contactExists) {
      return reject(false);
    }

    //tạo bản ghi contacts trong cơ sở dữ liệu
    let newContactItem = {
      userId: currentUserId,
      contactId: contactId
    };
    let newContact = await ContactModel.createNew(newContactItem);
    
    //Tạo bản ghi thông báo trong cơ sở dữ liệu
    let notificationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: NotificationModel.types.ADD_CONTACT 
    };
    await NotificationModel.model.createNew(notificationItem);

    resolve(newContact);
  });
};

let removeContact = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeContact = await ContactModel.removeContact(currentUserId, contactId);
    if(removeContact.result.n === 0) {
      return reject(false);
    }

    resolve(true);
  });
};

//Xóa yêu cầu két bạn của người gửi
let removeRequestContactSent = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContactModel.removeRequestContactSent(currentUserId, contactId);
    if(removeReq.result.n === 0) {
      return reject(false);
    }
    await NotificationModel.model.removeRequestContactSentNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);

    resolve(true);
  });
};

//xóa yêu cầu kết bạn của người nhận
let removeRequestContactReceived = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContactModel.removeRequestContactReceived(currentUserId, contactId);
    if(removeReq.result.n === 0) {
      return reject(false);
    }
    //await NotificationModel.model.removeRequestContactReceivedNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);

    resolve(true);
  });
};
let approveRequestContactReceived = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let approveReq = await ContactModel.approveRequestContactReceived(currentUserId, contactId);
    
    if(approveReq.nModified === 0) {
      return reject(false);
    }
    let notificationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: NotificationModel.types.APPROVE_CONTACT 
    };
    await NotificationModel.model.createNew(notificationItem);
    resolve(true);
  });
};


let getContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(currentUserId, LIMIT_NUMBER_TAKEN);

      let users = contacts.map(async (contact) => {
        if(contact.contactId == currentUserId) {
          return await UserModel.getNormalUserDataById(contact.userId);
        } else {
          return await UserModel.getNormalUserDataById(contact.contactId);
        }
        
      });
      resolve(await Promise.all(users));

    } catch (error) {
      reject(error);
    }
  });
};

let getContactsSent = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContactsSent(currentUserId, LIMIT_NUMBER_TAKEN);

      let users = contacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.contactId);
      });
      resolve(await Promise.all(users));

    } catch (error) {
      reject(error);
    }
  });
};

let getContactsReceived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContactsReceived(currentUserId, LIMIT_NUMBER_TAKEN);

      let users = contacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.userId);
      });
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let countAllContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContacts(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

let countAllContactsSent = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContactsSent(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

let countAllContactsReceived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContactsReceived(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

let readMoreContacts = (currentUserId, skipNumberContacts) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContacts = await ContactModel.readMoreContacts(currentUserId, skipNumberContacts, LIMIT_NUMBER_TAKEN);
      let users = newContacts.map(async (contact) => {
        if(contact.contactId == currentUserId) {
          return await UserModel.getNormalUserDataById(contact.userId);
        } else {
          return await UserModel.getNormalUserDataById(contact.contactId);
        }
      });
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let readMoreContactsSent = (currentUserId, skipNumberContacts) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContacts = await ContactModel.readMoreContactsSent(currentUserId, skipNumberContacts, LIMIT_NUMBER_TAKEN);
      let users = newContacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.contactId);
      });
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let readMoreContactsReceived = (currentUserId, skipNumberContacts) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContacts = await ContactModel.readMoreContactsReceived(currentUserId, skipNumberContacts, LIMIT_NUMBER_TAKEN);
      let users = newContacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.userId);
      });
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let searchFriends = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let friendIds = [];
    let friends = await ContactModel.getFriends(currentUserId);
    friends.forEach(item => {
      friendIds.push(item.userId);
      friendIds.push(item.contactId);
    });

    //Loại bỏ các id trùng nhau
    friendIds = _.uniqBy(friendIds);
    friendIds = friendIds.filter(friend => currentUserId != friend);
    let users = await UserModel.findAllToAddGroupChat(friendIds, keyword);
    resolve(users);
  });
};

let addNewGroup = (groupChatName, arrayIds) => {
  return new Promise(async (resolve, reject) => {
    let groupCheckExist = await ChatGroupModel.checkGroupExist(groupChatName, arrayIds[0].userId);
    if(groupCheckExist) {
      return reject(transErrors.group_chat_name_dulicate_error);
    }
    let newGroupItem = {
      name: groupChatName,
      userAmount: arrayIds.length,
      userId: arrayIds[0].userId,
      members: arrayIds
    };
    let newGroup = await ChatGroupModel.createGroup(newGroupItem);

    resolve(newGroup);
  });
};
let memberInGroup = (idOfGroup, targetId) => {
  return new Promise(async(resolve, reject) => {
    let memberInGroup = await ChatGroupModel.memberInGroup(idOfGroup);
    resolve(memberInGroup);
  });
};
module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeContact: removeContact,
  removeRequestContactSent: removeRequestContactSent,
  removeRequestContactReceived: removeRequestContactReceived,
  approveRequestContactReceived: approveRequestContactReceived,
  getContacts: getContacts,
  getContactsSent: getContactsSent,
  getContactsReceived: getContactsReceived,
  countAllContacts: countAllContacts,
  countAllContactsSent: countAllContactsSent,
  countAllContactsReceived: countAllContactsReceived,
  readMoreContacts: readMoreContacts,
  readMoreContactsSent: readMoreContactsSent,
  readMoreContactsReceived: readMoreContactsReceived,
  searchFriends: searchFriends,
  addNewGroup: addNewGroup,
  memberInGroup: memberInGroup
};
