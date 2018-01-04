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
//dailymotion api 
  Video.allDm = [];
  Video.loadAllDm = function() {
    // Concatenate all videos to the Video.all array
    Video.allDm = Video.allDm.concat(Video.rawDm.map(ele => {
      return {
        'videoId' : ele.id,
        // 'thumbnail' : ele.snippet.thumbnails.default,
        'title' : ele.title}
        // 'publishedDate' : ele.snippet.publishedAt}
    }))
    console.log(Video.allDm)
  }

// api dailymotion stuff
  Video.findDmByInterests = (ctx, next) => {
    Video.allDm = [];
    console.log('Video.findByInterests');
    module.User.interests.forEach((interest, idx, arr) => {
      console.log(`Searching for ${interest}`)
      $.get(`${__API_URL__}/api/dailymotion/videos/search`, { 'search': interest })
        .then(results => {
          console.log(results)
          // console.log(results.items[0].id)
          Video.rawDm = results.list;
        })
        .then(Video.loadAllDm)
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
