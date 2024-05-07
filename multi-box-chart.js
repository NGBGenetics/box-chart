class MultiBoxChart extends HTMLElement {
  defaultWidth = 600;
  defaultDots = [150];
  borderWidth = 2;
  dotWidth = 16;
  yHeight = 20;

  constructor() {
    super();
  }

  connectedCallback() {
    this.width = Number(this.getAttribute("width")) || this.defaultWidth;
    this.log = this.getAttribute("log") === "true";
    this.dots =
      this.getAttribute("dots")?.replaceAll(" ", "").split(",").map(Number) ||
      this.defaultDots;
    const box = this.getAttribute("box")
      ?.replaceAll(" ", "")
      .split(",")
      .map(Number);
    const range = this.getAttribute("range")
      ?.replaceAll(" ", "")
      .split(",")
      .map(Number);
    this.times = this.getAttribute("time")?.replaceAll(" ", "").split(",");
    this.mediane = Number(this.getAttribute("mediane"));
    this.maxValue = Math.max(
      ...this.dots,
      ...(box ? box : []),
      ...(range ? range : []),
      this.mediane || []
    );
    this.distributedMediane = this.getPixelValue(this.mediane);
    this.distributedDots = this.dots.map((dot) => this.getPixelValue(dot));
    this.height = this.dots.length * this.yHeight;
    this.boxStart = box?.[0];
    this.boxEnd = box?.[1];
    this.distributedBoxStart = this.getPixelValue(this.boxStart);
    this.distributedBoxEnd = this.getPixelValue(this.boxEnd);
    this.rangeStart = Number(range?.[0]);
    this.rangeEnd = Number(range?.[1]);
    this.distributedrangeStart = this.getPixelValue(this.rangeStart);
    this.distributedrangeEnd = this.getPixelValue(this.rangeEnd);
    this.bottomStep = this.height / this.dots.length;
    this.render();
  }

  getPixelValue(value) {
    let val = value;
    let maxValue = this.maxValue;
    if (this.log && value > 0) {
      val = Math.log10(value) + 2;
      maxValue = Math.log10(maxValue) + 2;
    }
    return (val / maxValue) * 0.9 * this.width;
  }

  render() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          font-size: 12px;
          --global-tb-margin: 60px;
          --dot-dim: ${this.dotWidth}px;
          --axis-color: #014d4e;
          --range-color: #66a3a3;
          --box-color: lightgray;
          --dot-color: rgb(0, 52, 200, 0.6);
          --dot-color-warn: rgba(255, 100, 0, 0.6);
          --dot-color-alert: rgba(255, 0, 0, 0.6);
          --mediane-color: #ffe900;
          --last-outside: #ff0000;
          --last-inside: rgb(0, 52, 200);
          --last-close: rgb(255, 140, 0);
          --close: rgba(255, 140, 0, 80%);

        }

        .axis {
          width: ${this.width}px;
          height: ${this.height + this.yHeight}px;
          border-bottom: ${this.borderWidth}px solid var(--axis-color);
          border-left: ${this.borderWidth}px solid var(--axis-color);
          padding-top: var(--global-top-margin);
          position: relative;
          margin: 0 auto;
        }

        .axis::after {
          position: absolute;
          content: " ";
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-left: 8px solid var(--axis-color);
          right: -6px;
          bottom: -6px;
        }

        .axis::before {
          position: absolute;
          content: " ";
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-left: 8px solid var(--axis-color);
          left: -5px;
          top: -6px;
          transform: rotate(-90deg);
        }

        .range,
        .range::after {
          display: ${this.rangeEnd ? "block" : "none"};
          width: 0;
          height: calc(${this.height}px + 24px);
          border-left: ${this.borderWidth}px solid var(--range-color);
          position: absolute;
          left: ${this.distributedrangeStart - this.borderWidth}px;
          bottom: -12px;
        }

        .range::after {
          content: "";
          display: block;
          left: ${
            this.distributedrangeEnd -
            this.distributedrangeStart -
            this.borderWidth
          }px;
          bottom: 0;
        }

        .mediane {
          content: "";
          display: ${this.mediane !== 0 ? "block" : "none"};
          width: ${this.borderWidth}px;
          height: ${this.height}px;
          position: absolute;
          left: ${this.distributedMediane - this.borderWidth}px;
          bottom: 0px;
          background-color: var(--mediane-color);
          z-index: 1;
        }

        .box {
          display: ${this.boxEnd ? "block" : "none"};
          width: ${
            this.distributedBoxEnd - this.distributedBoxStart + this.borderWidth
          }px;
          height: ${this.height}px;
          background: var(--box-color);
          position: absolute;
          bottom: 0;
          left: ${this.distributedBoxStart - this.borderWidth}px;
        }

        .x-label > span {
          position: absolute;
          bottom: -25px;
          transform: translateX(-50%);
        }

        .x-label >.x-label-mediane {
          display: ${this.mediane !== 0 ? "block" : "none"};
          left: ${this.distributedMediane - this.borderWidth}px;
        }

        .x-label >.x-label-range-start {
          display: ${this.rangeStart ? "block" : "none"};
          left: ${this.distributedrangeStart - this.borderWidth}px;
        }

        .x-label >.x-label-range-end {
          display: ${this.rangeEnd ? "block" : "none"};
          left: ${this.distributedrangeEnd - this.borderWidth}px;
        }

        .x-label >.x-label-box-start {
          display: ${this.boxStart ? "block" : "none"};
          left: ${this.distributedBoxStart - this.borderWidth}px;
        }

        .x-label > .x-label-box-end {
          display: ${this.boxEnd ? "block" : "none"};
          left: ${this.distributedBoxEnd - this.borderWidth}px;
        }

        .y-label > span {
          position: relative;
        }

        .y-label > span {
          display: block;
          height: 10px;
          position: absolute;
          left: 0;
          bottom: -${this.borderWidth}px;
          transform: translateX(calc(-100% - 10px));
        }

        .y-line > span {
          display: block;
          width: ${this.width}px;
          border-bottom: ${this.borderWidth}px dashed gray;
          position: absolute;
          left: 0;
          bottom: 0;
          z-index: 1;
        }

        .dots > div {
          width: var(--dot-dim);
          height: var(--dot-dim);
          border-radius: 50%;
          background-color: var(--dot-color);
          position: absolute;
          z-index: 2;
        }

        .dot-label {
          position: absolute;
          left: 14px;
          top: 14px;
          font-size: 12px;
        }

        /* DOTS POSITION AND BACKGROUND */   
        ${this.distributedDots
          .map((dot, i) => {
            return `.dots > div:nth-child(${i + 1}) {
                    bottom: calc(${this.bottomStep * (i + 1)}px - 1px);
                    left: calc(${dot}px - 1px);
                    ${this.printBackground(i, dot)}
                    transform: translate(-50%, 50%);
                  }\n`;
          })
          .join("")}

        /* Y LABELS BOTTOM */
        ${this.distributedDots
          .map((_, i) => {
            return `.y-label > span:nth-child(${i + 1}) {
                      bottom: ${this.bottomStep * (i + 1) - this.borderWidth}px;
                    }\n`;
          })
          .join("")}


        /* Y LINE BOTTOM */
        ${this.distributedDots
          .map((_, i) => {
            return `.y-line > span:nth-child(${i + 1}) {
                      bottom: ${this.bottomStep * (i + 1) - this.borderWidth}px;
                    }\n`;
          })
          .join("")}
      </style>
      <div class="axis" id="axis">
        <div class="y-label">
          ${this.printElements(
            "span",
            this.distributedDots.length,
            (i) => this.times?.[i] || `T${i + 1}`
          )}
        </div>
        <div class="y-line">
          ${this.printElements("span", this.distributedDots.length, (i) => "")}
        </div>

        <div class="box"></div>
        <div class="range"></div>
        <div class="mediane"></div>
        <div class="dots">${this.dots
          .map(
            (dot) =>
              `<div><span class="dot-label">${dot.toFixed(2)}</span></div>`
          )
          .join("")}</div>

        <div class="x-label">
          <span class="x-label-mediane">${this.mediane?.toFixed(2)}</span>
          <span class="x-label-range-start">${this.rangeStart?.toFixed(
            2
          )}</span>
          <span class="x-label-range-end">${this.rangeEnd?.toFixed(2)}</span>
          <span class="x-label-box-start">${this.boxStart?.toFixed(2)}</span>
          <span class="x-label-box-end">${this.boxEnd?.toFixed(2)}</span>
        </div>
      </div>
    `;
  }

  printElements(elementType, length, content) {
    return Array.from({ length })
      .map((_, i) => {
        return `<${elementType}>${content(i)}</${elementType}>`;
      })
      .join("");
  }

  printBackground(i, dotXPosition) {
    const isLast = i === this.distributedDots.length - 1;
    const isInside =
      this.distributedBoxStart <= dotXPosition &&
      this.distributedBoxEnd >= dotXPosition;

    const isClose =
      (this.distributedBoxStart - 30 <= dotXPosition &&
        this.distributedBoxStart > dotXPosition) ||
      (this.distributedBoxEnd + 30 >= dotXPosition &&
        this.distributedBoxEnd < dotXPosition);

    if (isClose) {
      return isLast
        ? `background-color: var(--last-close);`
        : `background-color: var(--close);`;
    }

    return isLast
      ? `background-color: ${
          isInside ? "var(--last-inside)" : "var(--last-outside)"
        };`
      : ` background-color: ${
          isInside ? "var(--dot-color)" : "var(--dot-color-alert)"
        };`;
  }
}

customElements.define("multi-box-chart", MultiBoxChart);
