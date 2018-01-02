function resetView() {
  $('.content').hide();
  if (localStorage.uvueUser) {
    $('.interest-form').show();
    $('.logout-button').show();
  } else {
    $('.user-form input[name="user-name"]').val('');
    $('.user-form input[name="user-password"]').val('');
    $('.user-form').show();
  }
}

$('.user-form').on('submit', function(event) {
  event.preventDefault();
  localStorage.uvueUser = $('.user-form input[name="user-name"]').val();
  resetView();
});

$('.logout-button').on('click', 'button', function() {
  localStorage.clear();
  resetView();
});

resetView();
