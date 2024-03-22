class BoxChart extends HTMLElement {
  constructor() {
    super();
    this.containerWidth = Number(this.getAttribute("width")) || 1600;
    this.containerHeight = Number(this.getAttribute("height")) || 40;
    this.boxStart = (Number(this.getAttribute("box-start")) || 120) - 1;
    this.boxWidth = (Number(this.getAttribute("box-width")) || 200) - 2;
    this.dotPosition = (Number(this.getAttribute("dot-position")) || 0) - 8;
    this.limitLeft = Number(this.getAttribute("limit-left") ?? -1);
    this.limitRight = Number(this.getAttribute("limit-right") ?? -1);
    this.trianglePosition =
      (Number(this.getAttribute("triangle-position")) || 0) - 8;

    this.isDotRed =
      this.dotPosition > this.boxStart + this.boxWidth ||
      this.dotPosition < this.boxStart;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
      :host {
        font-family: arial;
      }
      .base {
        margin-left: 20px;
        width: ${this.containerWidth}px;
        height: ${this.containerHeight}px;
        display: flex;
      }
      .container {
        align-items: center;
        justify-content: center;
        position: relative;
        border-bottom: 2px solid black;
      }
      .line {
        height: 2px;
        width: 100%;
        margin-left: 0;
        background-color: lightgray;
      }
      .box {
        position: absolute;
        left: ${this.boxStart}px;
        height: 30px;
        width: ${this.boxWidth}px;
        border: 2px solid grey;
        background-color: lightgray;
      }
      .dot {
        position: absolute;
        left: ${this.dotPosition}px;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        background-color: blue;
      }
      .triangle {
        position: absolute;
        left: ${this.trianglePosition}px;
        width: 0;
        height: 0;
        border: 8px solid transparent;
        border-top: 0;
        border-bottom: 16px solid #ffe900;
      }
      .exclamation {
        position: absolute;
        right: -20px;
        font-size: 2.5rem;
        color: red;
      }
      .limit {
        position: absolute;
        bottom: 0;
        height: ${this.containerHeight - 4}px;
        width: 20px;
        border-left: 2px solid #4c4e52;
        margin-bottom: 2px;
        z-index: 1;
      }
      .limit.left {
        left: ${this.limitLeft}px;
      }
      .limit.right {
        left: ${this.limitRight - 1}px;
      }
      .scale .part {
        width: 20%;
        height: 10px;
        border-left: 2px solid black;
        position: relative;
        display: flex;
      }
      .part .micropart {
        position: absolute;
        left: 0;
        top: 0;
        height: 40%;
        border-right: 2px solid red;
      }
      .part .micropart:nth-child(1) {
        left: 50%;
      }
      .part .micropart:nth-child(2) {
        left: 66%;
      }
      .part .micropart:nth-child(3) {
        left: 80%;
      }
      .part .micropart:nth-child(4) {
        left: 83.333333%;
      }
      .part .micropart:nth-child(5) {
        left: 85.7142%;
      }
      .part .micropart:nth-child(6) {
        left: 87.5%;
      }
      .part .micropart:nth-child(7) {
        left: 88.88%;
      }
      .part .micropart:nth-child(8) {
        left: 90%;
      }
      .scale .part .label {
        position: absolute;
        top: 10px;
        left: -10px;
      }
      .scale .part:last-child {
        border-right: 2px solid black;
      }
      .red {
        background-color: red;
      }
      .hidden {
        display: none;
      }
      </style>
      <div class="container base">
        <div class="limit left ${this.limitLeft === -1 ? "hidden" : ""}"></div>
        <div class="limit right ${
          this.limitRight === -1 ? "hidden" : ""
        }"></div>
        <div class="line"></div>
        <div class="box"></div>
        <div class="triangle"></div>
        <div class="dot ${this.isDotRed ? "red" : ""}"></div>
        <div class="${this.isDotRed ? "" : "hidden"} exclamation">!</div>
      </div>
      <div class="scale base">
        <div class="part">
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <span class="label">10<sup>-2</sup></span>
        </div>
        <div class="part">
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <span class="label">10<sup>-1</sup></span>
        </div>
        <div class="part">
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <span class="label">10<sup>0</sup></span>
        </div>
        <div class="part">
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <span class="label">10<sup>1</sup></span>
        </div>
        <div class="part">
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <div class="micropart"></div>
          <span class="label">10<sup>2</sup></span>
        </div>
      </div>`;
  }
}

customElements.define("box-chart", BoxChart);
