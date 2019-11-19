
$.ajaxSetup({

  headers: {

    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')

  }

});
const socket = io();
function nineScrollLeft() {
  $('.left').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
}

function resizeNineScrollLeft() {
  $('.left').getNiceScroll().resize();
}

function nineScrollRight(divId) {
  $(`.right .chat[data-chat = ${divId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
  $(`.right .chat[data-chat = ${divId}]`).scrollTop($(`.right .chat[data-chat = ${divId}]`)[0].scrollHeight);
}

function enableEmojioneArea(divId) {
  $(`#write-chat-${divId}`).emojioneArea({
    standalone: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      keyup: function(editor, event) {
        $(`#write-chat-${divId}`).val(this.getText());
      },
      click: function() {
        textAndEmojiChat(divId);
        typingOn(divId);
      },
      blur: function() {
        typingOff(divId);
      }
    },
  });
  $('.icon-chat').bind('click', function(event) {
    event.preventDefault();
    $('.emojionearea-button').click();
    $('.emojionearea-editor').focus();
  });
}

function spinLoaded() {
  $('.master-loader').css('display', 'none');
}

function spinLoading() {
  $('.master-loader').css('display', 'block');
}

function ajaxLoading() {
  $(document)
    .ajaxStart(function() {
      spinLoading();
    })
    .ajaxStop(function() {
      spinLoaded();
    });
}

function showModalContacts() {
  $('#show-modal-contacts').click(function() {
    $(this).find('.noti_contact_counter').fadeOut('slow');
  });
}

function configNotification() {
  $('#noti_Button').click(function() {
    $('#notifications').fadeToggle('fast', 'linear');
    $('.noti_counter').fadeOut('slow');
    return false;
  });
  $('.main-content').click(function() {
    $('#notifications').fadeOut('fast', 'linear');
  });
}

function gridPhotos(layoutNumber) {
  $('.show-images').unbind('click').on('click', function() {
    let href = $(this).attr('href');
    let modalImagesId = href.replace('#', '');
    let originDataImage = $(`#${modalImagesId}`).find('div.modal-body').html();
    
    let countRows = Math.ceil($(`#${modalImagesId}`).find('div.all-images>img').length / layoutNumber);
    let layoutStr = new Array(countRows).fill(layoutNumber).join("");

    $(`#${modalImagesId}`).find('div.all-images').photosetGrid({
      highresLinks: true,
      rel: 'withhearts-gallery',
      gutter: '2px',
      layout: layoutStr,
      onComplete: function() {
        $(`#${modalImagesId}`).find('.all-images').css({
          'visibility': 'visible'
        });
        $(`#${modalImagesId}`).find('.all-images a').colorbox({
          photo: true,
          scalePhotos: true,
          maxHeight: '90%',
          maxWidth: '90%'
        });
      }
    });
    //bắt sự kiện modal
    $(`#${modalImagesId}`).on('hidden.bs.modal', function() {
      $(this).find('div.modal-body').html(originDataImage);
    });
  });
  
}

//Hiển thị thông báo sau khi người dùng đăng nhập thành công
function flashMasterNotify() {
  let notify = $(".master-success-message").text();
  if(notify.length) {
    alertify.notify(notify, "success", 7);
  }
}

function changeTypeChat() {
  $('#select-type-chat').bind('change', function() {
    let optionSelected = $('option:selected', this);
    optionSelected.tab('show');
    if($(this).val() === 'user-chat') {
      $('.create-group-chat').hide();
    } else {
      $('.create-group-chat').show();
    }
  })
}

function changeScreenChat() {
  //$('.room-chat').tab('hide');
  $('.room-chat').unbind('click').on('click', function() {
    let divId = $(this).find('li').data('chat');

    $('.person').removeClass('active');
    $(`.person[data-chat = ${divId}]`).addClass('active');

    $(this).tab('show'); 

    
    nineScrollRight(divId);

    enableEmojioneArea(divId);
    imageChat(divId);
    attachmentChat(divId);
    videoChat(divId);
  });
}
function convertEmoji() {
  $(".convert-emoji").each(function() {
      var original = $(this).html();
      var converted = emojione.toImage(original);
      $(this).html(converted);
  });

}
function bufferToBase64(buffer) {
  return btoa(
    new Uint8Array(buffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
}
function lanDauTruyCapTranWeb() {
  if(!$('.tab-content div.active ul').find('a').length) {
    Swal.fire({
      type: 'info',
      title: 'Bạn chưa có cuộc trò chuyện nào, hãy tìm kiếm bạn bè để trò chuyện',
      backdrop: 'rgba(85, 85, 85, 0.5)',
      width: "60rem",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonColor: '#2ECC71',
      confirmButtonText: 'Xác nhận'
    }).then((result) => {
      $('#contactsModal').modal('show');
    });

  }
}
function userTalk() {
  $('.user-talk').unbind('click').on('click', function() {
    let dataChat = $(this).data('uid');
    $('ul.people').find(`a[href = "#uid_${dataChat}"]`).click();
    $(this).closest('div.modal').modal('hide');
    //console.log('nhan');
  });
}
function imageZoom () {
  let modal = $('.modalZoomImage');
  let image = $('img.show-image-chat');
  let modalImg = $('#img01');
  image.unbind('click').on('click', function() {
    modal.css('display', 'block');
    modalImg.attr('src', $(this).attr('src'));
  });
  modal.unbind('click').on('click', function() {
    modal.css('display', 'none');
  });
}

$(document).ready(function() {
  // Hide số thông báo trên đầu icon mở modal contact
  showModalContacts();

  // Bật tắt popup notification
  configNotification();

  // Cấu hình thanh cuộn
  nineScrollLeft();


  // Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn

  // Icon loading khi chạy ajax
  ajaxLoading();

  // Hiển thị button mở modal tạo nhóm trò chuyện

  // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
  // Tham số chỉ được phép trong khoảng từ 1 đến 5
  gridPhotos(5);

  // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện

  flashMasterNotify();
  

  changeTypeChat();
  changeScreenChat();
  convertEmoji();
  if($('.tab-content div.active ul').find('a').length) {
    $('.tab-content div.active ul').find('a')[0].click();
  }
  
  $('#myNavbar>ul>li>a>i').click(function() {
    $(this).toggleClass('vuaclickvao');
  });
  
  $('#video-chat-group').bind('click', function() {
    alertify.notify('Tính năng không khả dụng với nhóm trò chuyện. Chỉ khả dụng với trò chuyện cá nhân', 'error', 10)
  });
  lanDauTruyCapTranWeb();
  userTalk();
  imageZoom();
});
