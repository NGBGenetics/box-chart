class MultiBoxChart extends HTMLElement {
  defaultWidth = 600;
  defaultHeight = 300;
  defaultDots = [0, 80, 90, 100, 300, 450];
  defaultBox = [100, 300];
  defaultLimit = [50, 400];
  defaultMediane = 200;
  xScaleSteps = 10;

  constructor() {
    super();
  }

  connectedCallback() {
    this.width = Number(this.getAttribute("width")) || this.defaultWidth;
    this.height = Number(this.getAttribute("height")) || this.defaultHeight;
    this.dots =
      this.getAttribute("dots")?.replaceAll(" ", "").split(",").map(Number) ||
      this.defaultDots;
    this.mediane = Number(this.getAttribute("mediane")) || this.defaultMediane;
    [this.boxStart, this.boxSize] =
      this.getAttribute("box")?.replaceAll(" ", "").split(",").map(Number) ||
      this.defaultBox;
    [this.limitStart, this.limitEnd] =
      this.getAttribute("limit")?.replaceAll(" ", "").split(",").map(Number) ||
      this.defaultLimit;
    this.xScaleSteps = Number(this.getAttribute("x-steps")) || this.xScaleSteps;
    this.bottomStep = this.height / this.dots.length;
    this.render();
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
          font-family: arial;
        }

        .axis {
          width: ${this.width}px;
          height: ${this.height}px;
          border-bottom: 2px solid var(--axis-color);
          border-left: 2px solid var(--axis-color);
          margin: 60px 100px;
          padding-top: 10px;
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
          left: calc(${this.limitStart}px - 2px);
          bottom: -14px;
        }

        .limit::after {
          content: "";
          display: block;
          left: calc(${this.limitEnd}px - 2px);
          bottom: 0;
        }

        .mediane {
          content: "";
          display: block;
          width: 2px;
          height: ${this.height}px;
          position: absolute;
          left: calc(${this.mediane}px - 2px);
          bottom: 0px;
          background-color: var(--mediane-color);
          z-index: 1;
        }

        .box {
          width: ${this.boxSize}px;
          height: ${this.height}px;
          background: var(--box-color);
          border-radius: 2px;
          position: absolute;
          bottom: 0;
          left: calc(${this.boxStart}px - 1px);
        }

        .x-label > span {
          position: absolute;
          bottom: -34px;
        }

        ${Array.from({ length: this.xScaleSteps })
          .map((_, i) => {
            return `.x-label > span:nth-child(${i + 1}) {
                    left: calc(${Math.floor(
                      (this.width / this.xScaleSteps) * i
                    )}px - 5px);
                  }\n`;
          })
          .join("")}

        .y-label > span {
          position: relative;
        }

        .y-label > span {
          display: block;
          width: 10px;
          height: 10px;
          position: absolute;
          left: -30px;
          bottom: -2px;
        }

        .y-label > span::after {
          content: "";
          display: block;
          width: ${this.width}px;
          height: 10px;
          border-bottom: 2px dashed gray;
          position: absolute;
          left: 30px;
          bottom: 0;
          z-index: 1;
        }

        .y-label > span::after {
          bottom: -2px;
        }

        ${this.dots
          .map((_, i) => {
            return `.y-label > span:nth-child(${i + 1}) {
                      bottom: ${this.bottomStep * (i + 1)}px;
                    }\n`;
          })
          .join("")}

        .dots > div {
          width: var(--dot-dim);
          height: var(--dot-dim);
          border-radius: 50%;
          background-color: var(--dot-color);
          position: absolute;
        }

        ${this.dots
          .map((dot, i) => {
            const isLast = i === this.dots.length - 1;
            const isInside =
              this.boxStart < dot && this.boxStart + this.boxSize > dot;

            const background = isLast
              ? `background-color: ${
                  isLast ? "var(--last-inside)" : "var(--dot-color-alert)"
                };`
              : ` background-color: ${
                  isInside ? "var(--dot-color)" : "var(--dot-color-alert)"
                };`;
            return `.dots > div:nth-child(${i + 1}) {
                    bottom: calc(${
                      this.bottomStep * (i + 1)
                    }px + (var(--dot-dim) / 2 * -1) - 1px);
                    left: calc(${dot}px + (var(--dot-dim) / 2 * -1) - 1px);
                    ${background}
                  }\n`;
          })
          .join("")}
      </style>
      <div class="axis" id="axis">
        <div class="y-label">
        ${Array.from({ length: this.dots.length })
          .map((_, i) => {
            return `<span>T${i + 1}</span>`;
          })
          .join("")}
        </div>

        <div class="box"></div>
        <div class="limit"></div>
        <div class="mediane"></div>
        <div class="dots">${this.dots.map(() => `<div></div>`).join("")}</div>

        <div class="x-label">
        ${Array.from({ length: this.xScaleSteps })
          .map((_, i) => {
            return `<span>${Math.floor(
              (this.width / this.xScaleSteps) * i
            )}</span>`;
          })
          .join("")}
        </div>
      </div>
    `;
  }
}

customElements.define("multi-box-chart", MultiBoxChart);
