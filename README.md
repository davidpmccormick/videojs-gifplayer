# videojs-gifplayer

Plays gifs that are in video format automatically with looping only when in viewport in similar fashion to twitter&#39;s gif player.

## Table of Contents

<!-- START doctoc -->
<!-- END doctoc -->
## Installation

```sh
npm install --save videojs-gifplayer
```

## Usage

To include videojs-gifplayer on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-gifplayer.min.js"></script>
<script>
  var player = videojs('my-video');

  player.gifplayer();
</script>
```

### Browserify

When using with Browserify, install videojs-gifplayer via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-gifplayer');

var player = videojs('my-video');

player.gifplayer();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-gifplayer'], function(videojs) {
  var player = videojs('my-video');

  player.gifplayer();
});
```

## License

MIT. Copyright (c) John D. Johnson II &lt;johnsonjo4531@gmail.com&gt;


[videojs]: http://videojs.com/
