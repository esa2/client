#URL SOURCE
https://developer.dailymotion.com/api#api-call

#Grab the daily motion CDN and load it asynchronously
<script>
  window.dmAsyncInit = function()
  {
    DM.init({ apiKey: 'your app id', status: true, cookie: true });
  };
  (function() {
    var e = document.createElement('script');
    e.async = true;
    e.src = 'https://api.dmcdn.net/all.js';

    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(e, s);
  }());
</script>
 Any code you want to run after the SDK is loaded should be placed within this function and after the call to DM.init(). For example, this is where you would test the logged in status of the user or subscribe to any Dailymotion events your application is interested in.

 #Dynamically Creates a Player which you can interact with
 <scirpt>
 var handleAPIResponse = function (response) {
  var videos = response.list;
  var player = DM.player(document.getElementById('player'), {
    video: videos.shift().id
  });

  // At the end of a video, load the next video if any
  player.addEventListener('end', function (e)
  {
    var nextVideo = videos.shift();
    if (nextVideo) {
      e.target.load(nextVideo.id);
    }
  });
};

DM.api('/videos', {
  filters: 'buzz',
  fields: 'id',
  limit: 100
}, handleAPIResponse);
</script>
#The video option is optional so you can call DM.player(document.getElementById("player")); and load a video dynamically later, through a call to the player.load() method.

#Search for videos with “javascript tutorial” query:
var handleAPIResponse = function(response) {
  alert(response.list[0].title);
};

DM.api('/videos', {
  search: 'javascript tutorial',
  fields: 'title'
}, handleAPIResponse);

#CREATE A PLAYER 
<script src='https://api.dmcdn.net/all.js'></script>
<div id='player'></div>div>
<script>
  var player = DM.player(document.getElementById('player'), {
    video: 'xwr14q',
    width: '100%',
    height: '100%',
    params: {
      autoplay: true,
      mute: true
    }
  });
</script>

#STORES SEARCHED VIDEOS (IN OUR SENSE INTERST FORM DATA) INTO AN ARRAY 
$api = new Dailymotion();
$result = $api->get(
    '/videos',
    array('fields' => array('id', 'title', 'owner'))
);