'use strict';

var app = app || {};
// var __API_URL__ = 'https://uvue.herokuapp.com';
var __API_URL__ = 'http://localhost:3000';

(function(module) {
  function errorCallback(err) {
    console.error(err);
    module.errorView.initErrorPage(err);
  }

  function Video(VideoObj) {
    Object.keys(VideoObj).forEach(key => this[key] = VideoObj[key]);
  }

  Video.prototype.toHtml = function() {
    let template = Handlebars.compile($('.video-list-template').text());
    return template(this);
  }

  Video.all = [];
  Video.findByInterests = (ctx, next) => {
    let vids = module.User.interests.map(interest => $.get(`${__API_URL__}/api/v3/videos/search`, {'search': interest}))

    $.when.apply($, vids).then(function() {
      Video.all = [];
      // process the raw videos from the args object
      for (let i = 0; i < arguments.length; i++) {
        arguments[i][2].responseJSON.items.forEach(ele => {
          Video.all.push({
            'videoId' : ele.id.videoId,
            'thumbnail' : ele.snippet.thumbnails.default,
            'title' : ele.snippet.title,
            'publishedDate' : ele.snippet.publishedAt
          });
        })
      }
    })
      .then(next)
      .catch(errorCallback);
  }

  module.Video = Video;
})(app)
