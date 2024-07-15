/*============================================================================
  Video with Text
==============================================================================*/
import '@archetype-themes/scripts/config';

class MediaText extends HTMLElement {
  constructor() {
    super();
    this.el = this;
    this.video = this.el.querySelector('video');
    this.controls = this.el.querySelector('.media-with-text__play-button');
    this.wrapper = this.closest('.media-with-text__video');
    this.altImage = this.wrapper.querySelector('.media-with-text__alt-image-wrapper');
  }

  connectedCallback() {
    if (this.controls) {
      this.controls.addEventListener('click', this.playVideo.bind(this));
    }

    if (this.video) {
      this.video.addEventListener('click', this.playVideo.bind(this));

      this.video.addEventListener('loadedmetadata', () => {
        if (this.altImage) {
          this.altImage.classList.add('media-with-text__alt-image--hidden');
        }

        this.wrapper.querySelector('.media-with-text__video-wrapper').classList.remove('media-with-text__video-wrapper--hidden');
      });
    }
  }

  playVideo() {
    if (this.video.paused) {
      this.video.play();
      if (this.controls) {
        this.controls.classList.add('media-with-text__play-button--hidden');
      }
    } else {
      this.video.pause();
      if (this.controls) {
        this.controls.classList.remove('media-with-text__play-button--hidden');
      }
    }
  }

  disconnectedCallback() {
    if (!this.video) return;
    this.video.removeEventListener('click', this.playVideo.bind(this));
    if (this.controls) {
      this.controls.removeEventListener('click', this.playVideo.bind(this));
    }
  }

}

customElements.define('media-text', MediaText);
