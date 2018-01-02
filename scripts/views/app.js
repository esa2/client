if (localStorage.uvueUser) {
  $('.user-form').hide();
} else {
  $('.interest-form').hide();
  $('.user-form').show();
}

$('.user-form').on('submit', function(event) {
  event.preventDefault();
  localStorage.uvueUser = $('.user-form input[name="username"]').val();
  window.location.reload();
});

$('.logout-button').on('click', 'button', function() {
  localStorage.clear();
  window.location.reload();
});