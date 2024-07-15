import '@archetype-themes/scripts/config';
import '@archetype-themes/scripts/helpers/library-loader';

window.vimeoApiReady = function () {
  theme.config.vimeoLoading = true

  // Because there's no way to check for the Vimeo API being loaded
  // asynchronously, we use this terrible timeout to wait for it being ready
  checkIfVimeoIsReady()
    .then(function () {
      theme.config.vimeoReady = true
      theme.config.vimeoLoading = false
      document.dispatchEvent(new CustomEvent('vimeoReady'))
    })
}

function checkIfVimeoIsReady () {
  let wait
  let timeout

  return new Promise((resolve, reject) => {
    wait = setInterval(function () {
      if (!Vimeo) {
        return
      }

      clearInterval(wait)
      clearTimeout(timeout)
      resolve()
    }, 500)

    timeout = setTimeout(function () {
      clearInterval(wait)
      reject()
    }, 4000) // subjective. test up to 8 times over 4 seconds
  })
}

theme.VimeoPlayer = (function () {
  const classes = {
    loading: 'loading',
    loaded: 'loaded',
    interactable: 'video-interactable'
  }

  const defaults = {
    byline: false,
    loop: true,
    muted: true,
    playsinline: true,
    portrait: false,
    title: false
  }

  function VimeoPlayer (divId, videoId, options) {
    this.divId = divId
    this.el = document.getElementById(divId)
    this.videoId = videoId
    this.iframe = null
    this.options = options

    if (this.options && this.options.videoParent) {
      this.parent = this.el.closest(this.options.videoParent)
    }

    this.setAsLoading()

    if (theme.config.vimeoReady) {
      this.init()
    } else {
      theme.LibraryLoader.load('vimeo', window.vimeoApiReady)
      document.addEventListener('vimeoReady', this.init.bind(this))
    }
  }

  VimeoPlayer.prototype = Object.assign({}, VimeoPlayer.prototype, {
    init: function () {
      const args = defaults
      args.id = this.videoId

      this.videoPlayer = new Vimeo.Player(this.el, args)

      this.videoPlayer.ready().then(this.playerReady.bind(this))
    },

    playerReady: function () {
      this.iframe = this.el.querySelector('iframe')
      this.iframe.setAttribute('tabindex', '-1')

      if (this.options.loop === 'false') {
        this.videoPlayer.setLoop(false)
      }

      // When sound is enabled in section settings,
      // for some mobile browsers Vimeo video playback
      // will stop immediately after starting and
      // will require users to tap the play button once more
      if (this.options.style === 'sound') {
        this.videoPlayer.setVolume(1)
      } else {
        this.videoPlayer.setVolume(0)
      }

      this.setAsLoaded()

      // pause when out of view
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.play()
          } else {
            this.pause()
          }
        })
      }, { rootMargin: '0px 0px 50px 0px' })

      observer.observe(this.iframe)
    },

    setAsLoading: function () {
      if (!this.parent) return
      this.parent.classList.add(classes.loading)
    },

    setAsLoaded: function () {
      if (!this.parent) return
      this.parent.classList.remove(classes.loading)
      this.parent.classList.add(classes.loaded)
      this.parent.classList.add(classes.interactable) // Once video is loaded, we should be able to interact with it
    },

    enableInteraction: function () {
      if (!this.parent) return
      this.parent.classList.add(classes.interactable)
    },

    play: function () {
      if (this.videoPlayer && typeof this.videoPlayer.play === 'function') {
        this.videoPlayer.play()
      }
    },

    pause: function () {
      if (this.videoPlayer && typeof this.videoPlayer.pause === 'function') {
        this.videoPlayer.pause()
      }
    },

    destroy: function () {
      if (this.videoPlayer && typeof this.videoPlayer.destroy === 'function') {
        this.videoPlayer.destroy()
      }
    }
  })

  return VimeoPlayer
})()
