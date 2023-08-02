export class Component {
  constructor(options) {
    this.document = options.shadowDom;
    this.text = this.document.getElementById("text");
    this.time = this.document.getElementById("time");
  }

  setLog(text, time) {
    this.text.innerText = text;
    this.timeAgo = time;
    this.updateTimeLoop();
  }

  updateTimeLoop() {
    this.time.innerText = Math.floor((Date.now() - this.timeAgo) / 60000);
    setTimeout(() => {
      this.updateTimeLoop();
    }, 5000);
  }
}
