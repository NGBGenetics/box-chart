class BoxChart extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const now = new Date();
    const containerMinWidth = this.getAttribute("minwidth") || 800;
    const containerHeight = this.getAttribute("height") || 40;
    const boxStart = this.getAttribute("box-start") || 120;
    const boxWidth = this.getAttribute("box-width") || 200;
    const dotPosition = this.getAttribute("dot-position") || 0;

    const isDotRed =
      Number(dotPosition) > Number(boxStart) + Number(boxWidth) ||
      Number(dotPosition) < Number(boxStart);

    // this.attachShadow({ mode: "open" });
    this.innerHTML = `
      <style>
        .container {
          width: 100%;
          min-width: ${containerMinWidth}px;
          height: ${containerHeight}px;
          background-color: lightgoldenrodyellow;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .line {
          height: 2px;
          width: 96%;
          background-color: black;
        }
        .box {
          position: absolute;
          left: ${boxStart}px;
          height: 20px;
          width: ${boxWidth}px;
          border: 2px solid grey;
          background-color: lightgray;
        }
        .dot {
          position: absolute;
          left: ${dotPosition}px;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          background-color: black;
        }
        .exclamation {
          position: absolute;
          right: 8px;
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
        <div class="dot ${isDotRed ? "red" : ""}"></div>
        <div class="${isDotRed ? "" : "hidden"} exclamation">!</div>
      </div>`;
  }
}

customElements.define("box-chart", BoxChart);
