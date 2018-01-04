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
    // Concatenate all videos to the Video.all array
    Video.all = Video.all.concat(Video.raw.map(ele => {
      return {
        'videoId' : ele.id.videoId,
        'thumbnail' : ele.snippet.thumbnails.default,
        'title' : ele.snippet.title,
        'publishedDate' : ele.snippet.publishedAt}
    }))
    console.log(Video.all)
  }

  Video.findByInterests = (ctx, next) => {
    Video.all = [];
    console.log('Video.findByInterests');
    module.User.interests.forEach((interest, idx, arr) => {
      console.log(`Searching for ${interest}`)
      $.get(`${__API_URL__}/api/v3/videos/search`, { 'search': interest })
        .then(results => {
          console.log(results)
          console.log(results.items[0].id)
          Video.raw = results.items;
        })
        .then(Video.loadAll)
        .then(() => {
          if (idx === arr.length - 1) {
            console.log(`CALLING NEXT() idx: ${idx}`);
            next();
          }
        })
        .catch(errorCallback)
    });
  }

  module.Video = Video;
})(app)
