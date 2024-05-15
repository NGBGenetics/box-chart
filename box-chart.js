class BoxChart extends HTMLElement {
  defaultSizes = {
    containerWidth: 1400,
    containerHeight: 40,
    boxStart: 0,
    boxWidth: 200,
    xvaluesPosition: 0,
    rangeLeft: -1,
    rangeRight: -1,
    trianglePosition: 0,
  };

  iconsSize = 16;
  halfIconsSize = Math.floor(this.iconsSize / 2);

  constructor() {
    super();
    this.containerWidth =
      Number(this.getAttribute("width")) || this.defaultSizes.containerWidth;
    this.containerHeight =
      Number(this.getAttribute("height")) || this.defaultSizes.containerHeight;
    this.boxStart =
      Number(this.getAttribute("box-start")) || this.defaultSizes.boxStart;
    this.boxWidth =
      Number(this.getAttribute("box-width")) || this.defaultSizes.boxWidth;
    this.xvaluesPosition =
      Number(this.getAttribute("xvalues-position")) ||
      this.defaultSizes.xvaluesPosition;
    this.rangeLeft = Number(
      this.getAttribute("range-left") ?? this.defaultSizes.rangeLeft
    );
    this.rangeRight = Number(
      this.getAttribute("range-right") ?? this.defaultSizes.rangeRight
    );
    this.trianglePosition =
      Number(this.getAttribute("triangle-position")) ||
      this.defaultSizes.trianglePosition;

    this.isDotRed =
      this.xvaluesPosition > this.boxStart + this.boxWidth ||
      this.xvaluesPosition < this.boxStart;
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
        left: ${this.boxStart - 1}px;
        height: 30px;
        width: ${this.boxWidth - 2}px;
        border: 2px solid grey;
        background-color: lightgray;
      }
      .xvalues {
        position: absolute;
        left: ${this.xvaluesPosition - this.halfIconsSize}px;
        border-radius: 50%;
        width: ${this.iconsSize}px;
        height: ${this.iconsSize}px;
        background-color: rgba(0, 0, 255, 0.7);
      }
      .triangle {
        position: absolute;
        left: ${this.trianglePosition - this.halfIconsSize}px;
        width: 0;
        height: 0;
        border: 8px solid transparent;
        border-top: 0;
        border-bottom: ${this.iconsSize}px solid #ffe900;
      }
      .exclamation {
        position: absolute;
        right: -20px;
        font-size: 2.5rem;
        color: red;
      }
      .label {
        margin: 0 10px;
      }
      .range {
        position: absolute;
        bottom: 0;
        height: ${this.containerHeight - 4}px;
        width: 20px;
        border-left: 2px solid #4c4e52;
        margin-bottom: 2px;
        z-index: 1;
      }
      .range.left {
        left: ${this.rangeLeft}px;
      }
      .range.right {
        left: ${this.rangeRight - 1}px;
      }
      .scale .part {
        width: 20%;
        height: 8px;
        border-left: 2px solid black;
        position: relative;
        display: flex;
      }
      .part .micropart {
        position: absolute;
        left: 0;
        top: 0;
        height: 4px;
        border-right: 2px solid black;
        display: none;
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
        background-color: rgba(255, 0, 0, 0.7);
      }
      .hidden {
        display: none;
      }
      .bold {
        font-weight: 600;
      }
      </style>
      <div class="base">
        <label class="label"><span class="bold">scale length</span>: ${
          this.containerWidth
        }</label>
        <label class="label"><span class="bold">box start, end</span>: ${
          this.boxStart
        }, ${this.boxWidth}</label>
        <label class="label"><span class="bold">ranges</span>: ${
          this.rangeLeft
        }, ${this.rangeRight}</label>
        <label class="label"><span class="bold">xvalues value</span>: ${
          this.xvaluesPosition
        }</label>
        <label class="label"><span class="bold">triangle value</span>: ${
          this.trianglePosition
        }</label>
      </div>
      <div class="container base">
        <div class="range left ${this.rangeLeft === -1 ? "hidden" : ""}"></div>
        <div class="range right ${
          this.rangeRight === -1 ? "hidden" : ""
        }"></div>
        <div class="line"></div>
        <div class="box"></div>
        <div class="triangle"></div>
        <div class="xvalues ${this.isDotRed ? "red" : ""}"></div>
        <div class="${this.isDotRed ? "" : "hidden"} exclamation">!</div>
      </div>
      <div class="scale base">
        <div class="part">
          <span class="label">10<sup>-2</sup></span>
        </div>
        <div class="part">
          <span class="label">10<sup>-1</sup></span>
        </div>
        <div class="part">
          <div class="micropart"></div>
          <span class="label">10<sup>0</sup></span>
        </div>
        <div class="part">
          <div class="micropart"></div>
          <span class="label">10<sup>1</sup></span>
        </div>
        <div class="part">
          <div class="micropart"></div>
          <span class="label">10<sup>2</sup></span>
        </div>
      </div>`;
  }
}

customElements.define("box-chart", BoxChart);
