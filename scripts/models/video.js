'use strict'

var app = app || {}
// var __API_URL__ = 'https://uvue.herokuapp.com'
var __API_URL__ = 'http://localhost:3000'

;(function(module) {
  function errorCallback(err) {
    console.error(err)
    module.errorView.initErrorPage(err)
  }

  function Video(VideoObj) {
    Object.keys(VideoObj).forEach(key => this[key] = VideoObj[key])
  }

  Video.prototype.toHtml = function() {
    let template = Handlebars.compile($('.video-list-template').text())
    return template(this)
  }

  Video.all = []
  Video.findYtByInterests = (ctx, next) => {
    if (module.User.interests.length === 0) return
    let vids = module.User.interests.map(interest => $.get(`${__API_URL__}/api/v3/videos/search`, {'search': interest}))
    $.when.apply($, vids).then(function() {
      Video.all = []
      console.log('Youtube arguments')
      console.log(arguments)
      // process the raw videos from the args object
      for (let i = 0; i < arguments.length; i++) {
        arguments[i][2].responseJSON.items.forEach(ele => {
          Video.all.push({
            'source' : 'youtube',
            'videoId' : ele.id.videoId,
            'title' : ele.snippet.title
          })
        })
      }
    })
      .then(next)
      .catch(errorCallback)
  }

  Video.findDmByInterests = (ctx, next) => {
    if (module.User.interests.length === 0) return
    let vids = module.User.interests.map(interest => $.get(`${__API_URL__}/api/dailymotion/videos/search`, { 'search': interest }))
    $.when.apply($, vids).then(function() {
      if (module.User.interests.length === 1) {
        arguments[0].list.map(ele => {
          Video.all.push({
            'source' : 'dailymotion',
            'videoId' : ele.id,
            'title' : ele.title
          })
        })
      } else {
        for (let i = 0; i < arguments.length; i++) {
          arguments[i][0].list.map(ele => {
            Video.all.push({
              'source' : 'dailymotion',
              'videoId' : ele.id,
              'title' : ele.title
            })
          })
        }
      }
    })
      .then(next)
      .catch(errorCallback)
  }

  module.Video = Video
})(app)
