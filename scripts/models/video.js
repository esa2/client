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
  Video.loadAll = function() {
    Video.all = Video.raw.map(ele => {
      return {'videoId' : ele.id.videoId,
        'thumbnail' : ele.snippet.thumbnails.default,
        'title' : ele.snippet.title,
        'publishedDate' : ele.snippet.publishedAt}
    })
  }

  Video.search = (searchTerm, callback) =>
    $.get(`${__API_URL__}/api/v3/videos/search`, searchTerm)
      .then( results => {
        console.log(results)
        console.log(results.items[0].id)
        Video.raw = results.items;
      })
      .then(Video.loadAll)
      .then(callback)
      .catch(errorCallback)

  module.Video = Video;
})(app)
