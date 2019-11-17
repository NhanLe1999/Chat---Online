import { contact } from './../services/index';
import { validationResult } from 'express-validator/check';

let findUsersContact = async (req, res, next) => {
  
  let errorArr = [];
  let validationErrors = validationResult(req);

  if(!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(item => {
      errorArr.push(item.msg);
    });

    return res.status(500).send(errorArr);
  }

  try {
    let currentUserId = req.user._id;
    let keyword = req.query.keyword;
    let create = req.query.create == '1';
    let users = await contact.findUsersContact(currentUserId, keyword);
    // console.log(users);
    if(create) {
      return res.render('main/contact/sections/_findUsersContact', {users});
    }
    return res.render('main/groupChat/sections/_searchFriends', {users});
  } catch (error) {
    return res.status(500).send(error);
  }
};


let addNew = async (req, res, next) => {
  try {
    //Lấy id của người gửi lời kết bạn và người nhận lời mời kết bạn
    let currentUserId = req.user._id;
    let contactId = req.body.uid;
    //Sử lý thêm bạn bè
    let newContact = await contact.addNew(currentUserId, contactId);
    //Nếu thành công thì sẽ trả vể giá trị true
    return res.status(200).send({success: !!newContact});
  } catch (error) {
    //Nếu không thành công thì sẽ trả về thông báo lỗi
    return res.status(500).send(error);
  }
};

let removeContact = async (req, res, next) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeContact = await contact.removeContact(currentUserId, contactId);

    return res.status(200).send({success: !!removeContact});
  } catch (error) {
    return res.status(500).send(error);
  }
};


let removeRequestContactSent = async (req, res, next) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeReq = await contact.removeRequestContactSent(currentUserId, contactId);

    return res.status(200).send({success: !!removeReq});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeRequestContactReceived = async (req, res, next) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeReq = await contact.removeRequestContactReceived(currentUserId, contactId);

    return res.status(200).send({success: !!removeReq});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let approveRequestContactReceived = async (req, res, next) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let approveReq = await contact.approveRequestContactReceived(currentUserId, contactId);

    return res.status(200).send({success: !!approveReq});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreContacts = async (req, res) => {
  try {
    let skipNumberContacts = +(req.query.skipNumber);
    let newContactUsers = await contact.readMoreContacts(req.user._id, skipNumberContacts);
    return res.status(200).send(newContactUsers);
  } catch (error) {
    return res.status(500).send(error);
  }
};


let readMoreContactsSent = async (req, res) => {
  try {
    let skipNumberContacts = +(req.query.skipNumber);
    let newContactUsers = await contact.readMoreContactsSent(req.user._id, skipNumberContacts);
    return res.status(200).send(newContactUsers);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreContactsReceived = async (req, res) => {
  try {
    let skipNumberContacts = +(req.query.skipNumber);
    let newContactUsers = await contact.readMoreContactsReceived(req.user._id, skipNumberContacts);
    return res.status(200).send(newContactUsers);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let searchFriends = async (req, res, next) => {
  let errorArr = [];
  let validationErrors = validationResult(req);

  if(!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(item => {
      errorArr.push(item.msg);
    });

    return res.status(500).send(errorArr);
  }

  try {
    let currentUserId = req.user._id;
    let keyword = req.params.keyword;
    let users = await contact.searchFriends(currentUserId, keyword);
    // console.log(users);
    
    return res.render('main/groupChat/sections/_searchFriends', {users});
  } catch (error) {
    return res.status(500).send(error);
  }
};
let addNewGroup = async (req, res, next) => {
  try {
    let userId = req.user._id;
    let arrayIds = req.body.arrayIds;
    let errorArr = [];
    let validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()) {
      let errors = Object.values(validationErrors.mapped());
      errors.forEach(item => {
        errorArr.push(item.msg);
      });

       return res.status(500).send(errorArr[0]);
    }
    //console.log(typeof JSON.stringify(userId), userId);
    //userId = JSON.stringify(userId);
    //console.log(typeof String(userId), userId);
    let groupChatName = req.body.groupChatName;
    arrayIds.unshift({"userId": String(userId)});

    let newGroup = await contact.addNewGroup(groupChatName, arrayIds);
    //console.log(newGroup);
    return res.status(200).send({groupChat: newGroup});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let showMemberInGroup = async (req, res, next) => {
  let idOfGroup = req.query.idOfGroup;
  let targetId = req.user._id;
  let memberInGroup = await contact.memberInGroup(idOfGroup, targetId);
  return res.status(200).send({memberInGroup: memberInGroup});
};
module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeContact: removeContact,
  removeRequestContactSent: removeRequestContactSent,
  removeRequestContactReceived: removeRequestContactReceived,
  approveRequestContactReceived: approveRequestContactReceived,
  readMoreContacts: readMoreContacts,
  readMoreContactsSent: readMoreContactsSent,
  readMoreContactsReceived: readMoreContactsReceived,
  searchFriends: searchFriends,
  addNewGroup: addNewGroup,
  showMemberInGroup: showMemberInGroup
}