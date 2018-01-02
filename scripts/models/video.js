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
    let template = Handlebars.compile($('#video-list-template').text());
    return template(this);
  }

  Video.all = [];
  Video.loadAll = rows => Video.all = rows.sort((a, b) => b.title - a.title).map(video => new Video(video));

  Video.find = (video, callback) =>
    $.get(`${__API_URL__}/api/v3/videos/find`, video)
      .then(Video.loadAll)
      .then(callback)
      .catch(errorCallback)

  module.Video = Video;
})(app)