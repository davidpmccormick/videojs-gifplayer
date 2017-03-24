import videojs from 'video.js';
import debounce from 'lodash.debounce';

// Default options for the plugin.
const defaults = {
  controls: false,
  loop: true,
  restartOnPause: true
};

// http://stackoverflow.com/a/7557433/2066736
function inViewport(el) {
  let rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function getScrollElement(node) {
  if (node === null) {
    return null;
  }

  if (node.scrollHeight > node.clientHeight) {
    return node;
  }

  return getScrollElement(node.parentNode);
}

function inScroll(el) {
  let elRect = el.getBoundingClientRect();
  let scrollEl = getScrollElement(el);

  if (scrollEl) {
    let scrollRect = scrollEl.getBoundingClientRect();

    return (
      scrollRect.top <= elRect.top &&
      scrollRect.left <= elRect.left &&
      scrollRect.bottom >= elRect.bottom &&
      scrollRect.right >= elRect.right
    );
  }

  return true;
}

function inUserView(el) {
  return inViewport(el) && inScroll(el);
}

// play every gif that is in the viewport, and
// pause every gif that is out of viewport
let autoPlayGifs = debounce(() => {
  let gifPlayers = document.querySelectorAll('.vjs-gifplayer');

  for (let gifPlayer of gifPlayers) {
    let player = gifPlayer.player;

    if (player) {
      if (inUserView(gifPlayer)) {
        if (player.paused()) {
          if (player.getAttribute('data-restartOnPause')) {
            player.currentTime(0);
          }
          player.play();
        }
      } else {
        player.pause();
      }
    }
  }
}, 300);

// https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
let hidden;
let visibilityChange;

if (typeof document.hidden !== 'undefined') {
  // Opera 12.10 and Firefox 18 and later support
  hidden = 'hidden';
  visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden';
  visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden';
  visibilityChange = 'webkitvisibilitychange';
}

// If the page is hidden, pause the video;
// if the page is shown, play the video
function handleVisibilityChange() {
  if (document[hidden]) {
    let gifPlayers = document.querySelectorAll('.vjs-gifplayer');

    for (let gifPlayer of gifPlayers) {
      let player = gifPlayer.player;

      if (player) {
        player.pause();
      }
    }
  } else {
    autoPlayGifs();
  }
}

window.addEventListener('resize', autoPlayGifs);
window.addEventListener('scroll', autoPlayGifs, true);
document.addEventListener(visibilityChange, handleVisibilityChange, false);

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 * @param    {Object} [options={}]
 */
const onPlayerReady = (player, options) => {
  player.addClass('vjs-gifplayer');

  player.loop(options.loop);
  player.controls(options.controls);
  // player.autoplay(options.autoplay);

  if (options.restartOnPause) {
    player.setAttribute('data-restartOnPause', 'true');
  }

  // player.play();
  autoPlayGifs();

};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function gifplayer
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const gifplayer = function(options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
videojs.plugin('gifplayer', gifplayer);

// Include the version number.
gifplayer.VERSION = '__VERSION__';

export default gifplayer;
