'use strict'

var app = app || {}

;(function(module) {
  const userView = {}

  function resetView() {
    $('.content').hide()
  }

  userView.initIndexPage = () => {
    if (localStorage.uvueUser) {
      module.User.fetch(JSON.parse(localStorage.uvueUser), null,
        () => page(`/client/user/${JSON.parse(localStorage.uvueUser)}/feed`))
    } else {
      page('/client/signin')
    }
  }

  userView.initSigninView = () => {
    resetView()
    $('.logout-btn').hide()
    $('.signin-section').show()
    $('.signin-form input[name="username"]').val('')
    $('.signin-form input[name="password"]').val('')
    $('.signin-form').on('submit', function(e) {
      e.preventDefault()
      let username = e.target.username.value
      let password = e.target.password.value
      module.User.fetch(username, password, module.User.validate)
    })
  }

  userView.initSignupView = () => {
    resetView()
    $('.signup-section').show()
    $('.signup-form input[name="username"]').val('')
    $('.signup-form input[name="password"]').val('')
    $('.signup-form').on('submit', function(e) {
      e.preventDefault()
      let realname = e.target.realname.value
      let username = e.target.username.value
      let password = e.target.password.value
      module.User.create(username, {
        'realname': realname,
        'password': password,
      })
    })
  }

  // Show the Video Feed
  userView.initFeedView = (ctx, next) => {
    resetView()
    $('.logout-btn').show()
    $('.logout-btn').on('click', function(e){
      e.preventDefault()
      module.User.logout()
      page('/client')
    })
    // Prep the interest section
    $('.add-interest-section').show()
    userView.initAddInterestSection()
    next()
  }

  // Show video list
  userView.initVideoList = () => {
    if (app.Video.all.length === 0) {
      $('.no-interest-msg').show()
      return
    }
    $('.allvideo').empty()
    let templateThumb
    let templateVideo
    // Append all videos to the view
    app.Video.all.map(video => {
      $('.thumb-view').show()
      if (video.source === 'youtube') {
        templateThumb = Handlebars.compile($('.yt-thumb-template').text())
        templateVideo = Handlebars.compile($('.yt-list-template').text())
        $('.yt-thumb-list').append(templateThumb(video))
        $('.video-list').append(templateVideo(video))
      } else {
        templateThumb = Handlebars.compile($('.dm-thumb-template').text())
        templateVideo = Handlebars.compile($('.dm-list-template').text())
        $('.dm-thumb-list').append(templateThumb(video))
        $('.video-list').append(templateVideo(video))
      }
    })
    $('.thumb-container').on('click', function() {
      $('.videodiv').hide()
      $('.thumb-view').hide()
      $('.video-view').show()
      $(`.video-${$(this).data('videoid')}`).show()
    })
  }

  $('.to-thumb-button').on('click', function() {
    $('.video-view').hide()
    $('.thumb-view').show()
  })

  userView.initAddInterestSection = () => {
    // First, empty the tag editor
    $('.tag-editor').empty()
    // Populate interest tag editor with current interests
    app.User.interests.map(ele => {
      let template = Handlebars.compile($('.interest-tag-template').text())
      $('.tag-editor').append(template({'value': ele}))
    })

    // Event handler for adding a tag
    $('.interest-add-btn').on('click', function (e) {
      e.preventDefault()
      let value = $('#interest-input').val()
      let template = Handlebars.compile($('.interest-tag-template').text())
      // either a duplicate or empty string - disallowed
      if (app.User.interests.indexOf(value) !== -1 || value === '') {
        return
      }
      // empty out the input box
      $('#interest-input').val('')
      // Append a new tag to the tag editor box
      $('.tag-editor').append(template({'value': value}))
      // Add the tag to the interests array
      app.User.interests.push(value)
      // Add interest to the db
      app.User.addInterest(value)
    })

    // Event handler for removing a tag
    $('.add-interest-section').on('click', '.cross', function(e) {
      e.preventDefault()
      let interest = $(this).parent('a').attr('data-interest')
      // Extract the index of the tag to remove
      let idx = app.User.interests.indexOf(interest)
      // do it
      app.User.interests.splice(idx, 1)
      $(this).parent('a').remove()
      // Remove interest from the db
      app.User.removeInterest(interest)
    })
  }

  $('.view-videos-button').on('click', function() {
    // Clear video array to prevent duplicates
    app.Video.all = []
    page('/client')
  })

  // userView.initAboutPage = function () {
  //   resetView()
  //   $('.about_us-section').show()
  // }

  module.userView = userView
})(app)
