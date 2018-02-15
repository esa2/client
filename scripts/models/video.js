'use strict'

var app = app || {}
var __API_URL__ = 'https://uvue-video.herokuapp.com'
//  var __API_URL__ = 'http://localhost:3000'

;(function(module) {
  function errorCallback(err) {
    console.error(err)
    module.errorView.initErrorPage(err)
  }

  function Video(VideoObj) {
    Object.keys(VideoObj).forEach(key => this[key] = VideoObj[key])
  }
  Video.all = []
  Video.findYtByInterests = (ctx, next) => {
    if (module.User.interests.length === 0) return
    let vids = module.User.interests.map(interest => $.get(`${__API_URL__}/api/v3/videos/search`, {'search': interest}))
    $.when.apply($, vids).then(function() {
      // process the raw videos from the args object
      if (module.User.interests.length === 1) {
        arguments[0].items.map(ele => {
          Video.all.push({
            'source' : 'youtube',
            'videoId' : ele.id.videoId,
            'title' : ele.snippet.title,
            'thumbnail' : ele.snippet.thumbnails.medium.url
          })
        })
      } else {
        for (let i = 0; i < arguments.length; i++) {
          //console.log(arguments[i][0].items[i].snippet.thumbnails.medium.url)
          arguments[i][0].items.forEach(ele => {
            Video.all.push({
              'source' : 'youtube',
              'videoId' : ele.id.videoId,
              'title' : ele.snippet.title,
              'thumbnail' : ele.snippet.thumbnails.medium.url
            })
          })
        }
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
          //console.log(arguments[i][0].list)
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
