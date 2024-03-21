class BoxChart extends HTMLElement {
  constructor() {
    super();
    this.containerMinWidth = Number(this.getAttribute("minwidth")) || 800;
    this.containerHeight = Number(this.getAttribute("height")) || 40;
    this.boxStart = Number(this.getAttribute("box-start")) || 120;
    this.boxWidth = Number(this.getAttribute("box-width")) || 200;
    this.dotPosition = (Number(this.getAttribute("dot-position")) || 0) - 8;

    this.isDotRed =
      Number(this.dotPosition) >
        Number(this.boxStart) + Number(this.boxWidth) ||
      Number(this.dotPosition) < Number(this.boxStart);
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
      .container {
        margin: 0 auto;
        width: 90%;
        min-width: ${this.containerMinWidth}px;
        height: ${this.containerHeight}px;
        background-color: lightgoldenrodyellow;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }
      .line {
        height: 2px;
        width: 100%;
        margin-left: 0;
        background-color: black;
      }
      .box {
        position: absolute;
        left: ${this.boxStart}px;
        height: 20px;
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
        background-color: black;
      }
      .exclamation {
        position: absolute;
        right: -20px;
        font-size: 2.5rem;
        font-family: arial;
        color: red;
      }
      .red {
        background-color: red;
      }
      .hidden {
        display: none;
      }
      </style>
      <div class="container">
        <div class="line"></div>
        <div class="box"></div>
        <div class="dot ${this.isDotRed ? "red" : ""}"></div>
        <div class="${this.isDotRed ? "" : "hidden"} exclamation">!</div>
      </div>`;
  }
}

customElements.define("box-chart", BoxChart);
