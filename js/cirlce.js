

$(document).ready(function() {
  // TODO: this is copy/pasted from script.js, refactor!
  // TODO: add require.js or some kind of module system
  var backendAddress = 'http://localhost:3000';

  $( window ).stellar({
    horizontalScrolling: false,
    verticalOffset: 0,
    horizontalOffset: 0
  });

  var letsGo = function() {
    var self = $( '.do-it' );
    self.animate( { left: '10px'}, 250, 'easeOutBounce', function() {
      self.animate( { left: '0' }, 250, 'easeOutBounce' );
    });

    setTimeout( letsGo, 3000 );
  };

  var displayMessage = function(type, text) {
    noty({
      text: text,
      layout: 'center',
      type: type,
      animation: {
        open: {height: 'toggle'},
        close: {height: 'toggle'},
        easing: 'swing',
        speed: 500
      }
    });
  };

  var handleFaqClick = function() {
    var isAnimating;
    $('.answer').hide();
    $('.question').click(function(e) {
      e.preventDefault();
      if(isAnimating) {
        return;
      }
      if($(this).siblings('.revealed').length) {
        return;
      }
      isAnimating = true;
      $('.revealed').slideUp('fast', function() {
        $(this).removeClass('revealed');
        isAnimating = false;
      });
      $(this).siblings('.answer').slideDown('fast', function() {
        $(this).addClass('revealed');
        isAnimating = false;
      });
    });
  };

  letsGo();

  var photosUris = {};

  $('.photo1, .photo2, .photo3').click(function(e) {
    var input = $('input' + '[name="' + $(this).attr('id') + '"]');
    e.preventDefault();
    if(input.val()) {
      $('.overlay img').attr('src', photosUris[input.attr('name')]);
      $('.overlay').show();
    }
    else {
      input.click();
    }
  });

  $('input[name="photo1"], input[name="photo2"], input[name="photo3"]').on('change', function(e) {
    var reader = new FileReader();
    var input = $(this)[0];
    var name = $(this).attr('name');

    reader.onload = function (e) {
      $('.photo-upload.' + name).css('background-image', 'url(' + e.target.result + ')');
      $('.photo-upload.' + name).css('background-size', 'cover');
      photosUris[name] = e.target.result;
    };

    reader.readAsDataURL($(this)[0].files[0]);
  });

  $('.overlay').click(function(e) {
    e.preventDefault();
    $(this).hide();
  });

  $('.photo-upload').hover(function() {
    if($('input[name="' + $(this).attr('id') + '"]').val()) {
      $(this).find('.erase').removeClass('hidden');
    }
  }, function() {
    $(this).find('.erase').addClass('hidden');
  });

  $('.erase').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    var id = $(this).parent('.photo-upload').attr('id');
    $('input[name="' + id + '"]').val('');
    $('.photo-upload.' + id).css('background-image', '');
    $(this).addClass('hidden');
  });

  $('.form-yourself').on('keyup', function(e) {
    var val = $(this).val(),
        wordsLeft = $('.words-left'),
        count = 100;

    if(!val) {
      wordsLeft.text(100);
    }
    else {
      count = 100 - val.match(/\S+/g).length;
      if(count > 0) {
        wordsLeft.text(100 - val.match(/\S+/g).length);
      }
    }
  });

  $('.form-yourself').on('keypress', function(e) {
    var val = $(this).val(),
        count;
    if(val) {
      count = 99 - val.match(/\S+/g).length;
    }

    if(count < 0) {
      e.preventDefault();
    }
  });

  $.ajax({
    dataType: 'json',
    url: backendAddress + '/token',
    crossDomain: true,
    success: function(data, status, xhr) {
      if(data && status === 'success') {
        $('#token').attr('value', data.token);
      }
    }
  });

  $.ajax({
    dataType: 'json',
    url: backendAddress + '/faqJson',
    crossDomain: true,
    success: function(data, status, xhr) {
      if(data && status === 'success') {
        data.faq.forEach(function(el) {
          $('.faq-response').append(
            '<div class="faq"><p class="question">' + el.question + '</p><p class="answer">' + el.answer + '</p></div>'
          );
        });

        handleFaqClick();
      }
    }
  });

  var isSending = false;

  $('.cirlce-form form').on('submit', function(e) {
    var submitButton = $('.form-submit');

    e.preventDefault();
    if(isSending) {
      return;
    }

    var canvas = document.getElementById('canvas');
    var dataUri = canvas.toDataURL('image/jpeg', 1.0);

    $('#canvasDataUri').val(dataUri);

    if(!$('#token').val() || !$('.form-name').val() || !$('.form-age').val() || !$('.form-mobile').val() ||
       !$('.form-email').val() || !$('.form-yourself').val() || !$('.form-questions').val() ||
       !$('.form-tshirt').val() || !$('.form-portfolio').val()) {

      displayMessage('error', 'All fields are required');
      return;
    }

    isSending = true;
    submitButton.text('sending...');
    $.ajax({
      url: backendAddress + '/submit',
      data: new FormData($(this)[0]),
      contentType: false,
      processData: false,
      type: 'POST',
      success: function(data) {
        $('#token').val('');
        submitButton.attr('disabled', true);
        displayMessage('success', 'Sent successfully');
      },
      error: function(xhr, status, error) {
        var responseJson;

        if(xhr.responseText) {
          responseJson = JSON.parse(xhr.responseText);
        }

        if(responseJson && responseJson.message) {
          displayMessage('error', responseJson.message);
        }
        else {
          displayMessage('error', 'There was an error, try again');
        }
      },
      complete: function() {
        isSending = false;
        submitButton.text('send');
      }
    });
  });
});