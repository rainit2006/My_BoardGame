function showMessage(data){
  var options = [];
  addMessageElement(data.message, options);
}

function addMessageElement (el, options) {
      var $el = $(el);

      // Setup default options
      if (!options) {
        options = {};
      }
      if (typeof options.fade === 'undefined') {
        options.fade = true;
      }
      if (typeof options.prepend === 'undefined') {
        options.prepend = false;
      }

      // Apply options
      if (options.fade) {
        $el.hide().fadeIn(2000);
      }
      if (options.prepend) {
        $('.messages').prepend($el);
      } else {
        $('.messages').append($el);
      }
      $('.messages')[0].scrollTop = $('.messages')[0].scrollHeight;
}
