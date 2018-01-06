'use strict'

var app = app || {}

;(function(module) {
  // var __API_URL__ = 'https://uvue.herokuapp.com'
  var __API_URL__ = 'http://localhost:3000'

  User.user = null
  User.interests = null

  function errorCallback(err) {
    console.error(err)
    module.errorView.initErrorPage(err)
  }

  function User(rawUserObj) {
    Object.keys(rawUserObj).map(key => (this[key] = rawUserObj[key]))
  }

  // Read interests for the current user from the database
  User.fetchInterests = (ctx, next) => {
    // Only attempt to fetch the interests if the user is logged in
    if (!User.user) {
      console.log(`Error, User.user = null, uvueUser=${localStorage.uvueUser}`)
      return
    }
    $.get(`${__API_URL__}/api/v1/users/${User.user.username}/search`)
      .then(User.loadInterests)
      .then(next)
      .catch(errorCallback)
  }

  User.loadInterests = dbRows => {
    // map the rows and store interest/search strings under the User
    User.interests = dbRows.map(ele => ele.search_string)
  }

  User.removeInterest = interest => {
    $.ajax({
      url: `${__API_URL__}/api/v1/users/${User.user.username}/${interest}/search`,
      method: 'DELETE'
    })
      .then(console.log)
      .catch(errorCallback)
  }

  User.addInterest = interest => {
    // Finally, add the new interest to the database
    $.post(`${__API_URL__}/api/v1/users/${User.user.username}/${interest}/search`)
      .then(console.log)
      .catch(errorCallback)
  }

  // Load a user
  User.loadIt = dbRow => {
    // nothing to load
    if (!dbRow.length) return
    console.log('dbRow:', dbRow)
    // Only one user should ever be returned
    User.user = new User(dbRow[0])
  }

  // Fetch user from database - run optional callback with arg
  User.fetch = (username, arg, callback) => {
    User.user = null
    $.get(`${__API_URL__}/api/v1/users/${username}`)
      .then(User.loadIt)
      .then(() => {
        if (callback)
          callback(username, arg)
      })
      .catch(errorCallback)
  }

  // Do post logout cleanup of User
  User.logout = () => {
    localStorage.removeItem('uvueUser')
    User.user = null
    User.interests = null
    app.Video.all = []
    // Empty the interest tags
    $('.tag-editor').empty()
  }

  // Validate the password
  User.validate = (username, password) => {
    // It was an invalid username
    if (User.user === null) {
      console.log('Invalid Username!')
    } else if (User.user.password !== password) {
      console.log(`Invalid Password for ${User.user.username}!`)
    } else {
      console.log('Successfully logged in!')
      // Store username in localStorage for persistence of login
      localStorage.uvueUser = JSON.stringify(User.user.username)
      page(`/client/user/${User.user.username}/feed`)
    }
  }

  // First verify, then create
  User.create = (username, arg) => {
    arg.username = username
    // Create a new user in the database
    $.post(`${__API_URL__}/api/v1/users`, arg)
      .then(() => {
        localStorage.uvueUser = JSON.stringify(username)
        User.fetch(username, null, () => page(`/client/user/${username}/feed`))
      })
      // .then(() => page(`/client/user/${username}/feed`))
      .catch(errorCallback)
  }

  module.User = User
})(app)
