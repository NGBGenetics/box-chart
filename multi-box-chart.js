class MultiBoxChart extends HTMLElement {
  // TODO deve mettere le label x delle box, mediane e limits, mettere le label dei dots vicino ai pallini
  defaultWidth = 600;
  defaultDots = [150];
  xScaleSteps = 10;

  constructor() {
    super();
  }

  connectedCallback() {
    this.width = Number(this.getAttribute("width")) || this.defaultWidth;
    this.dots =
      this.getAttribute("dots")?.replaceAll(" ", "").split(",").map(Number) ||
      this.defaultDots;
    const box = this.getAttribute("box")
      ?.replaceAll(" ", "")
      .split(",")
      .map(Number);
    const limit = this.getAttribute("limit")
      ?.replaceAll(" ", "")
      .split(",")
      .map(Number);
    this.times = this.getAttribute("time")?.replaceAll(" ", "").split(",");
    this.mediane = Number(this.getAttribute("mediane"));
    this.maxValue = Math.max(
      ...this.dots,
      ...(box ? box : []),
      ...(limit ? limit : []),
      this.mediane || []
    );
    this.distributedMediane = this.getPixelValue(this.mediane);
    this.distributedDots = this.dots.map((dot) =>
      this.getPixelValue(dot, this.maxValue, this.width)
    );
    this.height = Number(this.getAttribute("height")) || this.dots.length * 50;
    this.boxStart = box?.[0];
    this.boxEnd = box?.[1];
    this.distributedBoxStart = this.getPixelValue(this.boxStart);
    this.distributedBoxEnd = this.getPixelValue(this.boxEnd);
    this.limitStart = limit?.[0];
    this.limitEnd = limit?.[1];
    this.distributedLimitStart = this.getPixelValue(this.limitStart);
    this.distributedLimitEnd = this.getPixelValue(this.limitEnd);
    this.xScaleSteps = Number(this.getAttribute("x-steps")) || this.xScaleSteps;
    this.bottomStep = this.height / this.dots.length;
    this.render();
  }

  getPixelValue(value) {
    return (value / this.maxValue) * 0.9 * this.width;
  }

  render() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --dot-dim: 16px;
          --axis-color: #014d4e;
          --limit-color: #016667;
          --box-color: lightgray;
          --dot-color: rgb(0, 52, 200, 0.6);
          --dot-color-warn: rgba(255, 100, 0, 0.6);
          --dot-color-alert: rgba(255, 0, 0, 0.6);
          --mediane-color: #ffe900;
          --last-outside: #ff0000;
          --last-inside: rgb(0, 52, 200);
          --last-close: rgb(255, 140, 0);
          --close: rgba(255, 140, 0, 80%);
          --global-tb-margin: 60px;
          --global-lr-margin: 100px;
          --global-top-margin: 20px;
          font-family: arial;
        }

        .axis {
          width: ${this.width}px;
          height: ${this.height}px;
          border-bottom: 2px solid var(--axis-color);
          border-left: 2px solid var(--axis-color);
          margin: var(--global-tb-margin) var(--global-lr-margin);
          padding-top: var(--global-top-margin);
          position: relative;
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

        .limit,
        .limit::after {
          width: 0;
          height: calc(${this.height}px + 28px);
          border-left: 2px solid var(--limit-color);
          position: absolute;
          left: calc(${this.distributedLimitStart}px - 2px);
          bottom: -14px;
        }

        .limit::after {
          content: "";
          display: block;
          left: calc(${
            this.distributedLimitEnd - this.distributedLimitStart
          }px - 2px);
          bottom: 0;
        }

        .mediane {
          content: "";
          display: block;
          width: 2px;
          height: ${this.height}px;
          position: absolute;
          left: calc(${this.distributedMediane}px - 2px);
          bottom: 0px;
          background-color: var(--mediane-color);
          z-index: 1;
        }

        .box {
          width: ${this.distributedBoxEnd - this.distributedBoxStart}px;
          height: ${this.height}px;
          background: var(--box-color);
          position: absolute;
          bottom: 0;
          left: calc(${this.distributedBoxStart}px);
        }

        .x-label > span {
          position: absolute;
          bottom: -34px;
          transform: translateX(-50%);
        }

        .x-label-mediane {
          left: calc(${this.distributedMediane}px - 2px);
        }

        .x-label-limit-start {
          left: calc(${this.distributedLimitStart}px - 2px);
        }

        .x-label-limit-end {
          left: calc(${this.distributedLimitEnd}px - 2px);
        }

        .x-label-box-start {
          left: calc(${this.distributedBoxStart}px - 2px);
        }

        .x-label-box-end {
          left: calc(${this.distributedBoxEnd}px - 2px);
        }

        .y-label > span {
          position: relative;
        }

        .y-label > span {
          display: block;
          height: 10px;
          position: absolute;
          left: 0;
          bottom: -2px;
          transform: translateX(calc(-100% - 10px));
        }

        .y-line > span {
          display: block;
          width: ${this.width}px;
          border-bottom: 2px dashed gray;
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
                      bottom: ${this.bottomStep * (i + 1) - 2}px;
                    }\n`;
          })
          .join("")}


        /* Y LINE BOTTOM */
        ${this.distributedDots
          .map((_, i) => {
            return `.y-line > span:nth-child(${i + 1}) {
                      bottom: ${this.bottomStep * (i + 1) - 2}px;
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
        <div class="limit"></div>
        <div class="mediane"></div>
        <div class="dots">${this.dots
          .map(
            (dot) =>
              `<div><span class="dot-label">${dot.toFixed(2)}</span></div>`
          )
          .join("")}</div>

        <div class="x-label">
          <span class="x-label-mediane">${this.mediane}</span>
          <span class="x-label-limit-start">${this.limitStart}</span>
          <span class="x-label-limit-end">${this.limitEnd}</span>
          <span class="x-label-box-start">${this.boxStart}</span>
          <span class="x-label-box-end">${this.boxEnd}</span>
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
      this.boxStart <= dotXPosition &&
      this.boxStart + this.boxEnd >= dotXPosition;

    const isClose =
      (this.boxStart - 30 <= dotXPosition && this.boxStart > dotXPosition) ||
      (this.boxStart + this.boxEnd + 30 >= dotXPosition &&
        this.boxStart + this.boxEnd < dotXPosition);

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
