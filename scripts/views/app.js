if (localStorage.uvueUser) {
  $('#form-view').hide();
}

$('#form-view').on('submit', function(event) {
  event.preventDefault();
  localStorage.uvueUser = $('#form-view input[name="username"]').val();
  window.location.reload();
});

$('.logout-button').on('click', 'button', function() {
  localStorage.clear();
  window.location.reload();
});