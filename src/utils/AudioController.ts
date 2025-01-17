class AudioController {
  private el: HTMLAudioElement | null = null;

  getElement() {
    return (
      this.el ||
      (this.el = document.getElementById("target-audio") as HTMLAudioElement)
    );
  }

  // value: 0 ~ 100
  setVolumn(value: number) {
    if (!this.el) {
      this.el = this.getElement();
    }

    this.el.volume = value / 100;
  }

  getVolumn() {
    if (!this.el) {
      this.el = this.getElement();
    }

    return (this.el.volume * 100) >> 0;
  }

  setSrc(src: string) {
    if (!this.el) {
      this.el = this.getElement();
    }

    this.el.src = src;
  }

  getSrc() {
    if (!this.el) {
      this.el = this.getElement();
    }

    return this.el.src;
  }

  play() {
    if (!this.el) {
      this.el = this.getElement();
    }

    this.el.play();
  }
}

export default new AudioController();
