class AudioVisualization {
  private audioContext = new AudioContext();
  private analyser = this.audioContext.createAnalyser();
  private mediaSource: MediaElementAudioSourceNode;
  private canvasElement = document.getElementById(
    "visualization-canvas"
  ) as HTMLCanvasElement;
  private canvasContext = this.canvasElement.getContext("2d")!;
  private canvasWidth = window.innerWidth;
  private canvasHeight = window.innerHeight;

  constructor() {
    this.analyser.smoothingTimeConstant = 0.8;
    this.analyser.connect(this.audioContext.destination);

    const audioElement = document.getElementById(
      "target-audio"
    ) as HTMLAudioElement;
    this.mediaSource = this.audioContext.createMediaElementSource(audioElement);
    this.mediaSource.connect(this.analyser);

    this.onResize = this.onResize.bind(this);
    this.resume = this.resume.bind(this);
    this.draw = this.draw.bind(this);

    this.onResize();
    this.draw();
    window.addEventListener("resize", this.onResize);
  }

  private onResize() {
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = (window.innerHeight * 0.5) >> 0;
    this.canvasElement.width = this.canvasWidth;
    this.canvasElement.height = this.canvasHeight;
    this.canvasContext.fillStyle = "#1890ff";
    let fftSize = 32;
    while (this.canvasWidth / fftSize > 2) {
      fftSize *= 2;
      if (fftSize >= 32768) {
        break;
      }
    }
    this.analyser.fftSize = fftSize;
  }

  resume() {
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

  draw() {
    requestAnimationFrame(this.draw);

    const u8array = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(u8array);
    const data = Array.from(u8array).map((v) => v / 255);
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    const w = this.canvasWidth / data.length;
    data.forEach((value, index) => {
      const h = value * this.canvasHeight;
      const x = index * w;
      const y = this.canvasHeight - h;
      this.canvasContext.fillRect(x, y, w, h);
    });
  }
}

export default AudioVisualization;
